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
            var loc = await _AMDbContext.Locations.ToListAsync();

            return Ok(loc);
        }

        [HttpPost]
        public async Task<IActionResult> saveLocation([FromBody] Locations loc)
        {
            var locList = _AMDbContext.Locations.ToList();
            if (loc.LocationId != 0)
            {
                var existingloc = locList.Find(x => x.LocationName?.ToLower() == loc.LocationName?.ToLower() && x.LocationId!=loc.LocationId);
            
                if (existingloc == null)
                {

                    loc.modBy = username;
                    loc.modDate = DateTime.Now;
                    _AMDbContext.Locations.Update(loc);
                    await _AMDbContext.SaveChangesAsync();
                }
                else {
                    return NotFound("Location Already Exist!.");
                }

                _notificationInterceptor.SaveNotification("LocationEdit", loc.comID, "");
            }
            else
            {
                var tenantID = cm.Decrypt(HttpContext.User.FindFirst(ClaimTypes.Upn).Value);
                var tenlist = _Context.Tenants.Where(x => x.tenantID == int.Parse(tenantID)).ToList();
                //var locList = _AMDbContext.Locations.Where(x => x.LocTypeId == 5).ToList();
              
                var existingloc = locList.Find(x => x.LocationName?.ToLower() == loc.LocationName?.ToLower());
           
                //if (tenlist[0].maxLocationCount > locList.Count())
                if (existingloc==null)
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
                    //return NotFound("Location limit reached. No new location can be added.");
                    return NotFound("Location Already Exist!.");
                }
            }
            return Ok(loc);
        }

        [HttpPost("ReplaceParentLoc")]
        //public async Task<IActionResult> ReplaceParentLoc([FromBody] Locations obj)
        public async Task<IActionResult> ReplaceParentLoc([FromBody] Locations obj)
        {
            try
            {
                var locList = _AMDbContext.Locations.ToList();
                var getProvince = locList.Find(x => x.LocationId == obj.LocationId);
                var getRegion = locList.Find(x => x.LocationId == obj.ParentLocationId);
                if (getProvince==null) {
                    return NotFound("Province Not Found");
                }
                if (getRegion==null) {
                    return NotFound("Region Not Found");
                }
                getProvince.ParentLocationId = obj.ParentLocationId;
                _AMDbContext.Update(getProvince);
                await _AMDbContext.SaveChangesAsync();

                return Ok(getProvince);

            }
            catch (Exception ex )
            {

                throw;
            }
        
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
            if (_AMDbContext.Locations.Count() == 1)
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
