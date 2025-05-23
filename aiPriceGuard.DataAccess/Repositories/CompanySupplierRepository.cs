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
    public class CompanySupplierRepository : ICompanySupplierRepository
    {
        private readonly AMDbContext _dbContext;
        public CompanySupplierRepository(AMDbContext _dbContext)
        {
            this._dbContext = _dbContext;
        }

        public async Task<CompanySupplier> AddAsync(CompanySupplier comSupplier)
        {
            await  _dbContext.CompanySupplier.AddAsync(comSupplier);
            await saveAsync();
            return comSupplier;
        }

        public CompanySupplier FirstOrDefaultBySupplierId(int supplierID)
        {
            return _dbContext.CompanySupplier.FirstOrDefault(x=> x.SupplierId == supplierID);
        }

        public async Task Remove(CompanySupplier supplier)
        {
            try
            {
                _dbContext.CompanySupplier.Remove(supplier);
                await saveAsync();
            }
            catch (Exception ex)
            {

            }
        }
        private async Task saveAsync()
        {
            await _dbContext.SaveChangesAsync();
        }
    }
}
