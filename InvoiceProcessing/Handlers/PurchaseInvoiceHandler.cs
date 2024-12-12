using eMaestroD.DataAccess.IRepositories;
using eMaestroD.InvoiceProcessing.Interfaces;
using eMaestroD.Models.Models;
using eMaestroD.Models.VMModels;
using eMaestroD.Shared.Common;
using eMaestroD.Shared.Config;
using InvoiceProcessing.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.InvoiceProcessing.Handlers
{
    public class PurchaseInvoiceHandler : IInvoiceHandler
    {
        private readonly IHelperMethods _helperMethods;
        private readonly IGLService _gLService;
        public PurchaseInvoiceHandler(IHelperMethods helperMethods, IGLService gLService)
        {
            _helperMethods = helperMethods;
            _gLService = gLService;
        }
        public async Task<List<object>> ConvertInvoiceToGL(Invoice invoice)
        {
            if (string.IsNullOrEmpty(invoice.invoiceVoucherNo))
            {
                invoice.invoiceVoucherNo = await _gLService.GenerateGLVoucherNo((int)invoice.txTypeID, invoice.comID);
            }
            GL glMasterEntry = new GL();
            GL glDetailEntry = new GL();
            List<GL> glEntries = new List<GL>();
            decimal? totalNetAmount = 0;
            
            var AccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.StockInTrade);
            var relAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.CashInHand);
            if (invoice.invoiceType.ToLower() == "credit")
            {
                relAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.TradeCreditors);
            }

            glMasterEntry = new GL
            {
                GLID = (int)invoice.invoiceID,
                txTypeID = (int)invoice.txTypeID,
                cstID = 0,
                vendID = (int)invoice.CustomerOrVendorID,
                depositID = (int)invoice.fiscalYear,
                isDeposited = false,
                isVoided = false,
                isCleared = false,
                isPaid = false,
                voucherNo = invoice.invoiceVoucherNo,
                instituteOffer = 0,
                creditSum = (decimal)invoice.netTotal,
                discountSum = (decimal)invoice.totalDiscount,
                extraDiscountSum = (decimal)invoice.totalExtraDiscount,
                taxSum = (decimal)invoice.totalTax + (decimal)invoice.totalExtraTax + (decimal)invoice.totalAdvanceExtraTax,
                rebateSum = (decimal)invoice.totalRebate,
                paidSum = 0,
                dtTx = invoice.invoiceDate,
                locID = (int)invoice.locID,
                comID = invoice.comID,
                acctNo = "",
                relAcctNo = "",
                crtDate = DateTime.Now,
                modDate = DateTime.Now,
                isConverted = false,
                checkName = invoice.convertedInvoiceNo,
                balSum = invoice.invoiceType.ToLower() == "credit" ? (decimal)invoice.netTotal : 0
            };

            glEntries.Add(glMasterEntry);


            var ProductVendorList = await _gLService.GetVendorProductListAsync((int)invoice.comID);
            foreach (var product in invoice.Products)
            {
                var existingVendorProducts = ProductVendorList
                .Where(x => x.prodID == product.prodID)
                .OrderBy(x => x.preference)
                .ToList();

                int newPreference = existingVendorProducts.Any()
                    ? existingVendorProducts.Max(x => x.preference) + 1
                    : 1;

                bool isProductVendorExist = existingVendorProducts
                    .Any(x => x.comVendID == (int)invoice.CustomerOrVendorID);

                if (!isProductVendorExist)
                {
                    var vendorProduct = new VendorProduct
                    {
                        comID = (int)invoice.comID,
                        prodID = product.prodID ?? 0,
                        comVendID = (int)invoice.CustomerOrVendorID,
                        preference = newPreference,
                        sharePercentage = 0
                    };

                    await _gLService.UpsertVendorProductAsync(vendorProduct);
                }

                GL glEntry1 = new GL
                {
                    GLID = product.prodInvoiceID != null ? (int)product.prodInvoiceID : 0,
                    txTypeID = invoice.txTypeID ?? 0,
                    comID = invoice.comID,
                    depositID = (int)invoice.fiscalYear,
                    locID = invoice.locID ?? 0,
                    cstID = 0,
                    vendID = (int)invoice.CustomerOrVendorID,
                    prodID = product.prodID ?? 0,
                    prodBCID = product.prodBCID ?? 0,
                    qty = product.qty ?? 0,
                    bonusQty = product.bounsQty ?? 0,
                    qtyBal = product.qty ?? 0,
                    unitPrice = product.purchRate ?? 0,
                    debitSum = product.netAmount ?? 0,
                    discountSum = product.discountAmount ?? 0,
                    extraDiscountSum = product.extraDiscountAmount ?? 0,
                    rebateSum = product.rebateAmount ?? 0,
                    batchNo = product.batchNo,
                    taxSum = (decimal)product.ProductTaxes.Sum(x => x.taxAmount),
                    creditSum = 0,
                    dtTx = invoice.invoiceDate,
                    expiry = product.expiry,
                    glComments = product.notes,
                    checkAdd = "",
                    checkNo = "",
                    voucherID = "",
                    voucherNo = invoice.invoiceVoucherNo?.ToString(),
                    crtDate = DateTime.Now,
                    modDate = DateTime.Now,
                    acctNo = AccCode,
                    relAcctNo = relAccCode,
                    isPaid = false,
                    isVoided = false,
                    isDeposited = false,
                    isCleared = false,
                    isConverted = false,
                    checkName = invoice.convertedInvoiceNo,
                    mrp = product.mrp,
                    sellPrice = product.sellingPrice,
                    lastCost = product.lastCost,
                    gLDetails = product.ProductTaxes.Select(tax => new GLDetail
                    {
                        GLDetailID = tax.taxDetailID,
                        GLID = 0,
                        acctNo = tax.taxAcctNo,
                        GLAmount = tax.taxAmount,
                        rate = tax.taxPercent
                    }).ToList(),
                    
                };


                totalNetAmount += product.netAmount;

                glEntries.Add(glEntry1);
            }


            glDetailEntry = new GL
            {
                GLID = (int)invoice.invoiceDetailID,
                txTypeID = (int)invoice.txTypeID,
                cstID = 0,
                vendID = (int)invoice.CustomerOrVendorID,
                depositID = (int)invoice.fiscalYear,
                isDeposited = false,
                isVoided = false,
                isCleared = false,
                isPaid = false,
                voucherNo = invoice.invoiceVoucherNo,
                instituteOffer = 0,
                creditSum = (decimal)totalNetAmount,
                debitSum = 0,
                discountSum = 0,
                extraDiscountSum = 0,
                taxSum = 0,
                rebateSum = 0,
                paidSum = 0,
                dtTx = invoice.invoiceDate,
                locID = (int)invoice.locID,
                comID = invoice.comID,
                acctNo = relAccCode,
                relAcctNo = AccCode,
                crtDate = DateTime.Now,
                modDate = DateTime.Now,
                isConverted = false,
                checkName = invoice.convertedInvoiceNo,
                balSum = invoice.invoiceType.ToLower() == "credit" ? (decimal)invoice.netTotal : 0
            };

            glEntries.Add(glDetailEntry);

            return glEntries.Cast<object>().ToList();
        }
    }
}
