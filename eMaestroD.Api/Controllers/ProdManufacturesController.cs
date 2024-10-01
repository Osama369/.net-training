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
    public class ProdManufacturesController : Controller
    {
        private readonly AMDbContext _AMDbContext;

        public ProdManufacturesController(AMDbContext aMDbContext)
        {
            _AMDbContext = aMDbContext;
        }

        // GET: api/ProdManufactures?comID=1
        [HttpGet]
        public async Task<ActionResult> GetProdManufactures(int comID)
        {
            var prodManufactures = await _AMDbContext.ProdManufactures
                .Where(pm => pm.comID == comID)
                .ToListAsync();

            var response = new ResponsedGroupListVM
            {
                enttityDataSource = prodManufactures,
                entityModel = prodManufactures?.GetEntity_MetaData()
            };
            return Ok(response);
        }

        // POST: api/ProdManufactures
        // This method handles both Insert and Update
        [HttpPost]
        public async Task<IActionResult> UpsertProdManufacture(ProdManufacture prodManufacture)
        {
            if (prodManufacture.prodManuID == 0)
            {
                _AMDbContext.ProdManufactures.Add(prodManufacture);
            }
            else
            {
                _AMDbContext.Entry(prodManufacture).State = EntityState.Modified;
            }

            try
            {
                await _AMDbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }

            return Ok(prodManufacture);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProdManufacture(int id)
        {
            var prodManufacture = await _AMDbContext.ProdManufactures.FindAsync(id);
            if (prodManufacture == null)
            {
                return NotFound();
            }

            _AMDbContext.ProdManufactures.Remove(prodManufacture);
            await _AMDbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}
