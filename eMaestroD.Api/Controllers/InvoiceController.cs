using eMaestroD.Api.Common;
using eMaestroD.Api.Data;
using eMaestroD.Models.Models;
using eMaestroD.Models.VMModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using eMaestroD.DataAccess.DataSet;

namespace eMaestroD.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("/api/[controller]/[action]")]
    public class InvoiceController : Controller
    {
        private readonly AMDbContext _AMDbContext;
        private IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly InvoiceValidationService _invoiceValidationService;
        private readonly GLService _glService;
        public InvoiceController(AMDbContext aMDbContext, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, InvoiceValidationService invoiceValidationService, GLService glService)
        {
            _AMDbContext = aMDbContext;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _invoiceValidationService = invoiceValidationService;
            _glService = glService;
        }


        [HttpPost]
        public async Task<IActionResult> CreateInvoice([FromBody] Invoice invoice)
        {
            if (invoice == null)
            {
                return BadRequest("Invalid invoice data.");
            }

            bool isValid = _invoiceValidationService.ValidateInvoiceTotals(invoice);
            if (!isValid)
            {
                return BadRequest("Invoice totals are incorrect. Please check product prices, discounts, and taxes.");
            }

            try
            {
                List<GL> glEntries = await _glService.ConvertInvoiceToGL(invoice);
                await _glService.InsertGLEntries(glEntries);
                
                return Ok(new { message = "Invoice created successfully." });
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
