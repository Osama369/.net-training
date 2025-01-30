using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.Models.Models
{
    public class SupplierProduct
    {
        [Key]
        public int SupplierProdId { get; set; }  // Identity column (auto-increment)
        public int SupplierId { get; set; }     // Nullable int, since it's nullable in the table
        public int ComID { get; set; }          // Nullable int
        public decimal? Price { get; set; }      // Nullable decimal (18, 0)
        public int? Preference { get; set; }     // Nullable int
        public int? ProdID { get; set; }         // Nullable int
        public int? MinOrderQty { get; set; }    // Nullable int
        public decimal? SharePercentage { get; set; } // Nullable decimal (18, 0)
    }
}
