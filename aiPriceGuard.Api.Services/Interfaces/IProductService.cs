using aiPriceGuard.Models.Models;
using aiPriceGuard.Models.VMModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.Api.Services.Interfaces
{
    public interface IProductService
    {
        Task<Product> UpsertProductAsync(Product? product);
        Task<bool> Remove(Product? product);
        Task<List<Product>> GetAllProductsWithSupplierId(int? comID);      
        Task<Product> GetOneProduct(int? comID,int? productID,bool isActive);
        Task<Product> Delete(int? prodID, int? comID);
        List<Product> SaveJsonProduct(int? supplierID,RenderJson renderJSonObj);
        bool IsProductCodeDuplicate(string? ProductCode,string? ProductName);

    }
}
