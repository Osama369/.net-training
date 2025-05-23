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
    public class ProductBarCodeRepository : IProductBarCodeRepository
    {
        private readonly AMDbContext _dbContext;
        public ProductBarCodeRepository(AMDbContext _dbContext)
        {
            this._dbContext = _dbContext;
        }
        public async Task AddRangeAsync(IList<ProductBarCode> ProductBarCodeList)
        {
            if (ProductBarCodeList.Count > 0)
            {
                await _dbContext.AddRangeAsync(ProductBarCodeList);
        
            }
        }
        public List<ProductBarCode> GetListByProductId(int? productID)
        {
            return _dbContext.ProductBarCodes.Where(x => x.prodID == productID).ToList();
        }

        public void RemoveRange(List<ProductBarCode> productBarCodesList)
        {
            _dbContext.ProductBarCodes.RemoveRange(productBarCodesList);
        }

        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();   
        }
        public void UpdateRange(IList<ProductBarCode> ProductBarCodeList)
        {

            if (ProductBarCodeList.Count > 0)
            {
                 _dbContext.UpdateRange(ProductBarCodeList);

            }
        }
    }
}
