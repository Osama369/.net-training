using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ClosedXML.Excel;
using Microsoft.Data.SqlClient;
using System.Security.Claims;
using System.Text.RegularExpressions;
using eMaestroD.Models.Models;
using eMaestroD.Api.Common;
using eMaestroD.Api.Data;
using Microsoft.AspNetCore.Authorization;
using eMaestroD.DataAccess.DataSet;
using eMaestroD.Shared.Common;

namespace eMaestroD.Api.Controllers
{

    [ApiController]
    [Authorize]
    [Route("/api/[controller]")]
    public class VendorController : Controller
    {
        private readonly AMDbContext _AMDbContext;
        private readonly NotificationInterceptor _notificationInterceptor;
        private readonly IHttpContextAccessor _httpContextAccessor; 
        private readonly HelperMethods _helperMethods; 
        string username = "";
        public VendorController(AMDbContext aMDbContext, NotificationInterceptor notificationInterceptor, IHttpContextAccessor httpContextAccessor,HelperMethods helperMethods)
        {
            _AMDbContext = aMDbContext;
            _notificationInterceptor = notificationInterceptor;
            _httpContextAccessor = httpContextAccessor;
            _helperMethods = helperMethods;
            username = GetUsername();
        }

        [NonAction]
         public string GetUsername()
        {
            var email = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email);
            if (!string.IsNullOrEmpty(email))
            {
                if (_AMDbContext.Users != null)
                {
                    var user = _AMDbContext.Users.FirstOrDefault(x => x.Email == email);
                    if (user != null)
                    {
                        return user.FirstName + " " + user.LastName;
                    }
                }
            }
            return "";
        }

        [HttpGet]
        [Route("{comID}")]
        public async Task<IActionResult> GetAllVendor(int comID)
        {
            var result = await (from vend in _AMDbContext.Vendors
                                join coa in _AMDbContext.COA
                                on vend.vendID equals coa.COANo
                                where vend.comID == comID && vend.active == true && coa.parentCOAID == 83
                                select new Vendors // Projecting into the extended Customer model
                                {
                                    vendID = vend.vendID,
                                    comID = vend.comID,
                                    vendCode = vend.vendCode,
                                    vendName = vend.vendName,
                                    vendPhone = vend.vendPhone,
                                    address = vend.address,
                                    active = vend.active,
                                    taxNo = vend.taxNo,
                                    taxValue = vend.taxValue,
                                    comment = vend.comment,
                                    opnBal = coa.openBal,
                                    isActionBtn = false
                                }).ToListAsync();
            ResponsedGroupListVM vM = new ResponsedGroupListVM();
            vM.enttityDataSource = result;
            vM.entityModel = result?.GetEntity_MetaData();

            return Ok(vM);
        }

        [HttpDelete]
        [Route("{vendID}")]
        public async Task<IActionResult> DeleteVendor(int vendID)
        {
            var glList = _AMDbContext.gl.Where(x => x.vendID == vendID && x.txTypeID != 40).ToList();
            if (glList.Count > 0)
            {
                return NotFound("Some Invoices Depend on this Vendor, Please delete invoice first.");
            }
            var lst = _AMDbContext.Vendors.Where(a => a.vendID == vendID).ToList();
            _AMDbContext.RemoveRange(_AMDbContext.COA.Where(a => a.COANo == vendID && a.acctName == lst[0].vendName));
            _AMDbContext.RemoveRange(lst);
            _AMDbContext.RemoveRange(_AMDbContext.gl.Where(x => x.vendID == vendID && x.txTypeID == 40));
            await _AMDbContext.SaveChangesAsync();

            _notificationInterceptor.SaveNotification("SuppliersDelete", lst[0].comID, "");
            return Ok();
        }

