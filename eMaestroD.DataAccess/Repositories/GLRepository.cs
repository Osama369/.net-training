using eMaestroD.DataAccess.DataSet;
using eMaestroD.DataAccess.IRepositories;
using eMaestroD.Models.Models;
using eMaestroD.Models.VMModels;
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
        private readonly AMDbContext _AMDbContext;
        public GLRepository(AMDbContext dbContext)
        {
            _AMDbContext = dbContext;
        }

        public async Task<List<GL>> GetGLEntriesByVoucherNoAsync(string voucherNo)
        {
            return await _AMDbContext.gl
                .Include(gl => gl.gLDetails)
                .Where(gl => gl.voucherNo == voucherNo)
                .ToListAsync();
        }

        public async Task<bool> UpdateGLIsConvertedAsync(string voucherNo, string convertedVoucherNo)
        {
            try
            {
                var entries = await _AMDbContext.gl.Where(g => g.voucherNo == voucherNo).ToListAsync();

                if (!entries.Any())
                {
                    return false;
                }

                foreach (var entry in entries)
                {
                    entry.isConverted = true;
                    entry.checkName = convertedVoucherNo;

                    _AMDbContext.Entry(entry).State = EntityState.Modified;
                }

                await _AMDbContext.SaveChangesAsync();
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
