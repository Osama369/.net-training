using aiPriceGuard.DataAccess.DataSet;
using aiPriceGuard.Models.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using aiPriceGuard.Shared.Common;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Data.Entity;
using aiPriceGuard.Api.Services.Interfaces;

namespace aiPriceGuard.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class SupplierController : ControllerBase
    {
        private readonly AMDbContext _dbContext;
        private readonly ISupplierService _supplierService;
        private readonly ISharedService _sharedService;

        public SupplierController(AMDbContext dbContext, ISupplierService _supplierService, ISharedService _sharedService)
        {
            _dbContext = dbContext;
            this._supplierService = _supplierService;
            this._sharedService = _sharedService;
        }
        [HttpGet("{comID}")]
        public IActionResult GetAllSuppliers(int comID)
        {
            try
            {
                var result = _supplierService.GetSupplierByCompanyId(comID);
                ResponsedGroupListVM vM = new ResponsedGroupListVM();
                vM.enttityDataSource = result;
                vM.entityModel = result?.GetEntity_MetaData();
                return Ok(vM);
              
            }
            catch (Exception ex)
            {
                return BadRequest(ex);

            }
        }
        [HttpPost]
        public async Task<IActionResult> UpsertSupplier([FromBody]Supplier supplier)
        {
         
            if(supplier.SupplierId != null)
            {   
                supplier =await _supplierService.UpdateSupplier(supplier);
            }
            else
            {
                try
                {
                    supplier=await _supplierService.AddSupplierAsync(supplier);
                }catch (Exception ex)
                {

                }           
            }
            return Ok(supplier);
        }
        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody] Supplier supplier)
        {
            if (supplier != null)
            {
                var msg = await _supplierService.RemoveSupplierAsync(supplier);
               if (String.IsNullOrEmpty(msg))
                {
                    return Ok(supplier);

                }
                else
                {
                    return BadRequest(msg);
                }
            }
            return BadRequest();
        }
    }
}
