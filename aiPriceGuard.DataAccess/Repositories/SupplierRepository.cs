using aiPriceGuard.DataAccess.DataSet;
using aiPriceGuard.DataAccess.IRepositories;
using aiPriceGuard.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.DataAccess.Repositories
{
    public class SupplierRepository : ISupplierRepository
    {
        private readonly AMDbContext _dbContext;
        public SupplierRepository(AMDbContext _dbcontext)
        {
            this._dbContext = _dbcontext;
        }
        public async Task<Supplier> AddAsync(Supplier supplier)
        {

            await _dbContext.Supplier.AddAsync(supplier);
            await saveAsync();
            return supplier;
        }

        public async Task Remove(Supplier supplier)
        {
            _dbContext.Supplier.Remove(supplier);
             await  saveAsync();
            
        }

        //public async Task<Supplier> FindAsync(int supplierID)
        //{
        //    return await  _dbContext.Supplier.FindAsync(supplierID);
        //}

        public async Task<Supplier> FindByIdAsync(int supplierID)
        {
            try
            {
                var responseDt = await _dbContext.Supplier.FindAsync(supplierID);
                return responseDt;
            }catch(Exception ex)
            {

            }
            return new Supplier();
        }

        //public Supplier FirstOrDefaultAsyncInt(int queryParam)
        //{
            
        //    return await _dbContext.Supplier.FirstOrDefaultAsync(x=> x.)
               
        //}

        public List<Supplier> GetAll()
        {
            return _dbContext.Supplier.ToList();
        }

        public IEnumerable<Supplier> GetAllSupplierByCompanyId(int comID)
        {
            var query = from Supplier in _dbContext.Supplier
                        join comSupplier in _dbContext.CompanySupplier
                        on Supplier.SupplierId equals comSupplier.SupplierId
                        where comSupplier.ComId == comID
                        select new Supplier
                        {
                            SupplierId = Supplier.SupplierId,
                            SupplierName = Supplier.SupplierName,
                            SupplierCode = Supplier.SupplierCode,
                            Address = Supplier.Address,
                            Suburb = Supplier.Suburb,
                            State = Supplier.State,
                            PostCode = Supplier.PostCode,
                            Phone = Supplier.Phone,
                            Fax = Supplier.Fax
                        };
            return query.ToList();
        }

        public  async Task<Supplier> Update(Supplier supplier)
        {
             _dbContext.Supplier.Update(supplier);
            await saveAsync();
            return supplier;
        }
        private async Task saveAsync()
        {
            await _dbContext.SaveChangesAsync();
        }
    }
}
