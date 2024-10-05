using eMaestroD.DataAccess.IRepositories;
using eMaestroD.DataAccess.DataSet;
using eMaestroD.Models.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.DataAccess.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly AMDbContext _dbContext;
        public CustomerRepository(AMDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<Customer> GetCustomerByIdAsync(int customerId)
        {
            return await _dbContext.Customers
                .Where(c => c.cstID == customerId)
                .FirstOrDefaultAsync();
        }
    }
}
