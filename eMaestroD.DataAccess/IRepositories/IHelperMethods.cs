using eMaestroD.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.DataAccess.IRepositories
{
    public interface IHelperMethods
    {
        string GetAcctNoByKey(string key);
        Task<FiscalYear> GetActiveFiscalYear(int? comID, DateTime? dtTX);
        string GenerateAcctNo(string parentAcctNo, int comID);
    }
}
