using aiPriceGuard.DataAccess.DataSet;
using aiPriceGuard.Models.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using aiPriceGuard.Shared.Common;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;
using System.Text.Json;
//using System.Text.Json;
using aiPriceGuard.Api.Common;
using aiPriceGuard.Models.VMModels;
using aiPriceGuard.Api.Services.Interfaces;
using aiPriceGuard.DataAccess.IRepositories;

namespace aiPriceGuard.Api.Controllers
{
    [Route("api/[Controller]")]
    [ApiController]
    public class FileUploadController : Controller
    {
        private readonly AMDbContext _dbContext;
        private readonly IConfiguration _config;
        private readonly ISupplierService _supplierService;
        private readonly IFileUploadService _fileUploadService;
        private readonly IinvoiceService _invoiceService;

        public FileUploadController(AMDbContext _dbContext, IConfiguration _config, ISupplierService _supplierService, IFileUploadService _fileUploadService,
            IinvoiceService _invoiceService)
        {
            this._dbContext = _dbContext;
            this._config = _config;
            this._supplierService = _supplierService;
            this._fileUploadService = _fileUploadService;
            this._invoiceService = _invoiceService;
        }
        [HttpPost("UpsertFile")]
        public async Task<IActionResult> UpsertFile([FromForm]FileModel model)
        {
            if(model.file!=null && model.file.Length > 0)
            {
                model =await _fileUploadService.AddFile(model);
                
                return Ok(model);
            }

            return BadRequest();
        }
        [HttpGet("GetAllFiles/{comID}")]
        public async Task<IActionResult> GetALLFile(int comID)
        {
           
            var fileList =_fileUploadService.GetAllFileWithSupplier(comID);
            //var fileList = _dbContext.File.Where(x=> x.comID == comID).ToList();
            var res = new ResponsedGroupListVM();
            res.enttityDataSource = fileList;
            res.entityModel = fileList?.GetEntity_MetaData();
            return Ok(res);
        }
       

        private async Task AddProduct(List<InvoiceDetail> List,int supplierID,int comID)
        {
            var products = (from suppProducts in _dbContext.SupplierProducts
                            join product in _dbContext.Products
                            on suppProducts.prodID equals product.prodID
                            where suppProducts.SupplierId == supplierID
                            select new Product
                            {
                                prodCode = product.prodCode,
                            }).ToList();
           var prodUpdatedList = new List<Product>();   
            List.ForEach(item =>
            {
                if (!products.Any(x => x.prodCode == item.ItemCode))
                {
                    Product prod = new Product
                    {
                        prodCode = item.ItemCode,
                        prodName = item.ItemDesc,
                        purchRate = item.PriceEach,
                        qty = item.ShippedQty,
                        comID = comID,
                        active = true,
                        crtDate = DateTime.Now,
                        crtBy = User.FindFirst(ClaimTypes.Email)?.Value
                    };
                    prodUpdatedList.Add(prod);
                }
            });
            await _dbContext.Products.AddRangeAsync(prodUpdatedList);
            await _dbContext.SaveChangesAsync();

            var supplierProductList = new List<SupplierProduct>();
            prodUpdatedList.ForEach(x =>{
                SupplierProduct suppPrdct = new SupplierProduct
                {
                    prodID = x.prodID,
                    SupplierId = supplierID,
                    comID = comID
                };
                supplierProductList.Add(suppPrdct);
            });
            _dbContext.SupplierProducts.AddRange(supplierProductList);
            await _dbContext.SaveChangesAsync();


        }
        private async Task<List<ProductDetail>> MappedProductDetails(List<InvoiceDetail> invoiceDetailList)
        {
            var productDetailList = new List<ProductDetail>();
            invoiceDetailList.ForEach(x =>
            {
                ProductDetail prodDt = new ProductDetail
                {
                    ItemCode = x.ItemCode,
                    Name = x.productName,
                    Price = x.PriceEach,
                    Total = x.Amount,
                    Quantity = x.ShippedQty,
                    SerialNo = x.SerialNo,
                    ProductCode= "2199"
                };

                productDetailList.Add(prodDt);
            });
            return productDetailList;
        }


