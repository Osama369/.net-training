using eMaestroD.Models.Custom;
using System.ComponentModel.DataAnnotations.Schema;
using eMaestroD.Models.Models;

namespace eMaestroD.Models.ReportModels
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
