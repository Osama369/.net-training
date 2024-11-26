using eMaestroD.DataAccess.IRepositories;
using eMaestroD.InvoiceProcessing.Factories;
using eMaestroD.InvoiceProcessing.Interfaces;
using eMaestroD.Models.Models;
using eMaestroD.Models.VMModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.InvoiceProcessing.Services
{
    public class GLService : IGLService
    {
        private readonly InvoiceHandlerFactory _invoiceHandlerFactory;
        private readonly IGLRepository _glRepository; 
        private readonly IHelperMethods _helperMethods;
        private readonly ICustomerRepository _customerRepository;
        private readonly IVendorRepository _vendorRepository;
        private readonly IProductRepository _productRepository;

        public GLService(IGLRepository glRepository, InvoiceHandlerFactory invoiceHandlerFactory, IHelperMethods helperMethods, ICustomerRepository customerRepository, IVendorRepository vendorRepository, IProductRepository productRepository)
        {
            _invoiceHandlerFactory = invoiceHandlerFactory;
            _glRepository = glRepository;
            _helperMethods = helperMethods;
            _customerRepository = customerRepository;
            _vendorRepository = vendorRepository;
            _productRepository = productRepository;

        }

        public async Task<string> GenerateGLVoucherNo(int txTypeID, int? comID)
        {
            return await _glRepository.GenerateGLVoucherNoAsync(txTypeID, comID);
        }

        public async Task<string> GenerateTempGLVoucherNo(int txTypeID, int? comID)
        {
            return await _glRepository.GenerateTempGLVoucherNoAsync(txTypeID, comID);
        }

        public async Task<List<object>> ConvertInvoiceToGL(Invoice invoice)
        {
            if (invoice.invoiceID == 0)
            {
                var fy = await _helperMethods.GetActiveFiscalYear(invoice.comID, invoice.invoiceDate);
                if (fy == null)
                {
                    throw new InvalidOperationException("Fiscal year selection is outdated. Please choose a fiscal year that is currently valid.");
                }

                invoice.fiscalYear = fy.period;
            }

            var handler = _invoiceHandlerFactory.GetInvoiceHandler((int)invoice.txTypeID, this);
            return await handler.ConvertInvoiceToGL(invoice);
        }

        public async Task<decimal> GetInvoiceRemainingAmount(string voucherNo)
        {
            var glEntries = await _glRepository.GetGLEntriesByVoucherNoAsync(voucherNo);

            if (glEntries != null && glEntries.Any())
            {
                var entry = glEntries.FirstOrDefault(ge => !IsMasterEntry(ge) && ge.prodBCID == 0);
                return entry.balSum;
            }

            throw new InvalidOperationException("Entry not found.");
        }
        public async Task<Invoice> ConvertGLToInvoice(string voucherNo)
        {
            var glEntries = await _glRepository.GetGLEntriesByVoucherNoAsync(voucherNo);

            if (glEntries != null && glEntries.Any())
            {

                var masterEntry = glEntries.FirstOrDefault(ge => IsMasterEntry(ge));
                if (masterEntry == null)
                {
                    throw new InvalidOperationException("Master Entry not found.");
                }

                var detailEntries = glEntries.Where(ge => !IsMasterEntry(ge) && ge.prodBCID > 0).ToList();

                var entry = glEntries.FirstOrDefault(ge => !IsMasterEntry(ge) && ge.prodBCID == 0);
                int invoiceDetailID = entry != null ? entry.GLID : 0;

                string customerOrVendorName = string.Empty;
                if (masterEntry.cstID != 0)
                {
                    var customer = await _customerRepository.GetCustomerByIdAsync(masterEntry.cstID);
                    customerOrVendorName = customer?.cstName ?? "";
                }
                else if (masterEntry.vendID != 0)
                {
                    var vendor = await _vendorRepository.GetVendorByIdAsync(masterEntry.vendID);
                    customerOrVendorName = vendor?.vendName ?? "";
                }


                var invoice = new Invoice
                {
                    invoiceID = masterEntry.GLID,
                    invoiceDetailID = invoiceDetailID,
                    txTypeID = masterEntry.txTypeID,
                    CustomerOrVendorID = masterEntry.cstID != 0 ? masterEntry.cstID : masterEntry.vendID,
                    customerOrVendorName = customerOrVendorName,
                    fiscalYear = masterEntry.depositID,
                    invoiceVoucherNo = masterEntry.voucherNo,
                    invoiceDate = masterEntry.dtTx,
                    locID = masterEntry.locID,
                    comID = masterEntry.comID,
                    grossTotal = masterEntry.creditSum + masterEntry.discountSum + masterEntry.extraDiscountSum - masterEntry.taxSum + masterEntry.rebateSum,
                    netTotal = masterEntry.creditSum,
                    totalExtraTax = decimal.Zero,
                    totalAdvanceExtraTax = decimal.Zero,
                    totalDiscount = masterEntry.discountSum,
                    totalExtraDiscount = masterEntry.extraDiscountSum,
                    totalTax = masterEntry.taxSum,
                    totalRebate = masterEntry.rebateSum,
                    convertedInvoiceNo = masterEntry.checkName,
                    invoiceType = masterEntry.balSum > 0 ? "Credit" : "Cash",
                    isPaymented = masterEntry.isPaid,
                    totalRemainingPayment = entry.balSum,
                    bookerID = masterEntry.bookerID,
                    salesmanID = masterEntry.salesManID,
                    Products = new List<InvoiceProduct>()
                };

                foreach (var detail in detailEntries)
                {
                    var productDetail = await _productRepository.GetProducts((int)masterEntry.comID, detail.prodBCID);
                    var product = new InvoiceProduct
                    {
                        prodInvoiceID = detail.GLID,
                        prodID = detail.prodID,
                        prodBCID = detail.prodBCID,
                        prodCode = productDetail.FirstOrDefault().barCode,
                        prodName = productDetail.FirstOrDefault().prodName,
                        qty = detail.qty,
                        bounsQty = detail.bonusQty,
                        purchRate = detail.unitPrice,
                        sellRate = detail.unitPrice,
                        netAmount = detail.debitSum > 0 ? detail.debitSum : detail.creditSum,
                        discountPercent = (detail.checkAdd != null && decimal.TryParse(detail.checkAdd.ToString(), out var parsedValue)) ? parsedValue : 0,
                        discountAmount = detail.discountSum,
                        extraDiscountAmount = detail.extraDiscountSum,
                        rebateAmount = detail.rebateSum,
                        batchNo = detail.batchNo,
                        expiry = detail.expiry,
                        notes = detail.glComments,
                        mrp = detail.mrp,
                        sellingPrice = detail.sellPrice,
                        lastCost = detail.lastCost,
                        ProductTaxes = detail.gLDetails.Select(detail => new InvoiceProductTax
                        {
                            taxDetailID = detail.GLDetailID,
                            taxAcctNo = detail.acctNo,
                            taxAmount = detail.GLAmount,
                            taxPercent = detail.rate
                        }).ToList()
                    };

                    invoice.Products.Add(product);
                }

                return invoice;
            }
            else 
            {
                var tempGlEntries = await _glRepository.GetTempGLEntriesByVoucherNoAsync(voucherNo);
                if (tempGlEntries == null || !tempGlEntries.Any())
                {
                    throw new InvalidOperationException("No Entries found for the provided voucher number.");
                }

                var masterEntry = tempGlEntries.FirstOrDefault(ge => IsMasterTempEntry(ge));
                if (masterEntry == null)
                {
                    throw new InvalidOperationException("Master Entry not found.");
                }

                var detailEntries = tempGlEntries.Where(ge => !IsMasterTempEntry(ge) && ge.prodBCID > 0).ToList();

                var entry = tempGlEntries.FirstOrDefault(ge => !IsMasterTempEntry(ge) && ge.prodBCID == 0);
                int invoiceDetailID = entry != null ? entry.TempGLID : 0;

                string customerOrVendorName = string.Empty;
                if (masterEntry.cstID != 0)
                {
                    var customer = await _customerRepository.GetCustomerByIdAsync(masterEntry.cstID);
                    customerOrVendorName = customer?.cstName ?? "";
                }
                else if (masterEntry.vendID != 0)
                {
                    var vendor = await _vendorRepository.GetVendorByIdAsync(masterEntry.vendID);
                    customerOrVendorName = vendor?.vendName ?? "";
                }


                var invoice = new Invoice
                {
                    invoiceID = masterEntry.TempGLID,
                    invoiceDetailID = invoiceDetailID,
                    txTypeID = masterEntry.txTypeID,
                    CustomerOrVendorID = masterEntry.cstID != 0 ? masterEntry.cstID : masterEntry.vendID,
                    customerOrVendorName = customerOrVendorName,
                    fiscalYear = masterEntry.depositID,
                    invoiceVoucherNo = masterEntry.voucherNo,
                    invoiceDate = masterEntry.dtTx,
                    locID = masterEntry.locID,
                    comID = masterEntry.comID,
                    grossTotal = masterEntry.creditSum + masterEntry.discountSum + masterEntry.extraDiscountSum - masterEntry.taxSum + masterEntry.rebateSum,
                    netTotal = masterEntry.creditSum,
                    totalExtraTax = decimal.Zero,
                    totalAdvanceExtraTax = decimal.Zero,
                    totalDiscount = masterEntry.discountSum,
                    totalExtraDiscount = masterEntry.extraDiscountSum,
                    totalTax = masterEntry.taxSum,
                    totalRebate = masterEntry.rebateSum,
                    convertedInvoiceNo = masterEntry.checkName,
                    invoiceType = masterEntry.balSum > 0 ? "Credit" : "Cash",
                    isPaymented = masterEntry.isPaid,
                    totalRemainingPayment = entry.balSum,
                    isApproved = masterEntry.ApprovedDate != null ? true : false,
                    bookerID = masterEntry.bookerID,
                    salesmanID = masterEntry.salesManID,
                    Products = new List<InvoiceProduct>()
                };

                foreach (var detail in detailEntries)
                {
                    var productDetail = await _productRepository.GetProducts((int)masterEntry.comID, detail.prodBCID);
                    var product = new InvoiceProduct
                    {
                        prodInvoiceID = detail.TempGLID,
                        prodID = detail.prodID,
                        prodBCID = detail.prodBCID,
                        prodCode = productDetail.FirstOrDefault().barCode,
                        prodName = productDetail.FirstOrDefault().prodName,
                        qty = detail.qty,
                        bounsQty = detail.bonusQty,
                        purchRate = detail.unitPrice,
                        sellRate = detail.unitPrice,
                        netAmount = detail.debitSum > 0 ? detail.debitSum : detail.creditSum,
                        discountPercent = (detail.checkAdd != null && decimal.TryParse(detail.checkAdd.ToString(), out var parsedValue)) ? parsedValue : 0,
                        discountAmount = detail.discountSum,
                        extraDiscountAmount = detail.extraDiscountSum,
                        rebateAmount = detail.rebateSum,
                        batchNo = detail.batchNo,
                        expiry = detail.expiry,
                        notes = detail.glComments,
                        mrp = detail.mrp,
                        sellingPrice = detail.sellPrice,
                        lastCost = detail.lastCost,
                        ProductTaxes = detail.tempGLDetails.Select(detail => new InvoiceProductTax
                        {
                            taxDetailID = detail.TempGLDetailID,
                            taxAcctNo = detail.acctNo,
                            taxAmount = detail.GLAmount,
                            taxPercent = detail.rate
                        }).ToList()
                    };

                    invoice.Products.Add(product);
                }

                return invoice;
            }

            throw new InvalidOperationException("No Invoice found for provided voucherNo.");
        }

        private bool IsMasterEntry(GL glEntry)
        {
            return string.IsNullOrEmpty(glEntry.acctNo) && string.IsNullOrEmpty(glEntry.relAcctNo);
        }
        private bool IsMasterTempEntry(TempGL glEntry)
        {
            return string.IsNullOrEmpty(glEntry.acctNo) && string.IsNullOrEmpty(glEntry.relAcctNo);
        }
        public async Task InsertInvoice(List<GL> items)
        {
            await _glRepository.InsertGLEntriesAsync(items);
        }

        public async Task UpdateInvoice(List<GL> items)
        {
            await _glRepository.UpdateGLEntriesAsync(items);
        }

        public async Task InsertOrUpdateInvoice<T>(List<T> items) where T : class
        {
            if (items == null || !items.Any()) throw new ArgumentException("No items to process.");

            // Check if update or insert based on ID
            var firstItem = items.First();
            var idProperty = firstItem.GetType().GetProperty("GLID") ?? firstItem.GetType().GetProperty("TempGLID");
            var isUpdate = idProperty != null && (int)idProperty.GetValue(firstItem) != 0;

            if (isUpdate)
            {
                await _glRepository.UpdateEntriesAsync(items);
            }
            else
            {
                await _glRepository.InsertEntriesAsync(items);
            }
        }

        public async Task<List<GLTxLinks>> GenerateGLTxLinks(string invoiceNo, int? GLID)
        {
            var result = await _glRepository.GenerateGLTxLinks(invoiceNo, GLID);
            return result;
        }
        public async Task<List<Invoice>> GetInvoicesAsync(int txTypeID, int customerOrVendorID, int comID)
        {
            return await _glRepository.GetInvoicesAsync(txTypeID, customerOrVendorID, comID);
        }

        public async Task DeleteInvoice(string VoucherNo)
        {
            await _glRepository.DeleteGLEntriesAsync(VoucherNo);
        }

        public async Task ApproveInvoice(string VoucherNo)
        {
            await _glRepository.ApproveTempGLEntriesAsync(VoucherNo);
        }
        public async Task PostInvoices(List<Invoice> invoices)
        {
            foreach (var item in invoices)
            {
                var TempGLToPurchase = await ConvertGLToInvoice(item.invoiceVoucherNo);
                
                TempGLToPurchase.txTypeID = 1;
                TempGLToPurchase.invoiceID = 0;
                TempGLToPurchase.invoiceDetailID = 0;
                TempGLToPurchase.Products.ForEach(x=>x.prodInvoiceID = 0);
                TempGLToPurchase.Products.ForEach(x=>x.ProductTaxes.ForEach(x=>x.taxDetailID = 0));
                TempGLToPurchase.invoiceVoucherNo = "";
                TempGLToPurchase.convertedInvoiceNo = item.invoiceVoucherNo;

                var entries = await ConvertInvoiceToGL(TempGLToPurchase);
                if (entries.FirstOrDefault() is TempGL)
                {
                    await InsertOrUpdateInvoice<TempGL>(entries.Cast<TempGL>().ToList());
                }
                else if (entries.FirstOrDefault() is GL)
                {
                    await InsertOrUpdateInvoice<GL>(entries.Cast<GL>().ToList());
                }
                await _glRepository.PostTempGLEntriesAsync(item.invoiceVoucherNo);
            }
        }

        public async Task<List<VendorProduct>> GetVendorProductListAsync(int comID)
        {
            var data = await _glRepository.GetVendorProductListAsync(comID);
            return data;
        }

        public async Task InsertVendorProductAsync(VendorProduct vendorProduct)
        {
            await _glRepository.InsertVendorProductAsync(vendorProduct);
        }

        public async Task<List<InvoiceProduct>> GetItemsBySupplierAndDate(int supplierId, DateTime datefrom, DateTime dateTo)
        {
            var data = await _glRepository.GetItemsBySupplierAndDate(supplierId, datefrom, dateTo);
            return data;
        }
        
        //Remove this after all invoices changes
        public async Task InsertGLEntriesAsync<T>(IEnumerable<T> items, DateTime now, string username) where T : GL
        {
            await _glRepository.OldInsertGLEntriesAsync(items, now, username);
        }
    }
}
