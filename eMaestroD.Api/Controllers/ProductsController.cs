using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Reporting.NETCore;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Reporting.NETCore;
using System.Security.Claims;
using System.Drawing.Imaging;
using System.Drawing;
using System.Drawing.Printing;
using System.Text;
using ClosedXML.Excel;
using eMaestroD.Models.Models;
using eMaestroD.Api.Common;
using eMaestroD.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Models.VMModels;
using eMaestroD.DataAccess.DataSet;
using eMaestroD.Shared.Common;

namespace eMaestroD.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("/api/[controller]")]
    public class ProductsController : Controller
    {
        private readonly AMDbContext _AMDbContext;
        private IWebHostEnvironment _webHostEnvironment;
        private IConfiguration _configuration;
        List<GL> purchaceInvoiceList = new List<GL>();
        private readonly NotificationInterceptor _notificationInterceptor;
        private CustomMethod cm = new CustomMethod();
        private readonly IHttpContextAccessor _httpContextAccessor;
        string username = "";
        public ProductsController(AMDbContext aMDbContext, IWebHostEnvironment webHostEnvironment, NotificationInterceptor notificationInterceptor, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _AMDbContext = aMDbContext;
            _webHostEnvironment = webHostEnvironment;
            _notificationInterceptor = notificationInterceptor;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            username = GetUsername();
        }

        [NonAction]
        public string GetUsername()
        {
            var email = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email);
            var user = _AMDbContext.Users.Where(x => x.Email == email).FirstOrDefault();
            return user.FirstName + " " + user.LastName;
        }

        [HttpGet]
        [Route("{comID}")]
        public async Task<IActionResult> GetAllProducts(int comID)
        {

            var products = await _AMDbContext.Products.Where(x => x.comID == comID && x.active == true).ToListAsync();

            var VAT = await _AMDbContext.Taxes.Where(x => x.isDefault == true).ToListAsync();
            if (VAT.Count > 0 && products.Count > 0)
            {
                products[0].tax = VAT[0].taxValue;
                products[0].taxName = VAT[0].TaxName;
            }
            else if (VAT.Count > 0)
            {
                products.Add(new Product
                {
                    tax = VAT[0].taxValue,
                    taxName = VAT[0].TaxName
                }
                );
            }
            ResponsedGroupListVM vM = new ResponsedGroupListVM();
            vM.enttityDataSource = products;
            vM.entityModel = products?.GetEntity_MetaData();

            return Ok(vM);

        }

        [HttpGet("GetProducts/{comID}/{prodBCID}")]
        public async Task<IActionResult> GetProducts(int comID, int prodBCID = 0)
        {
            var products = await _AMDbContext.Set<ProductViewModel>()
                .FromSqlRaw("EXEC GetProducts @comID = {0}, @prodBCID = {1}", comID, prodBCID)
                .ToListAsync();

            if (products == null || !products.Any())
            {
                return NotFound();
            }

            return Ok(products);
        }

        [HttpGet]
        [Route("getAllProductWithCategory/{comID}")]
        public async Task<IActionResult> GetAllProductsWithCategory(int comID)
        {

            var products = await _AMDbContext.Products.Where(x => x.comID == comID && x.active == true).ToListAsync();

            var productIds = products.Select(x => x.prodID).ToList();
            
            var productGrpIds = products.Select(x => x.prodGrpID).ToList();
            var prodGroups = await _AMDbContext.ProdGroups
                .Where(x => productGrpIds.Contains(x.prodGrpID))
                .ToListAsync();

            var productBarCodes = await _AMDbContext.ProductBarCodes
                .Where(x => productIds.Contains(x.prodID))
                .ToListAsync();

            foreach (var product in products)
            {
                var prodGroup = prodGroups.FirstOrDefault(x => x.prodGrpID == product.prodGrpID);
                product.prodGrpName = prodGroup?.prodGrpName;
                product.ProductBarCodes = productBarCodes.Where(x => x.prodID == product.prodID).ToList();
            }

            var VAT = await _AMDbContext.Taxes.Where(x => x.isDefault == true).ToListAsync();
            if (VAT.Count > 0 && products.Count > 0)
            {
                products[0].tax = VAT[0].taxValue;
                products[0].taxName = VAT[0].TaxName;
            }
            else if (VAT.Count > 0)
            {
                products.Add(new Product{
                        tax = VAT[0].taxValue,
                        taxName = VAT[0].TaxName
                    });
            }
            ResponsedGroupListVM vM = new ResponsedGroupListVM();
            vM.enttityDataSource = products;
            vM.entityModel = products?.GetEntity_MetaData();

            return Ok(vM);

        }

        [HttpGet]
        [Route("GetOneProductDetail/{comID}/{prodID}")]
        public async Task<IActionResult> GetOneProductDetail(int comID, int prodID)
        {

            var product = await _AMDbContext.Products.Where(x => x.comID == comID && x.prodID == prodID && x.active == true).FirstOrDefaultAsync();

          
            var productBarCodes = await _AMDbContext.ProductBarCodes
                .Where(x => x.prodID == prodID)
                .ToListAsync();

            product.ProductBarCodes = productBarCodes;

            return Ok(product);

        }


        [HttpPost]
        public async Task<IActionResult> AddProduct([FromBody] Product product)
        {
            product.prodCode = product.prodCode.Trim();
            product.prodName = product.prodName.Trim();
            if (product.prodID != 0)
            {
                var existList = _AMDbContext.Products.Where(x => x.prodID != product.prodID && x.comID == product.comID && (x.prodCode == product.prodCode || x.prodName == product.prodName)).ToList();
                if (existList.Count() == 0)
                {
                    product.modDate = DateTime.Now;
                    product.modby = username;
                    _AMDbContext.Products.Update(product);


                    _AMDbContext.ProductBarCodes.UpdateRange(product.ProductBarCodes);
                    await _AMDbContext.SaveChangesAsync();

                    _notificationInterceptor.SaveNotification("ProductsEdit", product.comID, "");
                }
                else
                {
                    return NotFound("Product Name/Code Already Exists!");
                }
            }
            else
            {
                var existList = _AMDbContext.Products.Where(x => x.comID == product.comID && (x.prodCode == product.prodCode || x.prodName == product.prodName)).ToList();
                if (existList.Count() == 0)
                {
                    product.crtDate = product.modDate = DateTime.Now;
                    product.crtBy = product.modby = username;
                    await _AMDbContext.Products.AddAsync(product);
                    await _AMDbContext.SaveChangesAsync();

                    foreach (var item in product.ProductBarCodes)
                    {
                        item.prodID = product.prodID;
                    }
                    //ProductBarCodes pd = new ProductBarCodes()
                    //{
                    //    prodID = product.prodID,
                    //    BarCode = product.prodCode,
                    //    Qty = 1,
                    //    Unit = product.prodUnit,
                    //    Active = true,
                    //};
                    await _AMDbContext.ProductBarCodes.AddRangeAsync(product.ProductBarCodes);
                    await _AMDbContext.SaveChangesAsync();



                    //if (product.qty > 0)
                    //{
                    //    Int32 fiscalYear = _AMDbContext.FiscalYear.Where(x => x.active == true).FirstOrDefault().period;
                    //    Int32 VendID = _AMDbContext.Vendors.Where(x => x.vendName.ToUpper() == "OPENING STOCK").FirstOrDefault().vendID;
                    //    String voucherNo = "";
                    //    decimal totalAmount = 0M;
                    //    decimal totalQty = 0M;
                    //    string sql = "EXEC GenerateVoucherNo @txType";
                    //    List<SqlParameter> parms = new List<SqlParameter>
                    //    {
                    //    new SqlParameter { ParameterName = "@txType", Value = 1 },
                    //    };
                    //    voucherNo = _AMDbContext.invoiceNo.FromSqlRaw<invoiceNo>(sql, parms.ToArray()).ToList().FirstOrDefault().voucherNo;

                    //    #region MasterEntryForPurchaseInvoice
                    //    GL msterEntry = new GL()
                    //    {
                    //        relCOAID = 83,
                    //        crtDate = DateTime.Now,
                    //        modDate = DateTime.Now,
                    //        COAID = 98,
                    //        depositID = fiscalYear,
                    //        txTypeID = 1,
                    //        vendID = VendID,
                    //        // balSum = 0M,//because is not paid completely
                    //        isPaid = false,
                    //        isCleared = false,
                    //        isVoided = false,
                    //        isDeposited = false,
                    //        voucherNo = voucherNo,
                    //        dtTx = DateTime.Now,
                    //        dtDue = DateTime.Now,
                    //        glComments = "FromUploadTool",
                    //        paidSum = 0
                    //    };

                    //    GL glItem = new GL();

                    //    glItem.COAID = 98;
                    //    glItem.relCOAID = 83;
                    //    glItem.txTypeID = 1;
                    //    glItem.depositID = fiscalYear;
                    //    glItem.locID = 1;
                    //    glItem.vendID = VendID;
                    //    glItem.prodID = product.prodID;
                    //    glItem.qty = product.qty;
                    //    glItem.qtyBal = glItem.qty;
                    //    glItem.unitPrice = product.purchRate;
                    //    glItem.acctBal = (glItem.qty * product.purchRate) / glItem.qty;
                    //    glItem.debitSum = product.purchRate * (glItem.qty);
                    //    glItem.dtTx = DateTime.Now + DateTime.Now.TimeOfDay;
                    //    glItem.isVoided = glItem.isDeposited = glItem.isCleared = glItem.isPaid = false;
                    //    glItem.checkName = product.prodCode;
                    //    glItem.voucherNo = voucherNo;
                    //    glItem.crtDate = glItem.modDate =  DateTime.Now + DateTime.Now.TimeOfDay;

                    //    totalQty += glItem.qty;
                    //    totalAmount += glItem.debitSum;

                    //    purchaceInvoiceList.Add(glItem);
                    //    #endregion

                    //    #region CashLedgerEntry

                    //    GL glPayment = new GL();

                    //    glPayment.COAID = 83;
                    //    glPayment.relCOAID = 98;
                    //    glPayment.txTypeID = 1;
                    //    glPayment.depositID = fiscalYear;
                    //    glPayment.locID = 1;
                    //    glPayment.vendID = VendID;
                    //    glPayment.balSum = glPayment.creditSum = totalAmount;
                    //    glPayment.dtTx = glPayment.dtDue = DateTime.Now + DateTime.Now.TimeOfDay;
                    //    glPayment.voucherNo = voucherNo;
                    //    glPayment.crtDate = glPayment.modDate = DateTime.Now + DateTime.Now.TimeOfDay;
                    //    glPayment.isVoided = glPayment.isCleared = glPayment.isDeposited = glPayment.isPaid = false;

                    //    purchaceInvoiceList.Add(glPayment);

                    //    #endregion


                    //    msterEntry.balSum = msterEntry.debitSum = totalAmount;

                    //    purchaceInvoiceList.Insert(0, msterEntry);

                    //    var gl1 = 0;
                    //    foreach (var item in purchaceInvoiceList)
                    //    {
                    //        if (gl1 != 0)
                    //        {
                    //            item.txID = gl1;
                    //        }
                    //        await _AMDbContext.gl.AddAsync(item);
                    //        await _AMDbContext.SaveChangesAsync();
                    //        if (gl1 == 0)
                    //        {
                    //            gl1 = item.GLID;
                    //        }
                    //    }

                    //}

                    _notificationInterceptor.SaveNotification("ProductsCreate", product.comID, "");
                }
                else
                {
                    return NotFound("Product Name/Code Already Exists!");
                }
            }

            return Ok(product);
        }

        [HttpDelete]
        [Route("{prodID}")]
        public async Task<IActionResult> DeleteProduct(int prodID)
        {
            var glList = _AMDbContext.gl.Where(x => x.prodID == prodID).ToList();
            if (glList.Count > 0)
            {
                return NotFound("Some Invoices Depend on this Product, Please delete invoice first.");
            }

            var list = _AMDbContext.Products.Where(a => a.prodID == prodID).ToList();
            _AMDbContext.RemoveRange(_AMDbContext.Products.Where(a => a.prodID == prodID));
            _AMDbContext.RemoveRange(_AMDbContext.ProductBarCodes.Where(a => a.prodID == prodID));
            await _AMDbContext.SaveChangesAsync();
            _notificationInterceptor.SaveNotification("ProductsDelete", list[0].comID, "");

            return Ok();
        }

        [HttpGet]
        [Route("GetStockofProduct/{prdID:int}/{comID:int}")]
        public IActionResult GetStockofProduct(int prdID, int comID)
        {
            List<Stock> list;
            string sql = "EXEC GetAvailStockByProdID @prdID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                 new SqlParameter { ParameterName = "@prdID", Value = prdID },
                 new SqlParameter { ParameterName = "@comID", Value = comID }
            };

            list = _AMDbContext.Stock.FromSqlRaw(sql, parms.ToArray()).ToList();
            return Ok(list);
        }

        [HttpGet]
        [Route("GetLowStockProducts/{comID:int}")]
        public IActionResult GetLowStockProducts(int comID)
        {
            List<Stock> list;
            string sql = "EXEC GetLowStockProducts @comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                 new SqlParameter { ParameterName = "@comID", Value = comID }
            };

            list = _AMDbContext.Stock.FromSqlRaw(sql, parms.ToArray()).ToList();
            return Ok(list);
        }

        [HttpPost("uploadProducts")]
        public async Task<IActionResult> uploadProductsAsync()
        {
            try
            {
                var comID = int.Parse(Request.Headers["comID"].ToString());

                int fiscalYear = _AMDbContext.FiscalYear.Where(x => x.active == true && x.comID == comID).FirstOrDefault().period;
                string voucherNo = "";
                decimal totalAmount = 0M;
                decimal totalQty = 0M;

                var form = Request.Form;
                var list = new List<Product>();
                int countNotInsertedRow = 0;
                int countInsertedRow = 0;
                int countWrongCompanyName = 0;
                int countEmptyRow = 0;
                string ExistRowNumber = "";
                string EmptyRowNumber = "";
                string EmptyRowNumberForCompany = "";
                foreach (var file in form.Files)
                {
                    using (var stream = new MemoryStream())
                    {
                        file.CopyTo(stream);
                        using (var workbook = new XLWorkbook(stream))
                        {
                            var worksheet = workbook.Worksheet(1);

                            // Process the worksheet and extract data
                            // For example, you can read cells like this:
                            if (
                               worksheet.Cell(1, 1).Value.ToString() == "CATEGORY" &&
                               worksheet.Cell(1, 2).Value.ToString() == "CODE" &&
                               worksheet.Cell(1, 3).Value.ToString() == "NAME" &&
                               worksheet.Cell(1, 4).Value.ToString() == "TYPE" &&
                               worksheet.Cell(1, 5).Value.ToString() == "UNIT" &&
                               worksheet.Cell(1, 6).Value.ToString() == "PURCHASE RATE" &&
                               worksheet.Cell(1, 7).Value.ToString() == "SELL RATE" &&
                               worksheet.Cell(1, 8).Value.ToString() == "MIN QTY" &&
                               worksheet.Cell(1, 9).Value.ToString() == "MAX QTY" &&
                               worksheet.Cell(1, 10).Value.ToString() == "OPENING STOCK"
                               )
                            {
                                for (int i = 2; i <= worksheet.RowsUsed().Count(); i++)
                                {
                                    var company = _AMDbContext.Companies.Where(x => x.comID == comID).ToList();
                                    if (company.Count() == 1)
                                    {
                                        var vendList = _AMDbContext.Vendors.Where(x => x.active == true && x.comID == company.FirstOrDefault().comID && x.vendName.ToUpper() == "OPENING STOCK").FirstOrDefault();
                                        int VendID = vendList.vendID;

                                        var existList = _AMDbContext.Products.Where(x => x.comID == company.FirstOrDefault().comID && (x.prodCode == worksheet.Cell(i, 2).Value.ToString() || x.prodName == worksheet.Cell(i, 3).Value.ToString()));
                                        if (existList.Count() == 0)
                                        {
                                            var prdGrpName = worksheet.Cell(i, 1).Value.ToString();
                                            Product p = new Product();
                                            p.prodID = 0;
                                            var categoryList = _AMDbContext.ProdGroups.Where(x => x.prodGrpName == prdGrpName && x.comID == company.FirstOrDefault().comID).ToList();
                                            if (categoryList.Count > 0) { p.prodGrpID = categoryList[0].prodGrpID; }
                                            else
                                            {
                                                ProdGroups pg = new ProdGroups()
                                                {
                                                    active = true,
                                                    prodGrpName = prdGrpName,
                                                    prodGrpTypeID = 1,
                                                    parentProdGrpID = 0,
                                                    comID = company.FirstOrDefault().comID,
                                                    crtBy = username,
                                                    crtDate = DateTime.Now,
                                                    modby = username,
                                                    modDate = DateTime.Now
                                                };
                                                await _AMDbContext.ProdGroups.AddAsync(pg);
                                                _AMDbContext.SaveChanges();

                                                p.prodGrpID = pg.prodGrpID;
                                            }
                                            p.prodCode = worksheet.Cell(i, 2).Value.ToString().Trim();
                                            p.prodName = worksheet.Cell(i, 3).Value.ToString().Trim();
                                            if (p.prodCode != "" && p.prodName != "" && company.Count() == 1)
                                            {
                                                if (worksheet.Cell(i, 4).Value.ToString().ToLower() == "service")
                                                {
                                                    p.descr = "Service";
                                                }
                                                else
                                                {
                                                    p.descr = "Goods";
                                                }
                                                p.prodUnit = worksheet.Cell(i, 5).Value.ToString();
                                                p.purchRate = decimal.Parse(worksheet.Cell(i, 6).Value.ToString() == "" ? "0" : worksheet.Cell(i, 6).Value.ToString());
                                                p.sellRate = decimal.Parse(worksheet.Cell(i, 7).Value.ToString() == "" ? "0" : worksheet.Cell(i, 7).Value.ToString());
                                                p.minQty = decimal.Parse(worksheet.Cell(i, 8).Value.ToString() == "" ? "0" : worksheet.Cell(i, 8).Value.ToString());
                                                p.maxQty = decimal.Parse(worksheet.Cell(i, 9).Value.ToString() == "" ? "0" : worksheet.Cell(i, 9).Value.ToString());
                                                p.active = true;
                                                p.comID = company.FirstOrDefault().comID;

                                                p.crtDate = p.modDate = DateTime.Now;
                                                p.crtBy = p.modby = username;

                                                await _AMDbContext.Products.AddAsync(p);
                                                await _AMDbContext.SaveChangesAsync();
                                                p.prodGrpName = prdGrpName;
                                                list.Add(p);
                                                ProductBarCodes pd = new ProductBarCodes()
                                                {
                                                    prodID = p.prodID,
                                                    BarCode = p.prodCode,
                                                    Qty = 1,
                                                    Unit = p.prodUnit,
                                                    Active = true,
                                                };
                                                await _AMDbContext.ProductBarCodes.AddAsync(pd);
                                                await _AMDbContext.SaveChangesAsync();
                                                countInsertedRow++;
                                                decimal qty = 0;
                                                qty = decimal.Parse(worksheet.Cell(i, 10).Value.ToString() == "" ? "0" : worksheet.Cell(i, 10).Value.ToString());
                                                if (qty > 0)
                                                {
                                                    string sql = "EXEC GenerateVoucherNo @txType, @comID";
                                                    List<SqlParameter> parms = new List<SqlParameter>
                                                {
                                                new SqlParameter { ParameterName = "@txType", Value = 1 },
                                                new SqlParameter { ParameterName = "@comID", Value = comID }
                                                };
                                                    voucherNo = _AMDbContext.invoiceNo.FromSqlRaw(sql, parms.ToArray()).ToList().FirstOrDefault().voucherNo;

                                                    #region MasterEntryForPurchaseInvoice
                                                    GL msterEntry = new GL()
                                                    {
                                                        relCOAID = 83,
                                                        crtDate = DateTime.Now,
                                                        modDate = DateTime.Now,
                                                        COAID = 98,
                                                        depositID = fiscalYear,
                                                        txTypeID = 1,
                                                        vendID = VendID,
                                                        // balSum = 0M,//because is not paid completely
                                                        isPaid = false,
                                                        isCleared = false,
                                                        isVoided = false,
                                                        isDeposited = false,
                                                        voucherNo = voucherNo,
                                                        dtTx = DateTime.Now,
                                                        dtDue = DateTime.Now,
                                                        glComments = "FromUploadTool",
                                                        paidSum = 0,
                                                        crtBy = username,
                                                        modBy = username
                                                    };

                                                    GL glItem = new GL();

                                                    glItem.COAID = 98;
                                                    glItem.relCOAID = 83;
                                                    glItem.txTypeID = 1;
                                                    glItem.depositID = fiscalYear;
                                                    glItem.locID = 1;
                                                    glItem.vendID = VendID;
                                                    glItem.prodID = p.prodID;
                                                    glItem.qty = qty;
                                                    glItem.qtyBal = glItem.qty;
                                                    glItem.unitPrice = p.purchRate;
                                                    glItem.discountSum = 0;
                                                    glItem.debitSum = p.purchRate * glItem.qty;
                                                    glItem.dtTx = DateTime.Now;
                                                    glItem.isVoided = glItem.isDeposited = glItem.isCleared = glItem.isPaid = false;
                                                    glItem.checkName = p.prodCode;
                                                    glItem.voucherNo = voucherNo;
                                                    glItem.crtDate = glItem.modDate = DateTime.Now;
                                                    glItem.crtBy = glItem.modBy = username;

                                                    totalQty += glItem.qty;
                                                    totalAmount += glItem.debitSum;

                                                    purchaceInvoiceList.Add(glItem);
                                                    #endregion

                                                    #region CashLedgerEntry

                                                    GL glPayment = new GL();

                                                    glPayment.COAID = 83;
                                                    glPayment.relCOAID = 98;
                                                    glPayment.txTypeID = 1;
                                                    glPayment.depositID = fiscalYear;
                                                    glPayment.locID = 1;
                                                    glPayment.vendID = VendID;
                                                    glPayment.balSum = glPayment.creditSum = totalAmount;
                                                    glPayment.dtTx = glPayment.dtDue = DateTime.Now;
                                                    glPayment.voucherNo = voucherNo;
                                                    glPayment.crtDate = glPayment.modDate = DateTime.Now;
                                                    glPayment.crtBy = glPayment.modBy = username;
                                                    glPayment.isVoided = glPayment.isCleared = glPayment.isDeposited = glPayment.isPaid = false;

                                                    purchaceInvoiceList.Add(glPayment);

                                                    #endregion


                                                    msterEntry.balSum = msterEntry.debitSum = totalAmount;


                                                    purchaceInvoiceList.Insert(0, msterEntry);

                                                    var gl1 = 0;
                                                    foreach (var item in purchaceInvoiceList)
                                                    {
                                                        if (gl1 != 0)
                                                        {
                                                            item.txID = gl1;
                                                        }
                                                        await _AMDbContext.gl.AddAsync(item);
                                                        await _AMDbContext.SaveChangesAsync();
                                                        if (gl1 == 0)
                                                        {
                                                            gl1 = item.GLID;
                                                        }
                                                    }
                                                    purchaceInvoiceList.Clear();
                                                    totalAmount = 0;
                                                    totalQty = 0;
                                                }
                                            }
                                            else
                                            {
                                                countEmptyRow++;
                                                EmptyRowNumber = EmptyRowNumber + i + " , ";
                                            }
                                        }
                                        else
                                        {
                                            countNotInsertedRow++;
                                            ExistRowNumber = ExistRowNumber + i + " , ";
                                        }
                                    }
                                    else
                                    {
                                        countWrongCompanyName++;
                                        EmptyRowNumberForCompany = EmptyRowNumberForCompany + i + " , ";
                                    }
                                }
                            }
                            else
                            {
                                return BadRequest("header name is incorrect");
                            }
                        }
                    }
                }

                if (countInsertedRow == 0 && countNotInsertedRow > 0)
                {
                    return NotFound("All Products Already Exists!");

                }

                if (countInsertedRow == 0 && countNotInsertedRow == 0 && countWrongCompanyName > 0)
                {
                    return NotFound("Please write correct company name");

                }
                if (list.Count > 0)
                {
                    string text = "";
                    if (countNotInsertedRow > 0)
                    {
                        text = " , Already Exist On Row Number : " + ExistRowNumber.Remove(ExistRowNumber.Length - 2, 1);
                    }
                    if (countEmptyRow > 0)
                    {
                        text = text + " , Fill Empty Blanks On Row Number : " + EmptyRowNumber.Remove(EmptyRowNumber.Length - 2, 1);
                    }
                    if (countWrongCompanyName > 0)
                    {
                        text = text + " , Company name not correct on Row Number : " + EmptyRowNumberForCompany.Remove(EmptyRowNumberForCompany.Length - 2, 1);
                    }
                    list[0].comment = countInsertedRow.ToString() + " Out Of " + (countInsertedRow + countNotInsertedRow + countEmptyRow + countWrongCompanyName) + " Inserted Successfully!".ToString() + text;
                    return Ok(list);
                }
                return NotFound("Please Upload Correct File.");
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

        }

        [HttpPost("confirmProductCategory")]
        public async Task<IActionResult> confirmProductCategory()
        {
            try
            {
                var comID = int.Parse(Request.Headers["comID"].ToString());

                var form = Request.Form;
                var list = new List<ProdGroups>();
                foreach (var file in form.Files)
                {
                    using (var stream = new MemoryStream())
                    {
                        file.CopyTo(stream);
                        using (var workbook = new XLWorkbook(stream))
                        {
                            var worksheet = workbook.Worksheet(1);

                            // Process the worksheet and extract data
                            // For example, you can read cells like this:
                            if (
                               worksheet.Cell(1, 1).Value.ToString() == "prodGrpName" &&
                               worksheet.Cell(1, 2).Value.ToString() == "prodCode" &&
                               worksheet.Cell(1, 3).Value.ToString() == "prodName" &&
                               worksheet.Cell(1, 4).Value.ToString() == "type" &&
                               worksheet.Cell(1, 5).Value.ToString() == "prodUnit" &&
                               worksheet.Cell(1, 6).Value.ToString() == "purchRate" &&
                               worksheet.Cell(1, 7).Value.ToString() == "sellRate" &&
                               worksheet.Cell(1, 8).Value.ToString() == "minQty" &&
                               worksheet.Cell(1, 9).Value.ToString() == "maxQty" &&
                               worksheet.Cell(1, 10).Value.ToString() == "openingStock"
                               )
                            {
                                for (int i = 2; i <= worksheet.RowsUsed().Count(); i++)
                                {
                                    var prdGrpName = worksheet.Cell(i, 1).Value.ToString();
                                    var categoryList = _AMDbContext.ProdGroups.Where(x => x.prodGrpName == prdGrpName && x.comID == comID).ToList();
                                    if (categoryList.Count == 0) { list.Add(new ProdGroups { prodGrpName = prdGrpName }); }
                                }
                            }
                            else
                            {
                                return BadRequest("header name is incorrect");
                            }
                        }
                    }
                }

                if (list.Count > 0)
                {
                    var lst = list.DistinctBy(x => x.prodGrpName).ToList();
                    return Ok(lst.OrderBy(x => x.prodGrpName));
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return NotFound("Please Upload Correct File.");
            }

        }

        [HttpPost("BarcodeGenerator")]
        public async Task<IActionResult> BarcodeGenerator(List<Product> prodList)
        {
            //int quantity = int.Parse(prodList[0].unitQty.ToString());
            List<Product> duplicatedProdList = new List<Product>();

            var pageSetting = _AMDbContext.BarcodeConfigSettings.ToList();

            string pageWidth = pageSetting.FirstOrDefault(x=>x.key == "pageWidth").value;
            string pageHeight = pageSetting.FirstOrDefault(x => x.key == "pageHeight").value;
            string marginTop = pageSetting.FirstOrDefault(x => x.key == "marginTop").value;
            string marginLeft = pageSetting.FirstOrDefault(x => x.key == "marginLeft").value;
            string marginRight = pageSetting.FirstOrDefault(x => x.key == "marginRight").value;
            string marginBottom = pageSetting.FirstOrDefault(x => x.key == "marginBottom").value;
            string noOfBarcode = pageSetting.FirstOrDefault(x => x.key == "noOfBarcode").value;
            string unit = pageSetting.FirstOrDefault(x => x.key == "unit").value;

            foreach (var item in prodList)
            {
                Zen.Barcode.Code128BarcodeDraw barcode = Zen.Barcode.BarcodeDrawFactory
                                              .Code128WithChecksum;
                item.barcodeImage = (byte[])new ImageConverter().ConvertTo(barcode.Draw(item.prodCode, 50), typeof(byte[]));

                for (int i = 0; i < int.Parse(item.unitQty.ToString()); i++)
                {
                    duplicatedProdList.Add(item);
                }
            }

            
           
            var basePath = _configuration.GetSection("AppSettings:ImgPath").Value;
            // Set report parameters if needed
            // localReport.SetParameters(...);
            var tenantID = cm.Decrypt(HttpContext.User.FindFirst(ClaimTypes.Upn).Value);
            TextReader tr;
            string rptxml = "";
            if (int.Parse(noOfBarcode) == 1)
            {
                float[] resizedwidth;
                rptxml = System.IO.File.ReadAllText(@"RDLC/OneBarcode.rdlc");
                int start = rptxml.IndexOf("<TablixColumns>");
                int end = rptxml.IndexOf("</TablixColumns>") + "</TablixColumns>".Length;
                string resizedcolumns = string.Format(
                    "<TablixColumns>"
                    + "<TablixColumn><Width>{0}</Width></TablixColumn>"
                    + "</TablixColumns>"
                    , (float.Parse(pageWidth) - float.Parse(marginLeft) - float.Parse(marginRight) - 5).ToString() + unit
                    );
                rptxml = rptxml.Substring(0, start) + resizedcolumns + rptxml.Substring(end);
            }
            else if (int.Parse(noOfBarcode) == 2)
            {
                float[] resizedwidth;
                rptxml = System.IO.File.ReadAllText(@"RDLC/Barcode.rdlc");
                int start = rptxml.IndexOf("<TablixColumns>");
                int end = rptxml.IndexOf("</TablixColumns>") + "</TablixColumns>".Length;
                string resizedcolumns = string.Format(
                    "<TablixColumns>"
                    + "<TablixColumn><Width>{0}</Width></TablixColumn>"
                    + "</TablixColumns>"
                    , ((float.Parse(pageWidth) - float.Parse(marginLeft) - float.Parse(marginRight)) / 2 - 3).ToString() + unit
                    );
                rptxml = rptxml.Substring(0, start) + resizedcolumns + rptxml.Substring(end);

                int start1 = rptxml.LastIndexOf("<TablixColumns>");
                int end1 = rptxml.LastIndexOf("</TablixColumns>") + "</TablixColumns>".Length;
                string resizedcolumns1 = string.Format(
                    "<TablixColumns>"
                    + "<TablixColumn><Width>{0}</Width></TablixColumn>"
                    + "</TablixColumns>"
                    , ((float.Parse(pageWidth) - float.Parse(marginLeft) - float.Parse(marginRight)) / 2 - 3).ToString() + unit
                    );
                rptxml = rptxml.Substring(0, start1) + resizedcolumns1 + rptxml.Substring(end1);
            }


            tr = new StringReader(rptxml);

            LocalReport localReport = new LocalReport();
            localReport.EnableExternalImages = true;
            //localReport.ReportPath = "RDLC/Barcode.rdlc";
            localReport.LoadReportDefinition(tr);
            localReport.DataSources.Clear();
            localReport.DataSources.Add(new ReportDataSource("DataSet1", duplicatedProdList));

            string deviceInfo = string.Format(@"<DeviceInfo> 
                                                <OutputFormat>EMF</OutputFormat>
                                                <PageWidth>{0}</PageWidth>
                                                <PageHeight>{1}</PageHeight>
                                                <MarginTop>{2}</MarginTop>
                                                <MarginLeft>{3}</MarginLeft>
                                                <MarginRight>{4}</MarginRight>
                                                <MarginBottom>{5}</MarginBottom>
                                                </DeviceInfo>", pageWidth + unit, pageHeight + unit, marginTop + unit, marginLeft + unit, marginRight + unit, marginBottom + unit);
            byte[] result = localReport.Render("PDF", deviceInfo);


            var relativePath = Path.Combine("assets", "PDF", tenantID, "barcode.pdf");

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
            var angularPath = $"../../../assets/pdf/{tenantID}/barcode.pdf";
            return Ok(angularPath);

        }

    }
}
