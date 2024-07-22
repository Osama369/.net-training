using eMaestroD.Api.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace eMaestroD.Api.Models
{
    public class SaleHistory : IEntityBase
    {

        [DisplayName(Name = "Date")]
        public DateTime dtTx { get; set; }
        [DisplayName(Name = "Customer")]
        public string? cstName { get; set; }
        [DisplayName(Name = "Discount")]
        public decimal discountSum { get; set; }
        [DisplayName(Name = "Tax")]
        public decimal OFFERs { get; set; }
        [DisplayName(Name = "Amount")]
        public decimal creditSum { get; set; }

        [DisplayName(Name = "Total")]
        [NotMapped]
        public decimal total { get { return creditSum + OFFERs - discountSum; } }


        [HiddenOnRender]
        public string? voucherNo { get; set; }
        [HiddenOnRender]
        public int prodID { get; set; }
        [HiddenOnRender]
        public int cstID { get; set; }
        [HiddenOnRender]
        public decimal qty { get; set; }
        [HiddenOnRender]
        public decimal Rate { get; set; }
        [HiddenOnRender]
        public string? prodName { get; set; }
        [HiddenOnRender]
        public string? city { get; set; }
        [HiddenOnRender]
        public DateTime dtStart { get; set; }
        [HiddenOnRender]
        public DateTime dtEnd { get; set; }
    }
}
