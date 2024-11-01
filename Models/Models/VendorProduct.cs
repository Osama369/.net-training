using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.Models.Models
{
    public class VendorProduct
    {
        [Key]
        public int VendorProductID { get; set; }
        public int CompanyVendorID { get; set; }
        public int ProductID { get; set; }
        public int Preference { get; set; }
    }
}
