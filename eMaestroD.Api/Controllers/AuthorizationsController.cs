using eMaestroD.Api.Common;
using eMaestroD.Api.Data;
using eMaestroD.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace eMaestroD.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("/api/[controller]/[action]")]
    public class AuthorizationsController : Controller
    {
        private readonly AMDbContext _AMDbContext;
        private readonly Context _Context;
        private readonly NotificationInterceptor _notificationInterceptor;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthorizationsController(AMDbContext aMDbContext, Context context, NotificationInterceptor notificationInterceptor, IHttpContextAccessor httpContextAccessor)
        {
            _AMDbContext = aMDbContext;
            _notificationInterceptor = notificationInterceptor;
            _Context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet]
        [Route("{userID}")]
        public async Task<IActionResult> getAuthorizeScreen(int userID)
        {
            var screenList = _AMDbContext.Screens.ToList();
            var list = _AMDbContext.Authorizations.Where(x => x.userID == userID).ToList();
            foreach (var item in screenList)
            {
                if (item.screenGrpID != 0)
                {
                    item.screenParentName = screenList.Find(x => x.screenID == item.screenGrpID).screenName;
                }
            }
            foreach (var item in list)
            {
                if (item.screenID != 0)
                {
                    item.screenName = screenList.Find(x => x.screenID == item.screenID).screenName;
                    item.screenGrpID = screenList.Find(x => x.screenID == item.screenID).screenGrpID;
                    item.screenGrpName = screenList.Find(x => x.screenID == item.screenID).screenParentName;

                }
            }
            return Ok(list.OrderBy(x => x.screenGrpID).GroupBy(x => x.screenGrpName));
        }


        [HttpGet]
        [Route("{roleID}")]
        public async Task<IActionResult> GetAuthorizationTemplate(int roleID)
        {
            var screenList = _Context.Screens.ToList();
            var list = _Context.AuthorizationsTemplate.Where(x => x.roleID == roleID).ToList();
            foreach (var item in screenList)
            {
                if (item.screenGrpID != 0)
                {
                    item.screenParentName = screenList.Find(x => x.screenID == item.screenGrpID).screenName;
                }
            }
            foreach (var item in list)
            {
                if (item.screenID != 0)
                {
                    item.screenName = screenList.Find(x => x.screenID == item.screenID).screenName;
                    item.screenGrpID = screenList.Find(x => x.screenID == item.screenID).screenGrpID;
                    item.screenGrpName = screenList.Find(x => x.screenID == item.screenID).screenParentName;

                }
            }
            return Ok(list.OrderBy(x => x.screenGrpID).GroupBy(x => x.screenGrpName));
        }

        [HttpPost]
        public async Task<IActionResult> SaveAuthorizationTemplate([FromBody] List<AuthorizationsTemplate> ath)
        {
            var list = _Context.AuthorizationsTemplate.Where(x => x.roleID == ath[0].roleID).ToList();
            _Context.RemoveRange(list);
            await _Context.SaveChangesAsync();

            foreach (var item in ath)
            {
                item.authTemplateID = 0;
            }
            await _Context.AuthorizationsTemplate.AddRangeAsync(ath);
            await _Context.SaveChangesAsync();

            return Ok(ath);

        }


        [HttpPost]
        public async Task<IActionResult> saveAuthorizaScreen([FromBody] List<Authorizations> ath)
        {
            var list = _AMDbContext.Authorizations.Where(x => x.userID == ath[0].userID).ToList();
            _AMDbContext.RemoveRange(list);
            await _AMDbContext.SaveChangesAsync();

            foreach (var item in ath)
            {
                item.authID = 0;
            }
            await _AMDbContext.Authorizations.AddRangeAsync(ath);
            await _AMDbContext.SaveChangesAsync();

            var comID = Request.Headers["comID"].ToString();
            _notificationInterceptor.SaveNotification("AuthorizationEdit", int.Parse(comID), "");
            return Ok(ath);

        }


        [HttpGet]
        [Route("{screenName}")]
        public async Task<IActionResult> checkPermission(string screenName)
        {
            var email = HttpContext.User.FindFirst(ClaimTypes.Email);
            if (email != null)
            {
                string userEmail = email.Value;
                // Now you have the user's email
                var userlist = await _AMDbContext.Users.Where(x => x.Email == userEmail).ToListAsync();
                if (userlist.Count > 0)
                {
                    if (screenName.Contains("Create"))
                    {
                        screenName = screenName.Split("Create")[0];
                        var userAuthorizations = _AMDbContext.Authorizations
                                 .Where(x => x.userID == userlist[0].UserID)
                                 .Join(
                                     _AMDbContext.Screens,
                                     auth => auth.screenID,
                                     screen => screen.screenID,
                                     (auth, screen) => new
                                     {
                                         Authorization = auth,
                                         Screen = screen
                                     }
                                 )
                                 .Where(joinResult => joinResult.Screen.path.ToLower() == screenName.ToLower() && joinResult.Authorization.Add == true)
                                 .ToList();
                        if (userAuthorizations.Count > 0)
                        {
                            return Ok(true);
                        }
                    }
                    else if (screenName.Contains("Edit"))
                    {
                        screenName = screenName.Split("Edit")[0];
                        var userAuthorizations = _AMDbContext.Authorizations
                                 .Where(x => x.userID == userlist[0].UserID)
                                 .Join(
                                     _AMDbContext.Screens,
                                     auth => auth.screenID,
                                     screen => screen.screenID,
                                     (auth, screen) => new
                                     {
                                         Authorization = auth,
                                         Screen = screen
                                     }
                                 )
                                 .Where(joinResult => joinResult.Screen.path.ToLower() == screenName.ToLower() && joinResult.Authorization.Edit == true)
                                 .ToList();
                        if (userAuthorizations.Count > 0)
                        {
                            return Ok(true);
                        }
                    }
                    else if (screenName.Contains("Delete"))
                    {
                        screenName = screenName.Split("Delete")[0];
                        var userAuthorizations = _AMDbContext.Authorizations
                                 .Where(x => x.userID == userlist[0].UserID)
                                 .Join(
                                     _AMDbContext.Screens,
                                     auth => auth.screenID,
                                     screen => screen.screenID,
                                     (auth, screen) => new
                                     {
                                         Authorization = auth,
                                         Screen = screen
                                     }
                                 )
                                 .Where(joinResult => joinResult.Screen.path.ToLower() == screenName.ToLower() && joinResult.Authorization.Delete == true)
                                 .ToList();
                        if (userAuthorizations.Count > 0)
                        {
                            return Ok(true);
                        }
                    }
                    else
                    {
                        var userAuthorizations = _AMDbContext.Authorizations
                                 .Where(x => x.userID == userlist[0].UserID)
                                 .Join(
                                     _AMDbContext.Screens,
                                     auth => auth.screenID,
                                     screen => screen.screenID,
                                     (auth, screen) => new
                                     {
                                         Authorization = auth,
                                         Screen = screen
                                     }
                                 )
                                 .Where(joinResult => joinResult.Screen.path.ToLower() == screenName.ToLower() && joinResult.Authorization.isShow == true)
                                 .ToList();
                        if (userAuthorizations.Count > 0)
                        {
                            return Ok(true);
                        }
                    }
                }
                return Ok(false);
            }
            else
            {
                return Ok(false);
            }
        }


        [HttpGet]
        [Route("{screenName}/{value}")]
        public async Task<IActionResult> UpdateBookmarkScreen(string screenName, bool value)
        {
            var email = HttpContext.User.FindFirst(ClaimTypes.Email);
            if (email != null)
            {
                string userEmail = email.Value;
                // Now you have the user's email
                var userlist = await _AMDbContext.Users.Where(x => x.Email == userEmail).ToListAsync();
                if (userlist.Count > 0)
                {
                    var screen = _AMDbContext.Screens.Where(x => x.path.ToLower() == screenName.ToLower()).FirstOrDefault();
                    if (screen != null)
                        if (value)
                        {
                            var checkList = _AMDbContext.Authorizations.Where(x => x.userID == userlist[0].UserID && x.Find == true).ToList();
                            if (checkList.Count > 4)
                            {
                                return BadRequest("You've reached the maximum of 5 bookmarks. To add more, please remove an existing one.");
                            }
                        }
                    var updatedAuthorizationItem = _AMDbContext.Authorizations.Where(x => x.screenID == screen.screenID && x.userID == userlist[0].UserID).FirstOrDefault();
                    {
                        if (updatedAuthorizationItem != null)
                        {
                            updatedAuthorizationItem.Find = value;
                            _AMDbContext.Authorizations.Update(updatedAuthorizationItem);
                            await _AMDbContext.SaveChangesAsync();

                            var userAuthorizations = _AMDbContext.Authorizations
                               .Where(x => x.userID == userlist[0].UserID)
                               .Join(
                                   _AMDbContext.Screens,
                                   auth => auth.screenID,
                                   screen => screen.screenID,
                                   (auth, screen) => new
                                   {
                                       Authorization = auth,
                                       Screens = screen
                                   }
                               )
                               .Where(joinResult => joinResult.Screens.screenID == screen.screenID)
                               .ToList();

                            return Ok(userAuthorizations);
                        }
                    }
                }
                return BadRequest("Something went wrong.");
            }
            else
            {
                return BadRequest("Something went wrong.");
            }
        }



        [HttpGet]
        [Route("{screenName}")]
        public async Task<IActionResult> GetBookmarkScreen(string screenName)
        {
            var email = HttpContext.User.FindFirst(ClaimTypes.Email);
            if (email != null)
            {
                string userEmail = email.Value;
                // Now you have the user's email
                var userlist = await _AMDbContext.Users.Where(x => x.Email == userEmail).ToListAsync();
                if (userlist.Count > 0)
                {
                    var userAuthorizations = _AMDbContext.Authorizations
                                .Where(x => x.userID == userlist[0].UserID)
                                .Join(
                                    _AMDbContext.Screens,
                                    auth => auth.screenID,
                                    screen => screen.screenID,
                                    (auth, screen) => new
                                    {
                                        Authorization = auth,
                                        Screen = screen
                                    }
                                )
                                .Where(joinResult => joinResult.Screen.path.ToLower() == screenName.ToLower() && joinResult.Authorization.Find == true)
                                .ToList();
                    if (userAuthorizations.Count > 0)
                    {
                        return Ok(true);
                    }

                }
                return Ok(false);
            }
            else
            {
                return Ok(false);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBookmarkScreen()
        {
            var email = HttpContext.User.FindFirst(ClaimTypes.Email);
            if (email != null)
            {
                string userEmail = email.Value;
                // Now you have the user's email
                var userlist = await _AMDbContext.Users.Where(x => x.Email == userEmail).ToListAsync();
                if (userlist.Count > 0)
                {
                    var userAuthorizations = _AMDbContext.Authorizations
                                  .Where(x => x.userID == userlist[0].UserID)
                                  .Join(
                                      _AMDbContext.Screens,
                                      auth => auth.screenID,
                                      screen => screen.screenID,
                                      (auth, screen) => new
                                      {
                                          Authorization = auth,
                                          Screens = screen
                                      }
                                  )
                                  .Where(joinResult => joinResult.Authorization.Find == true)
                                  .ToList();
                    if (userAuthorizations.Count > 0)
                    {
                        return Ok(userAuthorizations);
                    }
                }
                return Ok();
            }
            else
            {
                return BadRequest("Something went wrong.");
            }
        }

    }
}
