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
        Task<string> GenerateVoucherNoAsync(int txTypeID, int? comID);
        Task<List<GL>> GetGLEntriesByVoucherNoAsync(string voucherNo);
        Task<bool> UpdateGLIsConvertedAsync(string voucherNo, string convertedVoucherNo, bool isDeleted); 
         Task InsertGLEntriesAsync(List<GL> glEntries); 
        Task UpdateGLEntriesAsync(List<GL> glEntries);
        Task DeleteGLEntriesAsync(string voucherNo);
        Task<List<Invoice>> GetInvoicesAsync(int txTypeID, int customerOrVendorID, int comID);
        Task<List<InvoiceProduct>> GetItemsBySupplierAndDate(int supplierId, DateTime datefrom, DateTime dateTo);
        //Temp until all method change
        Task<List<GLTxLinks>> GenerateGLTxLinks(string invoiceNo, int? GLID);
        Task OldInsertGLEntriesAsync(IEnumerable<GL> items, DateTime now, string username);
    }
}
