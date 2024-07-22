using eMaestroD.Api.Common;
using eMaestroD.Api.Data;
using eMaestroD.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Security.Claims;

namespace eMaestroD.Api.Controllers
{
    [ApiController]
    [Route("/api/[controller]/[action]")]
    public class GenericController : Controller
    {
        private CustomMethod cm = new CustomMethod();
        private readonly AMDbContext _AMDbContext;
        private IConfiguration _configuration;
        public GenericController(AMDbContext aMDbContext, IConfiguration configuration)
        {
            _AMDbContext = aMDbContext;
            _configuration = configuration;

        }

        [HttpGet]
        [Route("{date:DateTime}/{comID}")]
        public async Task<IActionResult> getDayBook(DateTime date, int comID)
        {
            List<DayBook> SDL;
            string sql = "EXEC DayBook @dtFrom,@dtTo,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
                    {
                         new SqlParameter { ParameterName = "@dtFrom", Value = date },
                         new SqlParameter { ParameterName = "@dtTo", Value = date.AddDays(1).AddSeconds(-1) },
                         new SqlParameter { ParameterName = "@comID", Value = comID },
                    };
            SDL = _AMDbContext.DayBook.FromSqlRaw(sql, parms.ToArray()).ToList().Where(x => x.glComments != "FromUploadTool").ToList();
            if (SDL.Count > 0)
                return Ok(SDL);

            return Ok();
        }

        [HttpGet]
        [Route("{date:DateTime}/{comID}")]
        public async Task<IActionResult> getSalesSummary(DateTime date, int comID)
        {
            List<SalesSummary> SDL;
            string sql = "EXEC SalesSummary @dtFrom,@dtTo,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
                    {
                         new SqlParameter { ParameterName = "@dtFrom", Value = date },
                         new SqlParameter { ParameterName = "@dtTo", Value = date.AddDays(1).AddSeconds(-1) },
                         new SqlParameter { ParameterName = "@comID", Value = comID },
                    };
            SDL = _AMDbContext.SalesSummary.FromSqlRaw(sql, parms.ToArray()).ToList();
            if (SDL.Count > 0)
                return Ok(SDL);

            return Ok();
        }

        [HttpGet]
        [Route("{comID}")]
        public async Task<IActionResult> getServiceTax(int comID)
        {
            var countryName = _AMDbContext.Companies.Where(x => x.comID == comID).ToList().FirstOrDefault().country;
            List<Taxes> SDL;
            if (countryName.ToUpper() == "PAKISTAN")
            {
                SDL = _AMDbContext.Taxes.Where(x => x.TaxName == "SRT").ToList();
                if (SDL.Count > 0)
                    return Ok(SDL);
                else
                    SDL = _AMDbContext.Taxes.Where(x => x.isDefault == true).ToList();
                return Ok(SDL);
            }
            else
            {
                SDL = _AMDbContext.Taxes.Where(x => x.isDefault == true).ToList();
                return Ok(SDL);
            }

        }



        [HttpGet]
        [Route("{comID}/{filterType}")]
        public async Task<IActionResult> getDashboardData(int comID, string filterType)
        {


            List<Dashboard> SDL;
            string sql = "EXEC GetDashBoardData @comID, @filterType";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@comID", Value = comID },
                    new SqlParameter { ParameterName = "@filterType", Value = filterType },
            };

            SDL = _AMDbContext.Dashboard.FromSqlRaw(sql, parms.ToArray()).ToList();


            List<StockStatusCumulativeValuation> stockValuation;
            string sql1 = "EXEC Report_StockStatusCumulativeValuation @asOfDate,@locID,@comID,@catID";
            List<SqlParameter> parms1 = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@asOfDate", Value = DateTime.Now.AddDays(1).AddSeconds(-1) },
                new SqlParameter { ParameterName = "@locID", Value = 0 },
                new SqlParameter { ParameterName = "@comID", Value = comID },
                new SqlParameter { ParameterName = "@catID", Value = 0 }
            };

            stockValuation = _AMDbContext.StockStatusCumulativeValuation.FromSqlRaw(sql1, parms1.ToArray()).ToList();

            foreach (var dashboard in SDL)
            {
                foreach (var item in stockValuation.FindAll(x => x.total != 0))
                {
                    dashboard.TotalValuation += item.total;
                }
                break;
            }


            return Ok(SDL);

        }


        [HttpGet]
        public async Task<IActionResult> getAllRoles()
        {
            var SDL = await _AMDbContext.Roles.ToListAsync(); ;
            return Ok(SDL);
        }

        [HttpGet]
        [Route("{comID}")]
        public async Task<IActionResult> getLogoPath(int comID)
        {
            var basePath = _configuration.GetSection("AppSettings:ImgPath").Value;
            var logoPath = "";
            bool fileExists = false;
            if (HttpContext.User.FindFirst(ClaimTypes.Upn) != null)
            {
                if (comID != 0)
                {
                    var companies = _AMDbContext.Companies.Where(x => x.comID == comID).FirstOrDefault();
                    var tenantID = cm.Decrypt(HttpContext.User.FindFirst(ClaimTypes.Upn).Value);
                    var lowercaseLogoPath = "assets/layout/images/" + tenantID + "/" + companies.companyName + comID + ".png";
                    var uppercaseLogoPath = "assets/layout/images/" + tenantID + "/" + companies.companyName + comID + ".PNG";


                    if (System.IO.File.Exists(Path.Combine(basePath, lowercaseLogoPath)))
                    {
                        logoPath = lowercaseLogoPath;
                    }

                    else if (System.IO.File.Exists(Path.Combine(basePath, uppercaseLogoPath)))
                    {
                        logoPath = uppercaseLogoPath;
                    }
                    else
                    {
                        logoPath = "assets/layout/images/logo.png"; // Default logo path
                    }
                }
                else
                {
                    logoPath = "assets/layout/images/logo.png"; // Default logo path
                }
            }
            else
            {
                logoPath = "assets/layout/images/logo.png"; // Default logo path
            }

            return Ok(logoPath);
        }

        [HttpGet]
        public async Task<IActionResult> GetTimeZone()
        {
            var timeZoneList = _AMDbContext.TimeZone.ToList();
            foreach (var item in timeZoneList)
            {
                item.timeZone = item.timeZone + " (" + item.current_utc_offset + ") (" + item.abbreviation + ")";
            }
            return Ok(timeZoneList);
        }
    }
}
