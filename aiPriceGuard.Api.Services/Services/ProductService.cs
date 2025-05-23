using aiPriceGuard.Api.Services.Interfaces;
using aiPriceGuard.DataAccess.IRepositories;
using aiPriceGuard.Models.Models;
using aiPriceGuard.Models.VMModels;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.Api.Services.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly ISupplierProductRepository _supplierProductRepoistory;
        private readonly IProductBarCodeRepository _productBarCodeRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ProductService(IProductRepository _productRepository, IHttpContextAccessor _httpContextAccessor
            , IProductBarCodeRepository _productBarCodeRepository, ISupplierProductRepository _supplierProductRepoistory)
        {
                this._productRepository = _productRepository;
                this._httpContextAccessor = _httpContextAccessor;
                this._productBarCodeRepository = _productBarCodeRepository;
                this._supplierProductRepoistory = _supplierProductRepoistory;
        }

        public async Task<Product> Delete(int? prodID, int? comID)
        {
            var prod =await _productRepository.FindByIdAsync(prodID);
            var suppProd = _supplierProductRepoistory.GetListByProductId(prodID);
            var prodBarCodeList = _productBarCodeRepository.GetListByProductId(prodID);

            _productRepository.Delete(prod);
            _supplierProductRepoistory.RemoveRange(suppProd);
            _productBarCodeRepository.RemoveRange(prodBarCodeList);

            await _productRepository.SaveChangesAsync();
            return prod;
        }

        public async Task<List<Product>> GetAllProductsWithSupplierId(int? comID)
        {
            if (comID != null)
            {
                var prdctdtList = _productRepository.GetAllByCompany(comID);
                var suppProd = _supplierProductRepoistory.GetAllByCompany(comID);
                prdctdtList = await SetSupplierId(prdctdtList, suppProd, comID);
                return prdctdtList;
            }
            return null;
        }

        public async Task<Product> GetOneProduct(int? comID, int? prodID, bool isActive)
        {
            var product =await  _productRepository.FindByIdAsync(prodID);
            //var product = _dbContext.Products.Where(x => x.comID == comID && x.prodID == prodID && x.active == isActive).ToList();

            var productBarCodes = _productBarCodeRepository.GetListByProductId(prodID);

            var vendProduct = _supplierProductRepoistory.GetListByProductId(prodID);
           
            var suppProd = _supplierProductRepoistory.GetAllByCompany(comID);
            List<Product> prodList = new List<Product>();
            prodList.Add(product);
          
            prodList = await SetSupplierId(prodList, vendProduct, comID);
            prodList[0].vendID = vendProduct == null ? 0 : vendProduct[0].SupplierId;
            prodList[0].sharePercentage = vendProduct == null ? 0 : vendProduct[0].sharePercentage;

            prodList[0].ProductBarCodes = productBarCodes;
            return prodList[0];
        }

        public List<Product> SaveJsonProduct(int? supplierID, RenderJson renderJSonObj)
        {
          
           var prodList= _productRepository.ProductsBySupplierId(supplierID);
            //renderJSonObj.ProductDetails.ForEach(x =>
            //{
            //    if(prodList.FirstOrDefault(y => y.prodName == x.Name) == null)
            //    {
            //        Product product = new Product
            //        {
            //            prodCode = prod.prodCode,
            //            prodName = prod.prodName,
            //            purchRate = prod.purchRate,
            //            sellRate = prod.sellRate,
            //            isTaxable = prod.isTaxable,
            //            active = prod.active,
            //            crtBy = prod.crtBy,
            //            crtDate = prod.crtDate,
            //            modby = prod.modby,
            //            modDate = prod.modDate,
            //            comID = prod.comID
            //        };
            //    }
            //});
            return null;
        }

        public async Task<bool> Remove(Product? product)
        {
            
            return _productRepository.Delete(product);           
        }

        public async Task<Product> UpsertProductAsync(Product? product)
        {
            if (product.prodID != 0)
            {
                var existList = _productRepository.GetProductExistList(product);
                if (existList.Count() == 0)
                {
                    product.modDate = DateTime.Now;
                    var user = _httpContextAccessor.HttpContext?.User;
                    product.modby = user.FindFirst(ClaimTypes.Email)?.Value;
                   _productRepository.Update(product);
                    var suppProducts = _supplierProductRepoistory.GetListByProductId(product.prodID);
                    _supplierProductRepoistory.RemoveRange(suppProducts);
                    await _supplierProductRepoistory.saveChangesAsync();

                    List<SupplierProduct> supplierProdList = new List<SupplierProduct>();
                    foreach (var vendID in product.supplierIDList)
                    {
                        SupplierProduct supplierProd = new SupplierProduct
                        {
                            comID = product.comID.Value,
                            SupplierId = vendID,
                            prodID = product.prodID,
                            price = 0
                        };
                        supplierProdList.Add(supplierProd);
                    }
                    await _supplierProductRepoistory.AddRangeAsync(supplierProdList);
                    _productBarCodeRepository.UpdateRange(product.ProductBarCodes);
                    await _productBarCodeRepository.SaveChangesAsync();
                    product.IsUpdate = true;

                    return product;
                }

            }
            else
            {
               
                var user = _httpContextAccessor.HttpContext?.User;
                product.crtBy = user.FindFirst(ClaimTypes.Email)?.Value;
                product.crtDate = DateTime.Now;
                await _productRepository.AddAsync(product);
               
                
                foreach (var prodBarCode in product.ProductBarCodes)
                {
                    prodBarCode.prodID = product.prodID;
                }
                 
                await _productBarCodeRepository.AddRangeAsync(product.ProductBarCodes);
                List<SupplierProduct> supplierProdList = new List<SupplierProduct>();
                foreach (var vendID in product.supplierIDList)
                {
                    SupplierProduct supplierProd = new SupplierProduct
                    {
                        comID = product.comID.Value,
                        SupplierId = vendID,
                        prodID = product.prodID,
                       price = 0
                    };
                    supplierProdList.Add(supplierProd);
                }
                await _supplierProductRepoistory.AddRangeAsync(supplierProdList);
                await _supplierProductRepoistory.saveChangesAsync();
                product.IsUpdate = false;

                return product;
            }
            return null;
        }

        private async Task<List<Product>> SetSupplierId(List<Product> prddtList, List<SupplierProduct> supplierProd, int? comID)
        {
            List<Product> prdctdtList = prddtList;
            List<SupplierProduct> suppProd = supplierProd;
            prdctdtList.ForEach(x =>
            {
                var suppProductM = suppProd.Where(x => x.prodID == x.prodID && x.comID == comID).ToList();
                if (suppProductM.Count > 0)
                {
                    foreach (var supp in suppProductM)
                    {
                        x.supplierIDList.Add(supp.SupplierId);
                    }

                }
            });
            return prdctdtList;
        }

        public bool IsProductCodeDuplicate(string? ProductCode,string? ProductName)
        {
            if (_productRepository.GetProductByProductCodeAndName(ProductCode,ProductName) != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
