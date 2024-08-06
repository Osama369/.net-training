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
                if (section.GetChildren().ToList().Count == 0)
                {
                    appSettings.Add(section.Key, section.Value);
                }
                else
                {
                    var subSectionDict = new Dictionary<string, string>();
                    foreach (var subSection in section.GetChildren())
                    {
                        subSectionDict.Add(subSection.Key, subSection.Value);
                    }
                    appSettings.Add(section.Key, subSectionDict);
                }
            }

            return Ok(appSettings);
        }
    }
}
