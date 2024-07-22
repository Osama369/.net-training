using eMaestroD.Api.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace eMaestroD.Api.Models
{
    public class ItemLedger : IEntityBase
    {
        [DisplayName(Name = "Date")]
        public DateTime dtTx { get; set; }
        [DisplayName(Name = "INV #")]
        [link]
        public string? voucherNo { get; set; }
        [DisplayName(Name = "Name")]
        public string? cstName { get; set; }
        [DisplayName(Name = "Item Name")]
        public string? prodName { get; set; }
        public decimal Rate { get; set; }
        [DisplayName(Name = "OS Qty")]
        [HiddenOnRender]
        public decimal OSQty { get; set; }
        [DisplayName(Name = "Bns")]
        [HiddenOnRender]
        public decimal OSBonus { get; set; }
        [DisplayName(Name = "Batch")]
        [HiddenOnRender]
        public string? OSbatchNo { get; set; }
        [DisplayName(Name = "Transfer Qty")]
        [HiddenOnRender]

        public decimal SISQty { get; set; }

        [DisplayName(Name = "Bns")]
        [HiddenOnRender]
        public decimal SISBonus { get; set; }

        [DisplayName(Name = "Batch")]
        [HiddenOnRender]

        public string? SISbatchNo { get; set; }



        [DisplayName(Name = "Purchase Qty")]

        public decimal PIQty { get; set; }

        [DisplayName(Name = "Bns")]
        [HiddenOnRender]
        public decimal PIBonus { get; set; }

        [DisplayName(Name = "Batch")]
        [HiddenOnRender]

        public string? PIbatchNo { get; set; }


        [DisplayName(Name = "Purchase Return Qty")]
        public decimal PRTQty { get; set; }

        [DisplayName(Name = "Bns")]
        [HiddenOnRender]
        public decimal PRTBonus { get; set; }

        [DisplayName(Name = "Batch")]
        [HiddenOnRender]

        public string? PRTbatchNo { get; set; }


        [DisplayName(Name = "Sale Qty")]
        public decimal SIQty { get; set; }

        [DisplayName(Name = "Bns")]
        [HiddenOnRender]
        public decimal SIBonus { get; set; }

        [DisplayName(Name = "Batch")]
        [HiddenOnRender]

        public string? SIbatchNo { get; set; }


        [DisplayName(Name = "Sale Return Qty")]
        public decimal RTQty { get; set; }

        [DisplayName(Name = "Bns")]
        [HiddenOnRender]
        public decimal RTBonus { get; set; }

        [DisplayName(Name = "Batch")]
        [HiddenOnRender]

        public string? RTbatchNo { get; set; }


        [HiddenOnRender]
        public string? prodUnit { get; set; }
        [HiddenOnRender]
        public int vendID { get; set; }
        [HiddenOnRender]
        public int cstID { get; set; }
        [HiddenOnRender]
        public DateTime? dtStart { get; set; }
        [HiddenOnRender]
        public DateTime? dtEnd { get; set; }






    }
}