        //Invoice Entry

        //[HttpGet("ProcessFile/{fileID}/{comID}/{supplierID}")]
        //public async Task<IActionResult> ProcessFile(int fileID, int comID, int supplierID)
        //{

        //    //var supplierFiles
        //    string jerseyPlazaFilePathOne = _config.GetSection("AppSettings:ImgPath").Value + "\\assets\\JsonFiles\\JerseyPlazaInvoice.json";
        //    string AbaliFilePathTwo = _config.GetSection("AppSettings:ImgPath").Value + "\\assets\\JsonFiles\\AbalineInvoice.json";
        //    string DemoSampleFilePathThird = _config.GetSection("AppSettings:ImgPath").Value + "\\assets\\JsonFiles\\Demo_sample.json";

        //    try
        //    {
        //        string jsonJersey = System.IO.File.ReadAllText(jerseyPlazaFilePathOne);
        //        string jsonAbali = System.IO.File.ReadAllText(AbaliFilePathTwo);
        //        string jsonDemoSample = System.IO.File.ReadAllText(DemoSampleFilePathThird);

        //        //jsonString = CleanJson(jsonString);
        //        var option = new JsonSerializerOptions()
        //        {
        //            Converters = { new CustomJsonSerialization<InvoicePDF>() }
        //        };

        //        InvoicePDF invoice = JsonSerializer.Deserialize<InvoicePDF>(jsonAbali, option);
        //        InvoicePDF invoice2 = JsonSerializer.Deserialize<InvoicePDF>(jsonAbali, option);
        //        InvoicePDF invoice3 = JsonSerializer.Deserialize<InvoicePDF>(jsonDemoSample, option);

        //        if (invoice != null)
        //        {
        //            if (invoice.supplier != null)
        //            {
        //                var supplierExist = _dbContext.Supplier.Any(x => x.SupplierName == invoice.supplier.SupplierName);
        //                if (!supplierExist)
        //                {
        //                    invoice.supplier.OCRPrompt = "d";
        //                    invoice.supplier.SupplierCode = "d";

        //                    await _dbContext.Supplier.AddAsync(invoice.supplier);
        //                }
        //            }

        //            if (invoice.InvoiceDetails != null)
        //            {
        //                if (invoice.InvoiceDetails.delAddress != null)
        //                {
        //                    var deliveryAddrObject = invoice.InvoiceDetails.delAddress;
        //                    invoice.InvoiceDetails.DeliveryAddress =
        //                    deliveryAddrObject.Name + deliveryAddrObject.Address + deliveryAddrObject.Street + deliveryAddrObject.StateZip + deliveryAddrObject.City;
        //                }

        //                if (invoice.InvoiceDetails.Summary != null && invoice.InvoiceDetails.Summary.Count > 0)
        //                {
        //                    await AddProduct(invoice.InvoiceDetails.Summary, supplierID, comID);
        //                    await _dbContext.InvoiceDetail.AddRangeAsync(invoice.InvoiceDetails.Summary);
        //                }
        //                else if (invoice.InvoiceDetails.LineItems != null && invoice.InvoiceDetails.LineItems.Count > 0)
        //                {

        //                    await AddProduct(invoice.InvoiceDetails.LineItems, supplierID, comID);

        //                    await _dbContext.InvoiceDetail.AddRangeAsync(invoice.InvoiceDetails.LineItems);
        //                }
        //                else if (invoice.InvoiceDetails.Items != null && invoice.InvoiceDetails.Items.Count > 0)
        //                {
        //                    await AddProduct(invoice.InvoiceDetails.Items, supplierID, comID);

