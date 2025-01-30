using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.Models.Models
{
    public class SupplierFile
    {
        [Key]
        public int? SupplierFileId { get; set; } // IDENTITY(1,1) NOT NULL
        public int SupplierId { get; set; } // int NOT NULL
        public int? FileId { get; set; } // int NOT NULL
    }
}
