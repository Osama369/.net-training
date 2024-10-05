using eMaestroD.DataAccess.DataSet;
using eMaestroD.DataAccess.IRepositories;
using Microsoft.EntityFrameworkCore;
using Models.VMModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.DataAccess.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AMDbContext _dbContext;
        public ProductRepository(AMDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<List<ProductViewModel>> GetProducts(int comID, int prodBCID = 0)
        {
            return await _dbContext.Set<ProductViewModel>()
                .FromSqlRaw("EXEC GetProducts @comID = {0}, @prodBCID = {1}", comID, prodBCID)
                .ToListAsync();
        }
    }
}
