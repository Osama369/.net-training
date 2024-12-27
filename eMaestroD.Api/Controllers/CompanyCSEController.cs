using eMaestroD.Api.Common;
using eMaestroD.DataAccess.DataSet;
using eMaestroD.Models.Models;
using eMaestroD.Shared.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace eMaestroD.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("/api/[controller]")]
    public class CompanyCSEController : Controller
    {
        private readonly AMDbContext _AMDbContext;
        private IWebHostEnvironment Environment;
        private readonly IConfiguration _configuration;
        private readonly NotificationInterceptor _notificationInterceptor;
        private CustomMethod cm = new CustomMethod();
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly HelperMethods _helperMethods;
        string username = "";
        public CompanyCSEController(IConfiguration configuration, AMDbContext aMDbContext, IWebHostEnvironment _environment, NotificationInterceptor notificationInterceptor, IHttpContextAccessor httpContextAccessor, HelperMethods helperMethods)
        {
            _AMDbContext = aMDbContext;
            Environment = _environment;
            _configuration = configuration;
            _notificationInterceptor = notificationInterceptor;
            _httpContextAccessor = httpContextAccessor;
            _helperMethods = helperMethods;
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
        public IActionResult GetAll(int comID)
        {
            var result = (from cse in _AMDbContext.CompanyCSE
                          where cse.CompID == comID
                          select new CompanyCSE
                          {
                              CSEID = cse.CSEID,
                              CompID = cse.CompID,
                              RepName = cse.RepName,
                              Address1 = cse.Address1,
                              email = cse.email,
                              Cell = cse.Cell,
                              vendName = (from vnd in _AMDbContext.Vendors
                                          where vnd.vendID == cse.vendID
                                          select vnd.vendName).FirstOrDefault(),
                              Active = cse.Active,
                              CSECustomer = (from cust in _AMDbContext.CSECustomer
                                           join customerInfo in _AMDbContext.Customers 
                                           on cust.CstID equals customerInfo.cstID
                                           where cust.CSEID == cse.CSEID
                                           select new CSECustomer
                                           {
                                               CSECustomerID = cust.CSECustomerID,
                                               CstID = cust.CstID,
                                               CustomerName = customerInfo.cstName,
                                               Active = cust.Active
                                           }).ToList(),
                              MseMapArea = (from map in _AMDbContext.MseMapArea
                                       join locationInfo in _AMDbContext.Locations 
                                       on map.AreaID equals locationInfo.LocationId
                                       where map.mseID == cse.CSEID
                                       select new MseMapArea
                                       {
                                           MseMapID = map.MseMapID,
                                           AreaID = map.AreaID,
                                           LocationName = locationInfo.LocationName, 
                                           Active = map.Active
                                       }).ToList()
                          }).ToList();


            ResponsedGroupListVM vM = new ResponsedGroupListVM();
            vM.enttityDataSource = result;
            vM.entityModel = result?.GetEntity_MetaData();

            return Ok(vM);

        }

    }
}
