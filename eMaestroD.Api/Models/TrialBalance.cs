using eMaestroD.Api.Common;

namespace eMaestroD.Api.Models
{
    public class TrialBalance : IEntityBase
    {

        [DisplayName(Name = "Account")]
        public string? acctName { get; set; }

        [DisplayName(Name = "Type")]
        public string? PrimitiveType { get; set; }

        public decimal DR { get; set; }
        public decimal CR { get; set; }

        [HiddenOnRender]
        public DateTime dtStart { get; set; }
        [HiddenOnRender]
        public DateTime dtEnd { get; set; }
    }
}