        //                    await _dbContext.InvoiceDetail.AddRangeAsync(invoice.InvoiceDetails.Items);
        //                }
        //                invoice.InvoiceDetails.comID = comID;
        //                invoice.InvoiceDetails.SupplierId = supplierID;
        //                invoice.InvoiceDetails.SupplierFileId = fileID;

        //                await _dbContext.Invoice.AddAsync(invoice.InvoiceDetails);
        //            }

        //            await _dbContext.SaveChangesAsync();
        //        }
        //    }
        //    catch (Exception ex)
        //    {

        //    }
        //    return Ok();
        //}

        //GL Entry Of Json Data
        //[HttpGet("ProcessFile/{fileID}/{comID}")]
        //public async Task<IActionResult> ProcessFile(int fileID,int comID)
        //{

        //    if(comID != 0 && fileID != 0)
        //    {
        //        //var FileDetails = await  _dbContext.File.FindAsync(fileID);
        //        try
        //        {
        //            //Temp
        //            string jsonFilePath = _config.GetSection("AppSettings:ImgPath").Value + "\\assets\\JsonFiles\\InvoiceJson.txt";
        //            string jsonString = System.IO.File.ReadAllText(jsonFilePath);
        //            Invoice invoice = JsonConvert.DeserializeObject<Invoice>(jsonString);

        //            var supplierID = _dbContext.SupplierFile.FirstOrDefault(x => x.FileId == fileID).SupplierId;
        //            Invoice glMasterEntry = new Invoice();
        //            Invoice glDetailEntry = new Invoice();
        //            List<Invoice> glEntries = new List<Invoice>();
        //            var fiscalYear = 2025;
        //            glMasterEntry = new Invoice
        //            {
        //                InvoiceID = 0,
        //                txTypeID = invoice.txTypeID ?? 0, // Use null-coalescing operator to provide default value if null
        //                cstID = 0,
        //                vendID = supplierID ,
        //                depositID = fiscalYear ,
        //                isDeposited = false,
        //                isVoided = false,
        //                isCleared = false,
        //                isPaid = false,
        //                voucherNo = invoice.voucherNo ?? "", // If voucherNo is null, use an empty string
        //                instituteOffer = 0,
        //                creditSum = invoice.creditSum ?? 0, // If creditSum is null, use 0
        //                debitSum = invoice.debitSum ?? 0, // If debitSum is null, use 0
        //                discountSum = invoice.discountSum ?? 0, // If discountSum is null, use 0
        //                extraDiscountSum = invoice.extraDiscountSum ?? 0, // If extraDiscountSum is null, use 0
        //                taxSum = invoice.taxSum ?? 0, // If taxSum is null, use 0
        //                rebateSum = invoice.rebateSum ?? 0, // If rebateSum is null, use 0
        //                paidSum = 0,
        //                dtTx = invoice.dtTx ?? DateTime.Now, // If dtTx is null, use DateTime.Now
        //                locID = invoice.locID ?? 0, // If locID is null, use 0
        //                comID = invoice.comID ?? 0, // If comID is null, use 0
        //                acctNo = "",
        //                relAcctNo = "",
        //                crtDate = DateTime.Now,
        //                modDate = DateTime.Now,
        //                isConverted = false,
        //                checkName = invoice.checkName ?? "", // If checkName is null, use an empty string
        //                balSum = invoice.balSum ?? 0 // If balSum is null, use 0
        //            };


        //            glEntries.Add(glMasterEntry);

        //            foreach (var product in invoice.Products)
        //            {

        //                var productFetched = _dbContext.Products.FirstOrDefault(x=> x.prodName.Trim().ToLower() == product.prodName.Trim().ToLower());
        //                var prodBarCodeFetched = productFetched == null? new ProductBarCode(): _dbContext.ProductBarCodes.FirstOrDefault(x => x.prodID == productFetched.prodID);   
        //                if (productFetched == null)
        //                {

