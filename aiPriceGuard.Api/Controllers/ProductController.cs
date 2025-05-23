using aiPriceGuard.DataAccess.DataSet;
using aiPriceGuard.Models.Models;
using Microsoft.AspNetCore.Mvc;
using aiPriceGuard.Shared.Common;
using System.Security.Claims;
using aiPriceGuard.DataAccess.IRepositories;
using aiPriceGuard.Api.Services.Interfaces;

namespace aiPriceGuard.Api.Controllers
{
    [Route("api/[Controller]")]
    [ApiController]
    public class ProductController : Controller
    {
   
        private readonly IProductService _productService;

        public ProductController( IProductService _productService)
        {
          
            this._productService = _productService;
        }
        [HttpPost("UpsertProduct")]
        public async Task<IActionResult> UpsertProduct([FromBody] Product product)
        {
             await  _productService.UpsertProductAsync(product);
            if(product != null)
            {
                return Ok(product);
            }
            return BadRequest();
        }
        [HttpGet("GetAllProducts/{comID}")]
        public async Task<IActionResult> GetAllProducts(int comID)
        {
            if(comID == 0)
            {
                return BadRequest("Company is not correct");
            }
            ResponsedGroupListVM vM = new ResponsedGroupListVM();
            var prdctdtList = await _productService.GetAllProductsWithSupplierId(comID);
            if (prdctdtList.Count > 0)
            {
               
                vM.enttityDataSource = prdctdtList;
                vM.entityModel = prdctdtList?.GetEntity_MetaData();
                return Ok(vM);
            }
            return Ok(vM);
        }
        [HttpGet]
        [Route("GetOneProductDetail/{comID}/{prodID}")]
        public async Task<IActionResult> GetOneProductDetail(int comID, int prodID)
        {
           var product= await  _productService.GetOneProduct(comID, prodID, true);
         
            return Ok(product);
        }
        
        [HttpDelete]
        [Route("Delete/{prodID}/{comID}")]
        public async Task<IActionResult> Delete(int prodID,int comID)
        {
            if (prodID != 0)
            {
               var prod =await _productService.Delete(prodID,comID);
                return Ok(prod);
            }
            return BadRequest();
        }
        private async Task<List<Product>> SetSupplierId(List<Product> prddtList, List<SupplierProduct> supplierProd,int comID)
        {
            List<Product> prdctdtList = prddtList;
            List<SupplierProduct> suppProd = supplierProd;
            prdctdtList.ForEach(x =>
            {
                var suppProductM = suppProd.Where(x => x.prodID == x.prodID && x.comID==comID).ToList();
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
