using eMaestroD.Models.Custom;
using eMaestroD.Models.Models;

namespace eMaestroD.Models.ReportModels
{
    public class MonthlySales : IEntityBase
    {
        [DisplayName(Name = "Sale Month")]
        public string? SaleMonth { get; set; }
        [DisplayName(Name = "Amount")]
        public decimal TotalSalesAmountMonthWise { get; set; }
    }
}
