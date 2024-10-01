using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using System.Security.Claims;
using eMaestroD.Models.Models;
using eMaestroD.Api.Common;
using eMaestroD.Api.Data;
using Microsoft.AspNetCore.Authorization;
using eMaestroD.DataAccess.DataSet;
using eMaestroD.Shared.Common;
using eMaestroD.Models.ReportModels;

namespace eMaestroD.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("/api/[controller]")]
    public class FiscalYearController : Controller
    {
        private List<COA> coaLst { get; set; }
        private List<Customer> cstLst { get; set; }
        private List<Vendors> vendLst { get; set; }
        private List<Locations> locLst { get; set; }
        private int fiscalYear = 0;
        private int index = 1;
        private FiscalYear objFiscalYr { get; set; }
        private FiscalYear objFiscalYrPrev { get; set; } = new FiscalYear();
        private FiscalBalances objFiscalBalances { get; set; } = new FiscalBalances();
        private List<FiscalBalances> objFiscalBalancesList { get; set; } = new List<FiscalBalances>();
        FiscalYear objFY = new FiscalYear();
        private readonly AMDbContext _AMDbContext;
        private readonly NotificationInterceptor _notificationInterceptor;
        private readonly IHttpContextAccessor _httpContextAccessor;
        string username = "";
        public FiscalYearController(AMDbContext aMDbContext, NotificationInterceptor notificationInterceptor, IHttpContextAccessor httpContextAccessor)
        {
            _AMDbContext = aMDbContext;
            _notificationInterceptor = notificationInterceptor;
            _httpContextAccessor = httpContextAccessor;
            username = GetUsername();
        }


        [NonAction]
        public string GetUsername()
        {
            var email = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email);
            var user = _AMDbContext.Users.Where(x => x.Email == email).FirstOrDefault();
            return user.FirstName + " " + user.LastName;
        }

        [HttpGet]
        [Route("{comID}")]
        public async Task<IActionResult> GetAllFiscalYear(int comID)
        {
            List<FiscalYear> SDL = _AMDbContext.FiscalYear.Where(x => x.comID == comID).ToList();
            return Ok(SDL);
        }


        [HttpPost]
        public async Task<IActionResult> SaveFiscalYear([FromBody] FiscalYear FiscalYear)
        {
            bool isEdit = false;
            if (FiscalYear.fID != 0)
            {
                var existList = _AMDbContext.FiscalYear.Where(x => x.fID != FiscalYear.fID && x.comID == FiscalYear.comID && (x.period == FiscalYear.period || x.dtStart <= FiscalYear.dtStart && x.dtEnd >= FiscalYear.dtStart)).ToList();
                if (existList.Count() == 0)
                {
                    FiscalYear.modBy = username;
                    FiscalYear.modDate = DateTime.Now;
                    _AMDbContext.FiscalYear.Update(FiscalYear);
                    await _AMDbContext.SaveChangesAsync();
                    isEdit = true;
                }
                else
                {
                    return NotFound("Fiscal Year Already Exists!");
                }
            }
            else
            {
                var existList = _AMDbContext.FiscalYear
                   .Where(x => x.comID == FiscalYear.comID
                               && (x.period == FiscalYear.period
                                   || x.dtStart <= FiscalYear.dtStart && x.dtEnd >= FiscalYear.dtStart))
                   .ToList();
                if (existList.Count() == 0)
                {
                    FiscalYear.crtBy = username;
                    FiscalYear.crtDate = DateTime.Now;
                    FiscalYear.modBy = username;
                    FiscalYear.modDate = DateTime.Now;
                    await _AMDbContext.FiscalYear.AddAsync(FiscalYear);
                    await _AMDbContext.SaveChangesAsync();
                }
                else
                {
                    return NotFound("Fiscal Year Already Exists!");
                }
            }

            List<FiscalYear> lst = _AMDbContext.FiscalYear.Where(x => x.comID == FiscalYear.comID).ToList();


            if (isEdit)
            {
                _notificationInterceptor.SaveNotification("FiscalYearEdit", FiscalYear.comID, "");
            }
            else
            {

                foreach (var item in lst)
                {
                    if (item.fID == FiscalYear.fID)
                    {
                        item.active = true;
                    }
                    else
                    {
                        item.active = false;
                        _AMDbContext.FiscalYear.Update(item);
                    }
                }
                await _AMDbContext.SaveChangesAsync();

                _notificationInterceptor.SaveNotification("FiscalYearCreate", FiscalYear.comID, "");
            }

            return Ok(lst);
        }

        [HttpPost("UpdateFicalYearActive")]
        public async Task<IActionResult> UpdateFicalYearActive([FromBody] FiscalYear FiscalYear)
        {
            List<FiscalYear> lst = _AMDbContext.FiscalYear.Where(x => x.comID == FiscalYear.comID).ToList();
            foreach (var item in lst)
            {
                if (item.fID == FiscalYear.fID)
                {
                    item.active = true;
                }
                else
                {
                    item.active = false;
                }
            }
            _AMDbContext.FiscalYear.UpdateRange(lst);
            await _AMDbContext.SaveChangesAsync();
            _notificationInterceptor.SaveNotification("FiscalYearEdit", FiscalYear.comID, "");

            return Ok(lst);

        }

        [HttpDelete]
        [Route("{fiscalyear}")]
        public async Task<IActionResult> DeleteFiscalYear(int fiscalyear)
        {
            var comID = Request.Headers["comID"].ToString();
            var existlist = _AMDbContext.gl.Where(x => x.depositID == fiscalyear && x.comID == int.Parse(comID)).ToList();
            if (existlist.Count() > 0)
            {
                return NotFound("Some Invoices Depend on this Fiscal Year. Please Delete Invoice First");
            }
            var lst = _AMDbContext.FiscalYear.Where(a => a.period == fiscalyear && a.comID == int.Parse(comID)).ToList();
            _AMDbContext.RemoveRange(lst);
            await _AMDbContext.SaveChangesAsync();

            _notificationInterceptor.SaveNotification("FiscalYearDelete", int.Parse(comID), "");

            return Ok(lst);
        }

        [HttpGet("EndFiscalYear/{isCreateNew}")]
        public async Task<IActionResult> EndFiscalYear(bool isCreateNew)
        {
            using (var transaction = _AMDbContext.Database.BeginTransaction())
            {
                try
                {
                    var comID = Request.Headers["comID"].ToString();
                    var fiscalYearList = _AMDbContext.FiscalYear.Where(x => x.comID == int.Parse(comID)).ToList();
                    objFY = fiscalYearList.Find(x => x.active == true);

                    string sqlQuerry = "EXEC GenerateVoucherNo @txType, @comID";
                    List<SqlParameter> parameters = new List<SqlParameter>
                    {
                        new SqlParameter { ParameterName = "@txType", Value = 40 },
                        new SqlParameter { ParameterName = "@comID", Value = comID },
                    };
                    var voucherNo = _AMDbContext.invoiceNo.FromSqlRaw(sqlQuerry, parameters.ToArray()).ToList()[0].voucherNo;


                    if (isCreateNew)
                    {
                        if (fiscalYearList.Find(x => x.period == objFY.period + 1) == null)
                        {

                            FiscalYear fy = new FiscalYear();
                            fy.active = false;
                            fy.period = objFY.period + 1;
                            fy.dtStart = Convert.ToDateTime(objFY.dtEnd).AddDays(1);
                            fy.dtEnd = Convert.ToDateTime(fy.dtStart).AddYears(1).AddDays(-1);
                            fy.crtBy = username;
                            fy.crtDate = DateTime.Now;
                            fy.modBy = username;
                            fy.modDate = DateTime.Now;
                            fy.comID = int.Parse(comID);

                            _AMDbContext.FiscalYear.Add(fy);
                            await _AMDbContext.SaveChangesAsync();

                            fiscalYearList.Add(fy);

                        }
                    }

                    var today = DateTime.Now;
                    if (today < objFY.dtEnd)
                    {
                        return BadRequest("The fiscal year cannot be finalized as the current active fiscal period remains ongoing.");
                    }

                    var checkList = _AMDbContext.FiscalBalances.Where(x => x.fiscalYear == objFY.period && x.comID == int.Parse(comID)).ToList();
                    if (checkList.Count() > 0)
                    {
                        return BadRequest("The fiscal year has already been closed.");
                    }

                    List<GL> glprodLst = new List<GL>();
                    List<AccountsReceivable> customerPaymentsLst = new List<AccountsReceivable>();
                    int newPeriod = 0;
                    if (fiscalYearList.Find(x => x.period == objFY.period + 1) != null)
                    {
                        newPeriod = fiscalYearList.Find(x => x.period == objFY.period + 1).period;
                    }
                    else
                    {
                        return BadRequest("Please create the new fiscal year before proceeding to close the current one.");
                    }

                    List<COA> coaList = new List<COA>();
                    List<GL> gl = new List<GL>();

                    coaLst = new List<COA>();
                    coaLst = _AMDbContext.COA.Where(x => x.active == true).ToList();
                    cstLst = _AMDbContext.Customers.Where(x => x.active == true && x.comID == int.Parse(comID)).ToList();
                    vendLst = _AMDbContext.Vendors.Where(x => x.active == true && x.comID == int.Parse(comID)).ToList();
                    locLst = _AMDbContext.Locations.Where(x => x.comID == int.Parse(comID)).ToList();

                    List<AccountsReceivable> objAcLContain = new List<AccountsReceivable>();
                    List<AccountsReceivable> objAcPayContain = new List<AccountsReceivable>();

                    List<AccountsReceivable> objAcL = new List<AccountsReceivable>();
                    string sql = "EXEC Report_AccountsReceivable @asOfDate,@cstID,@locID,@comID";
                    List<SqlParameter> parms = new List<SqlParameter>
                    {
                            new SqlParameter { ParameterName = "@asOfDate", Value = objFY.dtEnd },
                            new SqlParameter { ParameterName = "@cstID", Value = 0 },
                            new SqlParameter { ParameterName = "@locID", Value = 0 },
                            new SqlParameter { ParameterName = "@comID", Value = comID },
                    };

                    objAcL = _AMDbContext.AccountsReceivable.FromSqlRaw(sql, parms.ToArray()).ToList();

                    List<AccountsReceivable> list = new List<AccountsReceivable>();
                    string sql1 = "EXEC Report_AccountsPayable @asOfDate,@vendID,@locID,@comID";
                    List<SqlParameter> parms1 = new List<SqlParameter>
                    {
                            new SqlParameter { ParameterName = "@asOfDate", Value = objFY.dtEnd },
                            new SqlParameter { ParameterName = "@vendID", Value = 0 },
                            new SqlParameter { ParameterName = "@locID", Value = 0 },
                            new SqlParameter { ParameterName = "@comID", Value = comID },
                    };

                    list = _AMDbContext.AccountsReceivable.FromSqlRaw(sql1, parms1.ToArray()).ToList();

                    foreach (COA coa in coaLst)
                    {
                        if (coa.COAlevel > 4 || coa.COAlevel < 0 || coa.COAID < 1 || coa.COANo < 0) { continue; }

                        if (coa.parentCOAID == 40 && coa.COAlevel == 4)
                        {
                            var customer = cstLst.Find(x => x.cstID == coa.COANo && coa.parentCOAID == 40);
                            if (customer != null) //cstLst.Find(x => x.cstID == coa.COANo).locID > 0
                            {
                                objAcLContain = new List<AccountsReceivable>();
                                objAcLContain = objAcL.FindAll(x => x.id == coa.COANo && coa.parentCOAID == 40);


                                if (objAcLContain.Count > 0)
                                {
                                    if (coa.closingBal != objAcLContain[0].balSum)
                                    {

                                        #region ---- Fiscal Balances ----

                                        objFiscalBalances = new FiscalBalances();
                                        objFiscalBalances.cstID = objAcLContain[0].id;
                                        objFiscalBalances.openBal = objAcLContain[0].balSum;
                                        objFiscalBalances.closingBal = objAcLContain[0].balSum;
                                        objFiscalBalances.lastClosing = objAcLContain[0].balSum;
                                        objFiscalBalances.fiscalYear = objFY.period;
                                        objFiscalBalances.bal = objAcLContain[0].balSum;
                                        objFiscalBalances.parentCOAID = coa.parentCOAID;
                                        objFiscalBalances.crtDate = DateTime.Now;
                                        objFiscalBalances.modDate = DateTime.Now;
                                        objFiscalBalances.comID = int.Parse(comID);
                                        objFiscalBalancesList.Add(objFiscalBalances);
                                        #endregion


                                        GL glEntry1 = new GL()
                                        {
                                            txID = 0,
                                            txTypeID = 40,
                                            COAID = coa.parentCOAID,
                                            relCOAID = coa.COAID,
                                            cstID = customer.cstID,
                                            comID = customer.comID,
                                            balSum = 0,
                                            debitSum = objAcLContain[0].balSum,
                                            active = true,
                                            dtTx = fiscalYearList.Find(x => x.period == newPeriod).dtStart,
                                            voucherNo = voucherNo,
                                            depositID = newPeriod,
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
                                            balSum = objAcLContain[0].balSum,
                                            creditSum = objAcLContain[0].balSum,
                                            active = true,
                                            dtTx = fiscalYearList.Find(x => x.period == newPeriod).dtStart,
                                            voucherNo = voucherNo,
                                            depositID = newPeriod,
                                            crtBy = username,
                                            crtDate = DateTime.Now,
                                            modBy = username,
                                            modDate = DateTime.Now,
                                        };

                                        gl.Add(glEntry2);
                                    }
                                }
                            }
                            // coa.bal = core.GetAccountAmount(fiscalYear, coa.COAID, coa.acctName, coa.COAlevel, coa.parentCOAID, coa.COANo, 0);
                        }
                        else if (coa.parentCOAID == 83 && coa.COAlevel == 4)
                        {
                            var vendor = vendLst.Find(x => x.vendID == coa.COANo && coa.parentCOAID == 83);
                            if (vendor != null) //cstLst.Find(x => x.cstID == coa.COANo).locID > 0
                            {

                                objAcPayContain = new List<AccountsReceivable>();
                                objAcPayContain = list.FindAll(x => x.id == coa.COANo && coa.parentCOAID == 83);

                                if (objAcPayContain.Count > 0)
                                {
                                    coa.bal = objAcPayContain[0].balSum;
                                    coa.openBal = coa.bal;
                                    coa.closingBal = coa.bal;

                                    #region ---- Fiscal Balances ----

                                    objFiscalBalances = new FiscalBalances();
                                    objFiscalBalances.vendID = coa.COANo;
                                    objFiscalBalances.openBal = coa.bal;
                                    objFiscalBalances.closingBal = coa.bal;
                                    objFiscalBalances.lastClosing = coa.bal;
                                    objFiscalBalances.fiscalYear = objFY.period;
                                    objFiscalBalances.bal = coa.bal;
                                    objFiscalBalances.parentCOAID = coa.parentCOAID;
                                    objFiscalBalances.crtDate = DateTime.Now;
                                    objFiscalBalances.modDate = DateTime.Now;
                                    objFiscalBalances.comID = int.Parse(comID);
                                    objFiscalBalancesList.Add(objFiscalBalances);
                                    #endregion

                                    GL glEntry1 = new GL()
                                    {
                                        txID = 0,
                                        txTypeID = 40,
                                        COAID = coa.parentCOAID,
                                        relCOAID = coa.COAID,
                                        vendID = vendor.vendID,
                                        comID = vendor.comID,
                                        balSum = 0,
                                        creditSum = decimal.Parse(coa.bal.ToString()),
                                        active = true,
                                        dtTx = fiscalYearList.Find(x => x.period == newPeriod).dtStart,
                                        crtBy = username,
                                        crtDate = DateTime.Now,
                                        modBy = username,
                                        modDate = DateTime.Now,
                                        voucherNo = voucherNo,
                                        depositID = newPeriod
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
                                        balSum = decimal.Parse(coa.bal.ToString()),
                                        debitSum = decimal.Parse(coa.bal.ToString()),
                                        active = true,
                                        dtTx = fiscalYearList.Find(x => x.period == newPeriod).dtStart,
                                        crtBy = username,
                                        crtDate = DateTime.Now,
                                        modBy = username,
                                        modDate = DateTime.Now,
                                        voucherNo = voucherNo,
                                        depositID = newPeriod
                                    };

                                    gl.Add(glEntry2);
                                }
                            }
                        }
                        else
                        {


                            //coa.bal = core.GetAccountAmount(fiscalYear, coa.COAID, coa.acctName, coa.COAlevel, coa.parentCOAID, 0, 0);
                            coa.bal = GetOtherAmount(coa.treeName, coa.COAID, int.Parse(comID));

                            coa.openBal = coa.bal;
                            coa.closingBal = coa.bal;

                            #region ---- FiscalBalances ----

                            objFiscalBalances = new FiscalBalances();
                            objFiscalBalances.openBal = coa.bal;
                            objFiscalBalances.closingBal = coa.bal;
                            objFiscalBalances.lastClosing = coa.bal;
                            objFiscalBalances.fiscalYear = objFY.period;
                            objFiscalBalances.parentCOAID = coa.COAID;
                            objFiscalBalances.crtDate = DateTime.Now;
                            objFiscalBalances.modDate = DateTime.Now;
                            objFiscalBalances.comID = int.Parse(comID);
                            objFiscalBalancesList.Add(objFiscalBalances);
                            #endregion

                            GL glEntry1 = new GL()
                            {
                                txID = 0,
                                txTypeID = 40,
                                COAID = coa.parentCOAID,
                                relCOAID = coa.COAID,
                                cstID = 0,
                                vendID = 0,
                                comID = int.Parse(comID),
                                balSum = 0,
                                creditSum = decimal.Parse(coa.bal.ToString()),
                                active = true,
                                dtTx = fiscalYearList.Find(x => x.period == newPeriod).dtStart,
                                crtBy = username,
                                crtDate = DateTime.Now,
                                modBy = username,
                                modDate = DateTime.Now,
                                voucherNo = voucherNo,
                                depositID = newPeriod
                            };

                            gl.Add(glEntry1);


                            GL glEntry2 = new GL()
                            {
                                txID = 0,
                                txTypeID = 40,
                                COAID = coa.COAID,
                                relCOAID = coa.parentCOAID,
                                cstID = 0,
                                vendID = 0,
                                comID = int.Parse(comID),
                                balSum = decimal.Parse(coa.bal.ToString()),
                                debitSum = decimal.Parse(coa.bal.ToString()),
                                active = true,
                                dtTx = fiscalYearList.Find(x => x.period == newPeriod).dtStart,
                                crtBy = username,
                                crtDate = DateTime.Now,
                                modBy = username,
                                modDate = DateTime.Now,
                                voucherNo = voucherNo,
                                depositID = newPeriod
                            };

                            gl.Add(glEntry2);
                        }

                        coa.modDate = DateTime.Now;
                        coaList.Add(coa);

                    }


                    string sql2 = "EXEC GenerateVoucherNo @txType, @comID";
                    List<SqlParameter> parms2 = new List<SqlParameter>
                    {
                        new SqlParameter { ParameterName = "@txType", Value = 41 },
                        new SqlParameter { ParameterName = "@comID", Value = comID }
                    };
                    string voNo = _AMDbContext.invoiceNo.FromSqlRaw(sql2, parms2.ToArray()).ToList()[0].voucherNo;

                    foreach (var loc in locLst)
                    {
                        List<StockList> obj1;
                        //string sql4 = "EXEC Report_StockStatus @locID,@asOFDate";
                        //List<SqlParameter> parms4 = new List<SqlParameter>
                        //{
                        //        new SqlParameter { ParameterName = "@locID", Value = loc.locID },
                        //        new SqlParameter { ParameterName = "@asOFDate", Value = objFY.dtEnd },
                        //};
                        //obj1 = _AMDbContext.StockStatus.FromSqlRaw<StockStatus>(sql4, parms4.ToArray()).ToList();

                        string sql4 = "EXEC Report_StockList @prodID,@locID,@comID, @catID";
                        List<SqlParameter> parms4 = new List<SqlParameter>
                        {
                                new SqlParameter { ParameterName = "@prodID", Value = 0 },
                                new SqlParameter { ParameterName = "@locID", Value = loc.LocationId },
                                new SqlParameter { ParameterName = "@comID", Value = comID },
                                new SqlParameter { ParameterName = "@catID", Value = 0 }
                        };
                        obj1 = _AMDbContext.StockList.FromSqlRaw(sql4, parms4.ToArray()).ToList();


                        var locQtyLst = obj1;

                        foreach (var prodItem in locQtyLst)
                        {
                            glprodLst.Add(new GL()
                            {
                                unitPrice = prodItem.unitPrice,
                                COAID = 98,
                                relCOAID = 83,
                                txTypeID = 41,
                                locID = loc.LocationId,
                                depositID = newPeriod,
                                prodID = prodItem.prodID,
                                prodCode = prodItem.BarCode,
                                prodName = prodItem.prodName,
                                debitSum = prodItem.unitPrice * prodItem.AvailableQty,
                                qty = prodItem.AvailableQty,
                                voucherNo = voNo,
                                qtyBal = prodItem.AvailableQty,
                                isCleared = false,
                                isDeposited = false,
                                isPaid = false,
                                isVoided = false,
                                dtTx = fiscalYearList.Find(x => x.period == newPeriod).dtStart,
                                crtDate = DateTime.Now,
                                comID = int.Parse(comID)
                            });
                        }
                    }

                    if (glprodLst != null && glprodLst.Count > 0)
                    {
                        ////Parent Entry
                        GL glParent = new GL()
                        {
                            txTypeID = 41,
                            depositID = newPeriod,
                            voucherNo = voNo,
                            isCleared = false,
                            isDeposited = false,
                            isPaid = false,
                            isVoided = false,
                            dtTx = fiscalYearList.Find(x => x.period == newPeriod).dtStart,
                            crtDate = DateTime.Now,
                            comID = int.Parse(comID)
                        };
                        glprodLst.Insert(0, glParent);
                    }
                    //============ End Close Products Quantities =====

                    if (gl != null)
                    {
                        GL glMaster = new GL()
                        {
                            txTypeID = 40,
                            depositID = newPeriod,
                            voucherNo = voucherNo,
                            isCleared = false,
                            isDeposited = false,
                            isPaid = false,
                            isVoided = false,
                            dtTx = fiscalYearList.Find(x => x.period == newPeriod).dtStart,
                            crtDate = DateTime.Now,
                            comID = int.Parse(comID)
                        };
                        gl.Insert(0, glMaster);

                        await _AMDbContext.gl.AddRangeAsync(gl);
                        await _AMDbContext.SaveChangesAsync();

                        foreach (var item in gl)
                        {
                            item.txID = gl[0].GLID;
                        }
                        gl[0].txID = 0;

                        _AMDbContext.gl.UpdateRange(gl);
                        await _AMDbContext.SaveChangesAsync();
                    }

                    if (coaList != null && glprodLst != null)
                    {
                        _AMDbContext.COA.UpdateRange(coaList);
                        if (glprodLst.Count > 0)
                        {

                            await _AMDbContext.gl.AddRangeAsync(glprodLst);
                            await _AMDbContext.SaveChangesAsync();

                            foreach (var item in glprodLst)
                            {
                                item.txID = glprodLst[0].GLID;
                            }
                            glprodLst[0].txID = 0;

                            _AMDbContext.gl.UpdateRange(glprodLst);
                        }
                        await _AMDbContext.SaveChangesAsync();



                        if (objFiscalBalancesList != null && objFiscalBalancesList.Count > 0)
                        {
                            await _AMDbContext.FiscalBalances.AddRangeAsync(objFiscalBalancesList);
                            await _AMDbContext.SaveChangesAsync();

                        }

                        foreach (var item in fiscalYearList)
                        {
                            if (item.period == newPeriod)
                            {
                                item.active = true;
                            }
                            else
                            {
                                item.active = false;
                            }
                        }
                        _AMDbContext.FiscalYear.UpdateRange(fiscalYearList);
                        await _AMDbContext.SaveChangesAsync();

                        await transaction.CommitAsync();

                        return Ok(fiscalYearList);
                    }

                }
                catch (Exception ex)
                {
                    // Rollback the transaction if any operation fails
                    await transaction.RollbackAsync();

                    return BadRequest("Something went wrong.");
                }

                return BadRequest("Something went wrong.");
            }
        }

        private decimal GetOtherAmount(string Account, int coaID, int comID)
        {
            // FiscalYear objFY = new FiscalYear();
            decimal value = 0.0M;


            List<GeneralLedger> listGeneralLedger;
            string sql = "EXEC Report_GeneralLedger @dtStart,@dtEnd,@COAID,@locID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = objFY.dtStart },
                    new SqlParameter { ParameterName = "@dtEnd", Value = objFY.dtEnd },
                    new SqlParameter { ParameterName = "@COAID", Value = coaID },
                    new SqlParameter { ParameterName = "@locID", Value = 0 },
                    new SqlParameter { ParameterName = "@comID", Value = comID },

            };

            listGeneralLedger = _AMDbContext.GeneralLedger.FromSqlRaw(sql, parms.ToArray()).ToList();

            List<GeneralLedger> glBFL;

            string sql1 = "EXEC Report_GeneralLedger @dtStart,@dtEnd,@COAID,@locID,@comID";
            List<SqlParameter> parms1 = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = objFY.dtStart  },
                    new SqlParameter { ParameterName = "@dtEnd", Value = objFY.dtStart  },
                    new SqlParameter { ParameterName = "@COAID", Value = coaID },
                    new SqlParameter { ParameterName = "@locID", Value = 0 },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
            };

            glBFL = _AMDbContext.GeneralLedger.FromSqlRaw(sql1, parms1.ToArray()).ToList();

            List<GeneralLedger> objList = new List<GeneralLedger>();
            List<GeneralLedger> objList2 = new List<GeneralLedger>();
            List<GeneralLedger> objListBalBF = new List<GeneralLedger>();

            objList2 = listGeneralLedger.OrderBy(x => x.txDate).ToList();//.OrderByDescending(x => x.voucherNo = "Balance B/F").ThenBy(x=> x.txDate).ToList();

            if (objList2.Count > 0)
            {
                objList2[0].controlAccount = Account;
                foreach (var item in glBFL)
                {
                    objList2[0].balBF += item.CR + item.DR;
                }
                value = objList2[0].balBF;

                objList2[0].balBF = value;
                for (int i = 1; i < objList2.Count; i++)
                {
                    objList2[i].balBF = value + objList2[i].DR - objList2[i].CR;
                    value = objList2[i].balBF;
                }
                value = 0.0M;
            }
            decimal SumDR = 0;
            decimal SumCR = 0;
            decimal totalBal = 0;
            foreach (GeneralLedger item in objList2)
            {
                SumDR += item.DR;
                SumCR += item.CR;
            }
            totalBal = SumDR + objList2[0].balBF - SumCR;
            return totalBal;
        }
    }
}
