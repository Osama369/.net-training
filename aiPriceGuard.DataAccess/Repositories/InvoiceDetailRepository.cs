using aiPriceGuard.DataAccess.DataSet;
using aiPriceGuard.DataAccess.IRepositories;
using aiPriceGuard.Models.Models;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.DataAccess.Repositories
{
    public class InvoiceDetailRepository : IinvoiceDetailRepository
    {
        private readonly AMDbContext _dbContext;
        private readonly IServiceScopeFactory _scopeFactory;
        public InvoiceDetailRepository(AMDbContext _dbContext , IServiceScopeFactory _scopeFactory)
        {
            this._dbContext = _dbContext ?? throw new ArgumentNullException(nameof(_dbContext));
            this._scopeFactory = _scopeFactory ?? throw new ArgumentNullException(nameof(_scopeFactory));

        }
        public async Task AddRangeAsync(List<InvoiceDetail> invDetailList)
        {
            try
            {
                using (var scope = _scopeFactory.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<AMDbContext>();

                    // Proceed with adding the details to the dbContext
                    await dbContext.AddRangeAsync(invDetailList);
                    await dbContext.SaveChangesAsync();
                }

                //// Check if _dbContext is disposed
                //if (_dbContext == null || _dbContext.Database.CanConnect() == false)
                //{
                //    // Create a new scope and dbContext if the old one is disposed
                //    using (var scope = _scopeFactory.CreateScope())
                //    {
                //        var dbContext = scope.ServiceProvider.GetRequiredService<AMDbContext>();
                //        await dbContext.AddRangeAsync(invDetailList);
                //        await dbContext.SaveChangesAsync();
                //    }
                //}
                //else
                //{
                //    await _dbContext.AddRangeAsync(invDetailList);
                //    await _dbContext.SaveChangesAsync();
                //}
               
            }catch(Exception ex)
            {

            }
          
        }
    }
}
