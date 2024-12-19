using eMaestroD.Api.Common;
using eMaestroD.Api.Data;
using eMaestroD.Models.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using eMaestroD.DataAccess.DataSet;

namespace eMaestroD.Api.Controllers
{

    [ApiController]
    [Authorize]
    [Route("/api/[controller]")]
    public class TaxesController : Controller
    {
        private readonly AMDbContext _AMDbContext;
        private readonly NotificationInterceptor _notificationInterceptor;
        private readonly IHttpContextAccessor _httpContextAccessor; 
        private readonly HelperMethods _helperMethods;
        string username = "";
        public TaxesController(AMDbContext aMDbContext, NotificationInterceptor notificationInterceptor, IHttpContextAccessor httpContextAccessor, HelperMethods helperMethods)
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
            var user = _AMDbContext.Users.Where(x => x.Email == email).FirstOrDefault();
            return user.FirstName + " " + user.LastName;
        }

        [HttpGet]
        [Route("{comID}")]
        public async Task<IActionResult> GetTaxesList(int comID)
        {
            var ParentAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.CurrentLiability);
          

            var SDL = _AMDbContext.Taxes
                .Where(x => x.comID == comID)
                .Select(t => new
                {
                    t.TaxID,
                    t.TaxName,
                    t.comID,
                    t.taxValue,
                    t.isDefault,
                    t.crtBy,
                    t.crtDate,
                    t.modby,
                    t.modDate,
                    acctNo = _AMDbContext.COA
                                .Where(c => c.parentAcctNo == ParentAccCode && c.acctName == t.TaxName && c.comID == comID)
                                .Select(c => c.acctNo)
                                .FirstOrDefault() 
                })
                .ToList();

            return Ok(SDL);
        }


        [HttpPost]
        public async Task<IActionResult> SaveTaxes([FromBody] Taxes taxes)
        {
            var comID = int.Parse(Request.Headers["comID"].ToString());
            taxes.TaxName = taxes.TaxName.Trim();
            if (taxes.TaxID != 0)
            {
                var existList = _AMDbContext.Taxes.Where(x => x.TaxID != taxes.TaxID && x.TaxName == taxes.TaxName && x.comID == taxes.comID).ToList();
                if (existList.Count() == 0)
                {
                    taxes.modby = username;
                    taxes.modDate = DateTime.Now;
                    _AMDbContext.Taxes.Update(taxes);
                    await _AMDbContext.SaveChangesAsync();


                    var coaAccount = _AMDbContext.COA.Where(x => x.COANo == taxes.TaxID && x.parentCOAID == 25).FirstOrDefault();

                    COA coa = new COA()
                    {
                        COAID = coaAccount.COAID,
                        acctNo = coaAccount.acctNo,
                        acctName = taxes.TaxName,
                        isSys = false,
                        parentCOAID = 25,
                        COANo = taxes.TaxID,
                        COAlevel = 3,
                        active = true,
                        treeName = taxes.TaxName,
                        acctType = "Liability",
                        parentAcctType = "Liability",
                        parentAcctName = "Current Liability",
                        path = @"Liability\Current Liability\Current Liability\" + taxes.TaxName + @"\",
                        modDate = DateTime.Now,
                        modBy = username,
                        comID = comID
                    };
                    _AMDbContext.COA.Update(coa);
                    await _AMDbContext.SaveChangesAsync();

                    _notificationInterceptor.SaveNotification("TaxesEdit", comID, "");
                }
                else
                {
                    return NotFound("Tax Name Already Exists!");
                }
            }
            else
            {
                var existList = _AMDbContext.Taxes.Where(x => x.TaxName == taxes.TaxName && x.comID == comID).ToList();
                if (existList.Count() == 0)
                {
                    taxes.crtBy = username;
                    taxes.crtDate = DateTime.Now;
                    taxes.modby = username;
                    taxes.modDate = DateTime.Now;
                    taxes.comID = comID;
                    await _AMDbContext.Taxes.AddAsync(taxes);
                    await _AMDbContext.SaveChangesAsync();


                    var ParentAccCode = _AMDbContext.COA.FirstOrDefault(x => x.COAID == 25).acctNo;
                    var NewAcctNo = _helperMethods.GenerateAcctNo(ParentAccCode, comID);


                    COA coa = new COA()
                    {
                        acctNo = NewAcctNo,
                        acctName = taxes.TaxName,
                        openBal = 0,
                        bal = 0,
                        isSys = false,
                        parentCOAID = 25,
                        COANo = taxes.TaxID,
                        COAlevel = 3,
                        active = true,
                        treeName = taxes.TaxName,
                        acctType = "Liability",
                        parentAcctType = "Liability",
                        parentAcctName = "Current Liability",
                        path = @"Liability\Current Liability\Current Liability\" + taxes.TaxName + @"\",
                        crtDate = DateTime.Now,
                        modDate = DateTime.Now,
                        crtBy = username,
                        modBy = username,
                        comID = comID
                    };
                    await _AMDbContext.COA.AddAsync(coa);
                    await _AMDbContext.SaveChangesAsync();

                    _notificationInterceptor.SaveNotification("TaxesCreate", comID, "");
                }
                else
                {
                    return NotFound("Tax Name Already Exists!");
                }
            }
            return Ok(taxes);
        }

        [HttpPost("updateIsDefault")]
        public async Task<IActionResult> updateIsDefault([FromBody] Taxes taxes)
        {
            var comID = Request.Headers["comID"].ToString();
            List<Taxes> lst = _AMDbContext.Taxes.ToList();
            foreach (var item in lst)
            {
                if (item.TaxID == taxes.TaxID)
                {
                    item.modby = username;
                    item.modDate = DateTime.Now;
                    item.isDefault = true;
                }
                else
                {
                    item.isDefault = false;
                }
            }
            _AMDbContext.Taxes.UpdateRange(lst);
            await _AMDbContext.SaveChangesAsync();
            _notificationInterceptor.SaveNotification("TaxesEdit", int.Parse(comID), "");

            return Ok(lst);

        }

        [HttpDelete]
        [Route("{taxID}")]
        public async Task<IActionResult> DeleteTax(int taxID)
        {
            var existlist = _AMDbContext.gl.Where(x => x.COAID == taxID).ToList();
            if (existlist.Count() > 0)
            {
                return NotFound("Some Invoices Depend on this Tax. Please Delete Invoice First");
            }
            var lst = _AMDbContext.Taxes.Where(a => a.TaxID == taxID).ToList();
            _AMDbContext.RemoveRange(_AMDbContext.COA.Where(a => a.COANo == taxID && a.acctName == lst[0].TaxName && a.parentCOAID == 25));
            _AMDbContext.RemoveRange(lst);
            await _AMDbContext.SaveChangesAsync();

            var comID = Request.Headers["comID"].ToString();
            _notificationInterceptor.SaveNotification("TaxesDelete", int.Parse(comID), "");

            return Ok(lst);
        }

    }
}
