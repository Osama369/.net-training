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
        Task<string> GenerateVoucherNo(int txTypeID, int? comID);
        Task<List<GL>> ConvertInvoiceToGL(Invoice invoice);
        Task<Invoice> ConvertGLToInvoice(string voucherNo);
        Task<List<Invoice>> GetInvoicesAsync(int txTypeID, int customerOrVendorID, int comID);
        Task InsertGLEntries(List<GL> items);
        Task InsertGLEntriesAsync<T>(IEnumerable<T> items, DateTime now, string username) where T : GL;
    }
}
