using eMaestroD.Models.Custom;
using eMaestroD.Models.Models;

namespace eMaestroD.Models.ReportModels
{
    public class InvoiceWiseProfit : IEntityBase
    {
        [DisplayName(Name = "Invoice No")]
        [link]
        public string VoucherNo { get; set; }
        [DisplayName(Name = "Qty")]
        public decimal qty { get; set; }
        [DisplayName(Name = "Purchase Rate")]
        [HiddenOnRender]
        public decimal CostRate { get; set; }
        [DisplayName(Name = "Total Purchase")]
        public decimal Cost { get; set; }
        [DisplayName(Name = "Sale Rate")]
        [HiddenOnRender]
        public decimal SaleRate { get; set; }
        [DisplayName(Name = "Total Sale")]
        public decimal SalePrice { get; set; }
        [DisplayName(Name = "Profit")]
        public decimal Profit => SalePrice - Cost;
    }
}
