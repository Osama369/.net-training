using eMaestroD.Api.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace eMaestroD.Api.Models
{
    public class TaxSummary : IEntityBase
    {
        [DisplayName(Name = "Type")]
        public string? voucherID { get; set; }

        public decimal DR { get; set; }
        public decimal CR { get; set; }

        [DisplayName(Name = "Bal")]
        [NotMapped]
        public decimal bal { get; set; }


        [HiddenOnRender]
        public DateTime? dtStart { get; set; }
        [HiddenOnRender]
        public DateTime? dtEnd { get; set; }

    }
}
