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
                              vendID = cse.vendID,
                              vendName = (from vnd in _AMDbContext.Vendors
                                          where vnd.vendID == cse.vendID
                                          select vnd.vendName).FirstOrDefault(),
                              Active = cse.Active,
                              CSECustomer = (from cust in _AMDbContext.CSECustomer
                                           join customerInfo in _AMDbContext.Customers 
                                           on cust.CstID equals customerInfo.cstID
                                            join locationInfo in _AMDbContext.Locations
                                            on cust.locationId equals locationInfo.LocationId
                                             where cust.CSEID == cse.CSEID
                                           select new CSECustomer
                                           {
                                               CSECustomerID = cust.CSECustomerID,
                                               CstID = cust.CstID,
                                               CustomerName = customerInfo.cstName,
                                               LocationName = locationInfo.LocationName,
                                               Active = cust.Active
                                           }).ToList()
                          }).ToList();


            ResponsedGroupListVM vM = new ResponsedGroupListVM();
            vM.enttityDataSource = result;
            vM.entityModel = result?.GetEntity_MetaData();

            return Ok(vM);

        }

        [HttpPost]
        public async Task<IActionResult> Upsert(CompanyCSE model)
        {
            using (var transaction = _AMDbContext.Database.BeginTransaction())
            {
                try
                {
                    // Upsert CompanyCSE
                    var existingCSE = _AMDbContext.CompanyCSE.FirstOrDefault(c => c.CSEID == model.CSEID);
                    if (existingCSE == null)
                    {
                        _AMDbContext.CompanyCSE.Add(model);
                    }
                    else
                    {
                        existingCSE.CompID = model.CompID;
                        existingCSE.RepName = model.RepName;
                        existingCSE.Address1 = model.Address1;
                        existingCSE.email = model.email;
                        existingCSE.Cell = model.Cell;
                        existingCSE.vendID = model.vendID; // Assuming vendID comes from the model
                        existingCSE.Active = model.Active;
                        _AMDbContext.CompanyCSE.Update(existingCSE);
                    }
                    await _AMDbContext.SaveChangesAsync();


                    // Upsert CSECustomer
                    var existingCustomers = _AMDbContext.CSECustomer.Where(c => c.CSEID == model.CSEID).ToList();
                    _AMDbContext.CSECustomer.RemoveRange(existingCustomers);
                    await _AMDbContext.SaveChangesAsync();

                    if (model.CSECustomer != null)
                    {
                        foreach (var customer in model.CSECustomer)
                        {
                            customer.CSECustomerID = null;
                            customer.CSEID = existingCSE?.CSEID ?? model.CSEID; // Use existing or new ID
                            _AMDbContext.CSECustomer.Add(customer);
                        }
                    }


                    await _AMDbContext.SaveChangesAsync();

                    transaction.Commit();

                    return Ok(model);
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return BadRequest(ex.Message);
                }
            }
        }

        [HttpDelete]
        [Route("{cseID}")]
        public IActionResult Delete(int cseID)
        {
            using (var transaction = _AMDbContext.Database.BeginTransaction())
            {
                try
                {
                    var customers = _AMDbContext.CSECustomer.Where(c => c.CSEID == cseID).ToList();
                    _AMDbContext.CSECustomer.RemoveRange(customers);
                  
                    var companyCSE = _AMDbContext.CompanyCSE.FirstOrDefault(c => c.CSEID == cseID);
                    if (companyCSE != null)
                    {
                        _AMDbContext.CompanyCSE.Remove(companyCSE);
                    }

                    _AMDbContext.SaveChanges();
                    transaction.Commit();

                    return Ok(new { success = true, message = "Data deleted successfully." });
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return BadRequest(new { success = false, message = ex.Message });
                }
            }
        }
    }
}
