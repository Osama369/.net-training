using DocumentFormat.OpenXml.Wordprocessing;
using eMaestroD.Api.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace eMaestroD.Api.Models
{
    public class journalVoucher : IEntityBase
    {
        [DisplayName(Name = "Date")]
        [Date]
        public DateTime dtTx { get; set; }
        [DisplayName(Name = "Voucher No")]
        public string? voucherNo { get; set; }
        [DisplayName(Name = "Name")]
        [HiddenOnRender]
        public string? glComments { get; set; }


        [HiddenOnRender]
        [NotMapped]
        public decimal debit { get; set; }

        [HiddenOnRender]
        [NotMapped]
        public decimal credit { get; set; }


        [HiddenOnRender]
        [NotMapped]
        public int COAID { get; set; }

        [HiddenOnRender]
        [NotMapped]
        public int parentCOAID { get; set; }
        
        [HiddenOnRender]
        [NotMapped]
        public string? acctNo { get; set; }

        [HiddenOnRender]
        [NotMapped]
        public string? relAcctNo { get; set; }


        [HiddenOnRender]
        [NotMapped]
        public string parentAccountName { get; set; }

        [HiddenOnRender]
        [NotMapped]
        public string ChildAccountName { get; set; }


        [HiddenOnRender]
        [NotMapped]
        public int comID { get; set; }

        [HiddenOnRender]
        [NotMapped]
        public int GLID { get; set; }

        [HiddenOnRender]
        [NotMapped]
        public string? masterEntryComment { get; set; }
    }
}
