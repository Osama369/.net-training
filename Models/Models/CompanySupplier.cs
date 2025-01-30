using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.Models.Models
{
    public class CompanySupplier
    {
        [Key]
        public int? ComSupplierId { get; set; }              // Maps to ComSupplierId (Primary Key with Identity)
        public int? SupplierId { get; set; }                 // Maps to SupplierId (int, can be null, nullable type)
        public int? ComId { get; set; }
        public string?  SupplierComReference { get; set; }
    }
}
