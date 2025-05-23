using aiPriceGuard.DataAccess.DataSet;
using aiPriceGuard.DataAccess.IRepositories;
using aiPriceGuard.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.DataAccess.Repositories
{
    public class InvoiceRepository :IinvoiceRepository
    {
        private readonly AMDbContext _dbContext;
        public InvoiceRepository(AMDbContext _dbContext)
        {
            this._dbContext = _dbContext;
        }
        public async Task AddAsync(Invoice invoice)
        {
            await _dbContext.AddAsync(invoice);
            await _dbContext.SaveChangesAsync();
        }

       
    }
}
