using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using aiPriceGuard.Models.Models;
using aiPriceGuard.Models.Custom;

namespace aiPriceGuard.Models.Models
{
    public class Store :IEntityBase
    {
        [DisplayName(Name = "StoreId")]
        public int StoreId { get; set; }

        [DisplayName(Name = "Store Code")]
        public string? StoreCode { get; set; }

        [DisplayName(Name = "Store Name")]
        public string? StoreName { get; set; }

        [DisplayName(Name = "Suburb")]
        public string? Suburb { get; set; }

        [DisplayName(Name = "State")]
        public string? State { get; set; }

        [DisplayName(Name = "Post code")]
        public string? Postcode { get; set; }


    }
}
