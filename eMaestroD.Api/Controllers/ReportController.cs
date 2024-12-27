using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Reporting.NETCore;
using System.Drawing;
using System.IO;
using System.Drawing.Imaging;
using Microsoft.AspNetCore.Hosting;
using System.Globalization;
using System.Security.Claims;
using eMaestroD.Models.Models;
using eMaestroD.Api.Common;
using Microsoft.AspNetCore.Authorization;
using eMaestroD.DataAccess.DataSet;
using eMaestroD.Models.ReportModels;
using eMaestroD.Shared.Common;
using System.Data;

namespace eMaestroD.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("/api/[controller]")]
    public class ReportController : Controller
    {
        private readonly AMDbContext _AMDbContext;
        private IWebHostEnvironment Environment;
        private IConfiguration _configuration;
        private CustomMethod cm = new CustomMethod();
        public ReportController(AMDbContext aMDbContext, IWebHostEnvironment _environment, IConfiguration configuration)
        {
            _AMDbContext = aMDbContext;
            Environment = _environment;
            _configuration = configuration;

        }

        //GENERIC REPORT FUNCTION WITH ONE PARAMETER
        [HttpGet]
        [Route("{ReportName}/{Parameter}/{locID}/{comID}")]
        public async Task<IActionResult> ReportwithOneParameterAsync(string ReportName, string Parameter, string locID, int comID)
        {
            byte[] result = null;

            string isProductCode = Request.Headers["isProductCode"].ToString();
            string isArabicHeaderValue = Request.Headers["isArabic"].ToString();
            bool isArabic = !string.IsNullOrEmpty(isArabicHeaderValue) && bool.Parse(isArabicHeaderValue);
            if (ReportName == "PosReport")
            {
                string result1 = await PosReportAsync(Parameter, comID, bool.Parse(locID), isProductCode, isArabic);
                return Ok(result1);

            }
            else if (ReportName == "PosA4Report")
            {
                string result1 = await PosA4ReportAsync(Parameter, comID, bool.Parse(locID), isProductCode, isArabic);
                return Ok(result1);
            }
            else if (ReportName == "PosA5Report")
            {
                string result1 = await PosA5ReportAsync(Parameter, comID, bool.Parse(locID), isProductCode, isArabic);
                return Ok(result1);
            }
            else if (ReportName == "StockList")
            {
                int catID = int.Parse(Request.Headers["catID"].ToString());
                int vendID = int.Parse(Request.Headers["vendID"].ToString());
                int lID = int.Parse(locID);
                var res = await StockReportAsync(Parameter, lID, comID, catID, vendID);

                ResponsedGroupListVM vM = new ResponsedGroupListVM();
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();

                return Ok(vM);
            }

            return NotFound();
        }



        //GENERIC REPORT FUNCTION WITH TWO PARAMETER
        [HttpGet]
        [Route("{ReportName}/{Parameter1}/{Parameter2}/{locID}/{comID}")]
        public async Task<IActionResult> ReportwithTwoParameterAsync(string ReportName, DateTime Parameter1, DateTime Parameter2, int locID, int comID)
        {
            byte[] result = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 };
            ResponsedGroupListVM vM = new ResponsedGroupListVM();
            if (ReportName == "DailyInvoice")
            {
                var res = await DailyInvoiceReportAsync(Parameter1, Parameter2, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();

            }
            else if (ReportName == "generalJournal")
            {
                var res = await GeneralJournalReportAsync(Parameter1, Parameter2, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();

            }
            else if (ReportName == "StockStatusCumulativeValuation")
            {
                int catID = int.Parse(Request.Headers["catID"].ToString());

                var res = await StockStatusCumulativeValuation(Parameter2, locID, comID, catID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();

            }
            else if (ReportName == "CashBook")
            {
                //result = await CashBook(Parameter1, Parameter2);
                var res = await CashBook(Parameter1, Parameter2, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "InvoiceWiseProfit")
            {
                //result = await CashBook(Parameter1, Parameter2);
                var res = await InvoiceWiseProfit(Parameter1, Parameter2, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "MonthlySales")
            {
                //result = await CashBook(Parameter1, Parameter2);
                var res = await MonthlySales(Parameter1, Parameter2, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "CashRegister")
            {
                var res = await CashRegister(Parameter1, Parameter2, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();

            }
            else if (ReportName == "ProfitAndLoss")
            {
                var res = await ProfitAndLoss(Parameter1, Parameter2, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "TrialBalance")
            {
                var res = await TrialBalance(Parameter1, Parameter2, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "BalanceSheet")
            {
                var res = await BalanceSheet(Parameter1, Parameter2, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }

            else if (ReportName == "SaleClaimReport")
            {
                var res = await SaleClaimReport(Parameter1, Parameter2, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
           


            return Ok(vM);
            //return File(result, "application/pdf");
        }



        [HttpGet]
        [Route("{ReportName}/{Parameter1}/{Parameter2}/{Parameter3}/{locID}/{comID}")]
        public async Task<IActionResult> ReportwithThreeParameterAsync(string ReportName, DateTime Parameter1, DateTime Parameter2, string Parameter3, int locID, int comID)
        {
            byte[] result = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 };
            ResponsedGroupListVM vM = new ResponsedGroupListVM();
            if (ReportName == "ItemLedger")
            {
                var res = await ItemLedger(Parameter1, Parameter2, Parameter3, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "ItemWiseProfit")
            {
                var res = await ItemWiseProfit(Parameter1, Parameter2, Parameter3, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "BankBook")
            {
                var res = await BankBook(Parameter1, Parameter2, Parameter3, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "CreditCard")
            {
                var res = await CreditCard(Parameter1, Parameter2, Parameter3, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "PartyLedger")
            {
                var res = await PartyLedger(Parameter1, Parameter2, Parameter3, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "VendorLedger")
            {
                var res = await VendorLedger(Parameter1, Parameter2, Parameter3, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "AccountPayable")
            {
                var res = await AccountPayable(Parameter1, Parameter2, Parameter3, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "AccountReceivable")
            {
                var res = await AccountReceivable(Parameter1, Parameter2, Parameter3, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "GeneralLedger")
            {
                var res = await GeneralLedger(Parameter1, Parameter2, Parameter3, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "SaleHistory")
            {
                var res = await SaleHistory(Parameter1, Parameter2, Parameter3, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "StockSaleAndReturn")
            {
                var res = await StockSaleAndReturn(Parameter1, Parameter2, Parameter3, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "BonusClaim")
            {
                var res = await BonusClaim(Parameter1, Parameter2, comID, int.Parse(Parameter3));
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "DiscountClaim")
            {
                var res = await DiscoutClaim(Parameter1, Parameter2, comID, int.Parse(Parameter3));
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "ItemExpiryListReport")
            {
                var res = await ItemExpiryListReport(Parameter1, Parameter2, comID, int.Parse(Parameter3));
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "SalesManLedgerReport")
            {
                var res = await SaleManLedgerReport(Parameter1, Parameter2, comID, int.Parse(Parameter3));
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }

            else if (ReportName == "SaleManWiseSale")
            {
                var res = await SaleManWiseSale(Parameter1, Parameter2, comID, int.Parse(Parameter3));
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "ExpenseReport")
            {                                                         // accNo
                var res = await ExpenseReport(Parameter1, Parameter2, Parameter3, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }

            else if (ReportName == "ReceiptJournal")
            {                                                                 // cstID
                var res = await ReceiptJournal(Parameter1, Parameter2, int.Parse(Parameter3), locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "BulkReceipt")
            {                                                                 // cstID
                var res = await BulkReceipt(Parameter1, Parameter2, int.Parse(Parameter3), locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "MonthWisePartySale")
            {                                                                 // cstID
                var res = await MonthWisePartySale(Parameter1, Parameter2, int.Parse(Parameter3), locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            return Ok(vM);

        }


        [HttpGet]
        [Route("{ReportName}/{Parameter1}/{Parameter2}/{Parameter3}/{Parameter4}/{locID}/{comID}")]
        public async Task<IActionResult> ReportwithFourParameterAsync(string ReportName, DateTime Parameter1, DateTime Parameter2, string Parameter3, string Parameter4, int locID, int comID)
        {
            byte[] result = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 };
            ResponsedGroupListVM vM = new ResponsedGroupListVM();
            if (ReportName == "TaxReport")
            {
                var res = await TaxReport(Parameter1, Parameter2, Parameter3, Parameter4, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "TaxReportByCustomer")
            {
                var res = await TaxReportByCustomer(Parameter1, Parameter2, Parameter3, Parameter4, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "TaxReportBySupplier")
            {
                var res = await TaxReportBySupplier(Parameter1, Parameter2, Parameter3, Parameter4, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "TaxSummaryReport")
            {
                var res = await TaxSummaryReport(Parameter1, Parameter2, Parameter3, Parameter4, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "CustomerVendorLedger")
            {
                var res = await CustomerVendorLedger(Parameter1, Parameter2, Parameter3, Parameter4, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            else if (ReportName == "SSRWithAvailability")
            {
                var res = await SSRWithAvailability(Parameter1, Parameter2, int.Parse(Parameter3), int.Parse(Parameter4),  locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            if (ReportName == "ChallanReport")
            {
                var res = await ChallanepRort(Parameter3, Parameter4, locID,comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }

            else if(ReportName == "PurchaseOrderGRN")
            {
                //result = await CashBook(Parameter1, Parameter2);
                var res = await PurchaseOrderGRN(Parameter1, Parameter2, int.Parse(Parameter3), int.Parse(Parameter4),  locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }

            else if (ReportName == "ReceivableAging")
            {
                try
                {
                    //result = await CashBook(Parameter1, Parameter2);
                    var res = await ReceivableAging(Parameter1, int.Parse(Parameter3), locID, comID);
                    vM.enttityDataSource = res;
                    vM.entityModel = res?.GetEntity_MetaData();
                }
                catch (Exception ex)
                {

                    throw;
                }
              
            }
            else if (ReportName == "PayableAging")
            {
                var res = await PayableAging(Parameter1, int.Parse(Parameter3), locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
           
            else if (ReportName == "CustomerSaleProductWise")
            {
                var res = await CustomerSaleProductWise(Parameter1, Parameter2, int.Parse(Parameter3), Parameter4, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }
            return Ok(vM);
        }

        [HttpGet]
        [Route("{ReportName}/{Parameter1}/{Parameter2}/{Parameter3}/{Parameter4}/{Parameter5}/{locID}/{comID}")]
        public async Task<IActionResult> ReportwithFiveParameterAsync(string ReportName, DateTime Parameter1, DateTime Parameter2, string Parameter3, string Parameter4, string Parameter5, int locID, int comID)
        {
            byte[] result = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 };
            ResponsedGroupListVM vM = new ResponsedGroupListVM();
            if (ReportName == "AdvancedSearch")
            {
                //result = await CashBook(Parameter1, Parameter2);
                var res = await AdvancedSearch(Parameter1, Parameter2, Parameter3, Parameter4, Parameter5, locID, comID);
                vM.enttityDataSource = res;
                vM.entityModel = res?.GetEntity_MetaData();
            }

            

            return Ok(vM);
        }

        [NonAction]
        public async Task<string> PosReportAsync(string vourcherno, int comID, bool isBankDetail, string isProductCode, bool isArabic)
        {
            var config = await _AMDbContext.Companies.Where(x => x.comID == comID).ToListAsync();
            var currencylist = _AMDbContext.Currency.Where(x => x.CurrencyCode == config[0].CurrencyCode).ToList();
            var currencyName = "";
            if (currencylist.Count > 0)
            {
                currencyName = currencylist[0].Name;
            }
            else
            {
                currencyName = "USD";
            }

            List<SaleDelivery> SDL;
            string sql = "";
            if (vourcherno.Split('-').FirstOrDefault() == "PNV" || vourcherno.Split('-').FirstOrDefault() == "POV" || vourcherno.Split('-').FirstOrDefault() == "PRT")
            {
                sql = "EXEC Report_PurchaseInvoice @voucherNo";
            }
            else
            {

                sql = "EXEC Report_SaleDelivery @voucherNo";

            }
            List<SqlParameter> parms = new List<SqlParameter>
                    {
                         new SqlParameter { ParameterName = "@voucherNo", Value = vourcherno },
                    };
            SDL = _AMDbContext.SaleDelivery.FromSqlRaw(sql, parms.ToArray()).ToList();

            decimal amount = 0;
            string taxName = "";
            decimal tax = 0;
            decimal discount = 0;
            byte[] arrpic = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 };
            var type = "";
            if (SDL.Count > 0)
            {
                foreach (var item in SDL)
                {
                    type = item.relCOAID == 40 || item.relCOAID == 83 ? "Credit" : "Cash";
                    item.modBy = item.prodCode;
                    if (vourcherno.Split('-').FirstOrDefault() == "PRT")
                    {
                        item.qty = -item.qty;
                    }
                    if (vourcherno.Split('-').FirstOrDefault() == "POV" || vourcherno.Split('-').FirstOrDefault() == "SRT")
                    {
                        item.creditSum += Convert.ToDecimal(item.debitSum);
                    }
                    amount += Convert.ToDecimal(item.creditSum);

                    if (item.checkName == "tax")
                    {
                        taxName = item.taxInWords;
                        if (vourcherno.Split('-').FirstOrDefault() == "PNV" || vourcherno.Split('-').FirstOrDefault() == "POV" || vourcherno.Split('-').FirstOrDefault() == "SRT")
                        {
                            item.taxSum = item.debitSum;
                            tax = item.debitSum;
                        }
                        else
                        {
                            item.taxSum = item.creditSum;
                            tax = item.creditSum;
                        }
                    }

                }
                amount = amount - SDL[0].discountSum;
                SDL[0].amountInWords = $"{AmountInWords(Convert.ToInt32(Math.Round(amount, 0))).ToUpperInvariant()} IN {currencyName.ToUpper()} ONLY";


                QRCoder.QRCodeGenerator qRCodeGenerator = new QRCoder.QRCodeGenerator();
                QRCoder.QRCodeData qRCodeData = qRCodeGenerator.CreateQrCode(
                    "Invoice Details\n" +
                    "----------------------------------------------\n" +
                    "Seller's Name: " + config[0].companyName + "\n" +
                    "Seller's TRN: " + config[0].productionType + "\n" +
                    "Invoice Date: " + SDL[0].dtTx + "\n" +
                    "Invoice Total(with " + taxName + "): " + Math.Round(amount, 2) + "\n" +
                    taxName + " Total: " + Math.Round(tax, 2) + "\n"
                    , QRCoder.QRCodeGenerator.ECCLevel.Q);
                QRCoder.QRCode qRCode = new QRCoder.QRCode(qRCodeData);
                Bitmap bmp = qRCode.GetGraphic(5);
                using (MemoryStream ms = new MemoryStream())
                {
                    bmp.Save(ms, ImageFormat.Png);
                    arrpic = ms.ToArray();
                }

                SDL[0].taxInWords = $"{AmountInWords(Convert.ToInt32(Math.Round(tax, 0))).ToUpperInvariant()} IN {currencyName.ToUpper()} ONLY";

            }
            string base64 = Convert.ToBase64String(arrpic);
            var basePath = _configuration.GetSection("AppSettings:ImgPath").Value;
            // Set report parameters if needed
            // localReport.SetParameters(...);
            var tenantID = cm.Decrypt(HttpContext.User.FindFirst(ClaimTypes.Upn).Value);
            var logoPath = "assets\\layout\\images\\" + tenantID + "\\" + config[0].companyName + config[0].comID + ".png";
            var DefaultlogoPath = "assets\\layout\\images\\logo.png";
            var headerImg = "";
            bool fileExists = System.IO.File.Exists(Path.Combine(basePath, logoPath));
            if (fileExists)
            {
                headerImg = new Uri(Path.Combine(basePath, logoPath)).AbsoluteUri;
            }
            else
            {
                headerImg = new Uri(Path.Combine(basePath, DefaultlogoPath)).AbsoluteUri;
            }
            //string header = new Uri(this.Environment.ContentRootPath).AbsoluteUri + "/Images/ReportHeader.png";
            LocalReport localReport = new LocalReport();
            localReport.EnableExternalImages = true;
            localReport.ReportPath = "RDLC/SaleDeliveryPos.rdlc";
            ReportParameter ReportHeaderImage = new ReportParameter("ReportHeaderImage", headerImg);
            ReportParameter comPanyName = new ReportParameter("comPanyName", config[0].companyName);
            ReportParameter address = new ReportParameter("address", config[0].address);
            ReportParameter phone = new ReportParameter("phone", config[0].contactNo);
            ReportParameter VAT = new ReportParameter("VAT", config[0].productionType);
            ReportParameter qrcode = new ReportParameter("qrcode", base64);
            ReportParameter taxNameforReport = new ReportParameter("taxName", taxName);
            ReportParameter pc = new ReportParameter("isProductCode", isProductCode);
            ReportParameter typeParam = new ReportParameter("Type", type);
            localReport.SetParameters(typeParam);
            localReport.SetParameters(pc);

            if (isBankDetail)
            {
                var bank = _AMDbContext.Banks.Where(x => x.isDefault == true && x.comID == comID).FirstOrDefault();
                if (bank != null)
                {
                    ReportParameter bankDetail = new ReportParameter("bankDetail", bank.bankName + "," + bank.accountNo + "," + bank.IBAN + "," + bank.branchCode);
                    localReport.SetParameters(bankDetail);
                }
            }
            localReport.SetParameters(taxNameforReport);
            localReport.SetParameters(comPanyName);
            localReport.SetParameters(address);
            localReport.SetParameters(phone);
            localReport.SetParameters(VAT);
            localReport.SetParameters(ReportHeaderImage);
            localReport.SetParameters(qrcode);
            localReport.DataSources.Clear();
            localReport.DataSources.Add(new ReportDataSource("DataSet1", SDL));
            localReport.DisplayName = "Sale";
            byte[] result = localReport.Render("PDF");

            var pdfName = "InvoiceReport" + DateTime.Now.ToString("yyyyMMdd_HHmmss") + ".pdf";
            var relativePath = Path.Combine("assets", "PDF", tenantID, comID.ToString(), pdfName);
            // Create the directory if it doesn't exist
            var filePath = Path.Combine(basePath, relativePath);
            string directoryPath = Path.GetDirectoryName(filePath);
            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            using (FileStream fs = new FileStream(filePath, FileMode.Create))
            {
                fs.Write(result, 0, result.Length);
            }

            var angularPath = $"../../../assets/pdf/{tenantID}/{comID}/{pdfName}";
            return angularPath;
        }

        [NonAction]
        public async Task<string> PosA4ReportAsync(string vourcherno, int comID, bool isBankDetail, string isProductCode, bool isArabic)
        {
            var config = await _AMDbContext.Companies.Where(x => x.comID == comID).ToListAsync();
            var currencylist = _AMDbContext.Currency.Where(x => x.CurrencyCode == config[0].CurrencyCode).ToList();
            var currencyName = "";
            if (currencylist.Count > 0)
            {
                currencyName = currencylist[0].Name;
            }
            else
            {
                currencyName = "USD";
            }
            string sql = "";
            List<SaleDelivery> SDL;
            if (vourcherno.Split('-').FirstOrDefault() == "PNV" || vourcherno.Split('-').FirstOrDefault() == "POV" || vourcherno.Split('-').FirstOrDefault() == "PRT")
            {
                sql = "EXEC Report_PurchaseInvoice @voucherNo";
            }
            else
            {
                sql = "EXEC Report_SaleDelivery @voucherNo";
            }
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@voucherNo", Value = vourcherno },
            };
            SDL = _AMDbContext.SaleDelivery.FromSqlRaw(sql, parms.ToArray()).ToList();
            decimal amount = 0;
            decimal tax = 0;
            string taxName = "";
            decimal discount = 0;
            byte[] arrpic = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 };
            var type = "";
            List<int> serialNoArray = new List<int>();
            if (SDL.Count > 0)
            {
                foreach (var item in SDL)
                {
                    if (item.comments != "")
                    {
                        string leadingSpaces = new string(' ', 9);
                        var numbers = item.comments
                                     .Split(',')
                                     .Select(str => str.Trim()) // Trim spaces
                                     .Select(str => int.TryParse(str, out int num) ? num : (int?)null) // Try parsing
                                     .Where(num => num.HasValue) // Ensure valid numbers
                                     .Select(num => num.Value)  // Get the value
                                     .ToList();
                        serialNoArray.AddRange(numbers);


                        item.comments = leadingSpaces + item.comments.Replace(", ", "\r\n         ");
                    }
                    //item.comments = item.comments.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                    type = item.relCOAID == 40 || item.relCOAID == 83 ? "Credit" : "Cash";
                    if (vourcherno.Split('-').FirstOrDefault() == "PRT")
                    {
                        item.qty = -item.qty;
                    }

                    if (vourcherno.Split('-').FirstOrDefault() == "POV" || vourcherno.Split('-').FirstOrDefault() == "SRT")
                    {
                        item.creditSum += Convert.ToDecimal(item.debitSum);
                    }
                    amount += Convert.ToDecimal(item.creditSum);
                    if (item.checkName == "tax")
                    {
                        taxName = item.taxInWords;
                        if (vourcherno.Split('-').FirstOrDefault() == "PNV" || vourcherno.Split('-').FirstOrDefault() == "POV" || vourcherno.Split('-').FirstOrDefault() == "SRT")
                        {
                            item.taxSum = item.debitSum;
                            tax = item.debitSum;
                        }
                        else
                        {
                            item.taxSum = item.creditSum;
                            tax = item.creditSum;
                        }
                    }
                }
                discount = SDL[0].discountSum;
                amount = amount - discount;
                SDL[0].amountInWords = $"{AmountInWords(Convert.ToInt32(Math.Round(amount, 0))).ToUpperInvariant()} IN {currencyName.ToUpper()} ONLY";


                QRCoder.QRCodeGenerator qRCodeGenerator = new QRCoder.QRCodeGenerator();
                QRCoder.QRCodeData qRCodeData = qRCodeGenerator.CreateQrCode(
                    "Invoice Details\n" +
                    "----------------------------------------------\n" +
                    "Seller's Name: " + config[0].companyName + "\n" +
                    "Seller's TRN: " + config[0].productionType + "\n" +
                    "Invoice Date: " + SDL[0].dtTx + "\n" +
                    "Invoice Total(with " + taxName + "): " + Math.Round(amount, 2) + "\n" +
                    taxName + " Total: " + Math.Round(tax, 2) + "\n"
                    , QRCoder.QRCodeGenerator.ECCLevel.Q);
                QRCoder.QRCode qRCode = new QRCoder.QRCode(qRCodeData);
                Bitmap bmp = qRCode.GetGraphic(5);
                using (MemoryStream ms = new MemoryStream())
                {
                    bmp.Save(ms, ImageFormat.Png);
                    arrpic = ms.ToArray();
                }

                SDL[0].taxInWords = $"{AmountInWords(Convert.ToInt32(Math.Round(tax, 0))).ToUpperInvariant()} IN {currencyName.ToUpper()} ONLY";
            }
            string base64 = Convert.ToBase64String(arrpic);
            // Set report parameters if needed
            // localReport.SetParameters(...);
            var basePath = _configuration.GetSection("AppSettings:ImgPath").Value;


            var tenantID = cm.Decrypt(HttpContext.User.FindFirst(ClaimTypes.Upn).Value);
            var logoPath = "assets\\layout\\images\\" + tenantID + "\\" + config[0].companyName + config[0].comID + ".png";
            var DefaultlogoPath = "assets\\layout\\images\\logo.png";
            var headerImg = "";
            bool fileExists = System.IO.File.Exists(Path.Combine(basePath, logoPath));
            if (fileExists)
            {
                headerImg = new Uri(Path.Combine(basePath, logoPath)).AbsoluteUri;
            }
            else
            {
                headerImg = new Uri(Path.Combine(basePath, DefaultlogoPath)).AbsoluteUri;
            }
            LocalReport localReport = new LocalReport();
            localReport.EnableExternalImages = true;
            if (!isArabic)
            {
                localReport.ReportPath = "RDLC/SaleDeliverySpecial2InArabic.rdlc";
                ReportParameter comPanyNameInArabic = new ReportParameter("comPanyNameInArabic", config[0].softwareVersion);
                localReport.SetParameters(comPanyNameInArabic);
            }
            else
            {
                localReport.ReportPath = "RDLC/SaleDeliverySpecial2.rdlc";
            }
            ReportParameter ReportHeaderImage = new ReportParameter("ReportHeaderImage", headerImg);
            ReportParameter comPanyName = new ReportParameter("comPanyName", config[0].companyName);

            ReportParameter address = new ReportParameter("address", config[0].address);
            ReportParameter phone = new ReportParameter("phone", config[0].contactNo);
            ReportParameter VAT = new ReportParameter("VAT", config[0].productionType);
            ReportParameter country = new ReportParameter("country", config[0].country);
            ReportParameter qrcode = new ReportParameter("qrcode", base64);
            ReportParameter taxNameforReport = new ReportParameter("taxName", taxName);
            ReportParameter pc = new ReportParameter("isProductCode", isProductCode);
            ReportParameter typeParam = new ReportParameter("Type", type);
            localReport.SetParameters(typeParam);
            localReport.SetParameters(pc);
            if (isBankDetail)
            {
                var bank = _AMDbContext.Banks.Where(x => x.isDefault == true && x.comID == comID).FirstOrDefault();
                if (bank != null)
                {
                    ReportParameter bankDetail = new ReportParameter("bankDetail", bank.bankName + "," + bank.accountNo + "," + bank.IBAN + "," + bank.branchCode);
                    localReport.SetParameters(bankDetail);
                }
            }
            localReport.SetParameters(taxNameforReport);
            localReport.SetParameters(comPanyName);
            localReport.SetParameters(country);
            localReport.SetParameters(address);
            localReport.SetParameters(phone);
            localReport.SetParameters(VAT);
            localReport.SetParameters(ReportHeaderImage);
            localReport.SetParameters(qrcode);
            localReport.DataSources.Clear();
            var rowCount = SDL.Count + (serialNoArray.Count > 30 ? serialNoArray.Count - 10 : serialNoArray.Count > 15 ? serialNoArray.Count - 5 : serialNoArray.Count);
            if (rowCount < 25)
            {
                for (int i = 0; i < 25 - rowCount; i++)
                {
                    SDL.Add(new SaleDelivery { prodID = -1, voucherNo = SDL[0].voucherNo });
                }
            }
            else if (rowCount < 81)
            {
                for (int i = 0; i < 81 - rowCount; i++)
                {
                    SDL.Add(new SaleDelivery { prodID = -1, voucherNo = SDL[0].voucherNo });
                }
            }
            else if (rowCount < 137)
            {
                for (int i = 0; i < 137 - rowCount; i++)
                {
                    SDL.Add(new SaleDelivery { prodID = -1, voucherNo = SDL[0].voucherNo });
                }
            }
            else if (rowCount < 193)
            {
                for (int i = 0; i < 193 - rowCount; i++)
                {
                    SDL.Add(new SaleDelivery { prodID = -1, voucherNo = SDL[0].voucherNo });
                }
            }
            localReport.DataSources.Add(new ReportDataSource("DaliySaleDeliveryDataSet1", SDL));

            byte[] result = localReport.Render("PDF");
            var pdfName = "InvoiceReport" + DateTime.Now.ToString("yyyyMMdd_HHmmss") + ".pdf";
            var relativePath = Path.Combine("assets", "PDF", tenantID, comID.ToString(), pdfName);
            // Create the directory if it doesn't exist
            var filePath = Path.Combine(basePath, relativePath);
            string directoryPath = Path.GetDirectoryName(filePath);
            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            using (FileStream fs = new FileStream(filePath, FileMode.Create))
            {
                fs.Write(result, 0, result.Length);
            }

            var angularPath = $"../../../assets/pdf/{tenantID}/{comID}/{pdfName}";
            return angularPath;
        }


        [NonAction]
        public async Task<string> PosA5ReportAsync(string vourcherno, int comID, bool isBankDetail, string isProductCode, bool isArabic)
        {
           
            try
            {
                var config = await _AMDbContext.Companies.Where(x => x.comID == comID).ToListAsync();
                var currencylist = _AMDbContext.Currency.Where(x => x.CurrencyCode == config[0].CurrencyCode).ToList();
                var currencyName = "";
                if (currencylist.Count > 0)
                {
                    currencyName = currencylist[0].Name;
                }
                else
                {
                    currencyName = "USD";
                }
                string sql = "";
                List<SaleDelivery2> SDL;
                if (vourcherno.Split('-').FirstOrDefault() == "PNV" || vourcherno.Split('-').FirstOrDefault() == "POV" || vourcherno.Split('-').FirstOrDefault() == "PRT")
                {
                    sql = "EXEC Report_PurchaseInvoice @voucherNo";
                }
                else
                {
                    sql = "EXEC Report_SaleDelivery2 @voucherNo";
                }
                List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@voucherNo", Value = vourcherno },
            };
                SDL = _AMDbContext.SaleDelivery2.FromSqlRaw(sql, parms.ToArray()).ToList();
                decimal amount = 0;
                decimal tax = 0;
                string taxName = "";
                decimal discount = 0;
                byte[] arrpic = new byte[] { 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20 };
                var type = "";
                List<int> serialNoArray = new List<int>();
                if (SDL.Count > 0)
                {
                    foreach (var item in SDL)
                    {
                        if (item.comments != "")
                        {
                            string leadingSpaces = new string(' ', 9);
                            var numbers = item.comments
                                         .Split(',')
                                         .Select(str => str.Trim()) // Trim spaces
                                         .Select(str => int.TryParse(str, out int num) ? num : (int?)null) // Try parsing
                                         .Where(num => num.HasValue) // Ensure valid numbers
                                         .Select(num => num.Value)  // Get the value
                                         .ToList();
                            serialNoArray.AddRange(numbers);


                            item.comments = leadingSpaces + item.comments.Replace(", ", "\r\n         ");
                        }
                        //item.comments = item.comments.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                        type = item.relCOAID == 40 || item.relCOAID == 83 ? "Credit" : "Cash";
                        if (vourcherno.Split('-').FirstOrDefault() == "PRT")
                        {
                            item.qty = -item.qty;
                        }

                        if (vourcherno.Split('-').FirstOrDefault() == "POV" || vourcherno.Split('-').FirstOrDefault() == "SRT")
                        {
                            item.creditSum += Convert.ToDecimal(item.debitSum);
                        }
                        amount += Convert.ToDecimal(item.creditSum);
                        if (item.checkName == "tax")
                        {
                            taxName = item.taxInWords;
                            if (vourcherno.Split('-').FirstOrDefault() == "PNV" || vourcherno.Split('-').FirstOrDefault() == "POV" || vourcherno.Split('-').FirstOrDefault() == "SRT")
                            {
                                item.taxSum = item.debitSum;
                                tax = item.debitSum;
                            }
                            else
                            {
                                item.taxSum = item.creditSum;
                                tax = item.creditSum;
                            }
                        }
                    }
                    discount = SDL[0].discountSum;
                    amount = amount - discount;
                    SDL[0].amountInWords = $"{AmountInWords(Convert.ToInt32(Math.Round(amount, 0))).ToUpperInvariant()} IN {currencyName.ToUpper()} ONLY";


                    QRCoder.QRCodeGenerator qRCodeGenerator = new QRCoder.QRCodeGenerator();
                    QRCoder.QRCodeData qRCodeData = qRCodeGenerator.CreateQrCode(
                        "Invoice Details\n" +
                        "----------------------------------------------\n" +
                        "Seller's Name: " + config[0].companyName + "\n" +
                        "Seller's TRN: " + config[0].productionType + "\n" +
                        "Invoice Date: " + SDL[0].dtTx + "\n" +
                        "Invoice Total(with " + taxName + "): " + Math.Round(amount, 2) + "\n" +
                        taxName + " Total: " + Math.Round(tax, 2) + "\n"
                        , QRCoder.QRCodeGenerator.ECCLevel.Q);
                    QRCoder.QRCode qRCode = new QRCoder.QRCode(qRCodeData);
                    Bitmap bmp = qRCode.GetGraphic(5);
                    using (MemoryStream ms = new MemoryStream())
                    {
                        bmp.Save(ms, ImageFormat.Png);
                        arrpic = ms.ToArray();
                    }

                    SDL[0].taxInWords = $"{AmountInWords(Convert.ToInt32(Math.Round(tax, 0))).ToUpperInvariant()} IN {currencyName.ToUpper()} ONLY";
                }
                string base64 = Convert.ToBase64String(arrpic);
                // Set report parameters if needed
                // localReport.SetParameters(...);
                var basePath = _configuration.GetSection("AppSettings:ImgPath").Value;


                var tenantID = cm.Decrypt(HttpContext.User.FindFirst(ClaimTypes.Upn).Value);
                var logoPath = "assets\\layout\\images\\" + tenantID + "\\" + config[0].companyName + config[0].comID + ".png";
                var DefaultlogoPath = "assets\\layout\\images\\logo.png";
                var defaultsignaturePath = "assets\\Signature\\" + tenantID + "\\" + config[0].comID + "\\signature.jpg";
                var headerImg = "";
                var signImage = "";

                bool fileExists = System.IO.File.Exists(Path.Combine(basePath, logoPath));
                if (fileExists)
                {
                    headerImg = new Uri(Path.Combine(basePath, logoPath)).AbsoluteUri;

                }
                else
                {
                    headerImg = new Uri(Path.Combine(basePath, DefaultlogoPath)).AbsoluteUri;

                }
                signImage = new Uri(Path.Combine(basePath, defaultsignaturePath)).AbsoluteUri;
                LocalReport localReport = new LocalReport();
                localReport.EnableExternalImages = true;
                if (!isArabic)
                {
                    localReport.ReportPath = "RDLC/SaleDeliverySpecial2InArabic.rdlc";
                    ReportParameter comPanyNameInArabic = new ReportParameter("comPanyNameInArabic", config[0].softwareVersion);
                    localReport.SetParameters(comPanyNameInArabic);
                }
                else
                {
                    localReport.ReportPath = "RDLC/SaleDelivery2.rdlc";
                }
                ReportParameter ReportHeaderImage = new ReportParameter("ReportHeaderImage", headerImg);
                ReportParameter comPanyName = new ReportParameter("comPanyName", config[0].companyName);

                ReportParameter address = new ReportParameter("address", config[0].address);
                ReportParameter phone = new ReportParameter("phone", config[0].contactNo);
                ReportParameter email = new ReportParameter("email", config[0].email);         
                //ReportParameter VAT = new ReportParameter("VAT", config[0].productionType);
               // ReportParameter country = new ReportParameter("country", config[0].city+' '+config[0].country);
               // ReportParameter qrcode = new ReportParameter("qrcode", base64);
                //ReportParameter taxNameforReport = new ReportParameter("taxName", taxName);
                //ReportParameter pc = new ReportParameter("isProductCode", isProductCode);
               // ReportParameter typeParam = new ReportParameter("Type", type);
                ReportParameter Signature = new ReportParameter("Signature", signImage);
                //localReport.SetParameters(typeParam);
                //localReport.SetParameters(pc);
                if (isBankDetail)
                {
                    var bank = _AMDbContext.Banks.Where(x => x.isDefault == true && x.comID == comID).FirstOrDefault();
                    if (bank != null)
                    {
                        ReportParameter bankDetail = new ReportParameter("bankDetail", bank.bankName + "," + bank.accountNo + "," + bank.IBAN + "," + bank.branchCode);
                        //localReport.SetParameters(bankDetail);
                    }
                }
                //localReport.SetParameters(taxNameforReport);
                localReport.SetParameters(comPanyName);
                localReport.SetParameters(email);
                //localReport.SetParameters(country);
                localReport.SetParameters(address);
                localReport.SetParameters(phone);
                //localReport.SetParameters(VAT);
                localReport.SetParameters(ReportHeaderImage);
                localReport.SetParameters(Signature);
                //localReport.SetParameters(qrcode);
                localReport.DataSources.Clear();
                //var rowCount = SDL.Count + (serialNoArray.Count > 30 ? serialNoArray.Count - 10 : serialNoArray.Count > 15 ? serialNoArray.Count - 5 : serialNoArray.Count);
                //if (rowCount < 25)
                //{
                //    for (int i = 0; i < 25 - rowCount; i++)
                //    {
                //        SDL.Add(new SaleDelivery { prodID = -1, voucherNo = SDL[0].voucherNo });
                //    }
                //}
                //else if (rowCount < 81)
                //{
                //    for (int i = 0; i < 81 - rowCount; i++)
                //    {
                //        SDL.Add(new SaleDelivery { prodID = -1, voucherNo = SDL[0].voucherNo });
                //    }
                //}
                //else if (rowCount < 137)
                //{
                //    for (int i = 0; i < 137 - rowCount; i++)
                //    {
                //        SDL.Add(new SaleDelivery { prodID = -1, voucherNo = SDL[0].voucherNo });
                //    }
                //}
                //else if (rowCount < 193)
                //{
                //    for (int i = 0; i < 193 - rowCount; i++)
                //    {
                //        SDL.Add(new SaleDelivery { prodID = -1, voucherNo = SDL[0].voucherNo });
                //    }
                //}
                localReport.DataSources.Add(new ReportDataSource("DaliySaleDeliveryDataSet1", SDL));

                byte[] result = localReport.Render("PDF");
                var pdfName = "InvoiceReport" + DateTime.Now.ToString("yyyyMMdd_HHmmss") + ".pdf";
                var relativePath = Path.Combine("assets", "PDF", tenantID, comID.ToString(), pdfName);
                // Create the directory if it doesn't exist
                var filePath = Path.Combine(basePath, relativePath);
                string directoryPath = Path.GetDirectoryName(filePath);
                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                }

                using (FileStream fs = new FileStream(filePath, FileMode.Create))
                {
                    fs.Write(result, 0, result.Length);
                }

                var angularPath = $"../../../assets/pdf/{tenantID}/{comID}/{pdfName}";
                return angularPath;

            }
            catch (Exception ex)
            {

                throw;
            }
        }


        [NonAction]
        public async Task<List<StockList>> StockReportAsync(string prodID, int locID, int comID, int catID, int vendID)
        {
            List<StockList> SDL;
            string sql = "EXEC Report_StockList @prodID,@locID,@comID, @catID,@vendID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@prodID", Value = prodID },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
                    new SqlParameter { ParameterName = "@catID", Value = catID },
                    new SqlParameter { ParameterName = "@vendID", Value = vendID }
            };
            SDL = _AMDbContext.StockList.FromSqlRaw(sql, parms.ToArray()).ToList();

            if (SDL.Count > 0)
            {
                return SDL;
            }
            return null;
        }

        [NonAction]
        public async Task<List<DailyInvoice>> DailyInvoiceReportAsync(DateTime dtfrom, DateTime dtTo, int locID, int comID)
        {
            List<DailyInvoice> SDL;
            string sql = "EXEC Report_DailyInvoice @dtfrom,@dtTo,@locID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtfrom", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtTo", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
            };
            SDL = _AMDbContext.DailyInvoice.FromSqlRaw(sql, parms.ToArray()).ToList();



            if (SDL.Count > 0)
            {
                return SDL;
            }
            return null;
        }


        [NonAction]
        public async Task<List<generalJournal>> GeneralJournalReportAsync(DateTime dtfrom, DateTime dtTo, int locID, int comID)
        {
            List<generalJournal> SDL;
            string sql = "EXEC Report_GeneralJournal @dtStart,@dtEnd,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
            };
            SDL = _AMDbContext.generalJournal.FromSqlRaw(sql, parms.ToArray()).ToList();


            if (SDL.Count > 0)
            {
                return SDL;
            }
            return null;
        }

        [NonAction]
        public async Task<List<StockSaleAndReturn>> StockSaleAndReturn(DateTime dtfrom, DateTime dtTo, string grpID, int locID, int comID)
        {


            List<StockSaleAndReturn> SDL;
            string sql = "EXEC Report_StockSalesAndReturnByLoc @dtStart,@dtEnd,@grpID,@locID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@grpID", Value = grpID },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
            };

            SDL = _AMDbContext.StockSaleAndReturn.FromSqlRaw(sql, parms.ToArray()).ToList();

            if (SDL.Count > 0)
            {
                return SDL;
            }
            return null;
        }

        [NonAction]
        public async Task<List<ProfitAndLoss>> ProfitAndLoss(DateTime dtfrom, DateTime dtTo, int comID)
        {


            List<ProfitAndLoss> SDL;
            string sql = "EXEC Report_profitAndLoss @dtStart,@dtEnd,@comID";

            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
            };
            SDL = _AMDbContext.ProfitAndLoss.FromSqlRaw(sql, parms.ToArray()).ToList();



            if (SDL.Count > 0)
            {
                decimal crtotal = 0;
                decimal drtotal = 0;
                decimal excrtotal = 0;
                foreach (var item in SDL)
                {
                    excrtotal += item.ExCr;
                    crtotal += item.CR;
                    drtotal += item.DR;
                }
                SDL.Add(new ProfitAndLoss { parentAcctType = "TOTAL", ExCr = excrtotal, CR = crtotal, DR = drtotal });
                SDL.Add(new ProfitAndLoss { parentAcctType = "PROFIT", ExCr = drtotal - crtotal - excrtotal });
                return SDL;
            }
            return null;
        }


        [NonAction]
        public async Task<List<TrialBalance>> TrialBalance(DateTime dtfrom, DateTime dtTo, int comID)
        {
            List<TrialBalance> SDL;
            string sql = "EXEC Report_TrialBalance @dtStart,@dtEnd,@comID";

            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
            };
            SDL = _AMDbContext.TrialBalance.FromSqlRaw(sql, parms.ToArray()).ToList();



            if (SDL.Count > 0)
            {
                decimal CRTOTAL = 0;
                decimal DRTOTAL = 0;
                //foreach (var item in SDL)
                //{
                //    CRTOTAL += item.CR;
                //    DRTOTAL += item.DR;
                //}
                SDL = SDL.OrderBy(x => x.PrimitiveType).ToList();
                //SDL.Add(new TrialBalance { acctName = "TOTAL", CR = CRTOTAL, DR = DRTOTAL });
                return SDL.Where(x => x.CR != 0 || x.DR != 0).ToList();
            }
            return null;
        }


        [NonAction]
        public async Task<List<BalanceSheet>> BalanceSheet(DateTime dtfrom, DateTime dtTo, int comID)
        {
            List<BalanceSheet> SDL;
            string sql = "EXEC Report_BalanceSheet @dtStart,@dtEnd,@comID";

            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
            };
            SDL = _AMDbContext.BalanceSheet.FromSqlRaw(sql, parms.ToArray()).ToList();



            if (SDL.Count > 0)
            {
                //decimal total = 0;
                //foreach (var item in SDL)
                //{
                //    total += item.Totalamount;
                //}
                //SDL.Add(new Models.BalanceSheet { acctName = "TOTAL", Totalamount = total });
                return SDL.OrderBy(x => x.PrimitiveType).ToList();
            }
            return null;
        }

        [NonAction]
        public async Task<List<SaleClaimReport>> SaleClaimReport(DateTime dtfrom, DateTime dtTo, int comID)
        {
            List<SaleClaimReport> SDL;
            string sql = "[Report_SaleClaimByProduct] @dtStart,@dtEnd,@comID";

            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
            };
            SDL = _AMDbContext.SaleClaimReport.FromSqlRaw(sql, parms.ToArray()).ToList();



            if (SDL.Count > 0)
            {
                //decimal total = 0;
                //foreach (var item in SDL)
                //{
                //    total += item.Totalamount;
                //}
                //SDL.Add(new Models.BalanceSheet { acctName = "TOTAL", Totalamount = total });
               // return SDL.OrderBy(x => x.PrimitiveType).ToList();
                return SDL;
            }
            return null;
        }


        [NonAction]
        public async Task<List<PayableAging>> PayableAging(DateTime dtfrom,int vendorID , int locID , int comID)
        {
            List<PayableAging> SDL;
            string sql = "[Report_PayableAging]  @vendID, @asOfDate, @locID, @comID";

            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@vendID", Value = vendorID },
                    new SqlParameter { ParameterName = "@asOfDate", Value = dtfrom },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
            };
            SDL = _AMDbContext.PayableAging.FromSqlRaw(sql, parms.ToArray()).ToList();



            if (SDL.Count > 0)
            {
                //decimal total = 0;
                //foreach (var item in SDL)
                //{
                //    total += item.Totalamount;
                //}
                //SDL.Add(new Models.BalanceSheet { acctName = "TOTAL", Totalamount = total });
                // return SDL.OrderBy(x => x.PrimitiveType).ToList();
                return SDL;
            }
            return null;
        }

        [NonAction]
        public async Task<List<CustomerSaleProdWIse>> CustomerSaleProductWise(DateTime dtfrom,DateTime dtTo,int cstId, string prodIds, int locID, int comID)
        {
            List<CustomerSaleProdWIse> SDL;
            string sql = "[Report_CustomerSale_ProductWise]  @dtStart,@dtEnd, @cstID, @prodID, @locID, @comID";

            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value =  dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@prodID", Value = prodIds },
                    new SqlParameter { ParameterName = "@cstID", Value = cstId },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
            };
            SDL = _AMDbContext.CustomerSaleProdWIse.FromSqlRaw(sql, parms.ToArray()).ToList();



            if (SDL.Count > 0)
            {
                //decimal total = 0;
                //foreach (var item in SDL)
                //{
                //    total += item.Totalamount;
                //}
                //SDL.Add(new Models.BalanceSheet { acctName = "TOTAL", Totalamount = total });
                // return SDL.OrderBy(x => x.PrimitiveType).ToList();
                return SDL;
            }
            return null;
        }
        [NonAction]
        public async Task<List<ReceivableAging>> ReceivableAging(DateTime dtTO, int cstID, int locID, int comID)
        {
            List<ReceivableAging> SDL;
            string sql = "[Report_ReceivableAging] @cstID ,@asOfDate ,@locID,@comID";

            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@cstID ", Value = cstID },
                    new SqlParameter { ParameterName = "@asOfDate ", Value = dtTO },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
            };
            SDL = _AMDbContext.ReceivableAging.FromSqlRaw(sql, parms.ToArray()).ToList();



            if (SDL.Count > 0)
            {
                //decimal total = 0;
                //foreach (var item in SDL)
                //{
                //    total += item.Totalamount;
                //}
                //SDL.Add(new Models.BalanceSheet { acctName = "TOTAL", Totalamount = total });
                // return SDL.OrderBy(x => x.PrimitiveType).ToList();
                return SDL;
            }
            return null;
        }
        [NonAction]
        public async Task<List<ChallanReport>> ChallanepRort( string Vfrom, string VTo, int locID, int comID)
        {
            List<ChallanReport> SDL;
            string sql = "[Report_InvoiceWiseSale] @VFrom,@VTo,@locID";

            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@VFrom", Value = Vfrom },
                    new SqlParameter { ParameterName = "@VTo", Value = VTo },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
            };
            SDL = _AMDbContext.ChallanReport.FromSqlRaw(sql, parms.ToArray()).ToList();



            if (SDL.Count > 0)
            {
                //decimal total = 0;
                //foreach (var item in SDL)
                //{
                //    total += item.Totalamount;
                //}
                //SDL.Add(new Models.BalanceSheet { acctName = "TOTAL", Totalamount = total });
                // return SDL.OrderBy(x => x.PrimitiveType).ToList();
                return SDL;
            }
            return null;
        }

        [NonAction]
        public async Task<List<PurchaseOrderGrn>> PurchaseOrderGRN(DateTime dFrom, DateTime dTo,int txTypeID,int vendID, int locID, int comID)
        {
            List<PurchaseOrderGrn> SDL;
            string sql = "[Report_PurchaseHistory] @dtStart,@dtEnd,@txTypId,@vendID,@locID,@comId";

            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart ", Value = dFrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@txTypId", Value = txTypeID },
                    new SqlParameter { ParameterName = "@vendID", Value = vendID },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comId ", Value = comID },
            };
            SDL = _AMDbContext.PurchaseOrderGrn.FromSqlRaw(sql, parms.ToArray()).ToList();



            if (SDL.Count > 0)
            {
                //decimal total = 0;
                //foreach (var item in SDL)
                //{
                //    total += item.Totalamount;
                //}
                //SDL.Add(new Models.BalanceSheet { acctName = "TOTAL", Totalamount = total });
                // return SDL.OrderBy(x => x.PrimitiveType).ToList();
                return SDL;
            }
            return null;
        }


        [NonAction]
        public async Task<List<BonusClaimReport>> BonusClaim(DateTime dtfrom, DateTime dtTo, int comID,int vendID)
        {
            List<BonusClaimReport> SDL;
            string sql = "exec [dbo].[Report_BonusClaim] @dtStart, @dtEnd ,@vendID,@comID";

            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
                    new SqlParameter { ParameterName = "@vendID", Value = vendID },
            };
            SDL = _AMDbContext.BonusClaim.FromSqlRaw(sql, parms.ToArray()).ToList();



            if (SDL.Count > 0)
            {
                //decimal total = 0;
                //foreach (var item in SDL)
                //{
                //    total += item.Totalamount;
                //}
                //SDL.Add(new Models.BalanceSheet { acctName = "TOTAL", Totalamount = total });
                return SDL.OrderBy(x => x.dtTx).ToList();
            }
            return null;
        }
        [NonAction]
        public async Task<List<DiscountClaimReport>> DiscoutClaim(DateTime dtfrom, DateTime dtTo, int comID, int vendID)
        {
            List<DiscountClaimReport> SDL;
            string sql = "exec [dbo].[Report_DiscountClaim] @dtStart, @dtEnd ,@vendID,@comID";

            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
                    new SqlParameter { ParameterName = "@vendID", Value = vendID },
            };
            SDL = _AMDbContext.DiscountClaimReport.FromSqlRaw(sql, parms.ToArray()).ToList();



            if (SDL.Count > 0)
            {
                //decimal total = 0;
                //foreach (var item in SDL)
                //{
                //    total += item.Totalamount;
                //}
                //SDL.Add(new Models.BalanceSheet { acctName = "TOTAL", Totalamount = total });
                return SDL.OrderBy(x => x.dtTx).ToList();
            }
            return null;
        }

        [NonAction]
        public async Task<List<SSRWithAvailabilityReport>>SSRWithAvailability (DateTime dtfrom, DateTime dtTo, int vendID, int groupID, int locID, int comID)
        {
            List<SSRWithAvailabilityReport> SDL;
            string sql = "[dbo].[Report_SSRWithAvailability] @dtStart, @dtEnd, @comID, @groupID, @locID, @vendorID";

            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
                    new SqlParameter { ParameterName = "@groupID", Value = groupID },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@vendorID", Value = vendID },
            };
            SDL = _AMDbContext.SSRWithAvailabilityReport.FromSqlRaw(sql, parms.ToArray()).ToList();



            if (SDL.Count > 0)
            {
                //decimal total = 0;
                //foreach (var item in SDL)
                //{
                //    total += item.Totalamount;
                //}
                //SDL.Add(new Models.BalanceSheet { acctName = "TOTAL", Totalamount = total });
                // return SDL.OrderBy(x => x.expiryDate).ToList();
                return SDL;
            }
            return null;
        }

        [NonAction]
        public async Task<List<ExpenseReport>> ExpenseReport(DateTime dtfrom, DateTime dtTo, string accNo, int locID, int comID)
        {
            try
            {
                List<ExpenseReport> SDL;
                string sql = "[dbo].[Report_ExpenseReport] @dtStart, @dtEnd, @accNo, @comID, @locID";

                     List<SqlParameter> parms = new List<SqlParameter>
                 {
                         new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                         new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                         new SqlParameter { ParameterName = "@accNo", Value = accNo },
                         new SqlParameter { ParameterName = "@comID", Value = comID },
                         new SqlParameter { ParameterName = "@locID", Value = locID },
                 };
                     SDL = _AMDbContext.ExpenseReport.FromSqlRaw(sql, parms.ToArray()).ToList();





                if (SDL.Count > 0)
                {
                    //decimal total = 0;
                    //foreach (var item in SDL)
                    //{
                    //    total += item.Totalamount;
                    //}
                    //SDL.Add(new Models.BalanceSheet { acctName = "TOTAL", Totalamount = total });
                    // return SDL.OrderBy(x => x.expiryDate).ToList();
                    return SDL;
                }
                return null;
            }
            catch (Exception ex)
            {

                throw;
            }

           


        }


        [NonAction]
        public async Task<List<ReceiptJournal>> ReceiptJournal(DateTime dtfrom, DateTime dtTo, int cstID, int locID, int comID)
        {

            List<ReceiptJournal> SDL;
            string sql = "[dbo].[Report_ReciptJournal] @dtStart, @dtEnd, @cstId,  @locID, @comID";

            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@cstId", Value = cstID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
            };
            SDL = _AMDbContext.ReceiptJournal.FromSqlRaw(sql, parms.ToArray()).ToList();





            if (SDL.Count > 0)
            {
                //decimal total = 0;
                //foreach (var item in SDL)
                //{
                //    total += item.Totalamount;
                //}
                //SDL.Add(new Models.BalanceSheet { acctName = "TOTAL", Totalamount = total });
                // return SDL.OrderBy(x => x.expiryDate).ToList();
                return SDL;
            }
            return null;


        }


        [NonAction]
        public async Task<List<SalemanItemWiseSaleReport>> SalemanItemWiseSalesReport(DateTime dtfrom, DateTime dtTo, int comID, int userID, int ProdID)
        {
            
                List<SalemanItemWiseSaleReport> SDL;
                string sql = "[dbo].[Report_SalePersonProductWiseSale] @dtStart, @dtEnd, @comID, @userID, @prodID";

                List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
                    new SqlParameter { ParameterName = "@userID", Value = userID },
                    new SqlParameter { ParameterName = "@prodID", Value = ProdID },
            };
                SDL = _AMDbContext.SalemanItemWiseSaleReport.FromSqlRaw(sql, parms.ToArray()).ToList();

          



            if (SDL.Count > 0)
            {
                //decimal total = 0;
                //foreach (var item in SDL)
                //{
                //    total += item.Totalamount;
                //}
                //SDL.Add(new Models.BalanceSheet { acctName = "TOTAL", Totalamount = total });
                // return SDL.OrderBy(x => x.expiryDate).ToList();
                return SDL;
            }
            return null;


        }
        [NonAction]
        public async Task<List<ItemExpiryListReport>> ItemExpiryListReport(DateTime dtfrom, DateTime dtTo, int comID, int vendID)
        {
            List<ItemExpiryListReport> SDL;
            string sql = "exec [dbo].[Report_ProductExpiryList] @dtStart, @dtEnd ,@vendID,@comID";

            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
                    new SqlParameter { ParameterName = "@vendID", Value = vendID },
            };
            SDL = _AMDbContext.ItemExpiryListReport.FromSqlRaw(sql, parms.ToArray()).ToList();



            if (SDL.Count > 0)
            {
                //decimal total = 0;
                //foreach (var item in SDL)
                //{
                //    total += item.Totalamount;
                //}
                //SDL.Add(new Models.BalanceSheet { acctName = "TOTAL", Totalamount = total });
                return SDL.OrderBy(x => x.expiryDate).ToList();
            }
            return null;
        }
        [NonAction]
        public async Task<List<SaleManeLedgerReport>> SaleManLedgerReport(DateTime dtfrom, DateTime dtTo, int comID, int UserID)
        {
            List<SaleManeLedgerReport> SDL;
            string sql = "exec [dbo].[Report_SalesManLedger] @dtStart, @dtEnd,@comID ,@saleManID";

            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
                    new SqlParameter { ParameterName = "@saleManID", Value = UserID },
            };
            SDL = _AMDbContext.SaleManLedgerReport.FromSqlRaw(sql, parms.ToArray()).ToList();

            for (int i = 0; i <= SDL.Count - 1; i++)
            {
                //if (i == 0) { if (SDL[i].balBF < 0) { plL[i].bal = plL[i].balBF * -1; } if (plL[i].bal == 0) { plL[i].bal = plL[i].balBF; plL[0].DR = 0; }  } //
                if (i == 0) { if (SDL[i].dr > 0) { SDL[i].balBF = SDL[i].dr; } else { SDL[i].balBF = -SDL[i].cr; } } //
                else if (i != 0)
                {

                    if (SDL[i].dr != 0)
                    {
                        SDL[i].balBF = SDL[i - 1].balBF + SDL[i].dr;

                    }
                    else if (SDL[i].cr != 0)
                    {
                        SDL[i].balBF = SDL[i - 1].balBF - SDL[i].cr;

                    }
                }
            }


            if (SDL.Count > 0)
            {
                //decimal total = 0;
                //foreach (var item in SDL)
                //{
                //    total += item.Totalamount;
                //}
                //SDL.Add(new Models.BalanceSheet { acctName = "TOTAL", Totalamount = total });
              //  return SDL.OrderBy(x => x.expiryDate).ToList();
                return SDL.ToList();
            }
            return null;
        }
        [NonAction]
        public async Task<List<SaleManWiseSaleReport>> SaleManWiseSale(DateTime dtfrom, DateTime dtTo, int comID, int UserID)
        {
            List<SaleManWiseSaleReport> SDL;
            string sql = "exec [dbo].[Report_SalePersonWiseSale] @dtStart, @dtEnd, @comID ,@userID";

            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
                    new SqlParameter { ParameterName = "@userID", Value = UserID },
            };
            SDL = _AMDbContext.SaleManWiseSaleReport.FromSqlRaw(sql, parms.ToArray()).ToList();



            if (SDL.Count > 0)
            {
                //decimal total = 0;
                //foreach (var item in SDL)
                //{
                //    total += item.Totalamount;
                //}
                //SDL.Add(new Models.BalanceSheet { acctName = "TOTAL", Totalamount = total });
                //  return SDL.OrderBy(x => x.expiryDate).ToList();
                return SDL.ToList();
            }
            return null;
        }

        [NonAction]
        public async Task<List<StockStatusCumulativeValuation>> StockStatusCumulativeValuation(DateTime dtTo, int locID, int comID, int catID)
        {
            List<StockStatusCumulativeValuation> SDL;
            string sql = "EXEC Report_StockStatusCumulativeValuation @asOfDate,@locID,@comID,@catID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@asOfDate", Value = dtTo.AddDays(1).AddSeconds(-1) },
                new SqlParameter { ParameterName = "@locID", Value = locID },
                new SqlParameter { ParameterName = "@comID", Value = comID },
                new SqlParameter { ParameterName = "@catID", Value = catID }
            };

            SDL = _AMDbContext.StockStatusCumulativeValuation.FromSqlRaw(sql, parms.ToArray()).ToList();

            if (SDL.Count > 0)
            {
                return SDL;
            }
            return null;
        }

        [NonAction]
        public async Task<List<CashBook>> CashBook(DateTime dtfrom, DateTime dtTo, int locID, int comID)
        {

            List<CashBook> SDL;
            string sql = "EXEC Report_CashBook @dtStart,@dtEnd,@locID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
            };

            SDL = _AMDbContext.CashBook.FromSqlRaw(sql, parms.ToArray()).ToList();

            for (int i = 0; i <= SDL.Count - 1; i++)
            {
                if (i == 0 && SDL.Count > 1)
                {

                    if (SDL[i + 1].DR != 0)
                    {
                        SDL[i + 1].bal += SDL[i].balBF;
                    }
                    else if (SDL[i + 1].CR != 0)
                    {
                        SDL[i + 1].bal -= SDL[i].balBF;
                    }

                    SDL[i].bal = SDL[i].balBF;
                }
                else if (i != 0)
                {

                    if (SDL[i].DR != 0)
                    {
                        SDL[i].bal = SDL[i - 1].bal + SDL[i].DR;

                    }
                    else if (SDL[i].CR != 0)
                    {
                        SDL[i].bal = SDL[i - 1].bal - SDL[i].CR;

                    }
                }
            }
            if (SDL.Count > 0)
            {
                return SDL;
            }
            return null;
        }


        [NonAction]
        public async Task<List<InvoiceWiseProfit>> InvoiceWiseProfit(DateTime dtfrom, DateTime dtTo, int locID, int comID)
        {

            List<InvoiceWiseProfit> SDL;
            string sql = "EXEC Report_InvoiceWiseProfit @dtStart,@dtEnd,@locID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
            };

            SDL = _AMDbContext.InvoiceWiseProfit.FromSqlRaw(sql, parms.ToArray()).ToList();

            if (SDL.Count > 0)
            {
                return SDL;
            }
            return null;
        }



        [NonAction]
        public async Task<List<MonthlySales>> MonthlySales(DateTime dtfrom, DateTime dtTo, int locID, int comID)
        {

            List<MonthlySales> SDL;
            string sql = "EXEC Report_MonthlySales @dtStart,@dtEnd,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
            };

            SDL = _AMDbContext.MonthlySales.FromSqlRaw(sql, parms.ToArray()).ToList();


            if (SDL.Count > 0)
            {
                decimal total = 0;
                //foreach (var item in SDL)
                //{
                //    total += item.TotalSalesAmountMonthWise;
                //}

                //SDL.Add(new MonthlySales
                //{
                //    SaleMonth = " "
                //});

                //SDL.Add(new MonthlySales
                //{
                //    SaleMonth = "TOTAL",
                //    TotalSalesAmountMonthWise = total
                //});

                return SDL;
            }
            return null;
        }
        [NonAction]
        public async Task<List<BulkReceipt>> BulkReceipt(DateTime dtfrom, DateTime dtTo, int userId, int locID, int comID)
        {
            try
            {
                List<BulkReceipt> SDL;
                string sql = "EXEC Report_BulkReceipt @dtStart,@dtEnd,@userId,@locId , @comId ";
                List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@userId", Value = userId },
                    new SqlParameter { ParameterName = "@locId", Value = locID },
                    new SqlParameter { ParameterName = "@comId", Value = comID },
            };

                 SDL = _AMDbContext.BulkReceipt.FromSqlRaw(sql, parms.ToArray()).ToList();


                if (SDL.Count > 0)
                {
                    decimal total = 0;
                    //foreach (var item in SDL)
                    //{
                    //    total += item.TotalSalesAmountMonthWise;
                    //}

                    //SDL.Add(new MonthlySales
                    //{
                    //    SaleMonth = " "
                    //});

                    //SDL.Add(new MonthlySales
                    //{
                    //    SaleMonth = "TOTAL",
                    //    TotalSalesAmountMonthWise = total
                    //});

                    return SDL;
                }
                return null;
            }
            catch (Exception ex)
            {

                throw;
            }
           
        }
        [NonAction]

        public async Task<List<MonthWisePartySale>> MonthWisePartySale(DateTime dtfrom, DateTime dtTo, int cstID, int locID, int comID)
        {
            try
            {
                List<MonthWisePartySale> SDL;
                var results = new List<MonthWisePartySale>();
                string sql = "EXEC Report_MonthWisePartySale @dtStart,@dtEnd,@cstID,@locId , @comId ";
                List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@cstID", Value = cstID },
                    new SqlParameter { ParameterName = "@locId", Value = locID },
                    new SqlParameter { ParameterName = "@comId", Value = comID },
            };

                using (var connection = _AMDbContext.Database.GetDbConnection())
                {
                    await connection.OpenAsync();
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = sql;
                        command.CommandType = CommandType.Text;
                        command.Parameters.AddRange(parms.ToArray());

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var record = new MonthWisePartySale
                                {
                                    customerName = reader["customerName"].ToString(), // Assuming "CustomerName" is a fixed column
                                };

                                // Process dynamic columns
                                for (int i = 1; i < reader.FieldCount; i++) // Start from 1 if "CustomerName" is the first column
                                {
                                    string columnName = reader.GetName(i); // Get column name (e.g., month)
                                    if (decimal.TryParse(reader[i].ToString(), out decimal value))
                                    {
                                        record.MonthWiseSales[columnName] = value; // Add to dynamic dictionary
                                    }
                                }

                                // Calculate total sales
                                record.TotalSales = record.MonthWiseSales.Values.Sum();

                                results.Add(record);
                            }
                        }
                    }
                }
                //if (results.Any()) {
                //    results.RemoveAll(x => x.customerName == "");
                //}
                return results.Any() ? results : null;
            }
            catch (Exception ex)
            {
                // Handle exceptions as needed
                throw;
            }
        }
        [NonAction]
        public async Task<List<AdvancedSearch>> AdvancedSearch(DateTime dtfrom, DateTime dtTo, string cstID, string vendID, string prodID, int locID, int comID)
        {

            List<AdvancedSearch> SDL;
            string sql = "EXEC AdvancedSearch @dtStart,@dtEnd,@locID,@comID,@cstID,@vendID,@prodID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
                    new SqlParameter { ParameterName = "@cstID", Value = cstID },
                    new SqlParameter { ParameterName = "@vendID", Value = vendID },
                    new SqlParameter { ParameterName = "@prodID", Value = prodID }
            };

            SDL = _AMDbContext.AdvancedSearch.FromSqlRaw(sql, parms.ToArray()).ToList();

            if (SDL.Count > 0)
            {
                return SDL;
            }
            return null;
        }


        [NonAction]
        public async Task<List<CashRegister>> CashRegister(DateTime dtfrom, DateTime dtTo, int locID, int comID)
        {

            List<CashRegister> SDL;
            string sql = "EXEC Report_CashRegister @dtStart,@dtEnd,@locID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
            };

            SDL = _AMDbContext.CashRegister.FromSqlRaw(sql, parms.ToArray()).ToList();


            if (SDL.Count > 0)
            {
                return SDL;
            }
            return null;
        }

        [NonAction]
        public async Task<List<ItemLedger>> ItemLedger(DateTime dtfrom, DateTime dtTo, string ProdID, int locID, int comID)
        {

            List<ItemLedger> SDL;
            string sql = "EXEC Report_ProductLedger @prodID,@dtStart,@dtEnd,@locID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@prodID", Value = ProdID },
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                            new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },

            };

            SDL = _AMDbContext.ItemLedger.FromSqlRaw(sql, parms.ToArray()).ToList();


            if (SDL.Count > 0)
            {
                return SDL;
            }
            return null;
        }


        [NonAction]
        public async Task<List<ItemWiseProfit>> ItemWiseProfit(DateTime dtfrom, DateTime dtTo, string ProdID, int locID, int comID)
        {

            List<ItemWiseProfit> SDL;
            string sql = "EXEC Report_ItemWiseProfit @prodID,@dtStart,@dtEnd,@locID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@prodID", Value = ProdID },
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },

            };

            SDL = _AMDbContext.ItemWiseProfit.FromSqlRaw(sql, parms.ToArray()).ToList();


            if (SDL.Count > 0)
            {
                return SDL;
            }
            return null;
        }

        [NonAction]
        public async Task<List<BankBook>> BankBook(DateTime dtfrom, DateTime dtTo, string bankID, int locID, int comID)
        {
            List<BankBook> SDL;
            string sql = "EXEC Report_BankBook @dtStart,@dtEnd,@bankID,@locID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@bankID", Value = bankID },
                         new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },

            };

            SDL = _AMDbContext.BankBook.FromSqlRaw(sql, parms.ToArray()).ToList();

            for (int i = 0; i <= SDL.Count - 1; i++)
            {
                if (i == 0)
                {
                    if (SDL[i].balBF < 0) { SDL[i].bal = SDL[i].balBF; }
                    else if (SDL[i].balBF > 0) { SDL[i].bal = SDL[i].balBF; }
                }
                else if (i != 0)
                {
                    if (SDL[i].DR != 0)
                    {
                        SDL[i].bal = SDL[i - 1].bal + SDL[i].bal;
                    }
                    else if (SDL[i].CR != 0)
                    {
                        SDL[i].bal = SDL[i - 1].bal - SDL[i].bal;
                    }
                }
            }

            if (SDL.Count > 0)
            {
                return SDL;
            }
            return null;
        }

        [NonAction]
        public async Task<List<BankBook>> CreditCard(DateTime dtfrom, DateTime dtTo, string bankID, int locID, int comID)
        {
            List<BankBook> SDL;
            string sql = "EXEC Report_CreditCard @dtStart,@dtEnd,@bankID,@locID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@bankID", Value = bankID },
                         new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },

            };

            SDL = _AMDbContext.BankBook.FromSqlRaw(sql, parms.ToArray()).ToList();

            for (int i = 0; i <= SDL.Count - 1; i++)
            {
                if (i == 0)
                {
                    if (SDL[i].balBF < 0) { SDL[i].bal = SDL[i].balBF; }
                    else if (SDL[i].balBF > 0) { SDL[i].bal = SDL[i].balBF; }
                }
                else if (i != 0)
                {
                    if (SDL[i].DR != 0)
                    {
                        SDL[i].bal = SDL[i - 1].bal + SDL[i].bal;
                    }
                    else if (SDL[i].CR != 0)
                    {
                        SDL[i].bal = SDL[i - 1].bal - SDL[i].bal;
                    }
                }
            }

            if (SDL.Count > 0)
            {
                return SDL;
            }
            return null;
        }

        [NonAction]
        public async Task<List<PartyLedger>> PartyLedger(DateTime dtfrom, DateTime dtTo, string CstID, int locID, int comID)
        {

            List<PartyLedger> SDL;
            string sql = "EXEC Report_PartyLedger @dtStart,@dtEnd,@cstID,@locID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@cstID", Value = CstID },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },

            };

            SDL = _AMDbContext.PartyLedger.FromSqlRaw(sql, parms.ToArray()).ToList();

            for (int i = 0; i <= SDL.Count - 1; i++)
            {
                //if (i == 0) { if (SDL[i].balBF < 0) { plL[i].bal = plL[i].balBF * -1; } if (plL[i].bal == 0) { plL[i].bal = plL[i].balBF; plL[0].DR = 0; }  } //
                if (i == 0) { if (SDL[i].DR > 0) { SDL[i].bal = SDL[i].DR; } else { SDL[i].bal = -SDL[i].CR; } } //
                else if (i != 0)
                {

                    if (SDL[i].DR != 0)
                    {
                        SDL[i].bal = SDL[i - 1].bal + SDL[i].DR;

                    }
                    else if (SDL[i].CR != 0)
                    {
                        SDL[i].bal = SDL[i - 1].bal - SDL[i].CR;

                    }
                }
            }

            if (SDL.Count > 0)
            {
                return SDL;
            }
            return null;
        }


        [NonAction]
        public async Task<List<Tax>> TaxReport(DateTime dtfrom, DateTime dtTo, string txtypeID, string cstID, int locID, int comID)
        {

            List<Tax> SDL;
            string sql = "EXEC Report_TaxLedger @dtStart,@dtEnd,@txtypeID,@cstID,@locID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@txTypeID", Value = txtypeID },
                    new SqlParameter { ParameterName = "@cstID", Value = cstID },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },

            };

            SDL = _AMDbContext.Tax.FromSqlRaw(sql, parms.ToArray()).ToList();

            for (int i = 0; i <= SDL.Count - 1; i++)
            {
                //if (i == 0) { if (SDL[i].balBF < 0) { plL[i].bal = plL[i].balBF * -1; } if (plL[i].bal == 0) { plL[i].bal = plL[i].balBF; plL[0].DR = 0; }  } //
                if (i == 0) { if (SDL[i].DR > 0) { SDL[i].bal = SDL[i].DR; } else { SDL[i].bal = -SDL[i].CR; } } //
                else if (i != 0)
                {

                    if (SDL[i].DR != 0)
                    {
                        SDL[i].bal = SDL[i - 1].bal + SDL[i].DR;

                    }
                    else if (SDL[i].CR != 0)
                    {
                        SDL[i].bal = SDL[i - 1].bal - SDL[i].CR;

                    }
                }
            }

            if (SDL.Count > 0)
            {
                return SDL;
            }
            return null;
        }


        [NonAction]
        public async Task<List<Tax>> TaxReportByCustomer(DateTime dtfrom, DateTime dtTo, string txtypeID, string cstID, int locID, int comID)
        {

            List<Tax> SDL;
            string sql = "EXEC Report_TaxLedgerByCustomer @dtStart,@dtEnd,@txtypeID,@cstID,@locID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@txTypeID", Value = txtypeID },
                    new SqlParameter { ParameterName = "@cstID", Value = cstID },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },

            };

            SDL = _AMDbContext.Tax.FromSqlRaw(sql, parms.ToArray()).ToList();

            for (int i = 0; i <= SDL.Count - 1; i++)
            {
                //if (i == 0) { if (SDL[i].balBF < 0) { plL[i].bal = plL[i].balBF * -1; } if (plL[i].bal == 0) { plL[i].bal = plL[i].balBF; plL[0].DR = 0; }  } //
                if (i == 0) { if (SDL[i].DR > 0) { SDL[i].bal = SDL[i].DR; } else { SDL[i].bal = -SDL[i].CR; } } //
                else if (i != 0)
                {

                    if (SDL[i].DR != 0)
                    {
                        SDL[i].bal = SDL[i - 1].bal + SDL[i].DR;

                    }
                    else if (SDL[i].CR != 0)
                    {
                        SDL[i].bal = SDL[i - 1].bal - SDL[i].CR;

                    }
                }
            }

            if (SDL.Count > 0)
            {
                return SDL;
            }
            return null;
        }


        [NonAction]
        public async Task<List<Tax>> TaxReportBySupplier(DateTime dtfrom, DateTime dtTo, string txtypeID, string cstID, int locID, int comID)
        {

            List<Tax> SDL;
            string sql = "EXEC Report_TaxLedgerBySupplier @dtStart,@dtEnd,@txtypeID,@cstID,@locID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@txTypeID", Value = txtypeID },
                    new SqlParameter { ParameterName = "@cstID", Value = cstID },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },

            };

            SDL = _AMDbContext.Tax.FromSqlRaw(sql, parms.ToArray()).ToList();

            for (int i = 0; i <= SDL.Count - 1; i++)
            {
                //if (i == 0) { if (SDL[i].balBF < 0) { plL[i].bal = plL[i].balBF * -1; } if (plL[i].bal == 0) { plL[i].bal = plL[i].balBF; plL[0].DR = 0; }  } //
                if (i == 0) { if (SDL[i].DR > 0) { SDL[i].bal = SDL[i].DR; } else { SDL[i].bal = -SDL[i].CR; } } //
                else if (i != 0)
                {

                    if (SDL[i].DR != 0)
                    {
                        SDL[i].bal = SDL[i - 1].bal + SDL[i].DR;

                    }
                    else if (SDL[i].CR != 0)
                    {
                        SDL[i].bal = SDL[i - 1].bal - SDL[i].CR;

                    }
                }
            }

            if (SDL.Count > 0)
            {
                return SDL;
            }
            return null;
        }



        [NonAction]
        public async Task<List<TaxSummary>> TaxSummaryReport(DateTime dtfrom, DateTime dtTo, string txtypeID, string cstID, int locID, int comID)
        {
            List<TaxSummary> SDL;
            string sql = "EXEC Report_TaxLedgerSummary @dtStart,@dtEnd,@txtypeID,@cstID,@locID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@txTypeID", Value = txtypeID },
                    new SqlParameter { ParameterName = "@cstID", Value = cstID },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },

            };

            SDL = _AMDbContext.TaxSummary.FromSqlRaw(sql, parms.ToArray()).ToList();

            for (int i = 0; i <= SDL.Count - 1; i++)
            {
                //if (i == 0) { if (SDL[i].balBF < 0) { plL[i].bal = plL[i].balBF * -1; } if (plL[i].bal == 0) { plL[i].bal = plL[i].balBF; plL[0].DR = 0; }  } //
                if (i == 0) { if (SDL[i].DR > 0) { SDL[i].bal = SDL[i].DR; } else { SDL[i].bal = -SDL[i].CR; } } //
                else if (i != 0)
                {
                    if (SDL[i].DR != 0)
                    {
                        SDL[i].bal = SDL[i - 1].bal + SDL[i].DR;
                    }
                    else if (SDL[i].CR != 0)
                    {
                        SDL[i].bal = SDL[i - 1].bal - SDL[i].CR;
                    }
                }
            }

            if (SDL.Count > 0)
            {
                decimal totalDebit = SDL.Sum(item => item.DR);
                decimal totalCredit = SDL.Sum(item => item.CR);


                SDL.Add(new TaxSummary
                {
                    voucherID = "TOTAL",
                    DR = totalDebit,
                    CR = totalCredit,
                    bal = SDL.Last().bal
                });
            }

            if (SDL.Count > 0)
            {
                return SDL;
            }
            return null;
        }


        [NonAction]
        public async Task<List<VendorLedger>> VendorLedger(DateTime dtfrom, DateTime dtTo, string vendID, int locID, int comID)
        {

            List<VendorLedger> SDL;
            string sql = "EXEC Report_VendorLedger @dtStart,@dtEnd,@vendID,@locID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@vendID", Value = vendID },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },

            };

            SDL = _AMDbContext.VendorLedger.FromSqlRaw(sql, parms.ToArray()).ToList();

            for (int i = 0; i <= SDL.Count - 1; i++)
            {
                if (i == 0) { if (SDL[i].CR > 0) { SDL[i].bal = SDL[i].CR * -1; } else { SDL[i].bal = SDL[i].CR; } } //
                else if (i != 0)
                {

                    if (SDL[i].DR != 0)
                    {
                        SDL[i].bal = SDL[i - 1].bal + SDL[i].DR;

                    }
                    else if (SDL[i].CR != 0)
                    {
                        SDL[i].bal = SDL[i - 1].bal - SDL[i].CR;

                    }
                    else if (SDL[i].CR == 0)
                    {
                        SDL[i].bal = SDL[i - 1].bal - SDL[i].CR;

                    }
                }
            }


            if (SDL.Count > 0)
            {

                return SDL;
            }
            return null;
        }



        [NonAction]
        public async Task<List<VendorLedger>> CustomerVendorLedger(DateTime dtfrom, DateTime dtTo, string cstID, string vendID, int locID, int comID)
        {

            List<PartyLedger> cstList;
            List<VendorLedger> vndList;
            string sql = "EXEC Report_PartyLedger @dtStart,@dtEnd,@cstID,@locID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@cstID", Value = cstID },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },

            };

            cstList = _AMDbContext.PartyLedger.FromSqlRaw(sql, parms.ToArray()).ToList();

            string sql1 = "EXEC Report_VendorLedger @dtStart,@dtEnd,@vendID,@locID,@comID";
            List<SqlParameter> parms1 = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@vendID", Value = vendID },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },

            };

            vndList = _AMDbContext.VendorLedger.FromSqlRaw(sql1, parms1.ToArray()).ToList();

            // Combine the lists
            var SDL = new List<VendorLedger>();

            // Add PartyLedger items to the combined list
            SDL.AddRange(cstList.Select(c => new VendorLedger
            {
                dtTx = c.dtTx,
                voucherNo = c.voucherNo,
                vendName = c.cstName,
                DR = c.DR,
                CR = c.CR,
                bal = c.bal,
            }));

            // Add VendorLedger items to the combined list
            SDL.AddRange(vndList.Select(v => new VendorLedger
            {
                dtTx = v.dtTx,
                voucherNo = v.voucherNo,
                vendName = v.vendName,
                DR = v.DR,
                CR = v.CR,
                bal = v.bal,
            }));

            SDL = SDL.OrderBy(x => x.dtTx).ToList();
            SDL[1].DR = SDL[0].DR;
            SDL.RemoveAt(0);
            for (int i = 0; i <= SDL.Count - 1; i++)
            {
                if (i == 0) { if (SDL[i].CR > 0) { SDL[i].bal = SDL[i].DR - SDL[i].CR; } else { SDL[i].bal = SDL[i].DR - SDL[i].CR * -1; } } //
                else if (i != 0)
                {
                    if (SDL[i].DR != 0)
                    {
                        SDL[i].bal = SDL[i - 1].bal + SDL[i].DR;
                    }
                    else if (SDL[i].CR != 0)
                    {
                        SDL[i].bal = SDL[i - 1].bal - SDL[i].CR;
                    }
                    else if (SDL[i].CR == 0)
                    {
                        SDL[i].bal = SDL[i - 1].bal - SDL[i].CR;
                    }
                }
            }
            if (SDL.Count > 0)
            {
                return SDL;
            }
            return null;
        }


        [NonAction]
        public async Task<List<AccountsReceivable>> AccountReceivable(DateTime dtfrom, DateTime dtTo, string cstID, int locID, int comID)
        {

            List<AccountsReceivable> SDL;
            string sql = "EXEC Report_AccountsReceivable @asOfDate,@cstID,@locID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@asOfDate", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@cstID", Value = cstID },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },

            };

            SDL = _AMDbContext.AccountsReceivable.FromSqlRaw(sql, parms.ToArray()).ToList();


            if (SDL.Count > 0)
            {
                decimal total = 0;
                //foreach (var item in SDL)
                //{
                //    total += item.balSum;
                //}

                //SDL.Add(new AccountsReceivable
                //{
                //    name = " "
                //});

                //SDL.Add(new AccountsReceivable
                //{
                //    name = "TOTAL RECEIVABLE",
                //    balSum = total
                //});

                return SDL;
            }
            return null;
        }


        [NonAction]
        public async Task<List<AccountsReceivable>> AccountPayable(DateTime dtfrom, DateTime dtTo, string venID, int locID, int comID)
        {

            List<AccountsReceivable> SDL;
            string sql = "EXEC Report_AccountsPayable @asOfDate,@vendID,@locID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@asOfDate", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@vendID", Value = venID },
                    new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },

            };

            SDL = _AMDbContext.AccountsReceivable.FromSqlRaw(sql, parms.ToArray()).ToList();


            if (SDL.Count > 0)
            {
                decimal total = 0;
                //foreach (var item in SDL)
                //{
                //    total += item.balSum;
                //}

                //SDL.Add(new AccountsReceivable
                //{
                //    name = " "
                //});

                //SDL.Add(new AccountsReceivable
                //{
                //    name = "TOTAL PAYABLE",
                //    balSum = total
                //});

                return SDL;
            }
            return null;
        }

        [NonAction]
        public async Task<List<GeneralLedger>> GeneralLedger(DateTime dtfrom, DateTime dtTo, string COAID, int locID, int comID)
        {
            decimal value = 0.0M;

            List<GeneralLedger> SDL;
            string sql = "EXEC Report_GeneralLedger @dtStart,@dtEnd,@COAID,@locID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@COAID", Value = COAID },
                       new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },

            };

            SDL = _AMDbContext.GeneralLedger.FromSqlRaw(sql, parms.ToArray()).ToList();

            SDL = SDL.OrderBy(x => x.txDate).ToList();

            List<GeneralLedger> balList;
            var fy = _AMDbContext.FiscalYear.Where(x => x.active == true && x.comID == comID).ToList()[0].dtStart;
            string sql1 = "EXEC Report_GeneralLedger @dtStart,@dtEnd,@COAID,@locID,@comID";
            List<SqlParameter> parms1 = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = fy },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtfrom.AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@COAID", Value = COAID },
                 new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
            };

            balList = _AMDbContext.GeneralLedger.FromSqlRaw(sql1, parms1.ToArray()).ToList();
            balList = balList.OrderBy(x => x.txDate).ToList();


            foreach (GeneralLedger item in balList)
            {
                if (item.DR != 0)
                {
                    SDL[0].balBF += item.DR;
                }
                else if (item.CR != 0)
                {
                    SDL[0].balBF -= item.CR;
                }
                //SDL[0].balBF += (item.CR + item.DR);
            }
            value = SDL[0].balBF;
            SDL[0].bal = SDL[0].balBF;

            for (int i = 1; i < SDL.Count; i++)
            {
                SDL[i].balBF = value + SDL[i].DR - SDL[i].CR;
                SDL[i].bal = SDL[i].balBF;
                value = SDL[i].balBF;
            }

            if (SDL.Count > 0)
            {
                return SDL;
            }
            return null;
        }
        [NonAction]
        public async Task<List<SaleHistory>> SaleHistory(DateTime dtfrom, DateTime dtTo, string CstID, int locID, int comID)
        {
            List<SaleHistory> SDL;
            string sql = "EXEC Report_SaleHistory @dtStart,@dtEnd,@cstID,@locID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dtStart", Value = dtfrom },
                    new SqlParameter { ParameterName = "@dtEnd", Value = dtTo.AddDays(1).AddSeconds(-1) },
                    new SqlParameter { ParameterName = "@cstID", Value = CstID },
                     new SqlParameter { ParameterName = "@locID", Value = locID },
                    new SqlParameter { ParameterName = "@comID", Value = comID },

            };

            SDL = _AMDbContext.SaleHistory.FromSqlRaw(sql, parms.ToArray()).ToList();


            if (SDL.Count > 0)
            {
                return SDL;
            }
            return null;
        }

        [NonAction]
        public static string AmountInWords(int Num)
        {
            string[] Below20 = { "", "One ", "Two ", "Three ", "Four ",
              "Five ", "Six " , "Seven ", "Eight ", "Nine ", "Ten ", "Eleven ",
            "Twelve " , "Thirteen ", "Fourteen ","Fifteen ",
              "Sixteen " , "Seventeen ","Eighteen " , "Nineteen " };
            string[] Below100 = { "", "", "Twenty ", "Thirty ",
              "Forty ", "Fifty ", "Sixty ", "Seventy ", "Eighty ", "Ninety " };

            string InWords = "";
            if (Num >= 1 && Num < 20)
                InWords += Below20[Num];
            if (Num >= 20 && Num <= 99)
                InWords += Below100[Num / 10] + Below20[Num % 10];
            if (Num >= 100 && Num <= 999)
                InWords += AmountInWords(Num / 100) + "Hundred " + AmountInWords(Num % 100);
            if (Num >= 1000 && Num <= 99999)
                InWords += AmountInWords(Num / 1000) + "Thousand " + AmountInWords(Num % 1000);
            if (Num >= 100000 && Num <= 9999999)
                InWords += AmountInWords(Num / 100000) + "Lac " + AmountInWords(Num % 100000);
            if (Num >= 10000000)
                InWords += AmountInWords(Num / 10000000) + "Crore " + AmountInWords(Num % 10000000);
            return InWords;
        }


        [NonAction]
        public string GetCurrencySymbol(string code)
        {
            RegionInfo regionInfo = (from culture in CultureInfo.GetCultures(CultureTypes.InstalledWin32Cultures)
                                     where culture.Name.Length > 0 && !culture.IsNeutralCulture
                                     let region = new RegionInfo(culture.LCID)
                                     where string.Equals(region.ISOCurrencySymbol, code, StringComparison.InvariantCultureIgnoreCase)
                                     select region).First();

            return regionInfo.CurrencySymbol;
        }

       
    }
}
