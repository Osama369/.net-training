using eMaestroD.Api.Common;

namespace eMaestroD.Api.Models
{
    public class DayBook : IEntityBase
    {
        [DisplayName(Name = "Date")]
        [Date]
        public DateTime dtTx { get; set; }
        [DisplayName(Name = "Voucher No")]
        public string? voucherNo { get; set; }
        [DisplayName(Name = "Name")]
        public string? cstName { get; set; }
        public decimal debit { get; set; }
        public decimal credit { get; set; }

        [HiddenOnRender]
        public string? glComments { get; set; }
        public string? type { get; set; }
        [HiddenOnRender]
        public int? txTypeID { get; set; }

    }
}