        //                    Product productEntry = new Product();
        //                    productEntry =  product;
        //                    await _dbContext.Products.AddAsync(productEntry);
        //                    await _dbContext.SaveChangesAsync();
        //                    productFetched = productEntry;

        //                    ProductBarCode prodBarCode = new ProductBarCode
        //                    {
        //                        prodID = productEntry.prodID,
        //                        Unit ="Unit",
        //                        Qty = productEntry.qty,
        //                        BarCode="123"
        //                    };
        //                    _dbContext.ProductBarCodes.Add(prodBarCode);
        //                    SupplierProduct supProd = new SupplierProduct
        //                    {
        //                        SupplierId = supplierID,
        //                        Price =  productEntry.purchRate,
        //                        ProdID = productEntry.prodID
        //                    };
        //                    await _dbContext.SupplierProducts.AddAsync(supProd);
        //                    await _dbContext.SaveChangesAsync();
        //                    prodBarCodeFetched = prodBarCode;
        //                }
        //                else
        //                {
        //                     product.prodID = productFetched.prodID;

        //                }
        //                Invoice glEntry1 = new Invoice
        //                {
        //                    InvoiceID = 0,
        //                    txTypeID = invoice.txTypeID ?? 0, // Use null-coalescing to assign 0 if null
        //                    comID = invoice.comID ?? 0, // Ensure comID is assigned a default if it's null
        //                    depositID = fiscalYear,
        //                    locID = invoice.locID ?? 0, // If locID is null, use 0
        //                    cstID = 0,
        //                    vendID = supplierID,
        //                    prodID = productFetched.prodID,
        //                    qty = product.qty ?? 0, // If qty is null, use 0
        //                    bonusQty = invoice.bonusQty ?? 0, // If bonusQty is null, use 0 (if bonusQty can be nullable)
        //                    qtyBal = product.qty ?? 0, // If qtyBal is null, use 0
        //                    unitPrice = product.purchRate ?? 0, // If purchRate is null, use 0
        //                    debitSum = product.totalAmount ?? 0, // If totalAmount is null, use 0
        //                    discountSum = invoice.discountSum ?? 0, // If discountSum is null, use 0
        //                    batchNo = invoice.batchNo ?? "", // If batchNo is null, use empty string
        //                    taxSum = invoice.taxSum ?? 0, // If taxSum is null, use 0
        //                    creditSum = 0, // Default value
        //                    dtTx = invoice.dtTx ?? DateTime.Now, // If dtTx is null, use current DateTime
        //                    expiry = invoice.expiry ?? DateTime.Now, // If expiry is null, use current DateTime
        //                    voucherNo = invoice.voucherNo ?? "", // If voucherNo is null, use empty string
        //                    crtDate = DateTime.Now,
        //                    modDate = DateTime.Now,
        //                    acctNo = invoice.acctNo ?? "", // If acctNo is null, use empty string
        //                    relAcctNo = invoice.relAcctNo ?? "", // If relAcctNo is null, use empty string
        //                    isPaid = false,
        //                    isVoided = false,
        //                    isDeposited = false,
        //                    isCleared = false,
        //                    isConverted = false,
        //                    checkName = invoice.checkName ?? "", // If checkName is null, use empty string
        //                    mrp = invoice.mrp ?? 0, // If mrp is null, use 0
        //                    sellPrice = product.sellRate ?? 0, // If sellRate is null, use 0
        //                    ProdBCID = prodBarCodeFetched.prodBCID                               // lastCost is commented out, if needed, you can handle similarly.
        //                };

        //                glEntries.Add(glEntry1);
        //            }

        //            _dbContext.Invoice.AddRangeAsync(glEntries);
        //            _dbContext.SaveChangesAsync();

        //        }
        //        catch (Exception ex)
        //        {

        //        }
        //        int x=0;
        //    }
        //    return Ok();
        //}
    }
}
