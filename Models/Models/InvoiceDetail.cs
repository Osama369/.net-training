using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace aiPriceGuard.Models.Models
{
    public class InvoiceDetail
    {
        [Key]
        public int? InvDetailId { get; set; }      // Identity field, primary key
        public int? InvoiceId { get; set; }       // Nullable, foreign key to Invoice table
        public int? InvLineNo { get; set; }       // Nullable, line number
        public string? ItemCode { get; set; }      // Nullable, varchar(50)
        public string? ItemDesc { get; set; }      // Nullable, varchar(256)
        public string? SupplierStkCode { get; set; } // Nullable, varchar(30)
        public string? CasePk { get; set; }        // Nullable, varchar(5)
        public int? ShippedQty { get; set; }      // Nullable, shipped quantity
        public decimal? UnitPrice { get; set; }   // Nullable, decimal(10, 2)
        public decimal? LineTotal { get; set; }   // Nullable, decimal(14, 4)
        public int? SerialNo { get; set; }  // Nullable integer
        public decimal? PriceEach { get; set; }  // Nullable decimal
        public decimal? Amount { get; set; }  // Nullable decimal
        public decimal? BackOrdered { get; set; }  // Nullable decimal
        public int? ProdID { get; set; }  // Nullable decimal

        [NotMapped]
        public  string? productName { get; set; }
    }


}
