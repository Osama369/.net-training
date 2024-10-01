using eMaestroD.DataAccess.DataSet;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.DataAccess.Repositories
{
    public class HelperMethods
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
    }
}
