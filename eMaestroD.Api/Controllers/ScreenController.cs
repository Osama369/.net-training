using eMaestroD.Api.Data;
using eMaestroD.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace eMaestroD.Api.Controllers
{

    [ApiController]
    [Route("/api/[controller]")]
    public class ScreenController : Controller
    {

        private readonly AMDbContext _AMDbContext;
        public ScreenController(AMDbContext aMDbContext)
        {
            _AMDbContext = aMDbContext;
        }



        [HttpGet]
        public async Task<IActionResult> getAllScreen()
        {


            var list = _AMDbContext.Screens.ToList();
            foreach (var item in list)
            {
                if (item.screenGrpID != 0)
                {
                    item.screenParentName = list.Find(x => x.screenID == item.screenGrpID).screenName;
                }
            }
            return Ok(list.OrderBy(x => x.screenGrpID));
        }


        [HttpPost]
        public async Task<IActionResult> saveScreen([FromBody] Screens screen)
        {
            if (screen.screenID == 0)
            {
                await _AMDbContext.Screens.AddAsync(screen);
                await _AMDbContext.SaveChangesAsync();

                var userlist = _AMDbContext.Users.ToList();
                List<Authorizations> authorizations = new List<Authorizations>();
                foreach (var item in userlist)
                {
                    authorizations.Add(new Authorizations
                    {
                        userID = item.UserID,
                        screenID = screen.screenID,
                        Add = false,
                        Edit = false,
                        Delete = false,
                        isShow = false,
                        Print = false,
                        Find = false
                    });
                }
                await _AMDbContext.Authorizations.AddRangeAsync(authorizations);
                await _AMDbContext.SaveChangesAsync();
            }
            else
            {
                _AMDbContext.Screens.Update(screen);
                await _AMDbContext.SaveChangesAsync();
            }

            return Ok(screen);

        }


    }
}
