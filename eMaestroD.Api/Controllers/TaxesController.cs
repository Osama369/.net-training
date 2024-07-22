using eMaestroD.Api.Common;
using eMaestroD.Api.Data;
using eMaestroD.Api.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace eMaestroD.Api.Controllers
{

    [ApiController]
    [Route("/api/[controller]")]
    public class TaxesController : Controller
    {
        private readonly AMDbContext _AMDbContext;
        private readonly NotificationInterceptor _notificationInterceptor;
        private readonly IHttpContextAccessor _httpContextAccessor;
        string username = "";
        public TaxesController(AMDbContext aMDbContext, NotificationInterceptor notificationInterceptor, IHttpContextAccessor httpContextAccessor)
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
        public async Task<IActionResult> getTaxesList()
        {
            List<Taxes> SDL = _AMDbContext.Taxes.ToList();
            return Ok(SDL);
        }


        [HttpPost]
        public async Task<IActionResult> saveTaxes([FromBody] Taxes taxes)
        {
            var comID = Request.Headers["comID"].ToString();
            taxes.TaxName = taxes.TaxName.Trim();
            if (taxes.TaxID != 0)
            {
                var existList = _AMDbContext.Taxes.Where(x => x.TaxID != taxes.TaxID && x.TaxName == taxes.TaxName).ToList();
                if (existList.Count() == 0)
                {
                    taxes.modby = username;
                    taxes.modDate = DateTime.Now;
                    _AMDbContext.Taxes.Update(taxes);
                    await _AMDbContext.SaveChangesAsync();


                    COA coa = new COA()
                    {
                        COAID = _AMDbContext.COA.Where(x => x.COANo == taxes.TaxID && x.parentCOAID == 25).FirstOrDefault().COAID,
                        acctNo = taxes.TaxID.ToString(),
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
                        modBy = username
                    };
                    _AMDbContext.COA.Update(coa);
                    await _AMDbContext.SaveChangesAsync();

                    _notificationInterceptor.SaveNotification("TaxesEdit", int.Parse(comID), "");
                }
                else
                {
                    return NotFound("Tax Name Already Exists!");
                }
            }
            else
            {
                var existList = _AMDbContext.Taxes.Where(x => x.TaxName == taxes.TaxName).ToList();
                if (existList.Count() == 0)
                {
                    taxes.crtBy = username;
                    taxes.crtDate = DateTime.Now;
                    taxes.modby = username;
                    taxes.modDate = DateTime.Now;
                    await _AMDbContext.Taxes.AddAsync(taxes);
                    await _AMDbContext.SaveChangesAsync();


                    COA coa = new COA()
                    {
                        acctNo = taxes.TaxID.ToString(),
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
                        modBy = username
                    };
                    await _AMDbContext.COA.AddAsync(coa);
                    await _AMDbContext.SaveChangesAsync();

                    _notificationInterceptor.SaveNotification("TaxesCreate", int.Parse(comID), "");
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
