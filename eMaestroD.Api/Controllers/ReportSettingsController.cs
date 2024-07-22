using eMaestroD.Api.Data;
using eMaestroD.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace eMaestroD.Api.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class ReportSettingsController : Controller
    {
        private readonly AMDbContext _AMDbContext;

        public ReportSettingsController(AMDbContext aMDbContext)
        {
            _AMDbContext = aMDbContext;
        }

        [HttpGet]
        public async Task<IActionResult> getAllReportSettings()
        {

            var rpt = await _AMDbContext.ReportSettings.ToListAsync();
            return Ok(rpt);

        }

        [HttpPost]
        public async Task<IActionResult> saveReportSettings([FromBody] List<ReportSettings> report)
        {
            foreach (var item in report)
            {

                item.key = item.key.Trim();
                if (item.id != 0)
                {
                    _AMDbContext.ReportSettings.Update(item);
                    await _AMDbContext.SaveChangesAsync();
                }
                else
                {
                    var existList = _AMDbContext.ReportSettings.Where(x => x.key == item.key).ToList();
                    if (existList.Count() == 0)
                    {
                        await _AMDbContext.ReportSettings.AddAsync(item);
                        await _AMDbContext.SaveChangesAsync();
                    }
                    else
                    {
                        return NotFound("Name Already Exists!");
                    }
                }
            }
            return Ok(report);
        }
    }
}
