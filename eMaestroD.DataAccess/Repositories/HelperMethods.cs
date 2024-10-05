using eMaestroD.DataAccess.DataSet;
using eMaestroD.DataAccess.IRepositories;
using eMaestroD.Models.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.DataAccess.Repositories
{
    public class HelperMethods : IHelperMethods
    {
        private readonly AMDbContext _context;
        public HelperMethods(AMDbContext context)
        {
            _context = context;
        }
        public string GetAcctNoByKey(string key)
        {
            var coaConfig = _context.COAConfig.FirstOrDefault(x => x.key == key);
            return coaConfig?.acctNo;
        }

        public async Task<FiscalYear> GetActiveFiscalYear(int? comID, DateTime? dtTX)
        {
            var existList = await _context.FiscalYear
                .Where(x => x.comID == comID && x.dtStart <= dtTX && x.dtEnd >= dtTX && x.active)
                .ToListAsync();
            return existList.FirstOrDefault();
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
            var filteredAcctNumbers = _context.COA
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
    }
}
