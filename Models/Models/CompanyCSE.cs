using eMaestroD.Models.Custom;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.Models.Models
{
    public class CompanyCSE : IEntityBase
    {
        [Key]
        [HiddenOnRender]
        public int CSEID { get; set; }
        [HiddenOnRender]
        public int? CompID { get; set; }
        [HiddenOnRender]
        public int? vendID { get; set; }
        [NotMapped]
        [DisplayName(Name ="Supplier Name")]
        public string? vendName { get; set; }
        [DisplayName(Name = "CSE Name")]
        public string? RepName { get; set; }
        [DisplayName(Name = "Address")]
        public string? Address1 { get; set; }
        [DisplayName(Name = "Email")]
        public string? email { get; set; }
        [DisplayName(Name = "Phone")]
        public string? Cell { get; set; }
        [HiddenOnRender]
        public bool? Active { get; set; }
        [HiddenOnRender]
        public bool? IsDefault { get; set; }
        [NotMapped]
        [HiddenOnRender]
        public List<CSECustomer>? CSECustomer { get; set; }
        //[NotMapped]
        //[HiddenOnRender]
        //public List<MseMapArea> MseMapArea { get; set; }
    }
}
