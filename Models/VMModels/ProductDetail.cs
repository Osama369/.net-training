using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.Models.VMModels
{
    public class ProductDetail
    {
        public string? ProductCode { get; set; }
        public string? ItemCode { get; set; }
        public string? Name { get; set; }
        public int? Quantity { get; set; }
        public int? SerialNo { get; set; }
        public decimal? Price { get; set; }
        public decimal? Total { get; set; }

    }
}
