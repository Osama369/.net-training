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
        public int vendProdID {get; set;}
        public int comVendID {get; set;}
        public int prodBCID { get; set;}
        public int comID  {get; set;}
        public int preference { get; set; }
    }
}
