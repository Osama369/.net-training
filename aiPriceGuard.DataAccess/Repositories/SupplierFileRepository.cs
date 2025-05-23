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
    public class SupplierFileRepository : ISupplierFileRepository
    {
        private readonly AMDbContext _dbContext;
        public SupplierFileRepository(AMDbContext _dbContext)
        {
            this._dbContext = _dbContext;
        }
        public async Task<SupplierFile> AddAsync(SupplierFile supplierFile)
        {
            await _dbContext.SupplierFile.AddAsync(supplierFile);
            return supplierFile;
        }
        public SupplierFile GetSupplierFileBySupplierId(int? supplierID)
        {
            return _dbContext.SupplierFile.FirstOrDefault(x=> x.SupplierId == supplierID);
        }
        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }
    }
}
