using eMaestroD.Models.Custom;
using eMaestroD.Models.Models;

namespace eMaestroD.Models.ReportModels
{
    public class AdvancedSearch : IEntityBase
    {
        [DisplayName(Name = "Date")]
        [Date]
        public DateTime dtTx { get; set; }
        [DisplayName(Name = "Supplier Name")]
        public string? vendName { get; set; }
        [DisplayName(Name = "Customer Name")]
        public string? cstName { get; set; }
        [DisplayName(Name = "Product Name")]
        public string? prodName { get; set; }
        [DisplayName(Name = "Unit Price")]
        public decimal unitprice { get; set; }
        [DisplayName(Name = "Qty")]
        public decimal qty { get; set; }
        [DisplayName(Name = "Amount")]
        public decimal Amount { get; set; }
    }
}
