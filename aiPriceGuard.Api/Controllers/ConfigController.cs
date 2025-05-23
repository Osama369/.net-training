using aiPriceGuard.DataAccess.DataSet;
using aiPriceGuard.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System.Linq;

namespace aiPriceGuard.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConfigController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AMDbContext _AMDbContext;

        public ConfigController(IConfiguration configuration, AMDbContext aMDbContext)
        {
            _configuration = configuration;
            _AMDbContext = aMDbContext;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var appSettings = new Dictionary<string, object>();

            foreach (var section in _configuration.GetSection("Settings").GetChildren())
            {
                 appSettings.Add(section.Key, section.Value);
            }

            return Ok(appSettings);
        }

        [HttpGet("GetConfigSettings/{comID}")]
        [Authorize]
        public async Task<IActionResult> GetConfigSettings(int comID)
        {
            var configSettings = await _AMDbContext.ConfigSettings.Where(x => x.comID == comID).ToListAsync();
            return Ok(configSettings);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> SaveConfigSettings(List<ConfigSetting> configSetting)
        {
            _AMDbContext.ConfigSettings.UpdateRange(configSetting);
            await _AMDbContext.SaveChangesAsync();

            return NoContent();
        }

    }
}
