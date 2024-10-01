using ClosedXML.Excel;
using eMaestroD.Api.Common;
using eMaestroD.Api.Data;
using eMaestroD.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using eMaestroD.DataAccess.DataSet;
using eMaestroD.Shared.Common;

namespace eMaestroD.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("/api/[controller]")]
    public class CustomersController : Controller
    {
        private readonly AMDbContext _AMDbContext;
        private readonly NotificationInterceptor _notificationInterceptor;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly HttpClient _httpClient; 
        private readonly HelperMethods _helperMethods; 
        string username = "";
        public CustomersController(AMDbContext aMDbContext, HttpClient httpClient, NotificationInterceptor notificationInterceptor, IHttpContextAccessor httpContextAccessor, HelperMethods helperMethods)
        {
            _AMDbContext = aMDbContext;
            _notificationInterceptor = notificationInterceptor;
            _httpContextAccessor = httpContextAccessor;
            _helperMethods = helperMethods;
            _httpClient = httpClient;

            username = GetUsername();
        }

        [HttpGet]
        [Route("{comID}")]
        public async Task<IActionResult> GetAllCustomer(int comID)
        {
            var result = await (from cst in _AMDbContext.Customers
                                join coa in _AMDbContext.COA
                                on cst.cstID equals coa.COANo
                                where cst.comID == comID && cst.active == true && coa.parentCOAID == 40
                                select new Customer // Projecting into the extended Customer model
                                {
                                    cstID = cst.cstID,
                                    comID = cst.comID,
                                    empID = cst.empID,
                                    cstCode = cst.cstCode,
                                    cstName = cst.cstName,
                                    contPhone = cst.contPhone,
                                    address = cst.address,
                                    active = cst.active,
                                    taxNo = cst.taxNo,
                                    taxValue = cst.taxValue,
                                    comment = cst.comment,
                                    opnBal = coa.openBal,
                                    vendorBal = _AMDbContext.COA.FirstOrDefault(x => x.parentCOAID == 83 && x.COANo == cst.empID) == null ? 0 : _AMDbContext.COA.FirstOrDefault(x => x.parentCOAID == 83 && x.COANo == cst.empID).openBal,
                                    isActionBtn = false
                                }).ToListAsync();
            ResponsedGroupListVM vM = new ResponsedGroupListVM();
            vM.enttityDataSource = result;
            vM.entityModel = result?.GetEntity_MetaData();

            return Ok(vM);

        }

        [HttpGet]
        [Route("GetAllCustomerIncludeWalkIn/{comID}")]
        public async Task<IActionResult> GetAllCustomerIncludeWalkIn(int comID)
        {

            var result = await _AMDbContext.Customers.Where(x => x.comID == comID).ToListAsync();
            ResponsedGroupListVM vM = new ResponsedGroupListVM();
            vM.enttityDataSource = result;
            vM.entityModel = result?.GetEntity_MetaData();

            return Ok(vM);

        }

        [HttpGet]
        [Route("{GetCustomerByPhoneNo}/{phoneNo}/{comID}")]
        public async Task<IActionResult> GetCustomerByPhoneNo(string phoneNo, int comID)
        {
            var existList = _AMDbContext.Customers.Where(x => x.comID == comID && (x.contPhone == phoneNo || x.taxNo == phoneNo)).FirstOrDefault();
            if (existList != null)
                return Ok(existList);

            return NotFound();
        }

        [HttpGet("{GetCstCode}/{comID}")]
        public async Task<IActionResult> GetCstCode(int comID)
        {
            var customers = _AMDbContext.Customers
                .Where(x => x.comID == comID)
                .ToList(); // Retrieve data from the database

            var existingCustomer = customers
                .OrderByDescending(x => int.TryParse(x.cstCode, out int result) ? result : int.MinValue)
                .FirstOrDefault();
            //var existingCustomer = _AMDbContext.Customers.Where(x => x.comID == comID).OrderByDescending(x => int.TryParse(x.cstCode, out int result) ? result : int.MinValue).FirstOrDefault();
            if (existingCustomer != null)
            {
                string newCstCode = GenerateNewCstCode(existingCustomer.cstCode);
                return Ok(newCstCode);
            }

            // If no existing customer with the given comID found
            return NotFound();
        }

        [NonAction]
        private string GenerateNewCstCode(string lastCstCode)
        {
            string numericPart = Regex.Replace(lastCstCode, "[^0-9]", ""); // Replace non-numeric characters with an empty string
            int lastNumber = int.Parse(numericPart);

            // Increment the last number
            int newNumber = lastNumber + 1;

            // Generate the new cstCode by simply using the new numeric part
            string newCstCode = newNumber.ToString();

            return newCstCode;
        }


        [HttpDelete]
        [Route("{cstID}")]
        public async Task<IActionResult> DeleteCustomer(int cstID)
        {
            var glList = _AMDbContext.gl.Where(x => x.cstID == cstID && x.txTypeID != 40).ToList();
            if (glList.Count > 0)
            {
                return NotFound("Some Invoices Depend on this Customer, Please delete invoice first.");
            }
            var lst = _AMDbContext.Customers.Where(a => a.cstID == cstID).ToList();
            _AMDbContext.RemoveRange(_AMDbContext.COA.Where(a => a.COANo == cstID && a.acctName == lst[0].cstName));
            _AMDbContext.RemoveRange(lst);
            _AMDbContext.RemoveRange(_AMDbContext.gl.Where(x => x.cstID == cstID && x.txTypeID == 40));
            await _AMDbContext.SaveChangesAsync();

            _notificationInterceptor.SaveNotification("CustomersDelete", lst[0].comID, "");
            return Ok();
        }



        [HttpPost]
        public async Task<IActionResult> saveCustomer([FromBody] Customer customer)
        {
            if (customer.comment == "true")
            {
                if (customer.cstID == 0 && customer.empID > 0)
                {
                    var oldCST = _AMDbContext.Customers.FirstOrDefault(x => x.empID == customer.empID);
                    customer.cstID = oldCST == null ? 0 : oldCST.cstID;
                }

                var fiscalYear = _AMDbContext.FiscalYear.Where(x => x.active == true && x.comID == customer.comID).ToList().FirstOrDefault().period;

                customer.cstCode = customer.cstCode.Trim();
                customer.cstName = customer.cstName.Trim();
                string sql = "EXEC GenerateVoucherNo @txType, @comID";
                var message = "";
                List<SqlParameter> parms = new List<SqlParameter>
                {
                    new SqlParameter { ParameterName = "@txType", Value = 40 },
                    new SqlParameter { ParameterName = "@comID", Value = customer.comID },
                };
                var voucherNo = _AMDbContext.invoiceNo.FromSqlRaw(sql, parms.ToArray()).ToList()[0].voucherNo;

                if (customer.cstID != 0)
                {
                    var existList = _AMDbContext.Customers.Where(x => x.cstID != customer.cstID && x.comID == customer.comID && x.cstCode == customer.cstCode).ToList();
                    if (existList.Count() == 0)
                    {
                        var cstCOA = _AMDbContext.COA.Where(x => x.COANo == customer.cstID && x.parentCOAID == 40).FirstOrDefault();
                        var cstGL = _AMDbContext.gl.Where(x => x.cstID == customer.cstID && x.txTypeID == 40 && x.COAID == cstCOA.COAID).ToList();
                        var oldBalance = cstCOA.openBal;
                        if (cstGL.Count() > 0)
                        {
                            var cstGlTxlinkList = _AMDbContext.GLTxLinks.Where(x => x.relGLID == cstGL[0].GLID).ToList();
                            if (cstGlTxlinkList.Count() > 0)
                            {
                                customer.opnBal = oldBalance;
                                message = ", You can't change opening balance because receipt is already created.";
                            }
                        }

                        customer.modby = username;
                        customer.modDate = DateTime.Now;
                        _AMDbContext.Customers.Update(customer);

                        COA coa = new COA()
                        {
                            COAID = cstCOA.COAID,
                            acctNo = cstCOA.acctNo,
                            acctName = customer.cstName,
                            isSys = false,
                            parentCOAID = 40,
                            COANo = customer.cstID,
                            nextChkNo = customer.cstCode,
                            COAlevel = 4,
                            active = true,
                            treeName = customer.cstName,
                            acctType = "Trade Debtors",
                            parentAcctType = "Assets",
                            parentAcctName = "Trade Debtors",
                            path = @"Assets\Current Assets\Account Receivable\Trade Debtors\" + customer.cstName + @"\",
                            openBal = customer.opnBal,
                            bal = cstCOA.bal - cstCOA.openBal + customer.opnBal,
                            closingBal = cstCOA.closingBal,
                            modBy = username,
                            modDate = DateTime.Now,
                            comID = customer.comID
                        };
                        _AMDbContext.COA.Update(coa);
                        await _AMDbContext.SaveChangesAsync();

                        if (cstGL.Count() > 0 && message == "")
                        {
                            if (customer.opnBal > 0)
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
                                    cstID = customer.cstID,
                                    comID = customer.comID,
                                    active = true,
                                    dtTx = DateTime.Now,
                                    voucherNo = cstGL[0].voucherNo,
                                    depositID = fiscalYear,
                                    crtBy = username,
                                    crtDate = DateTime.Now,
                                    modBy = username,
                                    modDate = DateTime.Now,
                                };

                                gl.Add(glMasterEntry);

                                GL glEntry1 = new GL()
                                {
                                    txID = 0,
                                    txTypeID = 40,
                                    COAID = coa.parentCOAID,
                                    relCOAID = coa.COAID,
                                    cstID = customer.cstID,
                                    comID = customer.comID,
                                    balSum = 0,
                                    debitSum = decimal.Parse(coa.openBal.ToString()),
                                    active = true,
                                    dtTx = DateTime.Now,
                                    voucherNo = cstGL[0].voucherNo,
                                    depositID = fiscalYear,
                                    crtBy = username,
                                    crtDate = DateTime.Now,
                                    modBy = username,
                                    modDate = DateTime.Now,
                                };

                                gl.Add(glEntry1);


                                GL glEntry2 = new GL()
                                {
                                    txID = 0,
                                    txTypeID = 40,
                                    COAID = coa.COAID,
                                    relCOAID = coa.parentCOAID,
                                    cstID = customer.cstID,
                                    comID = customer.comID,
                                    balSum = decimal.Parse(coa.openBal.ToString()),
                                    creditSum = decimal.Parse(coa.openBal.ToString()),
                                    active = true,
                                    dtTx = DateTime.Now,
                                    voucherNo = cstGL[0].voucherNo,
                                    depositID = fiscalYear,
                                    crtBy = username,
                                    crtDate = DateTime.Now,
                                    modBy = username,
                                    modDate = DateTime.Now,
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
                            if (customer.opnBal > 0)
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
                                    cstID = customer.cstID,
                                    comID = customer.comID,
                                    active = true,
                                    dtTx = DateTime.Now,
                                    voucherNo = voucherNo,
                                    depositID = fiscalYear,
                                    crtBy = username,
                                    crtDate = DateTime.Now,
                                    modBy = username,
                                    modDate = DateTime.Now,
                                };

                                gl.Add(glMasterEntry);

                                GL glEntry1 = new GL()
                                {
                                    txID = 0,
                                    txTypeID = 40,
                                    COAID = coa.parentCOAID,
                                    relCOAID = coa.COAID,
                                    cstID = customer.cstID,
                                    comID = customer.comID,
                                    balSum = 0,
                                    debitSum = decimal.Parse(coa.openBal.ToString()),
                                    active = true,
                                    dtTx = DateTime.Now,
                                    voucherNo = voucherNo,
                                    depositID = fiscalYear,
                                    crtBy = username,
                                    crtDate = DateTime.Now,
                                    modBy = username,
                                    modDate = DateTime.Now,
                                };

                                gl.Add(glEntry1);


                                GL glEntry2 = new GL()
                                {
                                    txID = 0,
                                    txTypeID = 40,
                                    COAID = coa.COAID,
                                    relCOAID = coa.parentCOAID,
                                    cstID = customer.cstID,
                                    comID = customer.comID,
                                    balSum = decimal.Parse(coa.openBal.ToString()),
                                    creditSum = decimal.Parse(coa.openBal.ToString()),
                                    active = true,
                                    dtTx = DateTime.Now,
                                    voucherNo = voucherNo,
                                    depositID = fiscalYear,
                                    crtBy = username,
                                    crtDate = DateTime.Now,
                                    modBy = username,
                                    modDate = DateTime.Now,
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

                        _notificationInterceptor.SaveNotification("CustomersEdit", customer.comID, "");
                    }
                    else
                    {
                        return NotFound("Customer Code Already Exists!");
                    }
                }
                else
                {
                    var existList = _AMDbContext.Customers.Where(x => x.comID == customer.comID && x.cstCode == customer.cstCode).ToList();
                    if (existList.Count() == 0)
                    {
                        customer.crtBy = username;
                        customer.crtDate = DateTime.Now;
                        customer.modby = username;
                        customer.modDate = DateTime.Now;
                        customer.cstGrpID = 0;

                        await _AMDbContext.Customers.AddAsync(customer);
                        await _AMDbContext.SaveChangesAsync();

                        var cstParentAccCode = _AMDbContext.COA.FirstOrDefault(x => x.COAID == 40).acctNo;
                        var cstNewAcctNo = _helperMethods.GenerateAcctNo(cstParentAccCode, (int)customer.comID);

                        COA coa = new COA()
                        {
                            acctNo = cstNewAcctNo,
                            acctName = customer.cstName,
                            openBal = customer.opnBal,
                            bal = customer.opnBal,
                            closingBal = 0,
                            isSys = false,
                            parentCOAID = 40,
                            COANo = customer.cstID,
                            nextChkNo = customer.cstCode,
                            COAlevel = 4,
                            active = true,
                            treeName = customer.cstName,
                            acctType = "Trade Debtors",
                            parentAcctType = "Assets",
                            parentAcctName = "Trade Debtors",
                            path = @"Assets\Current Assets\Account Receivable\Trade Debtors\" + customer.cstName + @"\",
                            crtBy = username,
                            crtDate = DateTime.Now,
                            modBy = username,
                            modDate = DateTime.Now,
                            comID = customer.comID
                        };
                        await _AMDbContext.COA.AddAsync(coa);
                        await _AMDbContext.SaveChangesAsync();

                        if (customer.opnBal > 0)
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
                                cstID = customer.cstID,
                                depositID = fiscalYear,
                                comID = customer.comID,
                                active = true,
                                dtTx = DateTime.Now,
                                voucherNo = voucherNo,
                                crtBy = username,
                                crtDate = DateTime.Now,
                                modBy = username,
                                modDate = DateTime.Now,
                            };

                            gl.Add(glMasterEntry);

                            GL glEntry1 = new GL()
                            {
                                txID = 0,
                                txTypeID = 40,
                                COAID = coa.parentCOAID,
                                depositID = fiscalYear,
                                relCOAID = coa.COAID,
                                cstID = customer.cstID,
                                comID = customer.comID,
                                balSum = 0,
                                debitSum = decimal.Parse(coa.openBal.ToString()),
                                active = true,
                                dtTx = DateTime.Now,
                                voucherNo = voucherNo,
                                crtBy = username,
                                crtDate = DateTime.Now,
                                modBy = username,
                                modDate = DateTime.Now,
                            };

                            gl.Add(glEntry1);


                            GL glEntry2 = new GL()
                            {
                                txID = 0,
                                txTypeID = 40,
                                COAID = coa.COAID,
                                relCOAID = coa.parentCOAID,
                                depositID = fiscalYear,
                                cstID = customer.cstID,
                                comID = customer.comID,
                                balSum = decimal.Parse(coa.openBal.ToString()),
                                creditSum = decimal.Parse(coa.openBal.ToString()),
                                active = true,
                                dtTx = DateTime.Now,
                                voucherNo = voucherNo,
                                crtBy = username,
                                crtDate = DateTime.Now,
                                modBy = username,
                                modDate = DateTime.Now,
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

                        _notificationInterceptor.SaveNotification("CustomersCreate", customer.comID, "");
                    }
                    else
                    {
                        return NotFound("Customer Code Already Exists!");
                    }
                }
                customer.message = message;
                return Ok(customer);
            }
            else
            {
                if (customer.cstID == 0)
                {
                    var walkInList = _AMDbContext.Customers.Where(x => x.comID == customer.comID && x.cstName.ToLower().Trim() == "walk in").FirstOrDefault();
                    customer.cstGrpID = walkInList != null ? walkInList.cstID : 0;
                    customer.cstName = customer.cstName.Trim();
                    customer.crtBy = username;
                    customer.crtDate = DateTime.Now;
                    customer.modby = username;
                    customer.modDate = DateTime.Now;

                    await _AMDbContext.Customers.AddAsync(customer);
                    await _AMDbContext.SaveChangesAsync();
                }
                else
                {
                    customer.cstName = customer.cstName.Trim();
                    customer.modby = username;
                    customer.modDate = DateTime.Now;

                    _AMDbContext.Customers.Update(customer);
                    await _AMDbContext.SaveChangesAsync();
                }

                return Ok(customer);
            }
        }


        [HttpPost("uploadCustomers")]
        public async Task<IActionResult> uploadCustomersAsync()
        {
            try
            {
                var comID = int.Parse(Request.Headers["comID"].ToString());

                var fiscalYear = _AMDbContext.FiscalYear.Where(x => x.active == true && x.comID == comID).ToList().FirstOrDefault().period;

                var form = Request.Form;
                var list = new List<Customer>();
                int countNotInsertedRow = 0;
                int countInsertedRow = 0;
                int countEmptyRow = 0;
                int countWrongCompanyName = 0;
                string ExistRowNumber = "";
                string EmptyRowNumber = "";
                string EmptyRowNumberForCompany = "";

                string sql = "EXEC GenerateVoucherNo @txType,@comID";
                List<SqlParameter> parms = new List<SqlParameter>
                {
                    new SqlParameter { ParameterName = "@txType", Value = 40 },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
                };
                var voucherNo = _AMDbContext.invoiceNo.FromSqlRaw(sql, parms.ToArray()).ToList()[0].voucherNo;
                var cstParentAccCode = _AMDbContext.COA.FirstOrDefault(x => x.COAID == 40).acctNo;

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
                                        var existList = _AMDbContext.Customers.Where(x => x.comID == company.FirstOrDefault().comID && x.cstCode == worksheet.Cell(i, 1).Value.ToString());
                                        if (existList.Count() == 0)
                                        {
                                            var prdGrpName = worksheet.Cell(i, 1).Value.ToString();
                                            Customer v = new Customer();
                                            v.cstID = 0;
                                            v.cstCode = worksheet.Cell(i, 1).Value.ToString().Trim();
                                            v.cstName = worksheet.Cell(i, 2).Value.ToString().Trim();

                                            if (v.cstName != "" && v.cstCode != "" && company.Count() == 1)
                                            {

                                                v.address = worksheet.Cell(i, 3).Value.ToString();
                                                v.contPhone = worksheet.Cell(i, 4).Value.ToString();
                                                v.taxNo = worksheet.Cell(i, 5).Value.ToString();
                                                v.active = true;
                                                v.taxValue = decimal.Parse(worksheet.Cell(i, 6).Value.ToString() == "" ? "0" : worksheet.Cell(i, 6).Value.ToString());
                                                decimal bal = decimal.Parse(worksheet.Cell(i, 7).Value.ToString() == "" ? "0" : worksheet.Cell(i, 7).Value.ToString());
                                                v.comID = company.FirstOrDefault().comID;

                                                v.crtBy = username;
                                                v.crtDate = DateTime.Now;
                                                v.modby = username;
                                                v.modDate = DateTime.Now;

                                                await _AMDbContext.Customers.AddAsync(v);
                                                await _AMDbContext.SaveChangesAsync();
                                                list.Add(v);

                                                var cstNewAcctNo = _helperMethods.GenerateAcctNo(cstParentAccCode, comID);
                                                
                                                COA coa = new COA()
                                                {
                                                    acctNo = cstNewAcctNo,
                                                    acctName = v.cstName,
                                                    openBal = bal,
                                                    bal = bal,
                                                    closingBal = 0,
                                                    isSys = false,
                                                    parentCOAID = 40,
                                                    COANo = v.cstID,
                                                    nextChkNo = v.cstCode,
                                                    COAlevel = 4,
                                                    treeName = v.cstName,
                                                    active = true,
                                                    acctType = "Trade Debtors",
                                                    parentAcctType = "Assets",
                                                    parentAcctName = "Trade Debtors",
                                                    path = @"Assets\Current Assets\Account Receivable\Trade Debtors\" + v.cstName + @"\",
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
                                                        cstID = v.cstID,
                                                        balSum = bal,
                                                        creditSum = bal,
                                                        comID = v.comID,
                                                        active = true,
                                                        dtTx = DateTime.Now,
                                                        voucherNo = voucherNo,
                                                        depositID = fiscalYear,
                                                        crtBy = username,
                                                        crtDate = DateTime.Now,
                                                        modBy = username,
                                                        modDate = DateTime.Now,
                                                    };

                                                    gl.Add(glMasterEntry);

                                                    GL glEntry1 = new GL()
                                                    {
                                                        txID = 0,
                                                        txTypeID = 40,
                                                        COAID = coa.parentCOAID,
                                                        relCOAID = coa.COAID,
                                                        cstID = v.cstID,
                                                        balSum = 0,
                                                        debitSum = bal,
                                                        comID = v.comID,
                                                        active = true,
                                                        dtTx = DateTime.Now,
                                                        voucherNo = voucherNo,
                                                        depositID = fiscalYear,
                                                        crtBy = username,
                                                        crtDate = DateTime.Now,
                                                        modBy = username,
                                                        modDate = DateTime.Now,
                                                    };

                                                    gl.Add(glEntry1);


                                                    GL glEntry2 = new GL()
                                                    {
                                                        txID = 0,
                                                        txTypeID = 40,
                                                        COAID = coa.COAID,
                                                        relCOAID = coa.parentCOAID,
                                                        cstID = v.cstID,
                                                        balSum = bal,
                                                        creditSum = bal,
                                                        comID = v.comID,
                                                        active = true,
                                                        dtTx = DateTime.Now,
                                                        voucherNo = voucherNo,
                                                        depositID = fiscalYear,
                                                        crtBy = username,
                                                        crtDate = DateTime.Now,
                                                        modBy = username,
                                                        modDate = DateTime.Now,
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
                    return NotFound("All Customer Already Exists!");

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

        [NonAction]
        public string GetUsername()
        {
            var email = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email);
            var user = _AMDbContext.Users.Where(x => x.Email == email).FirstOrDefault();
            return user.FirstName + " " + user.LastName;
        }
    }
}
