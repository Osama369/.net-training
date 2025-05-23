using aiPriceGuard.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.DataAccess.IRepositories
{
    public interface ICompanySupplierRepository
    {
        Task<CompanySupplier> AddAsync(CompanySupplier supplier);
        CompanySupplier FirstOrDefaultBySupplierId(int supplierID);
        Task Remove(CompanySupplier supplier);

    }
}
