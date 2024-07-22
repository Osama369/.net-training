using eMaestroD.Api.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace eMaestroD.Api.Models
{
    public class CashRegister : IEntityBase
    {

        [DisplayName(Name = "Date")]
        public DateTime txDate { get; set; }

        [DisplayName(Name = "Invoice Number")]
        [link]
        public string? voucherNo { get; set; }

        [DisplayName(Name = "Description")]
        public string? comments { get; set; }

        public decimal DR { get; set; }
        public decimal CR { get; set; }

        [HiddenOnRender]
        public int cstID { get; set; }

        [HiddenOnRender]
        public int vendID { get; set; }

        [HiddenOnRender]
        public int txTypeID { get; set; }

        [HiddenOnRender]
        public decimal bal { get; set; }

        [HiddenOnRender]
        public DateTime dtStart { get; set; }

        [HiddenOnRender]
        public DateTime dtEnd { get; set; }

        [HiddenOnRender]
        public string? vendName { get; set; }

        [HiddenOnRender]
        public decimal CBF { get; set; }

        [HiddenOnRender]
        public decimal DBF { get; set; }

        [HiddenOnRender]
        public decimal balBF { get; set; }

    }
}
