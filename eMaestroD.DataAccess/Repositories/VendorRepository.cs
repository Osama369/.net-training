using eMaestroD.DataAccess.DataSet;
using eMaestroD.DataAccess.IRepositories;
using eMaestroD.Models.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.DataAccess.Repositories
{
    public class VendorRepository : IVendorRepository
    {
        private readonly AMDbContext _dbContext;
        public VendorRepository(AMDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<Vendors> GetVendorByIdAsync(int vendorId)
        {
            return await _dbContext.Vendors
                .Where(v => v.vendID == vendorId)
                .FirstOrDefaultAsync();
        }
    }
}
