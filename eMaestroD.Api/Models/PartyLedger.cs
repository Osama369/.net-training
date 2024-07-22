using eMaestroD.Api.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace eMaestroD.Api.Models
{
    public class PartyLedger : IEntityBase
    {
        [DisplayName(Name = "Date")]
        public DateTime dtTx { get; set; }

        [DisplayName(Name = "Invoice No")]
        [link]
        public string? voucherNo { get; set; }
        [DisplayName(Name = "Customer Name")]
        public string? cstName { get; set; }

        [DisplayName(Name = "Description")]
        public string? glComments { get; set; }

        public decimal DR { get; set; }
        public decimal CR { get; set; }

        [DisplayName(Name = "Bal")]
        [NotMapped]
        public decimal bal { get; set; }

        [HiddenOnRender]
        public string? voucherID { get; set; }
        [HiddenOnRender]
        public int cstID { get; set; }
        [HiddenOnRender]
        public DateTime dtStart { get; set; }
        [HiddenOnRender]
        public DateTime dtEnd { get; set; }
        [HiddenOnRender]
        public decimal balBF { get; set; }
        [HiddenOnRender]
        public string? treeName { get; set; }
    }
}
