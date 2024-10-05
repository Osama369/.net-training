using eMaestroD.Api.Common;
using eMaestroD.Api.Data;
using eMaestroD.Models.Models;
using eMaestroD.Models.VMModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using eMaestroD.DataAccess.DataSet;
using eMaestroD.InvoiceProcessing.Interfaces;

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
        private readonly IGLService _glService;
        public InvoiceController(AMDbContext aMDbContext, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, InvoiceValidationService invoiceValidationService, IGLService glService)
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

        [HttpGet]
        [Route("{voucherNo}")]
        public async Task<IActionResult> GetInvoice(string voucherNo)
        {
            try
            {
                var invoice = await _glService.ConvertGLToInvoice(voucherNo);

                if (invoice == null)
                {
                    return NotFound("Invoice not found.");
                }

                return Ok(invoice);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("{txtypeID}/{customerOrVendorID}/{comID}")]
        public async Task<IActionResult> GetInvoices(int txtypeID, int customerOrVendorID, int comID)
        {
            try
            {
                var invoices = await _glService.GetInvoicesAsync(txtypeID, customerOrVendorID, comID);

                if (invoices == null)
                {
                    return NotFound("Invoices not found.");
                }

                return Ok(invoices);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
