using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.SqlServer;
using Microsoft.AspNetCore;
using aiPriceGuard.DataAccess.DataSet;
using aiPriceGuard.Models.Models;
using System.Data.Entity;


namespace aiPriceGuard.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoreController : ControllerBase
    {
      private readonly AMDbContext _dbcontext;
        public StoreController(AMDbContext dbContext) { 
           _dbcontext = dbContext;

        }

        [HttpGet]
        public async Task<IActionResult> GetAllStores()
        {
            var storesList = await _dbcontext.Stores.ToListAsync();
            return Ok(storesList);
        }


        [HttpGet]
        public async Task<IActionResult> SaveStore([FromBody] Store objStore)
        {
            if (objStore!=null) {
                var existingObj = await _dbcontext.Stores.AnyAsync(x=>x.StoreName==objStore.StoreName);
                if (!existingObj)
                {
                    await _dbcontext.Stores.AddAsync(objStore);
                    await _dbcontext.SaveChangesAsync();
                }
                else {
                    return BadRequest("Store Name is Duplicate");
                }
            }

            var storesList = await _dbcontext.Stores.ToListAsync();
            return Ok(storesList);
        }
    }
}
