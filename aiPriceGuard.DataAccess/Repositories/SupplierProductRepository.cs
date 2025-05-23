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
    public class SupplierProductRepository : ISupplierProductRepository
    {
        private readonly AMDbContext _dbContext;
        public SupplierProductRepository(AMDbContext _dbContext)
        {
            this._dbContext = _dbContext;
        }
        public async Task<SupplierProduct> AddAsync(SupplierProduct supplierProduct)
        {
            if (supplierProduct != null)
            {
                 await _dbContext.SupplierProducts.AddAsync(supplierProduct);
               return supplierProduct;
            }
            return null;
        }

        public async Task AddRangeAsync(IList<SupplierProduct> supplierProductList)
        {
            await _dbContext.SupplierProducts.AddRangeAsync(supplierProductList);
            await _dbContext.SaveChangesAsync();
        }

        public async  Task<SupplierProduct> FindByIdAsync(int? id)
        {
            if (id!=null)
            {
               return  await _dbContext.SupplierProducts.FindAsync(id);
            }
            return null;
        }

        public List<SupplierProduct> GetAllByCompany(int? comID)
        {

            var list = _dbContext.SupplierProducts.Where(x => x.comID == comID).ToList();
            return list;
        }

        public List<SupplierProduct> GetListByProductId(int? prodID)
        {
            if (prodID != null)
            {
                return _dbContext.SupplierProducts.Where(x => x.prodID == prodID).ToList();

            }
            return new List<SupplierProduct>();
        }

        public SupplierProduct GetSupplierProductBySupplierId(int? supplierID)
        {
            if (supplierID != null)
            {
                return _dbContext.SupplierProducts.FirstOrDefault(x => x.SupplierId == supplierID);
            }
            return null;
        }

        public bool Remove(SupplierProduct supplierProduct)
        {
            if(supplierProduct != null)
            {
                _dbContext.SupplierProducts.Remove(supplierProduct);
                return true;
            }
            return false;
        }

        public bool RemoveRange(IEnumerable<SupplierProduct> supplierProducts)
        {
            if(supplierProducts != null)
            {
                _dbContext.SupplierProducts.RemoveRange(supplierProducts);
                return true;
            }
            return false;
        }
        public async Task saveChangesAsync()
        {
          await _dbContext.SaveChangesAsync();
        }

        public SupplierProduct Update(SupplierProduct supplierProduct)
        {
            if (supplierProduct != null)
            {
                _dbContext.SupplierProducts.Update(supplierProduct);
                return supplierProduct;
            }
            return null;
        }
    }
}
