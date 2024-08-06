using eMaestroD.Api.Common;
using eMaestroD.Api.Data;
using eMaestroD.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.Api.Controllers
{
    [ApiController]
    [Route("/api/[controller]/[Action]")]
    public class CompanyController : Controller
    {
        private readonly AMDbContext _AMDbContext;
        private readonly Context _Context;
        private IWebHostEnvironment Environment;
        private readonly IConfiguration _configuration;
        private readonly NotificationInterceptor _notificationInterceptor;
        private CustomMethod cm = new CustomMethod();
        private readonly IHttpContextAccessor _httpContextAccessor;
        string username = "";
        public CompanyController(IConfiguration configuration, AMDbContext aMDbContext, Context Context, IWebHostEnvironment _environment, NotificationInterceptor notificationInterceptor, IHttpContextAccessor httpContextAccessor)
        {
            _AMDbContext = aMDbContext;
            _Context = Context;
            Environment = _environment;
            _configuration = configuration;
            _notificationInterceptor = notificationInterceptor;
            _httpContextAccessor = httpContextAccessor;
            username = GetUsername();
        }


        [HttpGet, Authorize]
        [Route("{comID}")]
        public async Task<IActionResult> getOneCompanyDetail(int comID)
        {
            var confg = await _AMDbContext.Companies.Where(x => x.comID == comID).ToListAsync();
            if (confg.Count > 0)
            {
                if (confg[0].CurrencyCode != null)
                {
                    var currlist = _AMDbContext.Currency.Where(x => x.CurrencyCode == confg[0].CurrencyCode).ToList()[0];
                    confg[0].CurrencyName = currlist.Name;
                }

                if (confg[0].timeZoneID != null)
                {
                    var timeZonelist = _AMDbContext.TimeZone.Where(x => x.timeZoneID == confg[0].timeZoneID).FirstOrDefault();
                    confg[0].timeZone = timeZonelist.timeZone + " (" + timeZonelist.current_utc_offset + ") (" + timeZonelist.abbreviation + ")";
                }
                else
                {
                    confg[0].timeZone = "Universal Time (+00:00) (UTC)";
                }
            }
            return Ok(confg);
        }

        [HttpGet, Authorize]
        public async Task<IActionResult> getCompanyList()
        {
            var email = HttpContext.User.FindFirst(ClaimTypes.Email);
            if (email != null)
            {
                string userEmail = email.Value;
                // Now you have the user's email
                var userlist = await _AMDbContext.Users.Where(x => x.Email == userEmail).ToListAsync();
                if (userlist.Count > 0)
                {
                    var userCompList = await _AMDbContext.UserCompanies.Where(x => x.UserID == userlist[0].UserID).ToListAsync();

                    var companyList = new List<Companies>();
                    foreach (var item in userCompList)
                    {
                        companyList.Add(_AMDbContext.Companies.Where(x => x.comID == item.ComID).FirstOrDefault());
                    }

                    foreach (var item in companyList)
                    {
                        if (item.timeZoneID != null)
                        {
                            var timeZonelist = _AMDbContext.TimeZone.Where(x => x.timeZoneID == item.timeZoneID).FirstOrDefault();
                            item.timeZone = timeZonelist.timeZone + " (" + timeZonelist.current_utc_offset + ") (" + timeZonelist.abbreviation + ")";
                        }
                        else
                        {
                            item.timeZone = "Universal Time (+00:00) (UTC)";
                        }
                    }

                    return Ok(companyList);
                }
                return NotFound("Something Went Wrong...");

            }
            else
            {
                return NotFound("Something Went Wrong...");
            }
        }


        [HttpGet, Authorize]
        public async Task<IActionResult> getAllCurrency()
        {
            var confg = await _AMDbContext.Currency.ToListAsync();
            return Ok(confg);
        }

        [HttpPost, Authorize]
        public async Task<IActionResult> saveCompanyDetail([FromBody] Companies company)
        {
            try
            {

                if (company.comID != 0)
                {
                    company.modBy = username;
                    company.modDate = DateTime.Now;
                    _AMDbContext.Companies.Update(company);
                    await _AMDbContext.SaveChangesAsync();

                    _notificationInterceptor.SaveNotification("CompanySettingEdit", company.comID, "");
                    return Ok(company);

                }
                else
                {
                    var tenantID = cm.Decrypt(HttpContext.User.FindFirst(ClaimTypes.Upn).Value);
                    var tenlist = _Context.Tenants.Where(x => x.tenantID == int.Parse(tenantID)).ToList();
                    var comlist = _AMDbContext.Companies.ToList();


                    if (tenlist[0].maxCompaniesCount > comlist.Count())
                    {
                        if (comlist.Where(x => x.companyName.Trim().ToLower() == company.companyName.Trim().ToLower()).ToList().Count() == 0)
                        {

                            var email = HttpContext.User.FindFirst(ClaimTypes.Email);
                            if (email != null)
                            {
                                string userEmail = email.Value;
                                var userlist = await _AMDbContext.Users.Where(x => x.Email == userEmail).ToListAsync();

                                var oldCompany = _AMDbContext.Companies.FirstOrDefault();
                                var superAdminUser = await _AMDbContext.Users.Where(x => x.Email == oldCompany.email).ToListAsync();

                                company.email = oldCompany.email;
                                company.owner = oldCompany.owner;
                                company.address = oldCompany.address;
                                company.country = oldCompany.country;
                                company.CurrencyCode = oldCompany.CurrencyCode;
                                company.contactNo = oldCompany.contactNo;
                                company.theme = oldCompany.theme;
                                company.language = oldCompany.language;
                                company.crtBy = username;
                                company.crtDate = DateTime.Now;
                                company.modBy = username;
                                company.modDate = DateTime.Now;
                                company.crtBy = oldCompany.language;
                                company.modBy = oldCompany.language;
                                company.timeZoneID = oldCompany.timeZoneID;
                                company.isMultiPayment = false;
                                _AMDbContext.Companies.Add(company);
                                await _AMDbContext.SaveChangesAsync();

                                if (userlist[0].UserID != superAdminUser[0].UserID)
                                {
                                    UserCompanies uc1 = new UserCompanies()
                                    {
                                        ComID = company.comID,
                                        UserID = superAdminUser[0].UserID,
                                    };

                                    _AMDbContext.UserCompanies.Add(uc1);
                                }

                                UserCompanies uc = new UserCompanies()
                                {
                                    ComID = company.comID,
                                    UserID = userlist[0].UserID,
                                };

                                _AMDbContext.UserCompanies.Add(uc);

                                Locations locations = new Locations()
                                {
                                    locTypeID = 1,
                                    locName = "Default",
                                    comID = company.comID,
                                    locCode = "1",
                                    active = true,
                                    crtBy = username,
                                    crtDate = DateTime.Now,
                                    modBy = username,
                                    modDate = DateTime.Now,
                                };
                                _AMDbContext.Locations.Add(locations);


                                Vendors vendor = new Vendors()
                                {
                                    vendName = "OPENING STOCK",
                                    vendCode = "1",
                                    active = true,
                                    comID = company.comID,
                                    crtBy = username,
                                    crtDate = DateTime.Now,
                                    modby = username,
                                    modDate = DateTime.Now,
                                };
                                _AMDbContext.Vendors.Add(vendor);


                                Customer cst = new Customer()
                                {
                                    cstName = "WALK IN",
                                    cstCode = "1",
                                    active = true,
                                    comID = company.comID,
                                    crtBy = username,
                                    crtDate = DateTime.Now,
                                    modby = username,
                                    modDate = DateTime.Now,

                                };
                                _AMDbContext.Customers.Add(cst);

                                await _AMDbContext.SaveChangesAsync();


                                FiscalYear FY = new FiscalYear()
                                {
                                    dtStart = new DateTime(DateTime.Now.Year, 1, 1),
                                    dtEnd = new DateTime(DateTime.Now.Year, 12, 31),
                                    period = DateTime.Now.Year,
                                    comID = company.comID,
                                    crtBy = username,
                                    crtDate = DateTime.Now,
                                    modBy = username,
                                    modDate = DateTime.Now,
                                    active = true,

                                };
                                _AMDbContext.FiscalYear.Add(FY);
                                await _AMDbContext.SaveChangesAsync();


                                COA coa = new COA()
                                {
                                    acctNo = cst.cstCode,
                                    acctName = cst.cstName,
                                    openBal = 0,
                                    bal = 0,
                                    closingBal = 0,
                                    isSys = true,
                                    parentCOAID = 40,
                                    COANo = cst.cstID,
                                    nextChkNo = cst.cstCode,
                                    COAlevel = 4,
                                    active = true,
                                    treeName = cst.cstName,
                                    acctType = "Trade Debtors",
                                    parentAcctType = "Assets",
                                    parentAcctName = "Trade Debtors",
                                    path = @"Assets\Current Assets\Account Receivable\Trade Debtors\" + cst.cstName + @"\",
                                    crtBy = username,
                                    crtDate = DateTime.Now,
                                    modBy = username,
                                    modDate = DateTime.Now,
                                };
                                await _AMDbContext.COA.AddAsync(coa);
                                await _AMDbContext.SaveChangesAsync();


                                COA coa1 = new COA()
                                {
                                    acctNo = vendor.vendCode,
                                    acctName = vendor.vendName,
                                    openBal = 0,
                                    bal = 0,
                                    closingBal = 0,
                                    isSys = true,
                                    parentCOAID = 83,
                                    COANo = vendor.vendID,
                                    nextChkNo = vendor.vendCode,
                                    COAlevel = 4,
                                    active = true,
                                    treeName = vendor.vendName,
                                    acctType = "Trade Creditors",
                                    parentAcctType = "Liability",
                                    parentAcctName = "Trade Creditors",
                                    path = @"Liability\Current Liability\Current Liability\Trade Creditors\" + vendor.vendName + @"\",
                                    crtBy = username,
                                    crtDate = DateTime.Now,
                                    modBy = username,
                                    modDate = DateTime.Now,
                                };
                                await _AMDbContext.COA.AddAsync(coa1);
                                await _AMDbContext.SaveChangesAsync();

                                _notificationInterceptor.SaveNotification("CompanySettingCreate", oldCompany.comID, "");

                                return Ok(company);
                            }
                            return NotFound("Something Went Wrong...");
                        }
                        else
                        {
                            return NotFound("The company name is already in use. Please choose a different one.");
                        }
                    }
                    return NotFound("Companies limit reached. No new company can be added.");
                }


            }
            catch (Exception ex)
            {
                return Ok();
            }
        }


        [HttpPost]
        public async Task<IActionResult> saveFile()
        {
            try
            {
                var comID = Request.Headers["comID"].ToString();
                var comName = Request.Headers["comName"].ToString();
                var form = Request.Form;
                var file = form.Files[0];
                var tenantID = cm.Decrypt(HttpContext.User.FindFirst(ClaimTypes.Upn).Value);

                var basePath = _configuration.GetSection("AppSettings:ImgPath").Value;
                var relativePath = Path.Combine("assets", "layout", "images", $"{tenantID}", $"{comID}.png");

                var filePath = Path.Combine(basePath, relativePath);
                string directoryPath = Path.GetDirectoryName(filePath);
                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                }
                MemoryStream stream = new MemoryStream();
                file.CopyTo(stream);
                byte[] imgData = stream.ToArray();
                MemoryStream streamImage = new MemoryStream(imgData);
                Image img = new PicsController().ResizeImage(streamImage, 320, 240);
                img.Save(filePath);

                return Ok(relativePath);
            }
            catch (Exception ex)
            {
                return NotFound();
            }

        }


        [NonAction]
        public string GetUsername()
        {
            var email = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email);
            var user = _AMDbContext.Users.Where(x => x.Email == email).FirstOrDefault();
            return user.FirstName + " " + user.LastName;
        }
    }
}
