using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.Models.VMModels
{
    public class InvoiceProduct
    {
        public int? prodID { get; set; }
        public int? prodBarcodeID { get; set; }
        public string? prodCode { get; set; }
        public string? prodName { get; set; }
        public string? descr { get; set; }
        public int? unitQty { get; set; }
        public int? qty { get; set; }
        public int? bounsQty { get; set; }
        public string? notes { get; set; }
        public string? batchNo { get; set; }
        public DateTime? expiry { get; set; }
        public decimal? purchRate { get; set; }
        public decimal? sellRate { get; set; }
        public decimal? discountPercent { get; set; }
        public decimal? discountAmount { get; set; }
        public decimal? extraDiscountPercent { get; set; }
        public decimal? extraDiscountAmount { get; set; }
        public decimal? rebatePercent { get; set; }
        public decimal? rebateAmount { get; set; }
        public decimal? grossValue { get; set; }
        public decimal? netAmount { get; set; }
        public List<InvoiceProductTax> ProductTaxes { get; set; }
    }
}
