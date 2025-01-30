using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using aiPriceGuard.Models.Models;
using aiPriceGuard.Models.Custom;
using System.ComponentModel.DataAnnotations.Schema;

namespace aiPriceGuard.Models.Models
{
    public class Supplier :IEntityBase
    {

        [DisplayName(Name ="Supplier ID")]
        [HiddenOnRender]
        public int? SupplierId { get; set; }

        [DisplayName(Name ="Suppler Code")]
        public string? SupplierCode { get; set; }

        [DisplayName(Name = "Supplier Name")]
        public string? SupplierName { get; set; }


        [DisplayName(Name = "Address")]
        public string? Address { get; set; }

        [DisplayName(Name = "Suburb")]
        [HiddenOnRender]
        public string? Suburb { get; set; }
        [DisplayName(Name = "State")]
        public string? State { get; set; }
        [DisplayName(Name = "Postal Code")]
        public string? PostCode { get; set; }

        [DisplayName(Name = "Phone")]
        public string? Phone { get; set; }

        [DisplayName(Name = "Fax")]
        public string? Fax { get; set; }
        [HiddenOnRender]
        public string? crtBy { get; set; }
        [HiddenOnRender]
        public DateTime? crtDate { get; set; }
        [HiddenOnRender]
        public string? modBy { get; set; }
        [HiddenOnRender]
        public DateTime? modDate { get; set; }
        public int comID { get; set; }

       

    }
}
