using eMaestroD.Api.Common;
using eMaestroD.Api.Data;
using eMaestroD.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace eMaestroD.Api.Controllers
{
    [ApiController]
    [Route("/api/[controller]/[action]")]
    public class CreditCardController : Controller
    {
        private readonly AMDbContext _AMDbContext;
        private readonly NotificationInterceptor _notificationInterceptor;
        private readonly IHttpContextAccessor _httpContextAccessor;
        string activeUser = "";
        public CreditCardController(AMDbContext aMDbContext, NotificationInterceptor notificationInterceptor, IHttpContextAccessor httpContextAccessor)
        {
            _AMDbContext = aMDbContext;
            _notificationInterceptor = notificationInterceptor;
            _httpContextAccessor = httpContextAccessor;
            activeUser = GetUsername();
        }

        [HttpGet]
        [Route("{comID}")]
        public async Task<IActionResult> GetAllCreditCard(int comID)
        {
            var result = await _AMDbContext.CreditCards.Where(x => x.active == true && x.comID == comID).ToListAsync();

            ResponsedGroupListVM vM = new ResponsedGroupListVM();
            vM.enttityDataSource = result;
            vM.entityModel = result?.GetEntity_MetaData();
            return Ok(vM);
        }

        [HttpPost]
        public async Task<IActionResult> SaveCreditCard([FromBody] CreditCard CC)
        {
            var comID = int.Parse(Request.Headers["comID"].ToString());
            if (CC.cardID != 0)
            {

                var existingField = _AMDbContext.CreditCards.FirstOrDefault(x => x.bankName.Trim().ToLower() == CC.bankName.Trim().ToLower() &&
                                                           x.comID == comID &&
                                                           x.cardID != CC.cardID);
                if (existingField != null)
                {
                    return BadRequest("credit card bank name already exists.");
                }

                CC.modDate = DateTime.Now;
                CC.modBy = activeUser;
                CC.comID = comID;
                _AMDbContext.CreditCards.Update(CC);
                await _AMDbContext.SaveChangesAsync();

                var cstCOA = _AMDbContext.COA.Where(x => x.COANo == CC.cardID && x.parentCOAID == 200).FirstOrDefault();
                COA coa = new COA()
                {
                    COAID = cstCOA.COAID == null ? 0 : cstCOA.COAID,
                    acctNo = "",
                    acctName = CC.bankName,
                    isSys = true,
                    parentCOAID = 200,
                    COANo = CC.cardID,
                    nextChkNo = "",
                    COAlevel = 4,
                    active = true,
                    treeName = CC.bankName,
                    acctType = "Accounts Payable",
                    parentAcctType = "Liability",
                    parentAcctName = "Credit Cards",
                    path = @"Liability\Current Liability\Current Liability\Credit Cards\" + CC.bankName + @"\",
                    crtBy = cstCOA == null ? activeUser : cstCOA.crtBy,
                    crtDate = cstCOA == null ? DateTime.Now : cstCOA.crtDate,
                    modDate = DateTime.Now,
                    modBy = activeUser,
                    openBal = cstCOA.openBal,
                    bal = cstCOA.bal,
                    closingBal = cstCOA.closingBal
                };
                _AMDbContext.COA.Update(coa);
                await _AMDbContext.SaveChangesAsync();


                _notificationInterceptor.SaveNotification("CreditCardEdit", comID, "");
            }
            else
            {
                var existingField = _AMDbContext.CreditCards.FirstOrDefault(x => x.bankName.Trim().ToLower() == CC.bankName.Trim().ToLower() && x.comID == comID);

                if (existingField != null)
                {
                    return BadRequest("credit card bank name already exists.");
                }

                CC.active = true;
                CC.crtBy = activeUser;
                CC.crtDate = DateTime.Now;
                CC.modBy = activeUser;
                CC.modDate = DateTime.Now;
                CC.comID = comID;
                var list = _AMDbContext.CreditCards.Where(x => x.comID == comID).ToList();
                if (list.Count() == 0) { CC.isDefault = true; }
                _AMDbContext.CreditCards.Add(CC);
                await _AMDbContext.SaveChangesAsync();

                COA coa = new COA()
                {
                    acctNo = "",
                    acctName = CC.bankName,
                    isSys = true,
                    parentCOAID = 200,
                    COANo = CC.cardID,
                    nextChkNo = "",
                    COAlevel = 4,
                    active = true,
                    treeName = CC.bankName,
                    acctType = "Accounts Payable",
                    parentAcctType = "Liability",
                    parentAcctName = "Credit Cards",
                    path = @"Liability\Current Liability\Current Liability\Credit Cards\" + CC.bankName + @"\",
                    openBal = 0,
                    bal = 0,
                    closingBal = 0,
                    crtBy = activeUser,
                    crtDate = DateTime.Now,
                    modBy = activeUser,
                    modDate = DateTime.Now,
                };
                _AMDbContext.COA.Add(coa);
                await _AMDbContext.SaveChangesAsync();

                _notificationInterceptor.SaveNotification("CreditCardCreate", comID, "");
            }

            return Ok(CC);
        }


        [HttpPost]
        public async Task<IActionResult> UpdateIsDefault([FromBody] CreditCard CC)
        {
            var comID = int.Parse(Request.Headers["comID"].ToString());
            List<CreditCard> lst = _AMDbContext.CreditCards.Where(x => x.comID == comID).ToList();
            foreach (var item in lst)
            {
                if (item.cardID == CC.cardID)
                {
                    item.modBy = activeUser;
                    item.modDate = DateTime.Now;
                    item.isDefault = true;
                }
                else
                {
                    item.isDefault = false;
                }
            }
            _AMDbContext.CreditCards.UpdateRange(lst);
            await _AMDbContext.SaveChangesAsync();
            _notificationInterceptor.SaveNotification("CreditCardEdit", comID, "");
            return Ok(lst);

        }

        [HttpDelete]
        [Route("{cardID}")]
        public async Task<IActionResult> DeleteCreditCard(int cardID)
        {
            var lst = _AMDbContext.CreditCards.Where(a => a.cardID == cardID).ToList();
            var coa = _AMDbContext.COA.Where(a => a.COANo == cardID && a.acctName == lst[0].bankName && a.parentCOAID == 200).FirstOrDefault();
            var existlist = _AMDbContext.gl.Where(x => x.COAID == coa.COAID || x.relCOAID == coa.COAID).ToList();
            if (existlist.Count() > 0)
            {
                return NotFound("Some Invoices Depend on this Credit Card. Please Delete Invoice First");
            }
            _AMDbContext.Remove(coa);
            _AMDbContext.RemoveRange(lst);
            await _AMDbContext.SaveChangesAsync();

            var comID = Request.Headers["comID"].ToString();
            _notificationInterceptor.SaveNotification("CreditCardDelete", int.Parse(comID), "");

            return Ok(lst);
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
