using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using eMaestroD.Api.Common;

namespace eMaestroD.Api.Models
{
    public class BankBook : IEntityBase
    {
        [DisplayName(Name = "Date")]
        public DateTime txDate { get; set; }
        [DisplayName(Name = "Bank Name")]
        public string? treeName { get; set; }

        [DisplayName(Name = "Invoice Number")]
        [link]
        public string? voucherNo { get; set; }

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
        public decimal CRBF { get; set; }

        [HiddenOnRender]
        public decimal DRBF { get; set; }

        [HiddenOnRender]
        public decimal balBF { get; set; }

        [HiddenOnRender]
        public string? BankName { get; set; }

    }
}
