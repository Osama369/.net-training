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
        private IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly InvoiceValidationService _invoiceValidationService;
        private readonly IGLService _glService;
        public InvoiceController(AMDbContext aMDbContext, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, InvoiceValidationService invoiceValidationService, IGLService glService)
        {
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
                var entries = await _glService.ConvertInvoiceToGL(invoice);
                if (entries.FirstOrDefault() is TempGL)
                {
                    await _glService.InsertOrUpdateInvoice<TempGL>(entries.Cast<TempGL>().ToList());
                }
                else if (entries.FirstOrDefault() is GL)
                {
                    await _glService.InsertOrUpdateInvoice<GL>(entries.Cast<GL>().ToList());
                }

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
        [Route("{voucherNo}")]
        public async Task<IActionResult> GetSaleInvoice(string voucherNo)
        {
            try
            {
                var invoice = await _glService.ConvertGLToSaleInvoice(voucherNo);

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
    
        [HttpDelete]
        [Route("{voucherNo}/{comID}")]
        public async Task<IActionResult> DeleteInvoice(string voucherNo, int comID)
        {
            try
            {
                await _glService.DeleteInvoice(voucherNo);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("{voucherNo}/{comID}")]
        public async Task<IActionResult> ApproveInvoice(string voucherNo, int comID)
        {
            try
            {
                await _glService.ApproveInvoice(voucherNo);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        
        [HttpGet]
        [Route("{supplierId}/{dateFrom}/{dateTo}")]
        public async Task<IActionResult> GetItemsBySupplierAndDate(int supplierId, DateTime dateFrom, DateTime dateTo)
        {

            var invoices = await _glService.GetItemsBySupplierAndDate(supplierId, dateFrom, dateTo);

            if (invoices == null)
            {
                return NotFound("Invoices not found.");
            }

            return Ok(invoices); 
        }

        [HttpGet]
        [Route("{prodID}/{prodBCID}/{locID}/{comID}")]
        public async Task<IActionResult> GetProductBatchByProdBCID(int prodID, int prodBCID, int locID, int comID)
        {
            try
            {

                var invoices = await _glService.GetProductBatchByProdBCID(prodID, prodBCID, locID,comID);

                if (invoices == null)
                {
                    return NotFound("Invoices not found.");
                }

                return Ok(invoices);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        

        [HttpPost]
        public async Task<IActionResult> PostInvoices(List<Invoice> invoices)
        {
            try
            {
                await _glService.PostInvoices(invoices);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("{voucherNo}")]
        public async Task<IActionResult> GetInvoiceRemainingAmount(string voucherNo)
        {
            try
            {
                var invoice = await _glService.GetInvoiceRemainingAmount(voucherNo);

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
    }
}
