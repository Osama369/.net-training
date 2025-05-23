using aiPriceGuard.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.DataAccess.IRepositories
{
    public interface ISupplierRepository
    {
        Task<Supplier> AddAsync(Supplier supplier);
        //Task<Supplier> FindAsync(int supplierID);
        Task<Supplier> Update(Supplier supplier);
        List<Supplier> GetAll();
        Task Remove(Supplier supplier);
        IEnumerable<Supplier> GetAllSupplierByCompanyId(int comID);
        Task<Supplier> FindByIdAsync(int supplierID);
        //Task<Supplier> FirstOrDefaultAsync(int supplierID);


    }
}
