using aiPriceGuard.DataAccess.DataSet;
using aiPriceGuard.Models.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using aiPriceGuard.Shared.Common;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Data.Entity;

namespace aiPriceGuard.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize]
    public class SupplierController : ControllerBase
    {
        private readonly AMDbContext _dbContext;
        public SupplierController(AMDbContext dbContext )
        {
            _dbContext = dbContext;
        }
        [HttpGet("{comID}")]
        public async Task<IActionResult> GetAllSuppliers(int comID)
        {
            try
            {
                var query = from Supplier in _dbContext.Supplier
                            join comSupplier in _dbContext.CompanySupplier
                            on Supplier.SupplierId equals comSupplier.SupplierId
                            where comSupplier.ComId == comID
                            select new Supplier
                            {
                                SupplierId = Supplier.SupplierId,
                                SupplierName = Supplier.SupplierName,
                                SupplierCode = Supplier.SupplierCode,
                                Address = Supplier.Address,
                                Suburb = Supplier.Suburb,
                                State = Supplier.State,
                                PostCode = Supplier.PostCode,
                                Phone = Supplier.Phone,
                                Fax = Supplier.Fax
                            };
                var result = query.ToList();
                ResponsedGroupListVM vM = new ResponsedGroupListVM();
                vM.enttityDataSource = result;
                vM.entityModel = result?.GetEntity_MetaData();
                return Ok(vM);

            }
            catch (Exception ex)
            {

            }
            return BadRequest();
        }
        [HttpPost]
        public async Task<IActionResult> UpsertSupplier([FromBody]Supplier supplier)
        {
         
            if(supplier.SupplierId != null)
            {
                var exEntry = await  _dbContext.Supplier.FindAsync(supplier.SupplierId);
                supplier.crtBy = exEntry.crtBy;
                supplier.crtDate =exEntry.crtDate;
                supplier.modDate = DateTime.Now;
                supplier.modBy = User.FindFirst(ClaimTypes.Email)?.Value;
                exEntry = null;
                _dbContext.Supplier.Update(supplier);

            }
            else
            {
                try
                {
                    supplier.crtDate = DateTime.Now;
                    supplier.crtBy = User.FindFirst(ClaimTypes.Email)?.Value;
                      
                    
                    await _dbContext.Supplier.AddAsync(supplier);
                    await _dbContext.SaveChangesAsync();

                    CompanySupplier comSupp = new CompanySupplier
                    {
                        ComId = supplier.comID,
                        SupplierId = supplier.SupplierId,
                        SupplierComReference = ""
                    };
                    await _dbContext.CompanySupplier.AddAsync(comSupp);
                }catch (Exception ex)
                {

                }
            
            }
            await _dbContext.SaveChangesAsync();

            return Ok(supplier);
        }
        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody] Supplier supplier)
        {
            if (supplier != null)
            {
                var suppdel = await _dbContext.Supplier.FindAsync(supplier.SupplierId);
                var comSupp =  _dbContext.CompanySupplier.FirstOrDefault(x=> x.SupplierId == supplier.SupplierId);
                if (suppdel != null && comSupp!=null)
                {
                    _dbContext.CompanySupplier.Remove(comSupp);
                    _dbContext.Supplier.Remove(supplier);
                    await _dbContext.SaveChangesAsync();
                    return Ok(supplier);
                }
                return BadRequest();
            }
            return BadRequest();
        }
    }
}
