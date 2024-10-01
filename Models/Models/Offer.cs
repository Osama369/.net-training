using eMaestroD.Models.Custom;
using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Models.Models
{
    public class Offer : IEntityBase
    {
        [Key]
        [HiddenOnRender]
        public int offerID { get; set; }
        [DisplayName(Name = "Offer Name")]
        public string? offerName { get; set; }
        [HiddenOnRender]
        public string? offerType { get; set; }
        [HiddenOnRender]
        public string? offerDescr { get; set; }
        [HiddenOnRender]
        public int? crtBy { get; set; }
        [HiddenOnRender]
        public DateTime? crtDate { get; set; }
        [HiddenOnRender]
        public int? modBy { get; set; }
        [HiddenOnRender]
        public DateTime? modDate { get; set; }
        [HiddenOnRender]
        public bool active { get; set; }
        [HiddenOnRender]
        public int comID { get; set; }
    }
}
