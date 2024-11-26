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
    public class SaleOrderHandler : IInvoiceHandler
    {
        private readonly IHelperMethods _helperMethods;
        private readonly IGLService _gLService;
        public SaleOrderHandler(IHelperMethods helperMethods, IGLService gLService)
        {
            _helperMethods = helperMethods;
            _gLService = gLService;
        }
        public async Task<List<object>> ConvertInvoiceToGL(Invoice invoice)
        {
            if (string.IsNullOrEmpty(invoice.invoiceVoucherNo))
            {
                invoice.invoiceVoucherNo = await _gLService.GenerateTempGLVoucherNo((int)invoice.txTypeID, invoice.comID);
            }
            TempGL glMasterEntry = new TempGL();
            TempGL glDetailEntry = new TempGL();
            List<TempGL> glEntries = new List<TempGL>();
            decimal? totalNetAmount = 0;

            
            //141
            var saleLocalAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.SaleLocal);
            //80
            var cashOrCreditAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.TradeDebtors);

            if (invoice.invoiceType.ToLower() == "cash")
            {
                cashOrCreditAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.CashInHand);
            }

            glMasterEntry = new TempGL
            {
                TempGLID = (int)invoice.invoiceID,
                txTypeID = (int)invoice.txTypeID,
                cstID = (int)invoice.CustomerOrVendorID,
                vendID = 0,
                salesManID = (int)invoice.salesmanID,
                bookerID = (int)invoice.bookerID,
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
                TransactionStatus = "Pending",
                balSum = invoice.invoiceType.ToLower() == "credit" ? (decimal)invoice.netTotal : 0

            };

            glEntries.Add(glMasterEntry);


            foreach (var product in invoice.Products)
            {
                TempGL glEntry1 = new TempGL
                {
                    TempGLID = product.prodInvoiceID != null && product.prodInvoiceID != 0 ? (int)product.prodInvoiceID : 0,
                    txTypeID = invoice.txTypeID ?? 0,
                    comID = invoice.comID,
                    depositID = (int)invoice.fiscalYear,
                    locID = invoice.locID ?? 0,
                    cstID = (int)invoice.CustomerOrVendorID,
                    salesManID = (int)invoice.salesmanID,
                    bookerID = (int)invoice.bookerID,
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
                    checkName = "",
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
                    TransactionStatus = "Pending",
                    tempGLDetails = product.ProductTaxes.Select(tax => new TempGLDetail
                    {
                        TempGLDetailID = tax.taxDetailID,
                        acctNo = tax.taxAcctNo,
                        GLAmount = tax.taxAmount,
                        rate = tax.taxPercent
                    }).ToList()
                };
                
                glEntries.Add(glEntry1);

                totalNetAmount += product.netAmount;

            }


            glDetailEntry = new TempGL
            {
                TempGLID = (int)invoice.invoiceDetailID,
                txTypeID = (int)invoice.txTypeID,
                cstID = 0,
                vendID = (int)invoice.CustomerOrVendorID,
                depositID = (int)invoice.fiscalYear,
                salesManID = (int)invoice.salesmanID,
                bookerID = (int)invoice.bookerID,
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
                dtTx = invoice.invoiceDate,
                locID = (int)invoice.locID,
                comID = invoice.comID,
                acctNo = cashOrCreditAccCode,
                relAcctNo = saleLocalAccCode,
                crtDate = DateTime.Now,
                modDate = DateTime.Now,
                isConverted = false,
                TransactionStatus = "Pending",
                balSum = invoice.invoiceType.ToLower() == "credit" ? (decimal)invoice.netTotal : 0
            };

            glEntries.Add(glDetailEntry);

            return glEntries.Cast<object>().ToList();
        }
    }
}
