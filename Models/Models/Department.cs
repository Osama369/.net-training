using eMaestroD.Models.Custom;
using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Models.Models
{
    public class Department : IEntityBase
    {
        [Key]
        [HiddenOnRender]
        public int depID { get; set; }
        [DisplayName(Name = "Department Name")]
        public string depName { get; set; }
        [DisplayName(Name = "Description")]
        public string? descr { get; set; }
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
        public int comID { get; set; }
    }
}
