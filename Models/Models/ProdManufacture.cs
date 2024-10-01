using eMaestroD.Models.Custom;
using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Models.Models
{
    public class ProdManufacture : IEntityBase
    {
        [Key]
        [HiddenOnRender]
        public int prodManuID { get; set; }
        [HiddenOnRender]
        public int comID { get; set; }
        [DisplayName(Name = "Manufacture Name")]
        public string prodManuName { get; set; }
        [HiddenOnRender]
        public bool active { get; set; }
        [HiddenOnRender]
        public string? crtBy { get; set; }
        [HiddenOnRender]
        public DateTime? crtDate { get; set; }
        [HiddenOnRender]
        public string? modBy { get; set; }
        [HiddenOnRender]
        public DateTime? modDate { get; set; }
    }
}
