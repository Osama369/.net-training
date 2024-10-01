using eMaestroD.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using eMaestroD.DataAccess.DataSet;

namespace eMaestroD.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("/api/[controller]/[action]")]
    public abstract class BaseController : Controller
    {
        protected readonly AMDbContext _dbContext;
        protected readonly IHttpContextAccessor _httpContextAccessor;
        protected string ActiveUser { get; private set; }

        public BaseController(AMDbContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _dbContext = dbContext;
            _httpContextAccessor = httpContextAccessor;
            ActiveUser = GetUsername();
        }

        private string GetUsername()
        {
            var email = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email);
            var user = _dbContext.Users.FirstOrDefault(x => x.Email == email);
            return user?.FirstName + " " + user?.LastName;
        }
    }
}
