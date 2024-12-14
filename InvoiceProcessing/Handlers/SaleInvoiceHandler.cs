using eMaestroD.DataAccess.IRepositories;
using eMaestroD.InvoiceProcessing.Interfaces;
using eMaestroD.Models.Models;
using eMaestroD.Models.VMModels;
using eMaestroD.Shared.Config;
using InvoiceProcessing.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.InvoiceProcessing.Handlers
{
    public class SaleInvoiceHandler : IInvoiceHandler
    {
        private readonly IHelperMethods _helperMethods;
        private readonly IGLService _gLService;
        public SaleInvoiceHandler(IHelperMethods helperMethods, IGLService gLService)
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

            var saleLocalAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.SaleLocal);
            //80
            var cashOrCreditAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.TradeDebtors);
            //98
            var stockInTradeAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.StockInTrade);
            //81
            var costOfGoodsAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.CostOfGoodsSold);

            if (invoice.invoiceType.ToLower() == "cash")
            {
                cashOrCreditAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.CashInHand);
            }

            glMasterEntry = new GL
            {
                GLID = (int)invoice.invoiceID,
                txTypeID = (int)invoice.txTypeID,
                cstID = (int)invoice.CustomerOrVendorID,
                vendID = 0,
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
                checkName = invoice.convertedInvoiceNo,
                crtDate = DateTime.Now,
                modDate = DateTime.Now,
                isConverted = false,
                salesManID = (int)(invoice.salesmanID ?? 0),
                bookerID = (int)(invoice.bookerID ?? 0),
                balSum = invoice.invoiceType.ToLower() == "credit" ? (decimal)invoice.netTotal : 0

            };

            glEntries.Add(glMasterEntry);


            foreach (var product in invoice.Products)
            {
                GL glEntry1 = new GL
                {
                    GLID = product.prodInvoiceID != null && product.prodInvoiceID != 0 ? (int)product.prodInvoiceID : 0,
                    txTypeID = invoice.txTypeID ?? 0,
                    comID = invoice.comID,
                    depositID = (int)invoice.fiscalYear,
                    locID = invoice.locID ?? 0,
                    cstID = (int)invoice.CustomerOrVendorID,
                    vendID = 0,
                    prodID = product.prodID ?? 0,
                    prodBCID = product.prodBCID ?? 0,
                    qty = product.qty ?? 0,
                    bonusQty = product.bounsQty ?? 0,
                    qtyBal = product.qty ?? 0,
                    unitPrice = product.sellRate ?? 0,
                    creditSum = product.netAmount ?? 0,
                    discountSum = product.discountAmount ?? 0,
                    extraDiscountSum = product.extraDiscountAmount ?? 0,
                    rebateSum = product.rebateAmount ?? 0,
                    batchNo = product.batchNo,
                    taxSum = (decimal)product.ProductTaxes.Sum(x => x.taxAmount),
                    debitSum = 0,
                    dtTx = invoice.invoiceDate,
                    expiry = product.expiry,
                    glComments = product.notes,
                    checkName = invoice.convertedInvoiceNo,
                    checkAdd = product.discountPercent.ToString() ?? "0",
                    checkNo = "",
                    voucherID = "",
                    voucherNo = invoice.invoiceVoucherNo?.ToString(),
                    crtDate = DateTime.Now,
                    modDate = DateTime.Now,
                    acctNo = saleLocalAccCode,
                    relAcctNo = cashOrCreditAccCode,
                    isPaid = false,
                    isVoided = false,
                    isDeposited = false,
                    isCleared = false,
                    isConverted = false,
                    salesManID = (int)(invoice.salesmanID ?? 0),
                    bookerID = (int)(invoice.bookerID ?? 0),
                    gLDetails = product.ProductTaxes.Select(tax => new GLDetail
                    {
                        GLDetailID = tax.taxDetailID,
                        acctNo = tax.taxAcctNo,
                        GLAmount = tax.taxAmount,
                        rate = tax.taxPercent
                    }).ToList()
                };
                
                glEntries.Add(glEntry1);


                GL glEntry2 = new GL
                {
                    GLID = product.prodInvoiceID != null && product.prodInvoiceID != 0 ?  (int)product.prodInvoiceID + 1: 0,
                    txTypeID = invoice.txTypeID ?? 0,
                    comID = invoice.comID,
                    depositID = (int)invoice.fiscalYear,
                    locID = invoice.locID ?? 0,
                    cstID = (int)invoice.CustomerOrVendorID,
                    vendID = 0,
                    prodID = product.prodID ?? 0,
                    prodBCID = product.prodBCID ?? 0,
                    bonusQty = product.bounsQty ?? 0,
                    qty = -(product.qty) ?? 0,
                    qtyBal = 0,
                    unitPrice = product.purchRate ?? 0,
                    creditSum = product.purchRate * product.qty ?? 0,
                    discountSum = 0,
                    extraDiscountSum = 0,
                    rebateSum = 0,
                    batchNo = product.batchNo,
                    taxSum = 0,
                    debitSum = 0,
                    dtTx = invoice.invoiceDate,
                    expiry = product.expiry,
                    glComments = product.notes,
                    checkName = invoice.convertedInvoiceNo,
                    checkAdd = "",
                    checkNo = "",
                    voucherID = "",
                    voucherNo = invoice.invoiceVoucherNo?.ToString(),
                    crtDate = DateTime.Now,
                    modDate = DateTime.Now,
                    acctNo = stockInTradeAccCode,
                    relAcctNo = costOfGoodsAccCode,
                    isPaid = false,
                    isVoided = false,
                    isDeposited = false,
                    isCleared = false,
                    isConverted = false,
                    gLDetails = null,
                    salesManID = (int)(invoice.salesmanID ?? 0),
                    bookerID = (int)(invoice.bookerID ?? 0),
                };

                glEntries.Add(glEntry2);


                GL glEntry3 = new GL
                {
                    GLID = product.prodInvoiceID != null && product.prodInvoiceID != 0 ? (int)product.prodInvoiceID + 2 : 0,
                    txTypeID = invoice.txTypeID ?? 0,
                    comID = invoice.comID,
                    depositID = (int)invoice.fiscalYear,
                    locID = invoice.locID ?? 0,
                    cstID = (int)invoice.CustomerOrVendorID,
                    vendID = 0,
                    prodID = product.prodID ?? 0,
                    prodBCID = product.prodBCID ?? 0,
                    bonusQty = product.bounsQty ?? 0,
                    qty = product.qty ?? 0,
                    qtyBal = 0,
                    unitPrice = product.purchRate ?? 0,
                    creditSum = 0,
                    debitSum = product.purchRate * product.qty ?? 0,
                    discountSum = 0,
                    extraDiscountSum = 0,
                    rebateSum = 0,
                    batchNo = product.batchNo,
                    taxSum = 0,
                    dtTx = invoice.invoiceDate,
                    expiry = product.expiry,
                    glComments = product.notes,
                    checkName = invoice.convertedInvoiceNo,
                    checkAdd = "",
                    checkNo = "",
                    voucherID = "",
                    voucherNo = invoice.invoiceVoucherNo?.ToString(),
                    crtDate = DateTime.Now,
                    modDate = DateTime.Now,
                    acctNo = costOfGoodsAccCode,
                    relAcctNo = stockInTradeAccCode,
                    isPaid = false,
                    isVoided = false,
                    isDeposited = false,
                    isCleared = false,
                    isConverted = false,
                    gLDetails = null,
                    salesManID = (int)(invoice.salesmanID ?? 0),
                    bookerID = (int)(invoice.bookerID ?? 0),
                };

                glEntries.Add(glEntry3);


                totalNetAmount += product.netAmount;

            }


            glDetailEntry = new GL
            {
                GLID = (int)invoice.invoiceDetailID,
                txTypeID = (int)invoice.txTypeID,
                vendID = 0,
                cstID = (int)invoice.CustomerOrVendorID,
                depositID = (int)invoice.fiscalYear,
                isDeposited = false,
                isVoided = false,
                isCleared = false,
                isPaid = false,
                voucherNo = invoice.invoiceVoucherNo,
                instituteOffer = 0,
                debitSum = (decimal)totalNetAmount,
                creditSum = 0,
                discountSum = 0,
                extraDiscountSum = 0,
                taxSum = 0,
                rebateSum = 0,
                paidSum = 0,
                checkName = invoice.convertedInvoiceNo,
                salesManID = (int)(invoice.salesmanID ?? 0),
                bookerID = (int)(invoice.bookerID ?? 0),
                dtTx = invoice.invoiceDate,
                locID = (int)invoice.locID,
                comID = invoice.comID,
                acctNo = cashOrCreditAccCode,
                relAcctNo = saleLocalAccCode,
                crtDate = DateTime.Now,
                modDate = DateTime.Now,
                isConverted = false,
                balSum = invoice.invoiceType.ToLower() == "credit" ? (decimal)invoice.netTotal : 0
            };

            glEntries.Add(glDetailEntry);

            return glEntries.Cast<object>().ToList();
        }
    }
}
