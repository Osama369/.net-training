using eMaestroD.DataAccess.DataSet;
using eMaestroD.DataAccess.IRepositories;
using eMaestroD.Models.Models;
using eMaestroD.Models.VMModels;
using Microsoft.Data.SqlClient;
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

        public async Task<string> GenerateVoucherNoAsync(int txTypeID, int? comID)
        {
            string sql = "EXEC GenerateVoucherNo @txType, @comID";
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

        public async Task<bool> UpdateGLIsConvertedAsync(string voucherNo, string convertedVoucherNo)
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
                    entry.isConverted = true;
                    entry.checkName = convertedVoucherNo;

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
                            await UpdateGLIsConvertedAsync(firstItem.checkName, firstItem.voucherNo);
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
                            invoiceType = gl.balSum > 0 ? "Credit" : "Cash"
                        };

            return await query.ToListAsync();
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
    }
}
