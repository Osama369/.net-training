using eMaestroD.Api.Common;
using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Api.Models
{
    public class Bank : IEntityBase
    {
        [Key]
        [HiddenOnRender]
        public int bankID { get; set; }
        [DisplayName(Name = "Is Default")]
        public bool isDefault { get; set; }
        [DisplayName(Name = "Bank Name")]
        public string? bankName { get; set; }
        [DisplayName(Name = "Branch Code")]
        public string? branchCode { get; set; }
        [DisplayName(Name = "Account No")]
        public string? accountNo { get; set; }
        public string? IBAN { get; set; }
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
        [HiddenOnRender]
        public int comID { get; set; }

    }
}
