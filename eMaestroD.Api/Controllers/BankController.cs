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
    public class BankController : Controller
    {
        private readonly AMDbContext _AMDbContext;
        private readonly NotificationInterceptor _notificationInterceptor;
        private readonly IHttpContextAccessor _httpContextAccessor;
        string activeUser = "";
        public BankController(AMDbContext aMDbContext, NotificationInterceptor notificationInterceptor, IHttpContextAccessor httpContextAccessor)
        {
            _AMDbContext = aMDbContext;
            _notificationInterceptor = notificationInterceptor;
            _httpContextAccessor = httpContextAccessor;
            activeUser = GetUsername();
        }

        [HttpGet]
        [Route("{comID}")]
        public async Task<IActionResult> GetAllBank(int comID)
        {
            var banks = await _AMDbContext.Banks.Where(x => x.active == true && x.comID == comID).ToListAsync();

            ResponsedGroupListVM vM = new ResponsedGroupListVM();
            vM.enttityDataSource = banks;
            vM.entityModel = banks?.GetEntity_MetaData();
            return Ok(vM);
        }

        [HttpPost]
        public async Task<IActionResult> SaveBank([FromBody] Bank bk)
        {
            var comID = int.Parse(Request.Headers["comID"].ToString());
            if (bk.bankID != 0)
            {

                var existingBank = _AMDbContext.Banks.FirstOrDefault(x => x.bankName.Trim().ToLower() == bk.bankName.Trim().ToLower() &&
                                                           x.accountNo.Trim() == bk.accountNo.Trim() &&
                                                           x.comID == comID &&
                                                           x.bankID != bk.bankID);
                if (existingBank != null)
                {
                    return BadRequest("A bank with the same bank name and account number already exists.");
                }

                bk.modDate = DateTime.Now;
                bk.modBy = activeUser;
                bk.comID = comID;
                _AMDbContext.Banks.Update(bk);
                await _AMDbContext.SaveChangesAsync();

                var cstCOA = _AMDbContext.COA.Where(x => x.COANo == bk.bankID && x.parentCOAID == 79).FirstOrDefault();
                COA coa = new COA()
                {
                    COAID = cstCOA.COAID == null ? 0 : cstCOA.COAID,
                    acctNo = bk.branchCode,
                    acctName = bk.bankName,
                    isSys = true,
                    parentCOAID = 79,
                    COANo = bk.bankID,
                    nextChkNo = bk.branchCode,
                    COAlevel = 4,
                    active = true,
                    treeName = bk.bankName,
                    acctType = "Bank",
                    parentAcctType = "Assets",
                    parentAcctName = "Bank Accounts",
                    path = @"Assets\Current Assets\Cash And Banks\Bank Accounts\" + bk.bankName + @"\",
                    modDate = DateTime.Now,
                    modBy = activeUser,
                    openBal = cstCOA.openBal,
                    bal = cstCOA.bal,
                    closingBal = cstCOA.closingBal
                };
                _AMDbContext.COA.Update(coa);
                await _AMDbContext.SaveChangesAsync();


                _notificationInterceptor.SaveNotification("BankEdit", comID, "");
            }
            else
            {
                var existingBank = _AMDbContext.Banks.FirstOrDefault(x => x.bankName.Trim().ToLower() == bk.bankName.Trim().ToLower() && x.accountNo.Trim() == bk.accountNo.Trim() && x.comID == comID);

                if (existingBank != null)
                {
                    return BadRequest("A bank with the same bank name and account number already exists.");
                }

                bk.active = true;
                bk.crtBy = activeUser;
                bk.crtDate = DateTime.Now;
                bk.modBy = activeUser;
                bk.modDate = DateTime.Now;
                bk.comID = comID;
                var list = _AMDbContext.Banks.Where(x => x.comID == comID).ToList();
                if (list.Count() == 0) { bk.isDefault = true; }
                _AMDbContext.Banks.Add(bk);
                await _AMDbContext.SaveChangesAsync();

                var cstCOA = _AMDbContext.COA.Where(x => x.COANo == bk.bankID && x.parentCOAID == 79).FirstOrDefault();
                if (cstCOA == null)
                {
                    cstCOA = _AMDbContext.COA.Where(x => x.parentCOAID == 79 && x.acctName == bk.bankName).FirstOrDefault();
                }
                COA coa = new COA()
                {
                    COAID = cstCOA == null ? 0 : cstCOA.COAID,
                    acctNo = bk.branchCode,
                    acctName = bk.bankName,
                    isSys = true,
                    parentCOAID = 79,
                    COANo = bk.bankID,
                    nextChkNo = bk.branchCode,
                    COAlevel = 4,
                    active = true,
                    treeName = bk.bankName,
                    acctType = "Bank",
                    parentAcctType = "Assets",
                    parentAcctName = "Bank Accounts",
                    path = @"Assets\Current Assets\Cash And Banks\Bank Accounts\" + bk.bankName + @"\",
                    openBal = cstCOA == null ? 0 : cstCOA.openBal,
                    bal = cstCOA == null ? 0 : cstCOA.bal,
                    closingBal = cstCOA == null ? 0 : cstCOA.closingBal,
                    crtBy = cstCOA == null ? activeUser : cstCOA.crtBy,
                    crtDate = cstCOA == null ? DateTime.Now : cstCOA.crtDate,
                    modBy = activeUser,
                    modDate = DateTime.Now,
                };
                _AMDbContext.COA.Update(coa);
                await _AMDbContext.SaveChangesAsync();

                _notificationInterceptor.SaveNotification("BankCreate", comID, "");
            }

            return Ok(bk);
        }


        [HttpPost]
        public async Task<IActionResult> UpdateIsDefault([FromBody] Bank bank)
        {
            var comID = int.Parse(Request.Headers["comID"].ToString());
            List<Bank> lst = _AMDbContext.Banks.Where(x => x.comID == comID).ToList();
            foreach (var item in lst)
            {
                if (item.bankID == bank.bankID)
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
            _AMDbContext.Banks.UpdateRange(lst);
            await _AMDbContext.SaveChangesAsync();
            _notificationInterceptor.SaveNotification("BankEdit", comID, "");
            return Ok(lst);

        }

        [HttpDelete]
        [Route("{bankID}")]
        public async Task<IActionResult> DeleteBank(int bankID)
        {
            var lst = _AMDbContext.Banks.Where(a => a.bankID == bankID).ToList();
            var bank = _AMDbContext.COA.Where(a => a.COANo == bankID && a.acctName == lst[0].bankName && a.parentCOAID == 79).FirstOrDefault();
            var existlist = _AMDbContext.gl.Where(x => x.COAID == bank.COAID || x.relCOAID == bank.COAID).ToList();
            if (existlist.Count() > 0)
            {
                return NotFound("Some Invoices Depend on this Bank. Please Delete Invoice First");
            }
            _AMDbContext.Remove(bank);
            _AMDbContext.RemoveRange(lst);
            await _AMDbContext.SaveChangesAsync();

            var comID = Request.Headers["comID"].ToString();
            _notificationInterceptor.SaveNotification("BankDelete", int.Parse(comID), "");

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
