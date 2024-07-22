using eMaestroD.Api.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace eMaestroD.Api.Models
{
    public class BalanceSheet : IEntityBase
    {


        [DisplayName(Name = "Type")]
        public string? PrimitiveType { get; set; }


        [DisplayName(Name = "Account")]
        public string? acctName { get; set; }

        [HiddenOnRender]
        public decimal DebitTotal { get; set; }
        [HiddenOnRender]
        public decimal CreditTotal { get; set; }

        [DisplayName(Name = "Amount")]
        [NotMapped]
        public decimal Totalamount { get { return DebitTotal + CreditTotal; } set { } }

        [HiddenOnRender]
        public int COAID { get; set; }
        [HiddenOnRender]
        public DateTime dtStart { get; set; }
        [HiddenOnRender]
        public DateTime dtEnd { get; set; }
    }
}
