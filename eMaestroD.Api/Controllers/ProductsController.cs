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
using eMaestroD.InvoiceProcessing.Interfaces;

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
        private readonly IGLService _glService;
        private readonly HelperMethods _helperMethods;
        string username = "";
        public ProductsController(AMDbContext aMDbContext, IWebHostEnvironment webHostEnvironment, NotificationInterceptor notificationInterceptor, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IGLService glService, HelperMethods helperMethods)
        {
            _AMDbContext = aMDbContext;
            _webHostEnvironment = webHostEnvironment;
            _notificationInterceptor = notificationInterceptor;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _helperMethods = helperMethods;
            username = GetUsername();
            _glService = glService;
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
                .FromSqlRaw("EXEC GetProducts @comID = {0}, @prodBCID = {1}, @prodID={2}", comID, prodBCID, 0)
                .ToListAsync();

            ResponsedGroupListVM vM = new ResponsedGroupListVM();
            vM.enttityDataSource = products;
            vM.entityModel = products?.GetEntity_MetaData();
            return Ok(vM);
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

            var vendProduct = await _AMDbContext.VendorProducts.Where(x => x.prodID == prodID).FirstOrDefaultAsync();
            product.vendID = vendProduct == null ? 0 : vendProduct.comVendID;
            product.sharePercentage = vendProduct == null ? 0 : vendProduct.sharePercentage;

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

                    if (product.vendID != null && product.vendID != 0)
                    {
                        var ProductVendorList = await _glService.GetVendorProductListAsync((int)product.comID);
                        var existingVendorProducts = ProductVendorList
                       .Where(x => x.prodID == product.prodID)
                       .OrderBy(x => x.preference)
                       .ToList();

                        int newPreference = existingVendorProducts.Any()
                            ? existingVendorProducts.Max(x => x.preference) + 1
                            : 1;

                        bool isProductVendorExist = existingVendorProducts
                            .Any(x => x.comVendID == (int)product.vendID);

                        if (!existingVendorProducts.Any())
                        {
                            var vendorProduct = new VendorProduct
                            {
                                vendProdID = 0,
                                comID = (int)product.comID,
                                prodID = product.prodID,
                                comVendID = (int)product.vendID,
                                preference = newPreference,
                                sharePercentage = product.sharePercentage
                            };

                            await _glService.UpsertVendorProductAsync(vendorProduct);
                        }
                        else
                        {
                            var vendorProduct = new VendorProduct
                            {
                                vendProdID = existingVendorProducts.FirstOrDefault().vendProdID,
                                comID = (int)product.comID,
                                prodID = product.prodID,
                                comVendID = (int)product.vendID,
                                preference = existingVendorProducts.FirstOrDefault().preference,
                                sharePercentage = product.sharePercentage
                            };

                            await _glService.UpsertVendorProductAsync(vendorProduct);
                        }
                    }

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
                    
                    //product.ProductBarCodes.Add(new ProductBarCodes
                    //{
                    //    Active = true,
                    //    BarCode = product.prodCode,
                    //    CostPrice = product.purchRate,
                    //    SalePrice = product.sellRate,
                    //    FOBPrice = product.tP,
                    //    TradePrice = product.retailprice,
                    //    prodID = product.prodID,
                    //    Qty = 1,
                    //    Unit = product.prodUnit
                    //});

                    foreach (var item in product.ProductBarCodes)
                    {
                        item.prodID = product.prodID;
                    }
                   
                    await _AMDbContext.ProductBarCodes.AddRangeAsync(product.ProductBarCodes);
                    await _AMDbContext.SaveChangesAsync();

                    if(product.vendID != null && product.vendID != 0)
                    {
                        var ProductVendorList = await _glService.GetVendorProductListAsync((int)product.comID);
                        var existingVendorProducts = ProductVendorList
                       .Where(x => x.prodID == product.prodID)
                       .OrderBy(x => x.preference)
                       .ToList();

                        int newPreference = existingVendorProducts.Any()
                            ? existingVendorProducts.Max(x => x.preference) + 1
                            : 1;

                        bool isProductVendorExist = existingVendorProducts
                            .Any(x => x.comVendID == (int)product.vendID);

                        if (!isProductVendorExist)
                        {
                            var vendorProduct = new VendorProduct
                            {
                                comID = (int)product.comID,
                                prodID = product.prodID,
                                comVendID = (int)product.vendID,
                                preference = newPreference,
                                sharePercentage = product.sharePercentage
                            };

                            await _glService.UpsertVendorProductAsync(vendorProduct);
                        }
                    }

                    _notificationInterceptor.SaveNotification("ProductsCreate", product.comID, "");
                }
                else
                {
                    return NotFound("Product Name/Code Already Exists!");
                }
            }

            var products = await _AMDbContext.Set<ProductViewModel>()
                .FromSqlRaw("EXEC GetProducts @comID = {0}, @prodBCID = {1}, @prodID ={2}", product.comID, 0,product.prodID)
                .ToListAsync();

            return Ok(products);

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
            _AMDbContext.RemoveRange(_AMDbContext.VendorProducts.Where(a => a.prodID == prodID));
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
            using var transaction = await _AMDbContext.Database.BeginTransactionAsync();
            try
            {
                var comID = int.Parse(Request.Headers["comID"].ToString());
                // Validate Fiscal Year
                var fiscalYear = _AMDbContext.FiscalYear
                    .Where(x => x.active && x.comID == comID)
                    .Select(x => x.period)
                    .FirstOrDefault();

                var vendList = await _AMDbContext.Vendors.Where(x => x.active == true && x.comID == comID && x.vendName.ToUpper() == "OPENING STOCK").FirstOrDefaultAsync();
                int VendID = vendList != null ? vendList.vendID : 1;

                if (fiscalYear == 0)
                    return BadRequest("Invalid fiscal year for the company.");

                var form = Request.Form;
                var list = new List<dynamic>();
                var ExistRowNumber = new StringBuilder();
                var EmptyRowNumber = new StringBuilder();

                int countInsertedRow = 0, countNotInsertedRow = 0, countEmptyRow = 0;

                foreach (var file in form.Files)
                {
                    using (var stream = new MemoryStream())
                    {
                        file.CopyTo(stream);
                        using (var workbook = new XLWorkbook(stream))
                        {
                            var productSheet = workbook.Worksheet(1);
                            var unitSheet = workbook.Worksheet(2);

                            // Validate Headers
                            if (!ValidateProductSheetHeaders(productSheet))
                                return BadRequest("Incorrect headers in Product sheet.");

                            if (!ValidateUnitSheetHeaders(unitSheet))
                                return BadRequest("Incorrect headers in Unit sheet.");

                            // Process Product Sheet
                            foreach (var row in productSheet.RowsUsed().Skip(1))
                            {
                                var rowIndex = row.RowNumber();
                                var supplierName = row.Cell(1).GetValue<string>().Trim();
                                var departmentName = row.Cell(2).GetValue<string>().Trim();
                                var categoryName = row.Cell(3).GetValue<string>().Trim();
                                var productBarcode = row.Cell(4).GetValue<string>().Trim();
                                var productName = row.Cell(5).GetValue<string>().Trim();
                                var minQty = row.Cell(6).GetValue<decimal?>() ?? 0;
                                var maxQty = row.Cell(7).GetValue<decimal?>() ?? 0;
                                var openingStock = row.Cell(8).GetValue<decimal?>() ?? 0;
                                var purchaseRate = row.Cell(9).GetValue<decimal?>() ?? 0;
                                var saleRate = row.Cell(10).GetValue<decimal?>() ?? 0;

                                if (string.IsNullOrWhiteSpace(productBarcode) || string.IsNullOrWhiteSpace(productName) || string.IsNullOrWhiteSpace(categoryName) || string.IsNullOrWhiteSpace(supplierName))
                                {
                                    countEmptyRow++;
                                    EmptyRowNumber.Append(rowIndex + ", ");
                                    continue;
                                }

                                var department = await GetOrCreateDepartmentAsync(departmentName, comID, username);
                                var ProdGroups = await GetOrCreateCategoryAsync(categoryName, comID, username);
                                var supplier = await GetOrCreateSupplierAsync(supplierName, comID, username);

                                var product = await _AMDbContext.Products
                                    .FirstOrDefaultAsync(p => (p.prodCode.ToLower() == productBarcode.ToLower() || p.prodName.ToLower() == productName.ToLower()) && p.comID == comID);

                                if (product == null)
                                {
                                    product = new Product
                                    {
                                        prodCode = productBarcode,
                                        prodName = productName,
                                        vendID = supplier.vendID,
                                        prodGrpID = ProdGroups.prodGrpID,
                                        minQty = minQty,
                                        maxQty = maxQty,
                                        descr = "Goods",
                                        prodUnit = "unit",
                                        comID = comID,
                                        depID = department != null ? department.depID : 0,
                                        active = true,
                                        crtBy = username,
                                        crtDate = DateTime.Now,
                                        modby = username,
                                        modDate = DateTime.Now
                                    };

                                    _AMDbContext.Products.Add(product);
                                    await _AMDbContext.SaveChangesAsync();
                                    list.Add(product);
                                    countInsertedRow++;

                                    // Add Default Barcode with BaseQty = 1
                                    var defaultBarcode = new ProductBarCodes
                                    {
                                        prodID = product.prodID,
                                        BarCode = productBarcode,
                                        Qty = 1,
                                        Unit = "unit",
                                        Active = true
                                    };
                                    _AMDbContext.ProductBarCodes.Add(defaultBarcode);
                                    await _AMDbContext.SaveChangesAsync();

                                    if (openingStock > 0)
                                    {
                                        await InsertOpeningStock(product, openingStock, fiscalYear, comID, username, VendID, purchaseRate, saleRate, defaultBarcode.prodBCID);
                                    }

                                }
                                else
                                {
                                    countNotInsertedRow++;
                                    ExistRowNumber.Append(rowIndex + ", ");
                                }

                                VendorProduct vendorProduct = new VendorProduct
                                {
                                    comVendID = supplier.vendID,
                                    prodID = product.prodID,
                                    comID = comID,
                                    preference = 1, // Default preference
                                    sharePercentage = supplier.sharePercentage, // Default share percentage
                                };

                                _AMDbContext.VendorProducts.Add(vendorProduct);
                                await _AMDbContext.SaveChangesAsync();
                            }

                            // Process Unit Sheet
                            foreach (var row in unitSheet.RowsUsed().Skip(1))
                            {
                                var productName = row.Cell(1).GetValue<string>().Trim();
                                var unit = row.Cell(2).GetValue<string>().Trim().ToLower();
                                var baseQty = row.Cell(3).GetValue<decimal>();

                                if (string.IsNullOrWhiteSpace(productName) || string.IsNullOrWhiteSpace(unit) || string.IsNullOrWhiteSpace(baseQty.ToString()))
                                {
                                    countEmptyRow++;
                                    EmptyRowNumber.Append(row.RowNumber() + ", ");
                                    continue;
                                }

                                var product = await _AMDbContext.Products
                                    .FirstOrDefaultAsync(p => p.prodName.ToLower() == productName.ToLower() && p.comID == comID);

                                if (product != null)
                                {
                                    var existingBarcodeUnit = await _AMDbContext.ProductBarCodes.AsNoTracking()
                                        .FirstOrDefaultAsync(b => b.prodID == product.prodID && b.BarCode == product.prodCode);

                                    if (existingBarcodeUnit != null)
                                    {
                                        if (baseQty == 1)
                                        {
                                            var trackedEntity = _AMDbContext.ChangeTracker
                                            .Entries<ProductBarCodes>()
                                            .FirstOrDefault(e => e.Entity.prodBCID == existingBarcodeUnit.prodBCID);

                                            if (trackedEntity != null)
                                            {
                                                _AMDbContext.Entry(trackedEntity.Entity).State = EntityState.Detached;
                                            }

                                            // Now update the entity
                                            existingBarcodeUnit.Unit = unit;
                                            _AMDbContext.ProductBarCodes.Update(existingBarcodeUnit);
                                            await _AMDbContext.SaveChangesAsync();
                                        }
                                        else
                                        {
                                            var barcodeUnit = new ProductBarCodes
                                            {
                                                prodID = product.prodID,
                                                BarCode = product.prodCode,
                                                Qty = baseQty,
                                                Unit = unit,
                                                Active = true
                                            };
                                            _AMDbContext.ProductBarCodes.Add(barcodeUnit);
                                            await _AMDbContext.SaveChangesAsync();

                                        }
                                    }
                                    else
                                    {
                                        var barcodeUnit = new ProductBarCodes
                                        {
                                            prodID = product.prodID,
                                            BarCode = product.prodCode,
                                            Qty = baseQty,
                                            Unit = unit,
                                            Active = true
                                        };
                                        _AMDbContext.ProductBarCodes.Add(barcodeUnit);
                                        await _AMDbContext.SaveChangesAsync();

                                    }
                                }
                            }
                            await _AMDbContext.SaveChangesAsync();
                        }
                    }
                }

                await transaction.CommitAsync();

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

                    list[0].comment = countInsertedRow.ToString() + " Out Of " +
                                      (countInsertedRow + countNotInsertedRow + countEmptyRow) +
                                      " Inserted Successfully!" + text;
                    return Ok(list);
                }

                return NotFound("Please Upload Correct File.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, ex.Message);
            }
        }

        private async Task<Vendors> GetOrCreateSupplierAsync(string supplierName, int comID, string username)
        {
            var vendor = await _AMDbContext.Vendors
                .FirstOrDefaultAsync(s => s.vendName.ToLower() == supplierName.ToLower() && s.comID == comID);

            if (vendor == null)
            {
                Random random = new Random();
                string randomNumber = random.Next(1000, 10000).ToString();
                vendor = new Vendors
                {
                    vendCode = randomNumber,
                    vendName = supplierName,
                    comID = comID,
                    active = true,
                    crtBy = username,
                    crtDate = DateTime.Now,
                    modby = username,
                    modDate = DateTime.Now
                };
                _AMDbContext.Vendors.Add(vendor);
                await _AMDbContext.SaveChangesAsync();

                var tradeCreditorsAcctCode = _helperMethods.GetAcctNoByKey(ConfigKeys.TradeCreditors);
                var vendNewAcctNo = _helperMethods.GenerateAcctNo(tradeCreditorsAcctCode, (int)vendor.comID);
                COA coa = new COA()
                {
                    acctNo = vendNewAcctNo,
                    acctName = vendor.vendName,
                    openBal = vendor.opnBal,
                    closingBal = 0,
                    isSys = false,
                    parentCOAID = 83,
                    COANo = vendor.vendID,
                    nextChkNo = vendor.vendCode,
                    bal = vendor.opnBal,
                    COAlevel = 4,
                    active = true,
                    treeName = vendor.vendName,
                    acctType = "Trade Creditors",
                    parentAcctType = "Liability",
                    parentAcctName = "Trade Creditors",
                    path = @"Liability\Current Liability\Current Liability\Trade Creditors\" + vendor.vendName + @"\",
                    crtBy = username,
                    crtDate = DateTime.Now,
                    modBy = username,
                    modDate = DateTime.Now,
                    comID = vendor.comID,
                    parentAcctNo = tradeCreditorsAcctCode
                };
                await _AMDbContext.COA.AddAsync(coa);
                await _AMDbContext.SaveChangesAsync();
            }

            return vendor;
        }

        
        private async Task<ProdGroups> GetOrCreateCategoryAsync(string categoryName, int comID, string username)
        {
            var category = await _AMDbContext.ProdGroups
                .FirstOrDefaultAsync(d => d.prodGrpName.ToLower() == categoryName.ToLower() && d.comID == comID);

            if (category == null)
            {
                category = new ProdGroups
                {
                    active = true,
                    prodGrpName = categoryName,
                    prodGrpTypeID = 1,
                    parentProdGrpID = 0,
                    comID = comID,
                    crtBy = username,
                    crtDate = DateTime.Now,
                    modby = username,
                    modDate = DateTime.Now,
                };
                _AMDbContext.ProdGroups.Add(category);
                await _AMDbContext.SaveChangesAsync();
            }

            return category;
        }

        private async Task<Department> GetOrCreateDepartmentAsync(string departmentName, int comID, string username)
        {
            var department = await _AMDbContext.Departments
                .FirstOrDefaultAsync(d => d.depName.ToLower() == departmentName.ToLower() && d.comID == comID);

            if (department == null)
            {
                department = new Department
                {
                    depName = departmentName,
                    comID = comID,
                    active = true,
                    crtBy = username,
                    crtDate = DateTime.Now,
                    modby = username,
                    modDate = DateTime.Now
                };
                _AMDbContext.Departments.Add(department);
                await _AMDbContext.SaveChangesAsync();
            }

            return department;
        }

        private bool ValidateProductSheetHeaders(IXLWorksheet sheet)
        {
            var requiredHeaders = new List<string>
            {
                "SUPPLIER NAME", "DEPARTMENT", "CATEGORY", "PRODUCT BARCODE", "PRODUCT NAME", "MIN QTY", "MAX QTY", "OPENING STOCK","PURCHASE RATE","SALE RATE"
            };

            var headers = sheet.Row(1).Cells().Select(cell => cell.Value.ToString().Trim().ToUpper()).ToList();
            return requiredHeaders.All(header => headers.Contains(header));
        }

        private async Task InsertOpeningStock(Product p, decimal qty, int fiscalYear, int comID, string username, int VendID, decimal purchaseRate, decimal saleRate, int prodBCID)
        {
            string sql = "EXEC GenerateGLVoucherNo @txType, @comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
            new SqlParameter { ParameterName = "@txType", Value = 1 },
            new SqlParameter { ParameterName = "@comID", Value = comID }
            };

            var voucherNo = _AMDbContext.invoiceNo.FromSqlRaw(sql, parms.ToArray()).ToList().FirstOrDefault().voucherNo;
            decimal totalAmount = 0M;
            //98
            var stockInTradeAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.StockInTrade);
            //83
            var TradeCreditorsAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.TradeCreditors);

            GL msterEntry = new GL()
            {
                relCOAID = 0,
                crtDate = DateTime.Now,
                modDate = DateTime.Now,
                COAID = 0,
                acctNo = "",
                relAcctNo = "",
                depositID = fiscalYear,
                txTypeID = 1,
                vendID = VendID,
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
            glItem.acctNo = stockInTradeAccCode;
            glItem.relAcctNo = TradeCreditorsAccCode;
            glItem.txTypeID = 1;
            glItem.depositID = fiscalYear;
            glItem.locID = 1;
            glItem.vendID = VendID;
            glItem.prodID = p.prodID;
            glItem.prodBCID = prodBCID;
            glItem.qty = qty;
            glItem.qtyBal = glItem.qty;
            glItem.unitPrice = purchaseRate;
            glItem.sellPrice = saleRate;
            glItem.batchNo = voucherNo;
            glItem.expiry = new DateTime().AddDays(60);
            glItem.discountSum = 0;
            glItem.debitSum = purchaseRate * glItem.qty;
            glItem.dtTx = DateTime.Now;
            glItem.isVoided = glItem.isDeposited = glItem.isCleared = glItem.isPaid = false;
            glItem.checkName = p.prodCode;
            glItem.voucherNo = voucherNo;
            glItem.crtDate = glItem.modDate = DateTime.Now;
            glItem.crtBy = glItem.modBy = username;

            totalAmount += glItem.debitSum;

            purchaceInvoiceList.Add(glItem);


            GL glPayment = new GL();

            glPayment.COAID = 83;
            glPayment.relCOAID = 98;
            glPayment.acctNo = TradeCreditorsAccCode;
            glPayment.relAcctNo = stockInTradeAccCode;
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
        }

        private bool ValidateUnitSheetHeaders(IXLWorksheet sheet)
        {
            var requiredHeaders = new List<string>
            {
                "PRODUCT NAME", "UNIT", "BASE QTY"
            };

            var headers = sheet.Row(1).Cells().Select(cell => cell.Value.ToString().Trim().ToUpper()).ToList();
            return requiredHeaders.All(header => headers.Contains(header));
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

        [HttpGet]
        [Route("IsBarcodeExist/{barcode}/{barcodeID}/{comID}")]
        public async Task<IActionResult> IsBarcodeExist(string barcode, int barcodeID, int comID)
        {
            var query = _AMDbContext.ProductBarCodes.AsQueryable();

            if (barcodeID == 0)
            {
                var barcodeExists = await query
                    .Where(x => x.BarCode == barcode)
                    .AnyAsync();

                if (barcodeExists)
                {
                    return Ok(true);
                }
                else
                {
                    return Ok(false);
                }
            }
            else
            {
                var barcodeExists = await query
                    .Where(x => x.BarCode == barcode && (x.prodBCID != barcodeID && x.prodID != barcodeID))
                    .AnyAsync();

                if (barcodeExists)
                {
                    return Ok(true);
                }
                else
                {
                    return Ok(false);
                }
            }
        }
    }
}
