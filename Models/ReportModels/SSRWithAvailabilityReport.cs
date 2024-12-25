using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eMaestroD.Models.Custom;
using eMaestroD.Models.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eMaestroD.Models.ReportModels
{
    public class SSRWithAvailabilityReport :IEntityBase
    {

        [DisplayName(Name = "Product Group Name")]
        public string? prodGrpName { get; set; }

        [DisplayName(Name = "Product Name")]
        public string? prodName { get; set; }

        [HiddenOnRender]
        [DisplayName(Name = "Company Name")]
        public string? comName { get; set; }


     


        [DisplayName(Name = "Product Price")]
        public decimal TP { get; set; }



        [DisplayName(Name = "Open")]
        public decimal OPENINGSTOCK { get; set; }

        [DisplayName(Name = "RCVD")]
        public decimal RCVD { get; set; }

        [DisplayName(Name = "Total")]
        [NotMapped]
        public decimal Total { get { return OPENING + OPENINGSTOCK  + RCVD; } }

        [DisplayName(Name = "Amount")]
        [NotMapped]
        public decimal Amount { get { return TP * (OPENING + OPENINGSTOCK  + RCVD); } }


        [DisplayName(Name = "Transfered")]
        public decimal TRANSFERRED { get; set; }



        [DisplayName(Name = "Last Month")]
        public decimal LASTMONTH { get; set; }

        [DisplayName(Name = "Today")]
        public decimal TODAYSALE { get; set; }


        [DisplayName(Name = "Total Quantity")]
        public decimal TOTALQTY { get; set; }



        [DisplayName(Name = "Total Bonus")]
        public decimal TOTALBONUS { get; set; }


        [DisplayName(Name = "Return Quantity")]
        public decimal RETQTY { get; set; }


        [DisplayName(Name = "Return Bonus")]
        public decimal RETBONUS { get; set; }

        [DisplayName(Name = "Net Sale Qty")]
        [NotMapped]
        public decimal NetSaleQty { get { return TOTALQTY - (-RETQTY); } }

        [DisplayName(Name = "Net Bonus")]
        [NotMapped]
        public decimal netBonus { get { return TOTALBONUS - (-RETBONUS); } }

        [DisplayName(Name = "Net Sale Amount")]
        [NotMapped]
        public decimal NetSaleAmount { get { return (TOTALQTY - RETQTY * -1) * TP; } }


        [DisplayName(Name = "Availability Quantity")]
        public decimal AvailabilityQty { get; set; }


        [DisplayName(Name = "Availability Amount")]
        [NotMapped]
        public decimal availableAmount { get { return AvailabilityQty  * TP; } }

      

        [DisplayName(Name = "Closing Qty")]
        [NotMapped]
        public decimal closeQty { get { return OPENING + OPENINGSTOCK  + RCVD - TRANSFERRED - TOTALQTY + RETQTY * -1; } }


        [DisplayName(Name = "Closing Amount")]
        [NotMapped]
        public decimal closeAmount { get { return (OPENING + OPENINGSTOCK  + RCVD - TRANSFERRED - TOTALQTY + RETQTY * -1) * TP; } }

        [HiddenOnRender]
        [DisplayName(Name = "OPENING")]
        public decimal OPENING { get; set; }

        [HiddenOnRender]
        [DisplayName(Name = "Last Month Discount")]
        public decimal LastMonthDiscount { get; set; }

        [HiddenOnRender]
        [DisplayName(Name = "PRETURN")]
        public decimal PRETURN { get; set; }

        [HiddenOnRender]
        [DisplayName(Name = "Discount")]
        public decimal discount { get; set; }

        [HiddenOnRender]
        [DisplayName(Name = "DT Start")]
        public DateTime dtStart { get; set; }

        [HiddenOnRender]
        [DisplayName(Name = "DT End")]
        public DateTime dtEnd { get; set; }

      




    }
}
