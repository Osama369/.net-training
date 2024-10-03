using eMaestroD.Api.Data;
using eMaestroD.DataAccess.DataSet;
using eMaestroD.DataAccess.IRepositories;
using eMaestroD.InvoiceProcessing.Factories;
using eMaestroD.Models.Models;
using eMaestroD.Models.VMModels;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace eMaestroD.Api.Common
{
    public class GLService
    {
        private readonly AMDbContext _AMDbContext;
        private readonly HelperMethods _helperMethods;
        private readonly InvoiceHandlerFactory _invoiceHandlerFactory;
        private readonly IGLRepository _glRepository;
        string userName = "";

        public GLService(AMDbContext aMDbContext, IGLRepository glRepository, HelperMethods helperMethods, InvoiceHandlerFactory invoiceHandlerFactory)
        {
            _AMDbContext = aMDbContext;
            _helperMethods = helperMethods;
            userName = _helperMethods.GetActiveUser_Username();
            _invoiceHandlerFactory = invoiceHandlerFactory;
            _glRepository = glRepository;

        }

        public async Task<string> GenerateVoucherNo(int txTypeID, int? comID)
        {
            string sql = "EXEC GenerateVoucherNo @txType, @comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@txType", Value = txTypeID },
                new SqlParameter { ParameterName = "@comID", Value = comID }
            };

            var SDL = await _AMDbContext.invoiceNo.FromSqlRaw(sql, parms.ToArray()).ToListAsync();
            return SDL?.FirstOrDefault()?.voucherNo;
        }

        public async Task<List<GL>> ConvertInvoiceToGL(Invoice invoice)
        {
            var fy = await _helperMethods.GetActiveFiscalYear(invoice.comID, invoice.invoiceDate);
            if (fy == null)
            {
                throw new InvalidOperationException("Fiscal year selection is outdated. Please choose a fiscal year that is currently valid.");
            }

            invoice.fiscalYear = fy.period;
            invoice.invoiceVoucherNo = await GenerateVoucherNo((int)invoice.txTypeID, invoice.comID);
            
            var handler = _invoiceHandlerFactory.GetInvoiceHandler((int)invoice.txTypeID);
            return await handler.ConvertInvoiceToGL(invoice);
        }


        public async Task<Invoice> ConvertGLToInvoice(string voucherNo)
        {
            var glEntries = await _glRepository.GetGLEntriesByVoucherNoAsync(voucherNo);

            if (glEntries == null || !glEntries.Any())
            {
                throw new InvalidOperationException("No GL entries found for the provided voucher number.");
            }

            var masterEntry = glEntries.FirstOrDefault(ge => IsMasterEntry(ge));
            if (masterEntry == null)
            {
                throw new InvalidOperationException("Master GL entry not found.");
            }

            var detailEntries = glEntries.Where(ge => !IsMasterEntry(ge) && ge.prodID > 0).ToList();

            var invoice = new Invoice
            {
                txTypeID = masterEntry.txTypeID,
                cstID = masterEntry.cstID,
                vendID = masterEntry.vendID,
                fiscalYear = masterEntry.depositID,
                invoiceVoucherNo = masterEntry.voucherNo,
                invoiceDate = masterEntry.dtTx,
                locID = masterEntry.locID,
                comID = masterEntry.comID,
                netTotal = masterEntry.creditSum,
                totalDiscount = masterEntry.discountSum,
                totalExtraDiscount = masterEntry.extraDiscountSum,
                totalTax = masterEntry.taxSum,
                totalRebate = masterEntry.rebateSum,
                convertedInvoiceNo = masterEntry.checkName,
                Products = new List<InvoiceProduct>()
            };

            foreach (var detail in detailEntries)
            {
                var product = new InvoiceProduct
                {
                    prodID = detail.prodID,
                    prodBCID = detail.prodBCID,
                    qty = detail.qty,
                    bounsQty = detail.bonusQty,
                    purchRate = detail.unitPrice,
                    netAmount = detail.debitSum,
                    discountAmount = detail.discountSum,
                    extraDiscountAmount = detail.extraDiscountSum,
                    rebateAmount = detail.rebateSum,
                    batchNo = detail.batchNo,
                    expiry = detail.expiry,
                    notes = detail.glComments,
                    ProductTaxes = detail.gLDetails.Select(detailDetail => new InvoiceProductTax
                    {
                        taxAcctNo = detailDetail.acctNo,
                        taxAmount = detailDetail.GLAmount,
                        taxPercent = detailDetail.rate
                    }).ToList()
                };

                invoice.Products.Add(product);
            }

            return invoice;
        }

        private bool IsMasterEntry(GL glEntry)
        {
            return string.IsNullOrEmpty(glEntry.acctNo) && string.IsNullOrEmpty(glEntry.relAcctNo);
        }


        public async Task InsertGLEntries(List<GL> items)
        {
            using (var transaction = await _AMDbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var firstItem = items.FirstOrDefault();
                    if (firstItem != null)
                    {
                        await _AMDbContext.Set<GL>().AddAsync(firstItem);
                        await _AMDbContext.SaveChangesAsync();
                        
                        items.Skip(1).ToList().ForEach(item => item.txID = firstItem.GLID);
                        
                        await _AMDbContext.Set<GL>().AddRangeAsync(items.Skip(1));
                        await _AMDbContext.SaveChangesAsync();

                        if (!string.IsNullOrEmpty(firstItem.checkName))
                           await _glRepository.UpdateGLIsConvertedAsync(firstItem.checkName, firstItem.voucherNo);
                    }

                    await transaction.CommitAsync();
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }

        public async Task InsertGLEntriesAsync<T>(IEnumerable<T> items, DateTime now, string username) where T : GL
        {
            using (var transaction = await _AMDbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    int gl1 = 0;
                    foreach (var item in items)
                    {
                        item.crtDate = now;
                        item.crtBy = username;
                        item.modDate = now;
                        item.modBy = username;
                        if (gl1 != 0)
                        {
                            item.txID = gl1;
                        }
                        await _AMDbContext.Set<T>().AddAsync(item);
                        await _AMDbContext.SaveChangesAsync();
                        if (gl1 == 0)
                        {
                            gl1 = item.GLID;
                        }
                    }

                    await transaction.CommitAsync();
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }
    }
}
