using eMaestroD.Api.Data;
using eMaestroD.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace eMaestroD.Api.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class InvoiceReportSettingsController : Controller
    {
        private readonly AMDbContext _AMDbContext;

        public InvoiceReportSettingsController(AMDbContext aMDbContext)
        {
            _AMDbContext = aMDbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllInvoiceReportSetting()
        {

            var rpt = await _AMDbContext.InvoiceReportSettings.ToListAsync();
            return Ok(rpt);

        }

        [HttpPost]
        public async Task<IActionResult> SaveInvoiceReportSetting([FromBody] List<InvoiceReportSettings> report)
        {
            foreach (var item in report)
            {

                item.key = item.key.Trim();
                if (item.invoiceReportSettingID != 0)
                {
                    _AMDbContext.InvoiceReportSettings.Update(item);
                    await _AMDbContext.SaveChangesAsync();
                }
                else
                {
                    var existList = _AMDbContext.InvoiceReportSettings.Where(x => x.key == item.key).ToList();
                    if (existList.Count() == 0)
                    {
                        await _AMDbContext.InvoiceReportSettings.AddAsync(item);
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