        [HttpGet("{GetVndCode}/{comID}")]
        public async Task<IActionResult> GetVndCode(int comID)
        {
            var vendors = _AMDbContext.Vendors
            .Where(x => x.comID == comID)
            .ToList(); // Retrieve data from the database

            var existingCustomer = vendors
                .OrderByDescending(x => int.TryParse(x.vendCode, out int result) ? result : int.MinValue)
                .FirstOrDefault();

            if (existingCustomer != null)
            {
                string newVndCode = GenerateNewVndCode(existingCustomer.vendCode);
                return Ok(newVndCode);
            }

            // If no existing customer with the given comID found
            return NotFound();
        }

        [NonAction]
        private string GenerateNewVndCode(string lastCstCode)
        {
            string numericPart = Regex.Replace(lastCstCode, "[^0-9]", ""); // Replace non-numeric characters with an empty string
            int lastNumber = int.Parse(numericPart);

            // Increment the last number
            int newNumber = lastNumber + 1;

            // Generate the new cstCode by simply using the new numeric part
            string newCstCode = newNumber.ToString();

            return newCstCode;
        }


        [HttpPost]
        public async Task<IActionResult> saveVendor([FromBody] Vendors vendor)
        {
            var fiscalYear = _AMDbContext.FiscalYear.Where(x => x.active == true && x.comID == vendor.comID).ToList().FirstOrDefault().period;

            vendor.vendCode = vendor.vendCode.Trim();
            vendor.vendName = vendor.vendName.Trim();
            var message = "";
            string sql = "EXEC GenerateGLVoucherNo @txType, @comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@txType", Value = 40 },
                new SqlParameter { ParameterName = "@comID", Value = vendor.comID }
            };
            var voucherNo = _AMDbContext.invoiceNo.FromSqlRaw(sql, parms.ToArray()).ToList()[0].voucherNo;


            if (vendor.vendID != 0)
            {
                var existList = _AMDbContext.Vendors.Where(x => x.vendID != vendor.vendID && x.comID == vendor.comID && x.vendCode == vendor.vendCode).ToList();
                if (existList.Count() == 0)
                {
                    var cstCOA = _AMDbContext.COA.Where(x => x.COANo == vendor.vendID && x.parentCOAID == 83).FirstOrDefault();
                    var cstGL = _AMDbContext.gl.Where(x => x.vendID == vendor.vendID && x.txTypeID == 40 && x.COAID == cstCOA.COAID).ToList();
                    var oldBalance = cstCOA.openBal;
                    if (cstGL.Count() > 0)
                    {
                        var cstGlTxlinkList = _AMDbContext.GLTxLinks.Where(x => x.relGLID == cstGL[0].GLID).ToList();
                        if (cstGlTxlinkList.Count() > 0)
                        {
                            vendor.opnBal = oldBalance;
                            message = ", You can't change opening balance because payment voucher is already created.";
                        }
                    }

                    vendor.modDate = DateTime.Now;
                    vendor.modby = username;
                    _AMDbContext.Vendors.Update(vendor);

                    COA coa = new COA()
                    {
                        COAID = cstCOA.COAID,
                        acctNo = cstCOA.acctNo,
                        acctName = vendor.vendName,
                        isSys = false,
                        parentCOAID = 83,
                        COANo = vendor.vendID,
                        nextChkNo = vendor.vendCode,
                        COAlevel = 4,
                        treeName = vendor.vendName,
                        active = true,
                        acctType = "Trade Creditors",
                        parentAcctType = "Liability",
                        parentAcctName = "Trade Creditors",
                        path = @"Liability\Current Liability\Current Liability\Trade Creditors\" + vendor.vendName + @"\",
                        crtBy = username,
                        crtDate = DateTime.Now,
                        modBy = username,
                        modDate = DateTime.Now,
                        openBal = vendor.opnBal,
                        bal = cstCOA.bal - cstCOA.openBal + vendor.opnBal,
                        closingBal = cstCOA.closingBal,
                        comID = vendor.comID
                    };
                    _AMDbContext.COA.Update(coa);
                    await _AMDbContext.SaveChangesAsync();

                    if (cstGL.Count() > 0 && message == "")
                    {
                        if (vendor.opnBal > 0)
                        {
                            _AMDbContext.RemoveRange(_AMDbContext.gl.Where(x => x.voucherNo == cstGL[0].voucherNo));
                            await _AMDbContext.SaveChangesAsync();

                            List<GL> gl = new List<GL>();
                            GL glMasterEntry = new GL()
                            {
                                txID = 0,
                                txTypeID = 40,
                                COAID = 0,
                                relCOAID = 0,
                                balSum = decimal.Parse(coa.openBal.ToString()),
                                creditSum = decimal.Parse(coa.openBal.ToString()),
                                vendID = vendor.vendID,
                                comID = vendor.comID,
                                active = true,
                                dtTx = DateTime.Now,
                                crtBy = username,
                                crtDate = DateTime.Now,
                                modBy = username,
                                modDate = DateTime.Now,
                                voucherNo = cstGL[0].voucherNo,
                                depositID = fiscalYear
                            };

                            gl.Add(glMasterEntry);

                            GL glEntry1 = new GL()
                            {
                                txID = 0,
                                txTypeID = 40,
                                COAID = coa.parentCOAID,
                                relCOAID = coa.COAID,
                                vendID = vendor.vendID,
                                comID = vendor.comID,
                                balSum = 0,
                                creditSum = decimal.Parse(coa.openBal.ToString()),
                                active = true,
                                dtTx = DateTime.Now,
                                crtBy = username,
                                crtDate = DateTime.Now,
                                modBy = username,
                                modDate = DateTime.Now,
                                voucherNo = cstGL[0].voucherNo,
                                depositID = fiscalYear
                            };

                            gl.Add(glEntry1);


                            GL glEntry2 = new GL()
                            {
                                txID = 0,
                                txTypeID = 40,
                                COAID = coa.COAID,
                                relCOAID = coa.parentCOAID,
                                vendID = vendor.vendID,
                                comID = vendor.comID,
                                balSum = decimal.Parse(coa.openBal.ToString()),
                                debitSum = decimal.Parse(coa.openBal.ToString()),
                                active = true,
                                dtTx = DateTime.Now,
                                crtBy = username,
                                crtDate = DateTime.Now,
                                modBy = username,
                                modDate = DateTime.Now,
                                voucherNo = cstGL[0].voucherNo,
                                depositID = fiscalYear
                            };

                            gl.Add(glEntry2);

                            var gl1 = 0;
                            foreach (var item in gl)
                            {
                                if (gl1 != 0)
                                {
                                    item.txID = gl1;
                                }
                                await _AMDbContext.gl.AddAsync(item);
                                await _AMDbContext.SaveChangesAsync();
                                if (gl1 == 0)
                                {
                                    gl1 = item.GLID;
                                }
                            }
                        }
                    }
                    else if (message == "")
                    {
                        if (vendor.opnBal > 0)
                        {
                            List<GL> gl = new List<GL>();
                            GL glMasterEntry = new GL()
                            {
                                txID = 0,
                                txTypeID = 40,
                                COAID = 0,
                                relCOAID = 0,
                                balSum = decimal.Parse(coa.openBal.ToString()),
                                creditSum = decimal.Parse(coa.openBal.ToString()),
                                vendID = vendor.vendID,
                                comID = vendor.comID,
                                active = true,
                                dtTx = DateTime.Now,
                                crtBy = username,
                                crtDate = DateTime.Now,
                                modBy = username,
                                modDate = DateTime.Now,
                                voucherNo = voucherNo,
                                depositID = fiscalYear
                            };

                            gl.Add(glMasterEntry);

                            GL glEntry1 = new GL()
                            {
                                txID = 0,
                                txTypeID = 40,
                                COAID = coa.parentCOAID,
                                relCOAID = coa.COAID,
                                vendID = vendor.vendID,
                                comID = vendor.comID,
                                balSum = 0,
                                creditSum = decimal.Parse(coa.openBal.ToString()),
                                active = true,
                                dtTx = DateTime.Now,
                                crtBy = username,
                                crtDate = DateTime.Now,
                                modBy = username,
                                modDate = DateTime.Now,
                                voucherNo = voucherNo,
                                depositID = fiscalYear
                            };

                            gl.Add(glEntry1);


                            GL glEntry2 = new GL()
                            {
                                txID = 0,
                                txTypeID = 40,
                                COAID = coa.COAID,
                                relCOAID = coa.parentCOAID,
                                vendID = vendor.vendID,
                                comID = vendor.comID,
                                balSum = decimal.Parse(coa.openBal.ToString()),
                                debitSum = decimal.Parse(coa.openBal.ToString()),
                                active = true,
                                dtTx = DateTime.Now,
                                crtBy = username,
                                crtDate = DateTime.Now,
                                modBy = username,
                                modDate = DateTime.Now,
                                voucherNo = voucherNo,
                                depositID = fiscalYear
                            };

                            gl.Add(glEntry2);

                            var gl1 = 0;
                            foreach (var item in gl)
                            {
                                if (gl1 != 0)
                                {
                                    item.txID = gl1;
                                }
                                await _AMDbContext.gl.AddAsync(item);
                                await _AMDbContext.SaveChangesAsync();
                                if (gl1 == 0)
                                {
                                    gl1 = item.GLID;
                                }
                            }
                        }
                    }

                    _notificationInterceptor.SaveNotification("SuppliersEdit", vendor.comID, "");
                }
                else
                {
                    return NotFound("Vendor Code Already Exists!");
                }
            }
            else
            {
                var existList = _AMDbContext.Vendors.Where(x => x.comID == vendor.comID && x.vendCode == vendor.vendCode).ToList();
                if (existList.Count() == 0)
                {
                    vendor.crtBy = username;
                    vendor.crtDate = DateTime.Now;
                    vendor.modby = username;
                    vendor.modDate = DateTime.Now;

                    await _AMDbContext.Vendors.AddAsync(vendor);
                    await _AMDbContext.SaveChangesAsync();

                    var vendParentAccCode = _AMDbContext.COA.FirstOrDefault(x => x.COAID == 83).acctNo;
                    var vendNewAcctNo = _helperMethods.GenerateAcctNo(vendParentAccCode, (int)vendor.comID);


                    COA coa = new COA()
                    {
                        acctNo = vendNewAcctNo,
                        acctName = vendor.vendName,
                        openBal = vendor.opnBal,
                        closingBal = 0,
                        isSys = false,
                        parentCOAID = 83,
                        COANo = vendor.vendID,
                        nextChkNo = vendor.vendCode,
                        bal = vendor.opnBal,
                        COAlevel = 4,
                        active = true,
                        treeName = vendor.vendName,
                        acctType = "Trade Creditors",
                        parentAcctType = "Liability",
                        parentAcctName = "Trade Creditors",
                        path = @"Liability\Current Liability\Current Liability\Trade Creditors\" + vendor.vendName + @"\",
                        crtBy = username,
                        crtDate = DateTime.Now,
                        modBy = username,
                        modDate = DateTime.Now,
                        comID = vendor.comID
                    };
                    await _AMDbContext.COA.AddAsync(coa);
                    await _AMDbContext.SaveChangesAsync();

                    if (vendor.opnBal > 0)
                    {
                        List<GL> gl = new List<GL>();
                        GL glMasterEntry = new GL()
                        {
                            txID = 0,
                            txTypeID = 40,
                            COAID = 0,
                            relCOAID = 0,
                            balSum = decimal.Parse(coa.openBal.ToString()),
                            creditSum = decimal.Parse(coa.openBal.ToString()),
                            vendID = vendor.vendID,
                            comID = vendor.comID,
                            active = true,
                            dtTx = DateTime.Now,
                            crtBy = username,
                            crtDate = DateTime.Now,
                            modBy = username,
                            modDate = DateTime.Now,
                            voucherNo = voucherNo,
                            depositID = fiscalYear
                        };

                        gl.Add(glMasterEntry);

                        GL glEntry1 = new GL()
                        {
                            txID = 0,
                            txTypeID = 40,
                            COAID = coa.parentCOAID,
                            relCOAID = coa.COAID,
                            vendID = vendor.vendID,
                            comID = vendor.comID,
                            balSum = 0,
                            creditSum = decimal.Parse(coa.openBal.ToString()),
                            active = true,
                            dtTx = DateTime.Now,
                            crtBy = username,
                            crtDate = DateTime.Now,
                            modBy = username,
                            modDate = DateTime.Now,
                            voucherNo = voucherNo,
                            depositID = fiscalYear
                        };

                        gl.Add(glEntry1);


                        GL glEntry2 = new GL()
                        {
                            txID = 0,
                            txTypeID = 40,
                            COAID = coa.COAID,
                            relCOAID = coa.parentCOAID,
                            vendID = vendor.vendID,
                            comID = vendor.comID,
                            balSum = decimal.Parse(coa.openBal.ToString()),
                            debitSum = decimal.Parse(coa.openBal.ToString()),
                            active = true,
                            dtTx = DateTime.Now,
                            crtBy = username,
                            crtDate = DateTime.Now,
                            modBy = username,
                            modDate = DateTime.Now,
                            voucherNo = voucherNo,
                            depositID = fiscalYear
                        };

                        gl.Add(glEntry2);

                        var gl1 = 0;
                        foreach (var item in gl)
                        {
                            if (gl1 != 0)
                            {
                                item.txID = gl1;
                            }
                            await _AMDbContext.gl.AddAsync(item);
                            await _AMDbContext.SaveChangesAsync();
                            if (gl1 == 0)
                            {
                                gl1 = item.GLID;
                            }
                        }

                    }

                    _notificationInterceptor.SaveNotification("SuppliersCreate", vendor.comID, "");
                }
                else
                {
                    return NotFound("Vendor Code Already Exists!");
                }
            }
            vendor.message = message;
            return Ok(vendor);
        }


        [HttpPost("uploadVendors")]
        public async Task<IActionResult> uploadVendorsAsync()
        {
            try
            {
                var comID = int.Parse(Request.Headers["comID"].ToString());

                var fiscalYear = _AMDbContext.FiscalYear.Where(x => x.active == true && x.comID == comID).ToList().FirstOrDefault().period;
                var form = Request.Form;
                var list = new List<Vendors>();
                int countNotInsertedRow = 0;
                int countInsertedRow = 0;
                int countEmptyRow = 0;
                int countWrongCompanyName = 0;
                string ExistRowNumber = "";
                string EmptyRowNumber = "";
                string EmptyRowNumberForCompany = "";
                string sql = "EXEC GenerateGLVoucherNo @txType, @comID";
                List<SqlParameter> parms = new List<SqlParameter>
                {
                    new SqlParameter { ParameterName = "@txType", Value = 40 },
                new SqlParameter { ParameterName = "@comID", Value = comID }
                };
                var voucherNo = _AMDbContext.invoiceNo.FromSqlRaw(sql, parms.ToArray()).ToList()[0].voucherNo;
                var vendParentAccCode = _AMDbContext.COA.FirstOrDefault(x => x.COAID == 83).acctNo;

                foreach (var file in form.Files)
                {
                    using (var stream = new MemoryStream())
                    {
                        file.CopyTo(stream);
                        using (var workbook = new XLWorkbook(stream))
                        {
                            var worksheet = workbook.Worksheet(1);

                            // Process the worksheet and extract data
                            // For example, you can read cells like this:
                            if (
                               worksheet.Cell(1, 1).Value.ToString() == "CODE" &&
                               worksheet.Cell(1, 2).Value.ToString() == "NAME" &&
                               worksheet.Cell(1, 3).Value.ToString() == "ADDRESS" &&
                               worksheet.Cell(1, 4).Value.ToString() == "PHONE" &&
                               worksheet.Cell(1, 5).Value.ToString() == "VAT NO" &&
                               worksheet.Cell(1, 6).Value.ToString() == "VAT %" &&
                               worksheet.Cell(1, 7).Value.ToString() == "OPENING BALANCE"
                               )
                            {
                                for (int i = 2; i <= worksheet.RowsUsed().Count(); i++)
                                {
                                    var company = _AMDbContext.Companies.Where(x => x.comID == comID).ToList();
                                    if (company.Count() == 1)
                                    {

                                        var existList = _AMDbContext.Vendors.Where(x => x.comID == company.FirstOrDefault().comID && x.vendCode == worksheet.Cell(i, 1).Value.ToString());
                                        if (existList.Count() == 0)
                                        {
                                            var prdGrpName = worksheet.Cell(i, 1).Value.ToString();

                                            Vendors v = new Vendors();
                                            v.vendID = 0;
                                            v.vendCode = worksheet.Cell(i, 1).Value.ToString().Trim();
                                            v.vendName = worksheet.Cell(i, 2).Value.ToString().Trim();

                                            if (v.vendCode != "" && v.vendName != "" && company.Count() == 1)
                                            {
                                                v.vendPhone = worksheet.Cell(i, 4).Value.ToString();
                                                v.address = worksheet.Cell(i, 3).Value.ToString();
                                                v.taxNo = worksheet.Cell(i, 5).Value.ToString();
                                                v.active = true;
                                                v.taxValue = decimal.Parse(worksheet.Cell(i, 6).Value.ToString() == "" ? "0" : worksheet.Cell(i, 6).Value.ToString());
                                                decimal bal = decimal.Parse(worksheet.Cell(i, 7).Value.ToString() == "" ? "0" : worksheet.Cell(i, 7).Value.ToString());
                                                v.comID = company.FirstOrDefault().comID;
                                                v.modby = v.crtBy = username;
                                                v.modDate = v.crtDate = DateTime.Now;
                                                await _AMDbContext.Vendors.AddAsync(v);
                                                await _AMDbContext.SaveChangesAsync();
                                                list.Add(v);

                                                var vendNewAcctNo = _helperMethods.GenerateAcctNo(vendParentAccCode, comID);

                                                COA coa = new COA()
                                                {
                                                    acctNo = vendNewAcctNo,
                                                    acctName = v.vendName,
                                                    openBal = bal,
                                                    bal = bal,
                                                    closingBal = 0,
                                                    isSys = false,
                                                    parentCOAID = 83,
                                                    COANo = v.vendID,
                                                    nextChkNo = v.vendCode,
                                                    COAlevel = 4,
                                                    treeName = v.vendName,
                                                    active = true,
                                                    acctType = "Trade Creditors",
                                                    parentAcctType = "Liability",
                                                    parentAcctName = "Trade Creditors",
                                                    path = @"Liability\Current Liability\Current Liability\Trade Creditors\" + v.vendName + @"\",
                                                    crtBy = username,
                                                    crtDate = DateTime.Now,
                                                    modBy = username,
                                                    modDate = DateTime.Now,
                                                    comID = v.comID
                                                };
                                                await _AMDbContext.COA.AddAsync(coa);
                                                await _AMDbContext.SaveChangesAsync();

                                                if (bal > 0)
                                                {
                                                    List<GL> gl = new List<GL>();
                                                    GL glMasterEntry = new GL()
                                                    {
                                                        txID = 0,
                                                        txTypeID = 40,
                                                        COAID = 0,
                                                        relCOAID = 0,
                                                        vendID = v.vendID,
                                                        balSum = bal,
                                                        creditSum = bal,
                                                        comID = v.comID,
                                                        active = true,
                                                        dtTx = DateTime.Now,
                                                        crtBy = username,
                                                        crtDate = DateTime.Now,
                                                        modBy = username,
                                                        modDate = DateTime.Now,
                                                        voucherNo = voucherNo,
                                                        depositID = fiscalYear
                                                    };

                                                    gl.Add(glMasterEntry);

                                                    GL glEntry1 = new GL()
                                                    {
                                                        txID = 0,
                                                        txTypeID = 40,
                                                        COAID = coa.parentCOAID,
                                                        relCOAID = coa.COAID,
                                                        vendID = v.vendID,
                                                        balSum = 0,
                                                        creditSum = bal,
                                                        comID = v.comID,
                                                        active = true,
                                                        dtTx = DateTime.Now,
                                                        crtBy = username,
                                                        crtDate = DateTime.Now,
                                                        modBy = username,
                                                        modDate = DateTime.Now,
                                                        voucherNo = voucherNo,
                                                        depositID = fiscalYear
                                                    };

                                                    gl.Add(glEntry1);


                                                    GL glEntry2 = new GL()
                                                    {
                                                        txID = 0,
                                                        txTypeID = 40,
                                                        COAID = coa.COAID,
                                                        relCOAID = coa.parentCOAID,
                                                        vendID = v.vendID,
                                                        balSum = bal,
                                                        debitSum = bal,
                                                        comID = v.comID,
                                                        active = true,
                                                        dtTx = DateTime.Now,
                                                        crtBy = username,
                                                        crtDate = DateTime.Now,
                                                        modBy = username,
                                                        modDate = DateTime.Now,
                                                        voucherNo = voucherNo,
                                                        depositID = fiscalYear
                                                    };

                                                    gl.Add(glEntry2);

                                                    var gl1 = 0;
                                                    foreach (var item in gl)
                                                    {
                                                        if (gl1 != 0)
                                                        {
                                                            item.txID = gl1;
                                                        }
                                                        await _AMDbContext.gl.AddAsync(item);
                                                        await _AMDbContext.SaveChangesAsync();
                                                        if (gl1 == 0)
                                                        {
                                                            gl1 = item.GLID;
                                                        }
                                                    }

                                                }

                                                countInsertedRow++;
                                            }
                                            else
                                            {
                                                countEmptyRow++;
                                                EmptyRowNumber = EmptyRowNumber + i + " , ";
                                            }
                                        }
                                        else
                                        {
                                            countNotInsertedRow++;
                                            ExistRowNumber = ExistRowNumber + i + " , ";
                                        }
                                    }
                                    else
                                    {
                                        countWrongCompanyName++;
                                        EmptyRowNumberForCompany = EmptyRowNumberForCompany + i + " , ";
                                    }
                                }
                            }
                            else
                            {
                                return BadRequest("header name is incorrect");
                            }
                        }
                    }
                }

                if (countInsertedRow == 0 && countNotInsertedRow > 0)
                {
                    return NotFound("All Vendors Already Exists!");

                }
                if (countInsertedRow == 0 && countNotInsertedRow == 0 && countWrongCompanyName > 0)
                {
                    return NotFound("Please write correct company name");

                }
                if (list.Count > 0)
                {
                    string text = "";
                    if (countNotInsertedRow > 0)
                    {
                        text = " , Already Exist On Row Number : " + ExistRowNumber.Remove(ExistRowNumber.Length - 2, 1);
                    }
                    if (countEmptyRow > 0)
                    {
                        text = text + " , Fill Empty Blanks On Row Number : " + EmptyRowNumber.Remove(EmptyRowNumber.Length - 2, 1);
                    }
                    if (countWrongCompanyName > 0)
                    {
                        text = text + " , Company name not correct on Row Number : " + EmptyRowNumberForCompany.Remove(EmptyRowNumberForCompany.Length - 2, 1);
                    }
                    list[0].comment = countInsertedRow.ToString() + " Out Of " + (countInsertedRow + countNotInsertedRow + countEmptyRow + countWrongCompanyName) + " Inserted Successfully!".ToString() + text;
                    return Ok(list);
                }
                return NotFound("Please Upload Correct File.");
            }
            catch (Exception ex)
            {
                return NotFound("Please Upload Correct File.");
            }

        }
    }
}
