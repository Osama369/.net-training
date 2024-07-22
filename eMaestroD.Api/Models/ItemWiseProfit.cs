using eMaestroD.Api.Common;

namespace eMaestroD.Api.Models
{
    public class ItemWiseProfit : IEntityBase
    {
        [DisplayName(Name = "Product Name")]
        public string? prodName { get; set; }
        [DisplayName(Name = "Cost Price")]
        public decimal CostPrice { get; set; }
        [DisplayName(Name = "Sale Price")]
        public decimal SalePrice { get; set; }
        [DisplayName(Name = "Quantity")]
        public decimal Qty { get; set; }
        [DisplayName(Name = "Profit Per Piece")]
        public decimal Profit { get; set; }
        [DisplayName(Name = "Profit")]
        public decimal ProfitTotal { get; set; }

    }
}
