using aiPriceGuard.Api.Services.Interfaces;
using aiPriceGuard.DataAccess.IRepositories;
using aiPriceGuard.DataAccess.Repositories;
using aiPriceGuard.Models.Models;
using aiPriceGuard.Models.VMModels;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.Api.Services.Services
{
    public class InvoiceService : IinvoiceService
    {
        private readonly ISupplierRepository _supplierRepository;
        private readonly IProductRepository _productRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IinvoiceRepository _invoiceRepository;
        private readonly IinvoiceDetailRepository _invoiceDetailRepository;
        private readonly ISupplierProductRepository _supplierProductRepository;

        public InvoiceService(ISupplierRepository _supplierRepository, IProductRepository _productRepository, IHttpContextAccessor _httpContextAccessor
            , IinvoiceRepository _invoiceRepository, IinvoiceDetailRepository _invoiceDetailRepository, ISupplierProductRepository _supplierProductRepository)
        {
            this._supplierRepository = _supplierRepository;
            this._productRepository = _productRepository;
            this._httpContextAccessor = _httpContextAccessor;
            this._invoiceRepository = _invoiceRepository;
            this._invoiceDetailRepository = _invoiceDetailRepository;
            this._supplierProductRepository= _supplierProductRepository;
        }
        public async Task<RenderJson> GetRenderFormatData(InvoicePDF invoice, int supplierID, int comID, int suppFileId)
        {
            RenderJson renderJsonObj = new RenderJson();
            if (invoice != null)
            {
                var supplier = await _supplierRepository.FindByIdAsync(supplierID);
                if (supplier != null)
                {
                    renderJsonObj.SupplierName = supplier.SupplierName;
                    renderJsonObj.OrderDate = invoice.InvoiceDetails.OrderDate;
                    renderJsonObj.OrderNo = invoice.InvoiceDetails.OrderNo;
                    renderJsonObj.SupplierId = supplierID;
                    renderJsonObj.SupplierFileId = suppFileId;
                    renderJsonObj.DeliveryAddress = invoice.InvoiceDetails.delAddress?.Name + invoice.InvoiceDetails.delAddress?.Street + 
                    invoice.InvoiceDetails.delAddress?.Address + 
                    invoice.InvoiceDetails.delAddress?.City + invoice.InvoiceDetails.delAddress?.StateZip ;
                    renderJsonObj.totalAmount = invoice.InvoiceDetails.InvoiceTotal ?? 0;
                    renderJsonObj.Fax = invoice.InvoiceDetails.Fax;
                    renderJsonObj.CompanyName = invoice.InvoiceDetails.CompanyName;
                    renderJsonObj.CustomerCode = invoice.InvoiceDetails.CustomerCode;
                    renderJsonObj.Customer_Ref_No = invoice.InvoiceDetails.Customer_Ref_No?? invoice.InvoiceDetails.CustomerRefNo;
                    renderJsonObj.DelAddressLine1 = invoice.InvoiceDetails.DelAddressLine1;
                    renderJsonObj.DelAddressLine2 = invoice.InvoiceDetails.DelAddressLine2;
                    renderJsonObj.DelAddressLine3 = invoice.InvoiceDetails.DelAddressLine3;
                    renderJsonObj.DelDate = invoice.InvoiceDetails.DelDate;
                    renderJsonObj.InvDate = invoice.InvoiceDetails.InvDate;
                    renderJsonObj.DeliveryDate = invoice.InvoiceDetails.DeliveryDate;
                    renderJsonObj.DeliveryNote = invoice.InvoiceDetails.DeliveryNote;
                    renderJsonObj.DelNumber = invoice.InvoiceDetails.DelNumber;
                    renderJsonObj.DelPostcode =invoice.InvoiceDetails.DelPostcode;
                    renderJsonObj.DelState = invoice.InvoiceDetails.DelState;
                    renderJsonObj.DelSuburb = invoice.InvoiceDetails.DelSuburb;
                    renderJsonObj.purchaseOrderNo = invoice.InvoiceDetails.purchaseOrderNo;
                    renderJsonObj.Rep = invoice.InvoiceDetails.Rep;
                    renderJsonObj.Terms = invoice.InvoiceDetails.Terms;
                    renderJsonObj.Tel = invoice.InvoiceDetails.Tel;
                    renderJsonObj.DelNote = invoice.InvoiceDetails.DelNote;
                    renderJsonObj.Remarks = invoice.InvoiceDetails.Remarks;
                    renderJsonObj.PhoneNo = invoice.InvoiceDetails.PhoneNo;
                    renderJsonObj.ShipVia = invoice.InvoiceDetails.ShipVia;
                    renderJsonObj.TotalCasesPallets = invoice.InvoiceDetails.TotalCasesPallets;
                    renderJsonObj.FreightOnBoard = invoice.InvoiceDetails.FreightOnBoard;
                }
                if (invoice.InvoiceDetails.Summary != null && invoice.InvoiceDetails.Summary.Count > 0)
                { 
                    renderJsonObj.ProductDetails = await MappedProductDetails(invoice.InvoiceDetails.Summary);
                }
                else if (invoice.InvoiceDetails.LineItems != null && invoice.InvoiceDetails.LineItems.Count > 0)
                {
                    renderJsonObj.ProductDetails = await MappedProductDetails(invoice.InvoiceDetails.LineItems);
                }
                else if (invoice.InvoiceDetails.Items != null && invoice.InvoiceDetails.Items.Count > 0)
                {
                    if (invoice.InvoiceDetails.InvoiceTotal == null)
                    {                     
                        invoice.InvoiceDetails.Items.ForEach(x =>
                        {
                            renderJsonObj.totalAmount += x.Amount;
                        });
                    }
                    renderJsonObj.ProductDetails = await MappedProductDetails(invoice.InvoiceDetails.Items);
                }
                return renderJsonObj;
            }
            return null;
        }

        public async  Task<RenderJson> SaveJsonData(RenderJson jsonObj)
        {
            
            List<Product> prodList = new List<Product>();
            List<Product> prodExistList = new List<Product>();

            try
            {
                var existProdList = new List<Product>();
                jsonObj.ProductDetails.ForEach(  x =>
                {
                    var prodBySupplierProdCode = _productRepository.GetProductBySupplierProductCode(x.ItemCode);
                    var prodByCode = _productRepository.GetProductByProductCode(x.ProductCode);
                    if (prodByCode == null)
                    {
                        var prodITEM = new Product
                        {
                            prodCode = x.ProductCode ?? "",
                            prodName = x.Name ?? "",
                            qty = x.Quantity ?? (decimal)0,
                            purchRate = x.Price ?? 0,
                            crtDate = DateTime.Now,
                            crtBy = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Email)?.Value ?? "",
                            comID = int.Parse(jsonObj.comID),
                            active = true,
                            SupplierProductCode = x.ItemCode
                        };
                        prodList.Add(prodITEM);
                    }
                    else if (prodBySupplierProdCode == null)
                    {
                        var suppProd =  _supplierProductRepository.GetListByProductId(prodByCode.prodID);
                        prodBySupplierProdCode = new Product
                        {
                            prodID = suppProd[0].prodID.Value,
                            SupplierProductCode = x.ItemCode,
                            comID = int.Parse(jsonObj.comID)
                        };
                                               
                        prodExistList.Add(prodBySupplierProdCode);
                    }

                });
                if(prodList.Count > 0)
                {
                    await _productRepository.AddRangeAsync(prodList);

                }
                var supplierProductList = new List<SupplierProduct>();
                prodList.ForEach(x =>
                {
                    var supplierProduct = new SupplierProduct
                    {
                        SupplierId = jsonObj.SupplierId.Value,
                        prodID = x.prodID,
                        SupplierProductCode = x.SupplierProductCode,
                        comID = x.comID.Value
                    };
                    supplierProductList.Add(supplierProduct);
                });
                prodExistList.ForEach(x =>
                {
                    var supplierProduct = new SupplierProduct
                    {
                        SupplierId = jsonObj.SupplierId.Value,
                        prodID = x.prodID,
                        SupplierProductCode = x.SupplierProductCode,
                        comID = x.comID.Value
                    };
                    supplierProductList.Add(supplierProduct);
                });
                await _supplierProductRepository.AddRangeAsync(supplierProductList);


                Invoice invoice = new Invoice
                {
                    SupplierId = jsonObj.SupplierId ??0,
                    comID = int.Parse(jsonObj.comID),
                    SupplierFileId = jsonObj.SupplierFileId ?? 0,
                    InvFileUrl = jsonObj.fileURL ??"",
                    OrderNo = jsonObj.OrderNo??"",
                    DeliveryAddress = jsonObj.DeliveryAddress??"",
                    CreatedBy = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Email)?.Value,
                    CreatedOn = DateTime.Now,
                    InvoiceTotal = jsonObj.totalAmount ?? 0,
                    OrderDate = jsonObj.OrderDate,
                    Fax = jsonObj.Fax,
                    CompanyName = jsonObj.CompanyName,
                    CustomerCode = jsonObj.CustomerCode,
                    Customer_Ref_No = jsonObj.Customer_Ref_No ?? jsonObj.CustomerRefNo,
                    DelAddressLine1 = jsonObj.DelAddressLine1,
                    DelAddressLine2 = jsonObj.DelAddressLine2,
                    DelAddressLine3 = jsonObj.DelAddressLine3,
                    DelDate = jsonObj.DelDate,
                    InvDate = jsonObj.InvDate,
                    DeliveryDate = jsonObj.DeliveryDate,
                    DeliveryNote = jsonObj.DeliveryNote,
                    DelNumber = jsonObj.DelNumber,
                    DelPostcode = jsonObj.DelPostcode,
                    DelState = jsonObj.DelState,
                    DelSuburb = jsonObj.DelSuburb,
                    ShippedOn = jsonObj.ShippedOn,
                    ShipVia = jsonObj.ShipVia,
                    purchaseOrderNo = jsonObj.purchaseOrderNo,
                    Rep = jsonObj.Rep,
                    Terms = jsonObj.Terms,
                    Tel = jsonObj.Tel,
                    DelNote = jsonObj.DelNote,
                    Remarks = jsonObj.Remarks,
                    PhoneNo = jsonObj.PhoneNo,
                    TotalCasesPallets = jsonObj.TotalCasesPallets
            };
                await _invoiceRepository.AddAsync(invoice);

                List<InvoiceDetail> invoiceDT = new List<InvoiceDetail>();
                jsonObj.ProductDetails.ForEach(x =>
                {
                    InvoiceDetail invDT = new InvoiceDetail
                    {
                        SupplierStkCode = x.ItemCode ??"",
                        ItemDesc = x.Name ?? "",
                        ShippedQty = x.Quantity??0,
                        PriceEach = x.Price?? 0,
                        Amount = x.Total ?? 0,
                        InvoiceId = invoice.InvoiceId,
                        ItemCode = x.ProductCode ?? ""
                    };
                    invoiceDT.Add(invDT);
                });

                var fetchedProdList =_productRepository.GetAll();
                invoiceDT.ForEach(x =>
                {
                    x.ProdID = fetchedProdList.FirstOrDefault(y => y.prodCode == x.ItemCode).prodID;                  
                });
                _invoiceDetailRepository.AddRangeAsync(invoiceDT);
            }catch (Exception ex)
            {

            }
            return jsonObj;
            
        }

        private async Task<List<ProductDetail>> MappedProductDetails(List<InvoiceDetail> invoiceDetailList)
        {
            var productDetailList = new List<ProductDetail>();
            //var productList =_productRepository.GetAll();
            //var suppProduct = _productRepository.GetProductByProductCode
            int lastProdID = _productRepository.GetLastProductId();
            int currentProdID = lastProdID;
            invoiceDetailList.ForEach(x =>
            {
                _productRepository.GetProductBySupplierProductCode(x.ItemCode);
                var prodExist = _productRepository.GetProductBySupplierProductCode(x.ItemCode);
                ProductDetail prodDt = new ProductDetail();
                prodDt.ItemCode = x.ItemCode;
                prodDt.Name = x.productName;
                prodDt.Price = x.PriceEach;
                prodDt.Total = x.Amount;
                prodDt.Quantity = x.ShippedQty;
                prodDt.SerialNo = x.SerialNo;

                if (prodExist!=null)
                {                
                    prodDt.ProductCode = prodExist.prodCode;                   
                }
                else
                {
                   currentProdID++;
                   prodDt.ProductCode = "P-" + currentProdID.ToString("D4");                 
                }
          
                productDetailList.Add(prodDt);

        });
            return productDetailList;
        }
    }
}
