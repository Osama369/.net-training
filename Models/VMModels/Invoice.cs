using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.Models.VMModels
{
    public class Invoice
    {
        public int? invoiceID { get; set; }
        public DateTime? invoiceDate { get; set; }
        public string? invoiceVoucherNo { get; set; }
        public string? invoiceType { get; set; }
        public int? fiscalYear { get; set; }
        public int? txTypeID { get; set; }
        public int? CustomerOrVendorID { get; set; }
        public string? customerOrVendorName { get; set; }
        public int? comID { get; set; }
        public int? locID { get; set; }
        public decimal? grossTotal { get; set; }
        public decimal? totalDiscount { get; set; }
        public decimal? totalTax { get; set; }
        public decimal? totalRebate { get; set; }
        public decimal? totalExtraTax { get; set; }
        public decimal? totalAdvanceExtraTax { get; set; }
        public decimal? totalExtraDiscount { get; set; }
        public decimal? netTotal { get; set; }
        public string? notes { get; set; }
        public string? convertedInvoiceNo { get; set; }
        public bool? isPaymented { get; set; }
        // List of products in the invoice
        public List<InvoiceProduct> Products { get; set; }
    }
}
