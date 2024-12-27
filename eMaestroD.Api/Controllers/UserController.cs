using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using Microsoft.Data.SqlClient;
using System;
using System.Security.Claims;
using System.Security.Principal;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using eMaestroD.Models.Models;
using eMaestroD.Api.Common;
using eMaestroD.Api.Data;
using eMaestroD.DataAccess.DataSet;
using eMaestroD.Models.VMModels;

namespace eMaestroD.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("/api/[controller]/[action]")]
    public class UserController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;

        private readonly AMDbContext _AMDbContext;
        private readonly Context _Context;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private IWebHostEnvironment Environment;
        private readonly NotificationInterceptor _notificationInterceptor;
        string username = "";
        //private readonly ConnectionStringService _connectionStringService;
        public UserController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager,
            AMDbContext aMDbContext, Context Context, IConfiguration configuration, IHttpContextAccessor httpContextAccessor,
            IEmailService emailService, IWebHostEnvironment _environment, NotificationInterceptor notificationInterceptor)
        {
            _AMDbContext = aMDbContext;
            //_connectionStringService = connectionStringService;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
            _emailService = emailService;
            Environment = _environment;
            _userManager = userManager;
            _signInManager = signInManager;
            _Context = Context;
            _notificationInterceptor = notificationInterceptor;
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
        public async Task<IActionResult> getAllUsers()
        {
            var usersWithDetails = await _AMDbContext.Set<UserDetailsViewModel>()
            .FromSqlRaw("EXEC GetAllUsersWithDetails")
            .ToListAsync();

            return Ok(usersWithDetails);
        }

        [HttpPost]
        public async Task<IActionResult> saveUserInMaster([FromBody] Users user)
        {
            var existEmail = await _userManager.FindByEmailAsync(user.Email);
            if ((user.UserID == null || existEmail == null) && user.isAllowLogin == true)
            {
                var tenantID = Decrypt(HttpContext.User.FindFirst(ClaimTypes.Upn).Value);
                if (existEmail == null)
                {
                    var tenlist = _Context.Tenants.Where(x => x.tenantID == int.Parse(tenantID)).ToList();
                    var userlist = _AMDbContext.Users.Where(x=>x.isAllowLogin == true).ToList();
                    if (tenlist[0].maxUserCount > userlist.Count())
                    {

                        var u = new IdentityUser
                        {
                            UserName = user.Email,
                            Email = user.Email,
                            //tenantID = int.Parse(tenantID)
                        };

                        // Create the user
                        var result = await _userManager.CreateAsync(u, user.password);

                        if (result.Succeeded)
                        {

                            var tenantUser = new TenantUser
                            {
                                tenantID = int.Parse(tenantID),
                                userID = u.Id,
                                email = user.Email,
                                isPrimary = true, // Assuming this user is the primary user for the tenant
                                ordinal = 1, // Assuming this is the first user
                                active = true,
                                created = DateTime.Now,
                                crtBy = user.FirstName + " " + user.LastName,
                                updated = DateTime.Now,
                                modBy = user.FirstName + " " + user.LastName
                            };

                            await _Context.TenantUsers.AddAsync(tenantUser);
                            await _Context.SaveChangesAsync();

                            return Ok(user);
                        }

                        return BadRequest(result.Errors.ToList()[0].Description);
                    }
                    return NotFound("User limit reached. No new users can be added.");
                }
                else if(existEmail.Email.ToLower() == user.Email.ToLower())
                {
                    var tenantUser = new TenantUser
                    {
                        tenantID = int.Parse(tenantID),
                        userID = existEmail.Id,
                        email = user.Email,
                        isPrimary = false, // Assuming this user is the primary user for the tenant
                        ordinal = 1, // Assuming this is the first user
                        active = true,
                        created = DateTime.Now,
                        crtBy = user.FirstName + " " + user.LastName,
                        updated = DateTime.Now,
                        modBy = user.FirstName + " " + user.LastName
                    };

                    await _Context.TenantUsers.AddAsync(tenantUser);
                    await _Context.SaveChangesAsync();
                    
                    return Ok(user);
                }
                return NotFound("Try Again, Something went wrong.");
            }
            return Ok(user);
        }


        [HttpPost]
        public async Task<IActionResult> saveUser([FromBody] List<Users> user)
        {
            if (user[0].UserID == null)
            {
                user[0].crtBy = username;
                user[0].Created = DateTime.Now;
                user[0].modBy = username;
                user[0].Updated = DateTime.Now;
                await _AMDbContext.Users.AddAsync(user[0]);
                await _AMDbContext.SaveChangesAsync();
                List<UserCompanies> uc = new List<UserCompanies>();
                foreach (var item in user)
                {
                    uc.Add(new UserCompanies
                    {
                        ComID = item.ComID,
                        UserID = user[0].UserID,
                    });

                }
                await _AMDbContext.UserCompanies.AddRangeAsync(uc);
                await _AMDbContext.SaveChangesAsync();

                UserLocation ul = new UserLocation()
                {
                    userID = (int)user[0].UserID,
                    locID = (int)user[0].locID
                };
                await _AMDbContext.UserLocations.AddAsync(ul);
                await _AMDbContext.SaveChangesAsync();

                var AuthList = _Context.AuthorizationsTemplate.Where(x => x.roleID == user[0].RoleID).ToList();
                List<Authorizations> authorizations = new List<Authorizations>();
                foreach (var item in AuthList)
                {
                    authorizations.Add(new Authorizations
                    {
                        userID = user[0].UserID,
                        screenID = item.screenID,
                        Add = item.Add,
                        Edit = item.Edit,
                        Delete = item.Delete,
                        isShow = item.isShow,
                        Print = item.Print,
                        Find = item.Find
                    });
                }
                await _AMDbContext.Authorizations.AddRangeAsync(authorizations);
                await _AMDbContext.SaveChangesAsync();

                _notificationInterceptor.SaveNotification("UsersCreate", user[0].ComID, "");
            }
            else
            {
                user[0].modBy = username;
                user[0].Updated = DateTime.Now;
                _AMDbContext.Users.Update(user[0]);
                _AMDbContext.RemoveRange(_AMDbContext.UserCompanies.Where(x => x.UserID == user[0].UserID));
                await _AMDbContext.SaveChangesAsync();
                List<UserCompanies> uc = new List<UserCompanies>();
                foreach (var item in user)
                {
                    if (item.ComID != null)
                    {
                        uc.Add(new UserCompanies
                        {
                            ComID = item.ComID,
                            UserID = user[0].UserID,
                        });
                    }
                }
                await _AMDbContext.UserCompanies.AddRangeAsync(uc);
                await _AMDbContext.SaveChangesAsync();

                var userLocationList = await _AMDbContext.UserLocations.FirstOrDefaultAsync(x => x.userID == user[0].UserID);
                UserLocation ul = new UserLocation()
                {
                    userLocID = userLocationList == null ? 0 : userLocationList.userLocID, 
                    userID = (int)user[0].UserID,
                    locID = (int)user[0].locID
                };
                _AMDbContext.UserLocations.Update(ul);
                await _AMDbContext.SaveChangesAsync();

                _notificationInterceptor.SaveNotification("UsersEdit", user[0].ComID, "");
            }
           
            var loc = await _AMDbContext.Locations.FirstOrDefaultAsync(x => x.LocationId == user[0].locID);
            user[0].locations = loc.LocationName;
            return Ok(user[0]);

        }



        [HttpDelete]
        [Route("{userID}")]
        public async Task<IActionResult> deleteUser(int userID)
        {
            var user = _AMDbContext.Users.Where(x => x.UserID == userID).ToList();
            var email = HttpContext.User.FindFirst(ClaimTypes.Email);
            if (email.Value != user[0].Email)
            {
                if (user.FirstOrDefault().isAllowLogin == true)
                {

                    var u = await _userManager.FindByEmailAsync(user[0].Email);
                    var result = await _userManager.DeleteAsync(u);
                    if (result.Succeeded)
                    {
                        _AMDbContext.RemoveRange(_AMDbContext.Users.Where(x => x.UserID == userID));
                        _AMDbContext.RemoveRange(_AMDbContext.UserCompanies.Where(x => x.UserID == userID));
                        _AMDbContext.RemoveRange(_AMDbContext.UserLocations.Where(x => x.userID == userID));
                        _AMDbContext.RemoveRange(_AMDbContext.Authorizations.Where(x => x.userID == userID));
                        await _AMDbContext.SaveChangesAsync();

                        _notificationInterceptor.SaveNotification("UsersDelete", user[0].ComID, "");
                        return Ok();
                    }
                }
                else
                {

                    _AMDbContext.RemoveRange(_AMDbContext.Users.Where(x => x.UserID == userID));
                    _AMDbContext.RemoveRange(_AMDbContext.UserCompanies.Where(x => x.UserID == userID));
                    _AMDbContext.RemoveRange(_AMDbContext.UserLocations.Where(x => x.userID == userID));
                    _AMDbContext.RemoveRange(_AMDbContext.Authorizations.Where(x => x.userID == userID));
                    await _AMDbContext.SaveChangesAsync();

                    _notificationInterceptor.SaveNotification("UsersDelete", user[0].ComID, "");
                    return Ok();
                }
            }
            else
            {
                return NotFound("You can't Delete yourself.");
            }
            return NotFound("Something Went Wrong...");

        }


        [HttpPost]
        public async Task<IActionResult> ResetPassword([FromBody] Users user)
        {
            var u = await _userManager.FindByEmailAsync(user.Email);
            var code = await _userManager.GeneratePasswordResetTokenAsync(u);
            var result = await _userManager.ResetPasswordAsync(u, code, user.password);
            if (result.Succeeded)
            {
                return Ok(user);
            }
            return BadRequest(result.Errors.ToList()[0].Description);
        }

        [HttpPost]
        public async Task<IActionResult> ChangePassword([FromBody] Users user)
        {
            var userEmail = HttpContext.User.FindFirst(ClaimTypes.Email).Value;
            var u = await _userManager.FindByEmailAsync(userEmail);
            var result = await _signInManager.CheckPasswordSignInAsync(u, user.modBy, false);

            if (result.Succeeded)
            {
                var code = await _userManager.GeneratePasswordResetTokenAsync(u);
                var result1 = await _userManager.ResetPasswordAsync(u, code, user.password);
                if (result1.Succeeded)
                {
                    return Ok(user);
                }
                return BadRequest(result1.Errors.ToList()[0].Description);
            }
            return BadRequest("Old Password is Incorrect");
        }


        private string Decrypt(string cipherText)
        {
            string encryptionKey = "MAKV2SPBNI99212";
            byte[] cipherBytes = Convert.FromBase64String(cipherText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(encryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(cipherBytes, 0, cipherBytes.Length);
                        cs.Close();
                    }
                    cipherText = Encoding.Unicode.GetString(ms.ToArray());
                }
            }

            return cipherText;
        }
    }
}