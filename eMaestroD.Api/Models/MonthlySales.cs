using eMaestroD.Api.Common;

namespace eMaestroD.Api.Models
{
    public class MonthlySales : IEntityBase
    {
        [DisplayName(Name = "Sale Month")]
        public string? SaleMonth { get; set; }
        [DisplayName(Name = "Amount")]
        public decimal TotalSalesAmountMonthWise { get; set; }
    }
}
