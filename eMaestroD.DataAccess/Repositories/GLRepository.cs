using eMaestroD.DataAccess.DataSet;
using eMaestroD.DataAccess.IRepositories;
using eMaestroD.Models.Models;
using eMaestroD.Models.VMModels;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.DataAccess.Repositories
{
    public class GLRepository : IGLRepository
    {
        private readonly AMDbContext _dbContext;
        public GLRepository(AMDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<string> GenerateGLVoucherNoAsync(int txTypeID, int? comID)
        {
            string sql = "EXEC GenerateGLVoucherNo @txType, @comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@txType", Value = txTypeID },
                new SqlParameter { ParameterName = "@comID", Value = comID }
            };

            var SDL = await _dbContext.invoiceNo.FromSqlRaw(sql, parms.ToArray()).ToListAsync();
            return SDL?.FirstOrDefault()?.voucherNo;
        }

        public async Task<string> GenerateTempGLVoucherNoAsync(int txTypeID, int? comID)
        {
            string sql = "EXEC GenerateTempGLVoucherNo @txType, @comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@txType", Value = txTypeID },
                new SqlParameter { ParameterName = "@comID", Value = comID }
            };

            var SDL = await _dbContext.invoiceNo.FromSqlRaw(sql, parms.ToArray()).ToListAsync();
            return SDL?.FirstOrDefault()?.voucherNo;
        }
        public async Task<List<GL>> GetGLEntriesByVoucherNoAsync(string voucherNo)
        {
            return await _dbContext.gl
                .Include(gl => gl.gLDetails)
                .Where(gl => gl.voucherNo == voucherNo)
                .ToListAsync();
        }

        public async Task<List<TempGL>> GetSaleGLEntriesByVoucherNoAsync(string voucherNo)
        {
            var query = "EXEC GetSaleGLEntriesByVoucherNo @VoucherNo = {0}";

            return await _dbContext.TempGL
                .FromSqlRaw(query, voucherNo)
                .ToListAsync();
        }


        public async Task<List<TempGL>> GetTempGLEntriesByVoucherNoAsync(string voucherNo)
        {
            return await _dbContext.TempGL
                .Include(gl => gl.tempGLDetails)
                .Where(gl => gl.voucherNo == voucherNo)
                .ToListAsync();
        }


        public async Task<bool> UpdateGLIsConvertedAsync(string voucherNo, string convertedVoucherNo, bool isDeleted)
        {
            try
            {
                var entries = await _dbContext.gl.Where(g => g.voucherNo == voucherNo).ToListAsync();

                if (!entries.Any())
                {
                    return false;
                }

                foreach (var entry in entries)
                {
                    if (!isDeleted)
                    {
                        entry.isConverted = true;
                        entry.checkName = convertedVoucherNo;
                    }
                    else
                    {
                        entry.isConverted = false;
                        entry.checkName = "";
                    }

                    _dbContext.Entry(entry).State = EntityState.Modified;
                }

                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return false;
            }
        }

        public async Task InsertEntriesAsync<T>(List<T> items) where T : class
        {
            if (items == null || !items.Any()) throw new ArgumentException("No items to process.");

            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var firstItem = items.First();
                    var dbSet = _dbContext.Set<T>();

                    await dbSet.AddAsync(firstItem);
                    await _dbContext.SaveChangesAsync();

                    var primaryKeyProperty = typeof(T).GetProperty("GLID") ?? typeof(T).GetProperty("TempGLID");
                    var txIDProperty = typeof(T).GetProperty("txID");
                    var firstItemId = primaryKeyProperty.GetValue(firstItem);

                    foreach (var item in items.Skip(1))
                    {
                        txIDProperty?.SetValue(item, firstItemId);
                    }

                    await dbSet.AddRangeAsync(items.Skip(1));
                    await _dbContext.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }

        public async Task UpdateEntriesAsync<T>(List<T> items) where T : class
        {
            if (items == null || !items.Any()) throw new ArgumentException("No items to update.");

            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    // Update the first item
                    var firstItem = items.First();
                    _dbContext.Set<T>().Update(firstItem);
                    await _dbContext.SaveChangesAsync();

                    // Set `txID` for the remaining items if applicable
                    var idProperty = firstItem.GetType().GetProperty("GLID") ?? firstItem.GetType().GetProperty("TempGLID");
                    var firstItemId = idProperty?.GetValue(firstItem);

                    foreach (var item in items.Skip(1))
                    {
                        var txIDProperty = item.GetType().GetProperty("txID");
                        if (txIDProperty != null && firstItemId != null)
                        {
                            txIDProperty.SetValue(item, firstItemId);
                        }
                    }

                    _dbContext.Set<T>().UpdateRange(items.Skip(1));
                    await _dbContext.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }



        public async Task InsertGLEntriesAsync(List<GL> items)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var firstItem = items.FirstOrDefault();
                    if (firstItem != null)
                    {
                        await _dbContext.Set<GL>().AddAsync(firstItem);
                        await _dbContext.SaveChangesAsync();

                        items.Skip(1).ToList().ForEach(item => item.txID = firstItem.GLID);

                        await _dbContext.Set<GL>().AddRangeAsync(items.Skip(1));
                        await _dbContext.SaveChangesAsync();

                        if (!string.IsNullOrEmpty(firstItem.checkName))
                            await UpdateGLIsConvertedAsync(firstItem.checkName, firstItem.voucherNo, false);
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
        public async Task UpdateGLEntriesAsync(List<GL> items)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var firstItem = items.FirstOrDefault();
                    if (firstItem != null)
                    {
                        _dbContext.Set<GL>().Update(firstItem);
                        await _dbContext.SaveChangesAsync();

                        items.Skip(1).ToList().ForEach(item => item.txID = firstItem.GLID);

                        _dbContext.Set<GL>().UpdateRange(items.Skip(1));
                        await _dbContext.SaveChangesAsync();
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

        public async Task<List<Invoice>> GetInvoicesAsync(int txTypeID, int customerOrVendorID, int comID)
        {
            var fiscalYear = await _dbContext.FiscalYear
                                           .Where(x => x.active == true && x.comID == comID)
                                           .Select(f => f.period)
                                           .FirstOrDefaultAsync();


            var query = from gl in _dbContext.gl
                        join c in _dbContext.Customers on gl.cstID equals c.cstID into customerGroup
                        from customer in customerGroup.DefaultIfEmpty()
                        join v in _dbContext.Vendors on gl.vendID equals v.vendID into vendorGroup
                        from vendor in vendorGroup.DefaultIfEmpty()
                        where gl.txTypeID == txTypeID &&
                              gl.comID == comID &&
                              gl.depositID == fiscalYear &&
                              (customerOrVendorID == 0 || gl.cstID == customerOrVendorID || gl.vendID == customerOrVendorID) &&
                              gl.txID == 0
                        orderby gl.GLID descending
                        select new Invoice
                        {
                            invoiceID = gl.GLID,
                            invoiceVoucherNo = gl.voucherNo,
                            invoiceDate = gl.dtTx,
                            netTotal = gl.creditSum,
                            totalDiscount = gl.discountSum,
                            totalExtraDiscount = gl.extraDiscountSum ?? 0,
                            totalTax = gl.taxSum,
                            totalRebate = gl.rebateSum ?? 0,
                            convertedInvoiceNo = gl.checkName,
                            customerOrVendorName = customer != null ? customer.cstName : vendor.vendName,
                            CustomerOrVendorID = customer != null ? customer.cstID : vendor.vendID,
                            txTypeID = gl.txTypeID,
                            fiscalYear = gl.depositID,
                            locID = gl.locID,
                            comID = gl.comID,
                            isPaymented = gl.isPaid ?? false,
                            isApproved = false,
                            transactionStatus = "",
                            invoiceType = gl.balSum > 0 ? "Credit" : "Cash"
                        };

            var tempGLQuery = from temp in _dbContext.TempGL
                              join c in _dbContext.Customers on temp.cstID equals c.cstID into customerGroup
                              from customer in customerGroup.DefaultIfEmpty()
                              join v in _dbContext.Vendors on temp.vendID equals v.vendID into vendorGroup
                              from vendor in vendorGroup.DefaultIfEmpty()
                              where temp.txTypeID == txTypeID &&
                                    temp.comID == comID &&
                                    temp.depositID == fiscalYear &&
                                    (customerOrVendorID == 0 || temp.cstID == customerOrVendorID || temp.vendID == customerOrVendorID) &&
                                    temp.txID == 0
                              orderby temp.TempGLID descending
                              select new Invoice
                              {
                                  invoiceID = temp.TempGLID,
                                  invoiceVoucherNo = temp.voucherNo,
                                  invoiceDate = temp.dtTx,
                                  netTotal = temp.creditSum,
                                  totalDiscount = temp.discountSum,
                                  totalExtraDiscount = temp.extraDiscountSum ?? 0,
                                  totalTax = temp.taxSum,
                                  totalRebate = temp.rebateSum ?? 0,
                                  convertedInvoiceNo = temp.checkName,
                                  customerOrVendorName = customer != null ? customer.cstName : vendor.vendName,
                                  CustomerOrVendorID = customer != null ? customer.cstID : vendor.vendID,
                                  txTypeID = temp.txTypeID,
                                  fiscalYear = temp.depositID,
                                  locID = temp.locID,
                                  comID = temp.comID,
                                  isPaymented = temp.isPaid ?? false,
                                  isApproved = temp.ApprovedDate != null ? true : false,
                                  transactionStatus = temp.TransactionStatus,
                                  invoiceType = temp.balSum > 0 ? "Credit" : "Cash"
                              };

            var combinedQuerry = query.Union(tempGLQuery);

            return await combinedQuerry.OrderByDescending(x=>x.invoiceDate).ToListAsync();
        }

        public async Task DeleteGLEntriesAsync(string voucherNo)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var entriesToDelete = await this.GetGLEntriesByVoucherNoAsync(voucherNo);
                    if (entriesToDelete.Any())
                    {
                        if (!string.IsNullOrEmpty(entriesToDelete.First().checkName))
                            await UpdateGLIsConvertedAsync(entriesToDelete.First().checkName, entriesToDelete.First().voucherNo, true);

                        var glDetailsToDelete = entriesToDelete
                            .SelectMany(gl => gl.gLDetails)
                            .ToList();

                        if (glDetailsToDelete.Any())
                        {
                            _dbContext.Set<GLDetail>().RemoveRange(glDetailsToDelete);
                        }

                        _dbContext.Set<GL>().RemoveRange(entriesToDelete);
                        await _dbContext.SaveChangesAsync();
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

        public async Task ApproveTempGLEntriesAsync(string voucherNo)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var email = "";
                    var entriesToApprove = await this.GetTempGLEntriesByVoucherNoAsync(voucherNo);
                    if (entriesToApprove.Any())
                    {
                        var transactionLog = new TransactionLog
                        {
                            voucherNo = entriesToApprove[0].voucherNo,
                            txTypeID = entriesToApprove[0].txTypeID,
                            note = "Entry Approved",
                            prevStatus = entriesToApprove[0].TransactionStatus, // Capture previous status
                            updatedStatus = "Approved",
                            crtBy = email,
                            crtDate = DateTime.Now
                        };

                        foreach (var item in entriesToApprove)
                        {
                            item.ApprovedBy = email;
                            item.ApprovedDate = DateTime.Now;
                            item.TransactionStatus = "Approved";
                        }

                        await _dbContext.Set<TransactionLog>().AddAsync(transactionLog);
                        _dbContext.Set<TempGL>().UpdateRange(entriesToApprove);
                        await _dbContext.SaveChangesAsync();
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

        public async Task PostTempGLEntriesAsync(string voucherNo)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var email = "";
                    var entriesToApprove = await this.GetTempGLEntriesByVoucherNoAsync(voucherNo);
                    if (entriesToApprove.Any())
                    {
                        var transactionLog = new TransactionLog
                        {
                            voucherNo = entriesToApprove[0].voucherNo,
                            txTypeID = entriesToApprove[0].txTypeID,
                            note = "Entry posted",
                            prevStatus = entriesToApprove[0].TransactionStatus, // Capture previous status
                            updatedStatus = "Posted",
                            crtBy = email,
                            crtDate = DateTime.Now
                        };

                        foreach (var item in entriesToApprove)
                        {
                            item.PostedBy = email;
                            item.PostedDate = DateTime.Now;
                            item.TransactionStatus = "Posted";
                        }



                        await _dbContext.Set<TransactionLog>().AddAsync(transactionLog);
                        _dbContext.Set<TempGL>().UpdateRange(entriesToApprove);
                        await _dbContext.SaveChangesAsync();
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

        public async Task<List<VendorProduct>> GetVendorProductListAsync(int comID)
        {
            return await _dbContext.VendorProducts.Where(x => x.comID == comID).ToListAsync();
        }

        public async Task InsertVendorProductAsync(VendorProduct vendorProduct)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    _dbContext.Set<VendorProduct>().AddAsync(vendorProduct);
                    await _dbContext.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }

        public async Task<List<InvoiceProduct>> GetItemsBySupplierAndDate(int supplierId, DateTime datefrom, DateTime dateTo)
        {
            string sql = "EXEC GetProductsBySupplierAndDateRange @SupplierID, @DateFrom, @DateTo";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@SupplierID", Value = supplierId },
                new SqlParameter { ParameterName = "@DateFrom", Value = datefrom },
                new SqlParameter { ParameterName = "@DateTo", Value = dateTo }
            };

            var SDL = await _dbContext.InvoiceProducts.FromSqlRaw(sql, parms.ToArray()).ToListAsync();
            return SDL;
        }

        public async Task<List<InvoiceProduct>> GetProductBatchByProdBCID(int prodBCID, int locID, int comID)
        {
            string sql = "EXEC GetProductBatchByProdBCID @SupplierID, @DateFrom, @DateTo";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@prodBCID", Value = prodBCID },
                new SqlParameter { ParameterName = "@locID", Value = locID },
                new SqlParameter { ParameterName = "@comID", Value = comID }
            };

            var SDL = await _dbContext.InvoiceProducts.FromSqlRaw(sql, parms.ToArray()).ToListAsync();
            return SDL;
        }

       
        //will do this after tempGL
        public async Task<List<GLTxLinks>> GenerateGLTxLinks(string invoiceNo, int? GLID)
        {
            if(GLID != 0)
            {
                var result = await _dbContext.GLTxLinks.Where(x=>x.GLID == GLID).ToListAsync();
                return result;
            }
            else
            {
                var result = await _dbContext.GLTxLinks.Where(x => x.GLID == GLID).ToListAsync();
                return result;
            }
        }

        //Temp method until all invoices change.
        public async Task OldInsertGLEntriesAsync(IEnumerable<GL> items, DateTime now, string username)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
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
                        await _dbContext.Set<GL>().AddAsync(item);
                        await _dbContext.SaveChangesAsync();
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
