using eMaestroD.Models.Custom;
using eMaestroD.Models.Models;

namespace eMaestroD.Models.ReportModels
{
    public class SalesSummary : IEntityBase
    {
        [DisplayName(Name = "Payment Method")]
        public string? paymentMethod { get; set; }
        [DisplayName(Name = "Sales")]
        public decimal sales { get; set; }
        [DisplayName(Name = "Sales Return")]
        public decimal salesReturn { get; set; }
        [DisplayName(Name = "Net Sales")]
        public decimal netSales { get; set; }

    }
}
