
using eMaestroD.Models.Custom;
using eMaestroD.Models.Models;

namespace eMaestroD.Models.ReportModels
{
    public class AccountsReceivable : IEntityBase
    {
        [DisplayName(Name = "As Of Date")]
        [HiddenOnRender]
        public DateTime asOfDate { get; set; }
        [HiddenOnRender]
        public int id { get; set; }
        [DisplayName(Name = "NAME")]
        public string? name { get; set; }
        [DisplayName(Name = "BALANCE")]
        public decimal balSum { get; set; }
    }
}
