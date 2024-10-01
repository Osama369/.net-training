using eMaestroD.Models.Custom;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace eMaestroD.Models.Models
{
    public class invoices : IEntityBase
    {
        [DisplayName(Name = "Date")]
        [Date]
        public DateTime dtTx { get; set; }
        [DisplayName(Name = "Voucher No")]
        public string? voucherNo { get; set; }
        [DisplayName(Name = "Name")]
        public string? cstName { get; set; }

        public decimal amount { get; set; }
        [HiddenOnRender]
        public string? glComments { get; set; }

        [HiddenOnRender]
        public string? type { get; set; }

        [HiddenOnRender]
        [NotMapped]
        public string? acctNo { get; set; }

        [HiddenOnRender]
        [NotMapped]
        public decimal enterAmount { get; set; }

        [HiddenOnRender]
        [NotMapped]
        public int cstID { get; set; }

        [HiddenOnRender]
        [NotMapped]
        public int COAID { get; set; }


        [HiddenOnRender]
        public bool isPaymented { get; set; }


        [HiddenOnRender]
        public int? comID { get; set; }

        [HiddenOnRender]
        [NotMapped]
        public int GLID { get; set; }

        [HiddenOnRender]
        public string? checkName { get; set; }

    }
}
