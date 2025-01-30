using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.Models.Models
{
    public class ProductBarCode
    {
        [Key]
        public int prodBCID { get; set; }
        public int prodID { get; set; }
        public string? BarCode { get; set; }
        public decimal? Qty { get; set; }
        public string? Unit { get; set; }
        public bool? Active { get; set; }
        public decimal? CostPrice { get; set; }
        public decimal? SalePrice { get; set; }
        public decimal? TradePrice { get; set; }
        public decimal? FOBPrice { get; set; }
    }
}
