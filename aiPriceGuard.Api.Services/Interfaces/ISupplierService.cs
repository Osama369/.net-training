using aiPriceGuard.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.Api.Services.Interfaces
{
    public interface ISupplierService
    {
        IEnumerable<Supplier> GetSupplierByCompanyId(int comID);
        Task<Supplier> UpdateSupplier(Supplier supplier);
        Task<Supplier> AddSupplierAsync(Supplier supplier);
        Task<string> RemoveSupplierAsync(Supplier supplier);
        Task<Supplier> FindSupplierAsyncById(int supplierID);



    }
}
