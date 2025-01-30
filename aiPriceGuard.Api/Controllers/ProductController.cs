using aiPriceGuard.DataAccess.DataSet;
using aiPriceGuard.Models.Models;
using Microsoft.AspNetCore.Mvc;
using aiPriceGuard.Shared.Common;
using System.Security.Claims;

namespace aiPriceGuard.Api.Controllers
{
    [Route("api/[Controller]")]
    [ApiController]
    public class ProductController : Controller
    {
        private readonly AMDbContext _dbContext;
        public ProductController(AMDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpPost("UpsertProduct")]
        public async Task<IActionResult> UpsertProduct([FromBody] Product product)
        {
            if (product.prodID!=0 )
            {
                var existList = _dbContext.Products.Where(x => x.prodID != product.prodID && x.comID == product.comID && (x.prodCode == product.prodCode || x.prodName == product.prodName)).ToList();
                if (existList.Count() == 0)
                {
                    product.modDate = DateTime.Now;
                    product.modby = User.FindFirst(ClaimTypes.Email)?.Value;
                    _dbContext.Products.Update(product);
                    var suppProducts = _dbContext.SupplierProducts.Where(x => x.ProdID == product.prodID).ToList();
                    _dbContext.RemoveRange(suppProducts);
                    await _dbContext.SaveChangesAsync();

                    List<SupplierProduct> supplierProdList = new List<SupplierProduct>();
                    foreach (var vendID in product.supplierIDList)
                    {
                        SupplierProduct supplierProd = new SupplierProduct
                        {
                            ComID = product.comID.Value,
                            SupplierId = vendID,
                            ProdID = product.prodID,
                            Price = 0
                        };
                        supplierProdList.Add(supplierProd);
                    }
                    await _dbContext.SupplierProducts.AddRangeAsync(supplierProdList);
                    _dbContext.ProductBarCodes.UpdateRange(product.ProductBarCodes);
                    await _dbContext.SaveChangesAsync();
                    product.IsUpdate = true;
                    
                    return Ok(product);
                }
                
            }
            else
            {
                await _dbContext.Products.AddAsync(product);
                product.crtBy = User.FindFirst(ClaimTypes.Email)?.Value;
                product.crtDate = DateTime.Now;
                await _dbContext.SaveChangesAsync();
                foreach(var prodBarCode in product.ProductBarCodes)
                {
                    prodBarCode.prodID = product.prodID;
                }
               
                await _dbContext.ProductBarCodes.AddRangeAsync(product.ProductBarCodes);
                List<SupplierProduct> supplierProdList = new List<SupplierProduct>();
                foreach (var vendID in product.supplierIDList)
                {
                    SupplierProduct supplierProd = new SupplierProduct
                    {
                        ComID = product.comID.Value,
                        SupplierId = vendID,
                        ProdID = product.prodID,
                        Price = 0
                    };
                    supplierProdList.Add(supplierProd);
                }
                await _dbContext.SupplierProducts.AddRangeAsync(supplierProdList);
                await _dbContext.SaveChangesAsync();
                product.IsUpdate = false;

                return Ok(product);
            }
            return BadRequest();
        }
        [HttpGet("GetAllProducts/{comID}")]
        public async Task<IActionResult> GetAllProducts(int comID)
        {
            var prdctdtList = _dbContext.Products.Where(x=> x.comID ==comID).ToList();
            var suppProd = _dbContext.SupplierProducts.Where(x=> x.ComID==comID).ToList();
            prdctdtList=await SetSupplierId(prdctdtList, suppProd,comID);
            ResponsedGroupListVM vM = new ResponsedGroupListVM();
            vM.enttityDataSource = prdctdtList;
            vM.entityModel = prdctdtList?.GetEntity_MetaData();
            return Ok(vM);
        }
        [HttpGet]
        [Route("GetOneProductDetail/{comID}/{prodID}")]
        public async Task<IActionResult> GetOneProductDetail(int comID, int prodID)
        {
            var product =  _dbContext.Products.Where(x => x.comID == comID && x.prodID == prodID && x.active == true).ToList();
            var productBarCodes =  _dbContext.ProductBarCodes
                .Where(x => x.prodID == prodID)
                .ToList();

            var vendProduct =  _dbContext.SupplierProducts.Where(x => x.ProdID == prodID).ToList();
            var suppProd = _dbContext.SupplierProducts.ToList();
            product=await SetSupplierId(product, vendProduct, comID);
            product[0].vendID = vendProduct == null ? 0 : vendProduct[0].SupplierId;
            product[0].sharePercentage = vendProduct == null ? 0 : vendProduct[0].SharePercentage;

            product[0].ProductBarCodes = productBarCodes;
            return Ok(product[0]);
        }
        
        [HttpDelete]
        [Route("Delete/{prodID}/{comID}")]
        public async Task<IActionResult> Delete(int prodID,int comID)
        {
            if (prodID != 0)
            {
                var prod=_dbContext.Products.FirstOrDefault(x => x.prodID == prodID && x.comID==comID);
                var suppProd = _dbContext.SupplierProducts.Where(x => x.ProdID == prodID && x.ComID == comID).ToList();
                var prodBarCodeList =_dbContext.ProductBarCodes.Where(x=> x.prodID == prodID).ToList();
                
                _dbContext.Products.Remove(prod);
                _dbContext.SupplierProducts.RemoveRange(suppProd);
                _dbContext.ProductBarCodes.RemoveRange(prodBarCodeList);
                await _dbContext.SaveChangesAsync();
            }
            return Ok();
        }
        private async Task<List<Product>> SetSupplierId(List<Product> prddtList, List<SupplierProduct> supplierProd,int comID)
        {
            List<Product> prdctdtList = prddtList;
            List<SupplierProduct> suppProd = supplierProd;
            prdctdtList.ForEach(x =>
            {
                var suppProductM = suppProd.Where(x => x.ProdID == x.ProdID && x.ComID==comID).ToList();
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
       
    }
}
