using eMaestroD.Models.Custom;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace eMaestroD.Models.Models
{
    public class Vendors : IEntityBase
    {
        [Key]
        [HiddenOnRender]
        public int vendID { get; set; }

        [DisplayName(Name = "Code")]
        public string? vendCode { get; set; }

        [DisplayName(Name = "Name")]
        [UpperCase]
        public string? vendName { get; set; }

        [HiddenOnRender]
        public int? comID { get; set; }

        [NotMapped]
        [HiddenOnRender]
        public string? comName { get; set; }
        public string? address { get; set; }

        [DisplayName(Name = "Area")]
        public string? city { get; set; }
        [HiddenOnRender]
        public string? state { get; set; }
        [HiddenOnRender]
        public string? zip { get; set; }

        [DisplayName(Name = "Phone")]
        public string? vendPhone { get; set; }
        
        [DisplayName(Name = "Share Percentage")]
        public decimal? sharePercentage { get; set; }
        [DisplayName(Name = "Licence No")]
        public string? licence { get; set; }
        [DisplayName(Name = "Expiry")]
        public DateTime? expiry { get; set; }

        [HiddenOnRender]
        public string? vendFax { get; set; }
        [HiddenOnRender]
        public string? contName { get; set; }
        [HiddenOnRender]
        public string? contPhone { get; set; }
        [HiddenOnRender]
        public bool? active { get; set; }
        [HiddenOnRender]
        public string? crtBy { get; set; }
        [HiddenOnRender]
        public DateTime? crtDate { get; set; }
        [HiddenOnRender]
        public string? modby { get; set; }
        [HiddenOnRender]
        public DateTime? modDate { get; set; }
        [HiddenOnRender]
        public int? vendTypeID { get; set; }
        [HiddenOnRender]
        public string? email { get; set; }
        [HiddenOnRender]
        public bool? isEmail { get; set; }
        [DisplayName(Name = "TAX No")]
        public string? taxNo { get; set; }
        [DisplayName(Name = "TAX %")]
        public decimal? taxValue { get; set; }

        [HiddenOnRender]
        [NotMapped]
        public string? comment { get; set; }
        [HiddenOnRender]
        [NotMapped]
        public decimal? opnBal { get; set; }
        [HiddenOnRender]
        [NotMapped]
        public string? message { get; set; }
        [HiddenOnRender]
        [NotMapped]
        public bool isActionBtn { get; set; }
        [HiddenOnRender]
        public int? cityID { get; set; }

    }
}
