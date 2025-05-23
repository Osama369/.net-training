using aiPriceGuard.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.DataAccess.IRepositories
{
    public interface IProductRepository 
    {
        Task<Product> AddAsync(Product product);
        Product Update(Product product);
        List<Product> GetAll();
        bool Delete(Product product);
        Task<Product> FindByIdAsync(int? id);
        Task SaveChangesAsync();
        IEnumerable<Product> GetProductExistList(Product product);
        List<Product> GetAllByCompany(int? comID);
        List<Product> ProductsBySupplierId(int? supplierID);
        int GetLastProductId();
        Product GetProductByName(string name);
        Product GetProductByProductCode(string? ProductCode);
        Product GetProductByProductCodeAndName(string? ProductCode,string? prodName);
        Task<List<Product>> AddRangeAsync(List<Product> product);
        Product GetProductBySupplierProductCode(string? SupplierProductCode);
    }
}
