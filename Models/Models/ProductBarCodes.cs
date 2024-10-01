using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Models.Models
{
    public class ProductBarCodes
    {
        [Key]
        public int prodBCID { get; set; }
        public int prodID { get; set; }
        public string? BarCode { get; set; }
        public decimal? Qty { get; set; }
        public string? Unit { get; set; }
        public bool? Active { get; set; }
        public decimal? CostPrice  { get; set; }
        public decimal? SalePrice  { get; set; }
        public decimal? TradePrice { get; set; }
        public decimal? FOBPrice   { get; set; }

    }
}
