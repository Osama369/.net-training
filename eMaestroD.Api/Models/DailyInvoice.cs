using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using eMaestroD.Api.Common;

namespace eMaestroD.Api.Models
{
    public class DailyInvoice : IEntityBase
    {

        [DisplayName(Name = "Date")]
        public DateTime dtTx { get; set; }

        [DisplayName(Name = "Voucher No")]
        [link]
        public string? voucherNo { get; set; }

        [DisplayName(Name = "Customer Name")]
        public string? cstName { get; set; }

        [DisplayName(Name = "Type")]
        public string? type { get; set; }

        public decimal Amount { get; set; }

        [HiddenOnRender]
        public DateTime CreatedDate { get; set; }

    }
}
