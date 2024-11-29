using eMaestroD.Models.Models;
using eMaestroD.Models.VMModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.InvoiceProcessing.Interfaces
{
    public interface IGLService
    {
        Task<string> GenerateGLVoucherNo(int txTypeID, int? comID);
        Task<string> GenerateTempGLVoucherNo(int txTypeID, int? comID);
        Task<List<GLTxLinks>> GenerateGLTxLinks(string invoiceNo, int? GLID);
        Task<List<object>> ConvertInvoiceToGL(Invoice invoice);
        Task<Invoice> ConvertGLToInvoice(string voucherNo); 
        Task<Invoice> ConvertGLToSaleInvoice(string voucherNo); 
         Task<decimal> GetInvoiceRemainingAmount(string voucherNo);
        Task<List<Invoice>> GetInvoicesAsync(int txTypeID, int customerOrVendorID, int comID);
        Task<List<VendorProduct>> GetVendorProductListAsync(int comID);
        Task InsertVendorProductAsync(VendorProduct vendorProduct);
        Task InsertInvoice(List<GL> items);
        Task UpdateInvoice(List<GL> items);
        Task InsertOrUpdateInvoice<T>(List<T> items) where T : class;
        Task InsertGLEntriesAsync<T>(IEnumerable<T> items, DateTime now, string username) where T : GL;
        Task DeleteInvoice(string VoucherNo);
        Task ApproveInvoice(string VoucherNo); 
        Task PostInvoices(List<Invoice> invoices); 
        Task<List<InvoiceProduct>> GetItemsBySupplierAndDate(int supplierId, DateTime datefrom, DateTime dateTo);
        Task<List<InvoiceProduct>> GetProductBatchByProdBCID(int prodBCID, int locID, int comID);
        
    }
}
