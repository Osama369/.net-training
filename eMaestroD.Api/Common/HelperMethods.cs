using eMaestroD.Api.Data;
using eMaestroD.Models.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using eMaestroD.DataAccess.DataSet;

namespace eMaestroD.Api.Common
{
    public class HelperMethods
    {
        private readonly AMDbContext _AMDbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public HelperMethods(AMDbContext aMDbContext, IHttpContextAccessor httpContextAccessor)
        {
            _AMDbContext = aMDbContext;
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetActiveUser_Username()
        {
            var email = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email);
            if (email != null)
            {
                var user = _AMDbContext.Users.Where(x => x.Email == email);
                if (user != null)
                {
                    return user.FirstOrDefault().FirstName + " " + user.FirstOrDefault().LastName;
                }
            }
            return "";
        }

        public string GenerateAcctNo(string parentAcctNo, int comID)
        {
            var segments = parentAcctNo.Split('-').ToList();
            int level = segments.FindIndex(seg => seg == "00" || seg == "00000");
            if (level == -1) level = segments.Count - 1; // If no zero segments, increment the last one
            string nextSegmentValue = GetNextSegmentValue(segments, level, comID);
            segments[level] = nextSegmentValue;
            for (int i = level + 1; i < segments.Count; i++)
            {
                segments[i] = i == segments.Count - 1 ? "00000" : "00";
            }
            return string.Join("-", segments);
        }

        private string GetNextSegmentValue(List<string> segments, int level, int comID)
        {
            var prefix = string.Join("-", segments.Take(level));
            var filteredAcctNumbers = _AMDbContext.COA
                .Where(acct => acct.acctNo.StartsWith(prefix) && acct.comID == comID)
                .ToList();

            if (filteredAcctNumbers.Count == 0)
            {
                return segments[level].Length == 2 ? "01" : "00001";
            }

            var maxSegment = filteredAcctNumbers
                .Select(acct => acct.acctNo.Split('-')[level])
                .Max();
            int nextValue = int.Parse(maxSegment) + 1;
            return nextValue.ToString(new string('0', segments[level].Length));
        }

        public string GetAcctNoByKey(string key)
        {
            var coaConfig = _AMDbContext.COAConfig.FirstOrDefault(x => x.key == key);
            return coaConfig?.acctNo;
        }


        public async Task<string> GenerateVoucherNoAsync(int txTypeID, int? comID)
        {
            string sql = "EXEC GenerateGLVoucherNo @txType, @comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@txType", Value = txTypeID },
                new SqlParameter { ParameterName = "@comID", Value = comID }
            };

            var SDL = await _AMDbContext.invoiceNo.FromSqlRaw(sql, parms.ToArray()).ToListAsync();
            return SDL?.FirstOrDefault()?.voucherNo;
        }

        public async Task<FiscalYear> GetActiveFiscalYear(int? comID, DateTime? dtTX)
        {
            var existList = await _AMDbContext.FiscalYear
                .Where(x => x.comID == comID && x.dtStart <= dtTX && x.dtEnd >= dtTX && x.active)
                .ToListAsync();
            return existList.FirstOrDefault();
        }
    }
}
