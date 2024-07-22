using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using eMaestroD.Api.Common;

namespace eMaestroD.Api.Models
{
    public class StockSaleAndReturn : IEntityBase
    {
        [DisplayName(Name = "Product Name")]
        public string? prodName { get; set; }

        public decimal TP { get; set; }

        [HiddenOnRender]
        public decimal SP { get; set; }

        [DisplayName(Name = "Open")]
        public decimal OPENING { get; set; }

        public decimal RCVD { get; set; }

        [DisplayName(Name = "Total")]
        [NotMapped]
        public decimal Total { get { return OPENING + OPENINGSTOCK + shortageQty + RCVD; } }

        [DisplayName(Name = "Amount")]
        [NotMapped]
        public decimal Amount { get { return TP * (OPENING + OPENINGSTOCK + shortageQty + RCVD); } }

        [DisplayName(Name = "Transfer")]
        public decimal TRANSFERRED { get; set; }

        [DisplayName(Name = "Last Month")]
        public decimal LASTMONTH { get; set; }
        [DisplayName(Name = "Today Sale")]
        public decimal TODAYSALE { get; set; }
        [DisplayName(Name = "Total Qty")]
        public decimal TOTALQTY { get; set; }

        [DisplayName(Name = "Return Qty")]
        public decimal RETQTY { get; set; }

        [DisplayName(Name = "Net Sale Qty")]
        [NotMapped]
        public decimal NetSaleQty { get { return TOTALQTY - (-RETQTY); } }

        [DisplayName(Name = "Net Sale Amount")]
        [NotMapped]
        public decimal NetSaleAmount { get { return (TOTALQTY - RETQTY * -1) * SP; } }

        [DisplayName(Name = "Closing Qty")]
        [NotMapped]
        public decimal closingQty { get { return OPENING + OPENINGSTOCK + shortageQty + RCVD - TRANSFERRED - TOTALQTY + RETQTY * -1; } }

        [DisplayName(Name = "Closing Amount")]
        [NotMapped]
        public decimal closingAmount { get { return (OPENING + OPENINGSTOCK + shortageQty + RCVD - TRANSFERRED - TOTALQTY + RETQTY * -1) * TP; } }

        [HiddenOnRender]
        public decimal PRETURN { get; set; }
        [HiddenOnRender]
        public decimal discount { get; set; }
        [HiddenOnRender]
        public decimal TOTALBONUS { get; set; }
        [HiddenOnRender]
        public decimal RETBONUS { get; set; }
        [HiddenOnRender]
        public decimal OPENINGSTOCK { get; set; }
        [HiddenOnRender]
        public decimal shortageQty { get; set; }
        [HiddenOnRender]
        public DateTime dtStart { get; set; }
        [HiddenOnRender]
        public DateTime dtEnd { get; set; }
        [HiddenOnRender]
        public decimal LastMonthDiscount { get; set; }
        [HiddenOnRender]
        public string? prodGrpName { get; set; }


    }
}
