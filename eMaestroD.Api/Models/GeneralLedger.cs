using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using eMaestroD.Api.Common;

namespace eMaestroD.Api.Models
{
    public class GeneralLedger : IEntityBase
    {

        [DisplayName(Name = "Date")]
        public DateTime txDate { get; set; }

        [DisplayName(Name = "Invoice No")]
        [link]
        public string? voucherNo { get; set; }
        [DisplayName(Name = "Account Name")]
        public string? controlAccount { get; set; }

        [DisplayName(Name = "Description")]
        public string? Comments { get; set; }

        public decimal DR { get; set; }
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
        [HiddenOnRender]
        public string? vendName { get; set; }
        [HiddenOnRender]
        public string? cstName { get; set; }
        [HiddenOnRender]
        public int COAID { get; set; }
        [HiddenOnRender]
        public string? checkAdd { get; set; }

        [HiddenOnRender]
        public string? bankAccNo { get; set; }

    }
}
