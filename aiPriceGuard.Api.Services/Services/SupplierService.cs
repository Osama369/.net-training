using aiPriceGuard.Api.Services.Interfaces;
using aiPriceGuard.DataAccess.IRepositories;
using aiPriceGuard.Models.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.Api.Services.Services
{
    public class SupplierService : ISupplierService
    {
        private readonly ISupplierRepository _supplierRespository;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ICompanySupplierRepository _comSupplierRespository;
        private readonly ISupplierProductRepository _supplierProductRespository;
        private readonly ISupplierFileRepository _supplierFileRespository;


        public SupplierService(ISupplierRepository _supplierRespository, IHttpContextAccessor _httpContextAccessor,
            ICompanySupplierRepository _comSupplierRespository, ISupplierFileRepository _supplierFileRespository, ISupplierProductRepository _supplierProductRespository)
        {
            this._supplierRespository= _supplierRespository;
            this._httpContextAccessor= _httpContextAccessor;   
            this._comSupplierRespository= _comSupplierRespository;
            this._supplierFileRespository = _supplierFileRespository;
            this._supplierProductRespository = _supplierProductRespository;
        }

        public async Task<Supplier> AddSupplierAsync(Supplier supplier)
        {
            supplier.crtDate = DateTime.Now;
            var user = _httpContextAccessor.HttpContext?.User;
            supplier.crtBy = user.FindFirst(ClaimTypes.Email)?.Value;
            supplier.OCRPrompt = String.Empty;

            await _supplierRespository.AddAsync(supplier);
            //await _dbContext.SaveChangesAsync();

            CompanySupplier comSupp = new CompanySupplier
            {
                ComId = supplier.comID,
                SupplierId = supplier.SupplierId,
                SupplierComReference = ""
            };
            await _comSupplierRespository.AddAsync(comSupp);
            return supplier;
        }

        public async Task<Supplier> FindSupplierAsyncById(int supplierID)
        {
            return await _supplierRespository.FindByIdAsync(supplierID);
        }

        public IEnumerable<Supplier> GetSupplierByCompanyId(int comID)
        {
            return _supplierRespository.GetAllSupplierByCompanyId(comID);
        }

        public async Task<string> RemoveSupplierAsync(Supplier supplier)
        {
            var suppID = supplier.SupplierId.Value;
            var suppdel = await _supplierRespository.FindByIdAsync(suppID);
            var comSupp=_comSupplierRespository.FirstOrDefaultBySupplierId(suppID);
            var suppProd = _supplierProductRespository.GetSupplierProductBySupplierId(suppID);
            var suppFile = _supplierFileRespository.GetSupplierFileBySupplierId(suppID);

            if(suppProd == null || suppFile == null)
            {
                return "this supplier is bound with Product or File";
            }
            if (suppdel == null  )
            {
                return "Supplier Not Available";
            }
            if(comSupp == null)
            {
                return "Company Supplier Not Available";
            }
            await  _comSupplierRespository.Remove(comSupp);
            await  _supplierRespository.Remove(suppdel);

            return string.Empty;
        }

        public async Task<Supplier> UpdateSupplier(Supplier supplier)
        {
            var exEntry = await _supplierRespository.FindByIdAsync(supplier.SupplierId.Value);

            supplier.crtBy = exEntry.crtBy;
            supplier.crtDate = exEntry.crtDate;
            supplier.modDate = DateTime.Now;
            var user = _httpContextAccessor.HttpContext?.User;
            supplier.modBy = user.FindFirst(ClaimTypes.Email)?.Value;
            supplier.OCRPrompt = String.Empty;

            return await _supplierRespository.Update(supplier);
        }
    }
}
