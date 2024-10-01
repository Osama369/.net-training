using eMaestroD.Models.Custom;
using System.ComponentModel.DataAnnotations.Schema;

namespace eMaestroD.Models.Models
{
    public class Tax : IEntityBase
    {
        [DisplayName(Name = "Date")]
        public DateTime dtTx { get; set; }

        [DisplayName(Name = "Invoice No")]
        [link]
        public string? voucherNo { get; set; }
        [DisplayName(Name = "Name")]
        public string? cstName { get; set; }

        [DisplayName(Name = "Type")]
        public string? voucherID { get; set; }

        [DisplayName(Name = "Description")]
        public string? glComments { get; set; }

        public decimal DR { get; set; }
        public decimal CR { get; set; }

        [DisplayName(Name = "Bal")]
        [NotMapped]
        public decimal bal { get; set; }

        [HiddenOnRender]
        public int? cstID { get; set; }
        [HiddenOnRender]
        public DateTime? dtStart { get; set; }
        [HiddenOnRender]
        public DateTime? dtEnd { get; set; }
        [HiddenOnRender]
        public decimal? balBF { get; set; }
        [HiddenOnRender]
        public string? treeName { get; set; }
    }
}
