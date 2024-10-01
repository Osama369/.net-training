using eMaestroD.Api.Common;
using eMaestroD.Api.Data;
using eMaestroD.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using eMaestroD.DataAccess.DataSet;
using eMaestroD.Shared.Common;

namespace eMaestroD.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("/api/[controller]/[Action]")]
    public class COAController : Controller
    {
        private readonly AMDbContext _AMDbContext;
        private readonly NotificationInterceptor _notificationInterceptor;
        List<COA> coalst = new List<COA>();
        List<COA> treeNode = new List<COA>();
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly HelperMethods _helperMethods;
        string username = "";
        public COAController(AMDbContext aMDbContext, NotificationInterceptor notificationInterceptor, IHttpContextAccessor httpContextAccessor, HelperMethods helperMethods)
        {
            _AMDbContext = aMDbContext;
            _notificationInterceptor = notificationInterceptor;
            _httpContextAccessor = httpContextAccessor;
            _helperMethods = helperMethods;
            username = GetUsername();

        }

        [HttpGet]
        public async Task<IActionResult> GetAllCOAForGird()
        {
            coalst = await _AMDbContext.COA.ToListAsync();
            foreach (var item in coalst.FindAll(x => x.COAlevel == 0))
            {
                treeNode.Add(item);
                AddChilds(item.COAID);

            }
            return Ok(treeNode);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCOA()
        {
            coalst = await _AMDbContext.COA.ToListAsync();
            if (coalst.Count == 0)
            {
                return NotFound();
            }
            return Ok(coalst);
        }


        [HttpPost]
        public async Task<IActionResult> saveCOA([FromBody] COA coa)
        {
            var comID = int.Parse(Request.Headers["comID"].ToString());
            if (coa.COAID != 0)
            {
                coa.modDate = DateTime.Now;
                coa.modBy = username;
                coa.comID = comID;
                _AMDbContext.COA.Update(coa);
                await _AMDbContext.SaveChangesAsync();

                _notificationInterceptor.SaveNotification("ChartOfAccountsEdit", comID, "");
            }
            else
            {
                var newAcctNo = _helperMethods.GenerateAcctNo(coa.acctNo, comID);

                coa.bal = 0;
                coa.closingBal = 0;
                coa.crtDate = DateTime.Now;
                coa.crtBy = username;
                coa.modDate = DateTime.Now;
                coa.modBy = username;
                coa.comID = comID;
                coa.acctNo = newAcctNo;
                await _AMDbContext.COA.AddAsync(coa);
                await _AMDbContext.SaveChangesAsync();

                coa.COANo = coa.COAID;
                _AMDbContext.COA.Update(coa);
                await _AMDbContext.SaveChangesAsync();

                _notificationInterceptor.SaveNotification("ChartOfAccountsCreate", comID, "");
            }

            return Ok(coa);
        }

        [HttpDelete]
        [Route("{COAID}")]
        public async Task<IActionResult> deleteCOA(int COAID)
        {
            var existlist = _AMDbContext.gl.Where(x => x.COAID == COAID || x.relCOAID == COAID).ToList();

            if (existlist.Count == 0)
            {
                _AMDbContext.RemoveRange(_AMDbContext.COA.Where(x => x.COAID == COAID));
                await _AMDbContext.SaveChangesAsync();
                var comID = Request.Headers["comID"].ToString();
                _notificationInterceptor.SaveNotification("ChartOfAccountsDelete", int.Parse(comID), "");
                return Ok();
            }
            return NotFound("Some Entries depend on this account, Please delete entries first.");
        }

        [NonAction]
        private void AddChilds(int parentID)
        {
            try
            {
                if (parentID > 0)
                {
                    // Bind accounts childs.
                    foreach (COA coa in coalst.FindAll(x => x.parentCOAID == parentID))
                    {
                        var FstChild = coa;
                        treeNode.Find(x => x.COAID == parentID).children.Add(FstChild);
                        int FstChdpID = coa.COAID;
                        foreach (COA ca in coalst.FindAll(x => x.parentCOAID == FstChdpID))
                        {
                            var ScndChild = ca;
                            treeNode.Find(x => x.COAID == parentID).children.Find(x => x.COAID == FstChdpID).children.Add(ScndChild);
                            int SndChdPID = ca.COAID;

                            if (SndChdPID > 0)
                            {
                                foreach (COA c in coalst.FindAll(x => x.parentCOAID == SndChdPID))
                                {

                                    var thrdChd = c;
                                    treeNode.Find(x => x.COAID == parentID).children.Find(x => x.COAID == FstChdpID).children.Find(x => x.COAID == SndChdPID).children.Add(thrdChd);
                                    int ThrdChdID = c.COAID;

                                    if (ThrdChdID > 0)
                                    {
                                        foreach (COA thrdCoa in coalst.FindAll(x => x.parentCOAID == ThrdChdID))
                                        {
                                            var frthChd = thrdCoa;
                                            treeNode.Find(x => x.COAID == parentID).children.Find(x => x.COAID == FstChdpID).children.Find(x => x.COAID == SndChdPID).children.Find(x => x.COAID == ThrdChdID).children.Add(frthChd);
                                        }
                                    }
                                }
                            }
                        }
                    }

                }
            }
            catch (Exception ex)
            {
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCoaWithoutTradeDebtors()
        {
            var company = await _AMDbContext.COA.ToListAsync();
            var comp = company.RemoveAll(x => x.parentCOAID == 40);
            return Ok(company);
        }

        [HttpGet]
        [Route("{comID}")]
        public async Task<IActionResult> GetAllCoaofLevel2(int comID)
        {
            var company = await _AMDbContext.COA.Where(x => x.COAlevel == 2 || x.COAID == 40 || x.COAID == 83 || x.COAID == 80 || x.COAID == 79).ToListAsync();
            return Ok(company);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCoaofLevel3()
        {
            var company = await _AMDbContext.COA.Where(x => x.COAlevel == 3).ToListAsync();
            return Ok(company);
        }

        [HttpGet]
        [Route("{parentCOAID}")]
        public async Task<IActionResult> GetAllCoaByParentCOAID(int parentCOAID)
        {
            var company = await _AMDbContext.COA.Where(x => x.parentCOAID == parentCOAID).ToListAsync();
            return Ok(company);
        }


        [HttpGet]
        [Route("{comID}")]
        public async Task<IActionResult> GetAllBank(int comID)
        {
            var company = await _AMDbContext.COA.ToListAsync();
            var comp = company.FindAll(x => x.parentCOAID == 79).ToList();
            List<COA> bankList = new List<COA>();
            foreach (var item in comp)
            {
                var bank = _AMDbContext.Banks.Where(x => x.bankID == item.COANo && x.comID == comID).FirstOrDefault();
                if (bank != null)
                {
                    item.acctName = item.acctName + " - " + bank.accountNo;
                    item.isSys = bank.isDefault;
                    bankList.Add(item);
                }
            }
            ResponsedGroupListVM vM = new ResponsedGroupListVM();
            vM.enttityDataSource = bankList;
            vM.entityModel = bankList?.GetEntity_MetaData();
            return Ok(vM);
        }


        [HttpGet]
        [Route("{comID}")]
        public async Task<IActionResult> GetAllCreditCards(int comID)
        {
            var company = await _AMDbContext.COA.ToListAsync();
            var comp = company.FindAll(x => x.parentCOAID == 200).ToList();
            List<COA> creditCardList = new List<COA>();
            foreach (var item in comp)
            {
                var bank = _AMDbContext.CreditCards.Where(x => x.cardID == item.COANo && x.comID == comID).FirstOrDefault();
                if (bank != null)
                {
                    item.isSys = bank.isDefault;
                    creditCardList.Add(item);
                }
            }
            ResponsedGroupListVM vM = new ResponsedGroupListVM();
            vM.enttityDataSource = creditCardList;
            vM.entityModel = creditCardList?.GetEntity_MetaData();
            return Ok(vM);
        }

        [HttpGet]
        public async Task<IActionResult> GetCurrency()
        {
            var config = await _AMDbContext.Companies.ToListAsync();
            return Ok(config);
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
