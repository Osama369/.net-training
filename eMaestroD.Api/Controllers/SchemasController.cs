using eMaestroD.Api.Common;
using eMaestroD.Api.Data;
using eMaestroD.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using eMaestroD.DataAccess.DataSet;
using eMaestroD.Shared.Common;

namespace eMaestroD.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("/api/[controller]")]
    public class SchemasController : Controller
    {
        private readonly AMDbContext _AMDbContext;

        public SchemasController(AMDbContext aMDbContext)
        {
            _AMDbContext = aMDbContext;
        }

        // GET: api/ProdDiscounts
        [HttpGet("{comID}")]
        public async Task<IActionResult> GetAllProdDiscounts(int comID)
        {
            var prodDiscounts = await _AMDbContext.ProdDiscounts.Where(x=>x.comID == comID).ToListAsync();
            var response = new ResponsedGroupListVM
            {
                enttityDataSource = prodDiscounts,
                entityModel = prodDiscounts?.GetEntity_MetaData()
            };
            return Ok(response);
        }

        // POST: api/ProdDiscounts/upsert
        [HttpPost("SaveProdDiscount")]
        public async Task<IActionResult> SaveProdDiscount([FromBody] List<ProdDiscount> prodDiscount)
        {
            
            try
            {
                _AMDbContext.ProdDiscounts.AddRange(prodDiscount);
                await _AMDbContext.SaveChangesAsync();
                return Ok(prodDiscount);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/ProdDiscounts/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProdDiscount(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid ID.");
            }

            try
            {
                var prodDiscount = await _AMDbContext.ProdDiscounts.FindAsync(id);

                if (prodDiscount == null)
                {
                    return NotFound($"ProdDiscount with ID {id} not found.");
                }

                _AMDbContext.ProdDiscounts.Remove(prodDiscount);
                await _AMDbContext.SaveChangesAsync();
                return Ok($"ProdDiscount with ID {id} deleted.");
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
