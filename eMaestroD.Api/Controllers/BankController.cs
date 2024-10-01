using eMaestroD.Api.Data;
using eMaestroD.Models.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using eMaestroD.DataAccess.DataSet;
using eMaestroD.Shared.Common;
using eMaestroD.Api.Common;

namespace eMaestroD.Api.Controllers
{
    public class BankController : BaseController
    {
        private readonly NotificationInterceptor _notificationInterceptor;
        private readonly HelperMethods _helperMethods;
        public BankController(AMDbContext dbContext, NotificationInterceptor notificationInterceptor, IHttpContextAccessor httpContextAccessor, HelperMethods helperMethods)
            : base(dbContext, httpContextAccessor)
        {
            _notificationInterceptor = notificationInterceptor;
            _helperMethods = helperMethods;
        }

        [HttpGet("{comID}")]
        public async Task<IActionResult> GetAllBank(int comID)
        {
            var banks = await _dbContext.Banks.Where(x => x.active && x.comID == comID).ToListAsync();
            var response = new ResponsedGroupListVM
            {
                enttityDataSource = banks,
                entityModel = banks?.GetEntity_MetaData()
            };
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> SaveBank([FromBody] Bank bank)
        {
            var comID = int.Parse(Request.Headers["comID"].ToString());

            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                var existingBank = _dbContext.Banks
                    .FirstOrDefault(x => x.bankName.Trim().ToLower() == bank.bankName.Trim().ToLower() &&
                                         x.accountNo.Trim() == bank.accountNo.Trim() &&
                                         x.comID == comID &&
                                         x.bankID != bank.bankID);

                if (existingBank != null)
                {
                    return BadRequest("A bank with the same bank name and account number already exists.");
                }

                bank.modDate = DateTime.Now;
                bank.modBy = ActiveUser;
                bank.comID = comID;

                if (bank.bankID != 0)
                {
                    _dbContext.Banks.Update(bank);
                }
                else
                {
                    bank.active = true;
                    bank.crtBy = ActiveUser;
                    bank.crtDate = DateTime.Now;
                    
                    var list = await _dbContext.Banks.Where(x => x.comID == comID).ToListAsync();
                    if (list.Count == 0)
                    {
                        bank.isDefault = true;
                    }
                    _dbContext.Banks.Add(bank);
                }

                await _dbContext.SaveChangesAsync();

                var coa = CreateOrUpdateCOA(bank);
                _dbContext.COA.Update(coa);
                await _dbContext.SaveChangesAsync();

                var notificationType = bank.bankID != 0 ? "BankEdit" : "BankCreate";
                _notificationInterceptor.SaveNotification(notificationType, comID, "");

                await transaction.CommitAsync();

                return Ok(bank);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdateIsDefault([FromBody] Bank bank)
        {
            var comID = int.Parse(Request.Headers["comID"].ToString());
            var banks = await _dbContext.Banks.Where(x => x.comID == comID).ToListAsync();

            foreach (var item in banks)
            {
                item.isDefault = item.bankID == bank.bankID;
                if (item.isDefault)
                {
                    item.modBy = ActiveUser;
                    item.modDate = DateTime.Now;
                }
            }

            _dbContext.Banks.UpdateRange(banks);
            await _dbContext.SaveChangesAsync();

            _notificationInterceptor.SaveNotification("BankEdit", comID, "");
            return Ok(banks);
        }

        [HttpDelete("{bankID}")]
        public async Task<IActionResult> DeleteBank(int bankID)
        {
            var banks = _dbContext.Banks.Where(a => a.bankID == bankID).ToList();
            var bankCOA = _dbContext.COA.FirstOrDefault(a => a.COANo == bankID && a.acctName == banks.First().bankName && a.parentCOAID == 79);
            var existlist = _dbContext.gl.Where(x => x.COAID == bankCOA.COAID || x.relCOAID == bankCOA.COAID).ToList();

            if (existlist.Any())
            {
                return NotFound("Some Invoices Depend on this Bank. Please Delete Invoice First");
            }

            _dbContext.Remove(bankCOA);
            _dbContext.RemoveRange(banks);
            await _dbContext.SaveChangesAsync();

            var comID = int.Parse(Request.Headers["comID"].ToString());
            _notificationInterceptor.SaveNotification("BankDelete", comID, "");

            return Ok(banks);
        }

        private COA CreateOrUpdateCOA(Bank bank)
        {
            var cstCOA = _dbContext.COA.FirstOrDefault(x => x.COANo == bank.bankID && x.parentCOAID == 79) ??
                         _dbContext.COA.FirstOrDefault(x => x.parentCOAID == 79 && x.acctName == bank.bankName);
            var parentAccCode = _dbContext.COA.FirstOrDefault(x => x.COAID == 79).acctNo;
            var newAcctNo = _helperMethods.GenerateAcctNo(parentAccCode, bank.comID);
            
            return new COA
            {
                COAID = cstCOA?.COAID ?? 0,
                acctNo = cstCOA?.acctNo ?? newAcctNo,
                acctName = bank.bankName,
                isSys = false,
                parentCOAID = 79,
                COANo = bank.bankID,
                nextChkNo = bank.branchCode,
                COAlevel = 4,
                active = true,
                treeName = bank.bankName,
                acctType = "Bank",
                parentAcctType = "Assets",
                parentAcctName = "Bank Accounts",
                path = @$"Assets\Current Assets\Cash And Banks\Bank Accounts\{bank.bankName}\",
                openBal = cstCOA?.openBal ?? 0,
                bal = cstCOA?.bal ?? 0,
                closingBal = cstCOA?.closingBal ?? 0,
                crtBy = cstCOA?.crtBy ?? ActiveUser,
                crtDate = cstCOA?.crtDate ?? DateTime.Now,
                modBy = ActiveUser,
                modDate = DateTime.Now,
                comID = bank.comID
            };
        }
    }
}
