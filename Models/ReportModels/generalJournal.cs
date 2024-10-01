using eMaestroD.Models.Custom;
using eMaestroD.Models.Models;

namespace eMaestroD.Models.ReportModels
{
    public class generalJournal : IEntityBase
    {
        [DisplayName(Name = "Date")]
        [Date]
        public DateTime txDate { get; set; }
        [DisplayName(Name = "Voucher No")]
        [link]
        public string? voucherNo { get; set; }
        [DisplayName(Name = "Parent Account Name")]
        public string? parentAccountName { get; set; }
        [DisplayName(Name = "Control Account")]
        public string? controlAccount { get; set; }
        [DisplayName(Name = "DR")]
        public decimal DR { get; set; }
        [DisplayName(Name = "CR")]
        public decimal CR { get; set; }
    }
}
