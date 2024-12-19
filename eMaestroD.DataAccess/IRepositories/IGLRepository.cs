using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eMaestroD.Models.Models;
using eMaestroD.Models.VMModels;

namespace eMaestroD.DataAccess.IRepositories
{
    public interface IGLRepository
    {
        Task<string> GenerateGLVoucherNoAsync(int txTypeID, int? comID);
        Task<string> GenerateTempGLVoucherNoAsync(int txTypeID, int? comID);
        Task<List<GL>> GetGLEntriesByVoucherNoAsync(string voucherNo);
        Task<List<TempGL>> GetSaleGLEntriesByVoucherNoAsync(string voucherNo);
        Task<List<TempGL>> GetTempGLEntriesByVoucherNoAsync(string voucherNo);
        Task<bool> UpdateGLIsConvertedAsync(string voucherNo, string convertedVoucherNo, bool isDeleted);
        Task InsertEntriesAsync<T>(List<T> items) where T : class;
        Task UpdateEntriesAsync<T>(List<T> items) where T : class;
        Task InsertGLEntriesAsync(List<GL> glEntries); 
        Task UpdateGLEntriesAsync(List<GL> glEntries);
        Task DeleteGLEntriesAsync(string voucherNo); 
        Task ApproveTempGLEntriesAsync(string voucherNo); 
        Task PostTempGLEntriesAsync(string voucherNo); 
         Task<List<Invoice>> GetInvoicesAsync(int txTypeID, int customerOrVendorID, int comID);
        Task<List<InvoiceProduct>> GetItemsBySupplierAndDate(int supplierId, DateTime datefrom, DateTime dateTo);
        Task<List<InvoiceProduct>> GetProductBatchByProdBCID(int prodID, int prodBCID, int locID, int comID);
        Task<List<VendorProduct>> GetVendorProductListAsync(int comID);
        Task UpsertVendorProductAsync(VendorProduct vendorProduct);
        Task UpdateGLBalSum(string VoucherNo, string convertVoucherNo, string tradeDebtor, string saleLocal, decimal newAmount, bool isEdit);
        Task UpdateGLqtybal(string VoucherNo, string convertVoucherNo, string saleLocal, string saleReturn, int txtypeID, int prodBCID, string batchNo, decimal qty, bool isEdit);

        //Temp until all method change
        Task<List<GLTxLinks>> GenerateGLTxLinks(string invoiceNo, int? GLID);
        Task OldInsertGLEntriesAsync(IEnumerable<GL> items, DateTime now, string username);
    }
}
