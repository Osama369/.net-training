using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Linq;

namespace eMaestroD.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConfigController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ConfigController(IConfiguration configuration)
        {
            _configuration = configuration;
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
    }
}
