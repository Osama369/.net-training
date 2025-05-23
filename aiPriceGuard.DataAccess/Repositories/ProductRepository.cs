using aiPriceGuard.DataAccess.DataSet;
using aiPriceGuard.DataAccess.IRepositories;
using aiPriceGuard.Models.Models;
using Microsoft.EntityFrameworkCore;

namespace aiPriceGuard.DataAccess.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AMDbContext _dbContext;
        public ProductRepository(AMDbContext _dbcontext)
        {
            this._dbContext = _dbcontext;
        }

        public async  Task<Product> AddAsync(Product product)
        {
            await _dbContext.Products.AddAsync(product);
            await _dbContext.SaveChangesAsync();
            return null;
        }

        public async Task<List<Product>> AddRangeAsync(List<Product> product)
        {
            try
            {
                await _dbContext.Products.AddRangeAsync(product);
                await _dbContext.SaveChangesAsync();
                return product;

            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public bool Delete(Product product)
        {
           _dbContext.Products.Remove(product);
            return true;
        }

        public async Task<Product> FindByIdAsync(int? id)
        {
            if (id != 0)
            {
                return await _dbContext.Products.FindAsync(id);

            }
            return null;
        }

        public List<Product> GetAll()
        {
            return _dbContext.Products.ToList();
        }

        public List<Product> GetAllByCompany(int? comID)
        {
           return _dbContext.Products.Where(x=> x.comID ==comID).ToList();
        }

        public int GetLastProductId()
        {
            var productID = _dbContext.Products
                             .OrderByDescending(p => p.prodID)
                             .FirstOrDefault()?.prodID ??0;
            return productID;
        }

        public Product GetProductByName(string name)
        {
            return _dbContext.Products.FirstOrDefault(x=> x.prodName ==name);
        }

        public Product GetProductByProductCode(string ProductCode)
        {
            return _dbContext.Products.FirstOrDefault(x => x.prodCode== ProductCode);
        }

        public Product GetProductByProductCodeAndName(string? ProductCode, string? prodName)
        {
            return _dbContext.Products.FirstOrDefault(x=> x.prodCode == ProductCode && x.prodName == prodName);
        }

        public Product GetProductBySupplierProductCode(string? SupplierProductCode)
        {
            if (SupplierProductCode != null)
            {
                var ProductList = (from prod in _dbContext.Products
                                  join suppProd in _dbContext.SupplierProducts
                                  on prod.prodID equals suppProd.prodID
                                  where suppProd.SupplierProductCode == SupplierProductCode
                                  select new Product
                                  {
                                    prodID = prod.prodID,
                                    prodCode = prod.prodCode,
                                    prodName = prod.prodName,
                                    purchRate = prod.purchRate,
                                    active = prod.active,
                                    crtBy = prod.crtBy,
                                    crtDate = prod.crtDate,
                                    comID = prod.comID,
                                    SupplierProductCode =suppProd.SupplierProductCode
                                  }).FirstOrDefault();
                return ProductList;
            }
            return null;
        }

        public IEnumerable<Product> GetProductExistList(Product product)
        {
           return  _dbContext.Products.Where(x => x.prodID != product.prodID && x.comID == product.comID && (x.prodCode == product.prodCode || x.prodName == product.prodName)).ToList();
        }

        public List<Product> ProductsBySupplierId(int? supplierID)
        {
            var prodList = (from prod in _dbContext.Products
                            join suppProd in _dbContext.SupplierProducts
                            on prod.prodID equals suppProd.prodID
                            where suppProd.SupplierProdId == supplierID
                            select new Product
                            {
                                prodID = prod.prodID,
                                prodCode = prod.prodCode,
                                prodName = prod.prodName,
                                purchRate = prod.purchRate,
                                sellRate = prod.sellRate,
                                isTaxable = prod.isTaxable,
                                active = prod.active,
                                crtBy = prod.crtBy,
                                crtDate = prod.crtDate,
                                modby = prod.modby,
                                modDate = prod.modDate,
                                comID = prod.comID
                               
                            }).ToList();
            return prodList;
        }

        public async Task SaveChangesAsync()
        {
            try
            {
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception ex)
            {

            }
        }
        public Product Update(Product product)
        {
           _dbContext.Products.Update(product);
            return product;
        }
    }
}
