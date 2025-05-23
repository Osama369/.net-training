using aiPriceGuard.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.DataAccess.IRepositories
{
    public interface IProductBarCodeRepository
    {
        Task AddRangeAsync(IList<ProductBarCode> ProductBarCodeList);
        void UpdateRange(IList<ProductBarCode> ProductBarCodeList);
        Task SaveChangesAsync();
        List<ProductBarCode> GetListByProductId(int? productID);
        void RemoveRange(List<ProductBarCode> productBarCodesList);

    }
}
