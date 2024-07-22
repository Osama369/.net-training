using eMaestroD.Api.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace eMaestroD.Api.Models
{
    public class CashBook : IEntityBase
    {

        [DisplayName(Name = "Date")]
        [Date]
        public DateTime txDate { get; set; }

        [DisplayName(Name = "Invoice No")]
        [link]
        public string? voucherNo { get; set; }

        [DisplayName(Name = "Party")]
        public string? vendName { get; set; }

        [DisplayName(Name = "Description")]
        public string? Comments { get; set; }

        [DisplayName(Name = "Debit")]
        public decimal DR { get; set; }

        [DisplayName(Name = "Credit")]
        public decimal CR { get; set; }
        [DisplayName(Name = "Bal")]
        public decimal bal { get; set; }

        [HiddenOnRender]
        public int cstID { get; set; }
        [HiddenOnRender]
        public int vendID { get; set; }
        [HiddenOnRender]
        public int txTypeID { get; set; }
        [HiddenOnRender]
        public DateTime dtStart { get; set; }
        [HiddenOnRender]
        public DateTime dtEnd { get; set; }
        [HiddenOnRender]
        public decimal CBF { get; set; }
        [HiddenOnRender]
        public decimal DBF { get; set; }
        [HiddenOnRender]
        public decimal balBF { get; set; }

    }
}
