using eMaestroD.Api.Common;
using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Api.Models
{
    public class CreditCard : IEntityBase
    {
        [Key]
        [HiddenOnRender]
        public int cardID { get; set; }
        [DisplayName(Name = "Is Default")]
        public bool isDefault { get; set; }
        [DisplayName(Name = "Card Name")]
        public string? bankName { get; set; }
        [HiddenOnRender]
        public bool? active { get; set; }
        [HiddenOnRender]
        public string? crtBy { get; set; }
        [HiddenOnRender]
        public DateTime? crtDate { get; set; }
        [HiddenOnRender]
        public string? modBy { get; set; }
        [HiddenOnRender]
        public DateTime? modDate { get; set; }
        [HiddenOnRender]
        public int comID { get; set; }
    }
}
