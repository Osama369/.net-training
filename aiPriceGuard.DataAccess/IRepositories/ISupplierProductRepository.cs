using aiPriceGuard.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.DataAccess.IRepositories
{
    public interface ISupplierProductRepository
    {
        Task<SupplierProduct> AddAsync(SupplierProduct supplierProduct);
        SupplierProduct Update(SupplierProduct supplierProduct);
        bool Remove(SupplierProduct supplierProduct);
        Task<SupplierProduct> FindByIdAsync(int? id);
        List<SupplierProduct> GetListByProductId(int? id);
        bool RemoveRange(IEnumerable<SupplierProduct> supplierProducts);
        Task saveChangesAsync();
        Task AddRangeAsync(IList<SupplierProduct> supplierProductList);
        List<SupplierProduct> GetAllByCompany(int? comID);
        SupplierProduct GetSupplierProductBySupplierId(int? supplierID);
    }
}
