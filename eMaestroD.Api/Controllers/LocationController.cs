using eMaestroD.Api.Common;
using eMaestroD.Api.Data;
using eMaestroD.Models.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using eMaestroD.DataAccess.DataSet;

namespace eMaestroD.Api.Controllers
{

    [ApiController]
    [Authorize]
    [Route("/api/[controller]")]
    public class LocationController : Controller
    {
        private readonly AMDbContext _AMDbContext;
        private readonly NotificationInterceptor _notificationInterceptor;
        private readonly Context _Context;
        private CustomMethod cm = new CustomMethod();
        private readonly IHttpContextAccessor _httpContextAccessor;
        string username = "";
        public LocationController(AMDbContext aMDbContext, Context Context, NotificationInterceptor notificationInterceptor, IHttpContextAccessor httpContextAccessor)
        {
            _AMDbContext = aMDbContext;
            _notificationInterceptor = notificationInterceptor;
            _Context = Context;
            _httpContextAccessor = httpContextAccessor;
            username = GetUsername();
        }

        [NonAction]
        public string GetUsername()
        {
            var email = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email);
            var user = _AMDbContext.Users.Where(x => x.Email == email).FirstOrDefault();
            return user.FirstName + " " + user.LastName;
        }

        [HttpGet]
        [Route("{comID}")]
        public async Task<IActionResult> GetAllLocation(int comID)
        {
            var loc = await _AMDbContext.Locations.Where(x => x.comID == comID).ToListAsync();

            return Ok(loc);
        }

        [HttpPost]
        public async Task<IActionResult> saveLocation([FromBody] Locations loc)
        {
            if (loc.LocationId != 0)
            {
                loc.modBy = username;
                loc.modDate = DateTime.Now;
                _AMDbContext.Locations.Update(loc);
                await _AMDbContext.SaveChangesAsync();

                _notificationInterceptor.SaveNotification("LocationEdit", loc.comID, "");
            }
            else
            {
                var tenantID = cm.Decrypt(HttpContext.User.FindFirst(ClaimTypes.Upn).Value);
                var tenlist = _Context.Tenants.Where(x => x.tenantID == int.Parse(tenantID)).ToList();
                var locList = _AMDbContext.Locations.Where(x => x.comID == loc.comID && x.LocTypeId == 5).ToList();
                if (tenlist[0].maxLocationCount > locList.Count())
                {

                    loc.crtBy = username;
                    loc.crtDate = DateTime.Now;
                    loc.modBy = username;
                    loc.modDate = DateTime.Now;

                    await _AMDbContext.Locations.AddAsync(loc);
                    await _AMDbContext.SaveChangesAsync();

                    _notificationInterceptor.SaveNotification("LocationCreate", loc.comID, "");
                }
                else
                {
                    return NotFound("Location limit reached. No new location can be added.");
                }
            }
            return Ok(loc);
        }




        [HttpDelete]
        [Route("{locID}")]
        public async Task<IActionResult> DeleteLocation(int locID)
        {
            var exist = _AMDbContext.gl.Where(x => x.locID == locID).ToList();
            if (exist.Count > 0)
            {
                return NotFound("Some invoices depend on this location, can't delete this location.");
            }
            var list = _AMDbContext.Locations.Where(x => x.LocationId == locID).ToList();
            if (_AMDbContext.Locations.Where(x => x.comID == list[0].comID).Count() == 1)
            {
                return NotFound("Can't Delete Only One Location");
            }
            else
            {
                _AMDbContext.RemoveRange(_AMDbContext.Locations.Where(a => a.LocationId == locID));
                await _AMDbContext.SaveChangesAsync();
                _notificationInterceptor.SaveNotification("LocationDelete", list[0].comID, "");
                return Ok();
            }
        }


    }
}
