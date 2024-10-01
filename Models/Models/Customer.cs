using eMaestroD.Models.Custom;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace eMaestroD.Models.Models
{
    public class Customer : IEntityBase
    {
        [Key]
        [HiddenOnRender]
        public int cstID { get; set; }

        [HiddenOnRender]
        public int? cstGrpID { get; set; }
        [HiddenOnRender]
        public int? comID { get; set; }
        [HiddenOnRender]
        public int? empID { get; set; }
        [DisplayName(Name = "Code")]
        public string? cstCode { get; set; }
        [DisplayName(Name = "Name")]
        [UpperCase]
        public string? cstName { get; set; }
        public string? address { get; set; }
        [DisplayName(Name = "Phone")]
        public string? contPhone { get; set; }
        [HiddenOnRender]
        public bool? active { get; set; }
        [DisplayName(Name = "VAT No")]
        public string? taxNo { get; set; }
        [DisplayName(Name = "VAT %")]
        public decimal? taxValue { get; set; }
        [HiddenOnRender]
        [NotMapped]
        public string? comment { get; set; }
        [HiddenOnRender]
        [NotMapped]
        public decimal? opnBal { get; set; }
        [HiddenOnRender]
        [NotMapped]
        public decimal? vendorBal { get; set; }
        [HiddenOnRender]
        [NotMapped]
        public string? message { get; set; }
        [HiddenOnRender]
        public string? crtBy { get; set; }
        [HiddenOnRender]
        public DateTime? crtDate { get; set; }
        [HiddenOnRender]
        public string? modby { get; set; }
        [HiddenOnRender]
        public DateTime? modDate { get; set; }
        [HiddenOnRender]
        [NotMapped]
        public bool isActionBtn { get; set; }

    }
}
