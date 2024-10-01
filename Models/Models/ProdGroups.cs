using eMaestroD.Models.Custom;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace eMaestroD.Models.Models
{
    public class ProdGroups : IEntityBase
    {
        [Key]
        [HiddenOnRender]
        public int prodGrpID { get; set; }
        [DisplayName(Name = "BRAND")]
        public string? prodGrpName { get; set; }
        [HiddenOnRender]
        public int? parentProdGrpID { get; set; }
        [HiddenOnRender]
        public int? prodGrpTypeID { get; set; }
        [HiddenOnRender]
        public bool active { get; set; }
        [HiddenOnRender]
        public int? comID { get; set; }

        [HiddenOnRender]
        public string? crtBy { get; set; }
        [HiddenOnRender]
        public DateTime? crtDate { get; set; }
        [HiddenOnRender]
        public string? modby { get; set; }
        [HiddenOnRender]
        public DateTime? modDate { get; set; }
    }
}
