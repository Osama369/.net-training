using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eMaestroD.Models.Custom;
using eMaestroD.Models.Models;


namespace eMaestroD.Models.ReportModels
{
    public class SSRWithAvailabilityReport :IEntityBase
    {

        [DisplayName(Name = "Product Group Name")]
        public string? prodGrpName { get; set; }

        [HiddenOnRender]
        [DisplayName(Name = "Company Name")]
        public string? comName { get; set; }


        [DisplayName(Name = "Product Name")]
        public string? prodName { get; set; }


        [DisplayName(Name = "Product Price")]
        public decimal TP { get; set; }

        
        [DisplayName(Name = "OPENING")]
        public decimal OPENING { get; set; }

        [DisplayName(Name = "OPENINGSTOCK")]
        public decimal OPENINGSTOCK { get; set; }

        [DisplayName(Name = "RCVD")]
        public decimal RCVD { get; set; }

        [DisplayName(Name = "PRETURN")]
        public decimal PRETURN { get; set; }

        [DisplayName(Name = "Last Month")]
        public decimal LASTMONTH { get; set; }
        
        [DisplayName(Name = "Last Month Discount")]
        public decimal LastMonthDiscount { get; set; }

        [DisplayName(Name = "Today Sale")]
        public decimal TODAYSALE { get; set; }

        [DisplayName(Name = "Total Quantity")]
        public decimal TOTALQTY { get; set; }

        [DisplayName(Name = "Total Bonus")]
        public decimal TOTALBONUS { get; set; }

        [DisplayName(Name = "Return Quantity")]
        public decimal RETQTY { get; set; }

        [DisplayName(Name = "Return Bonus")]
        public decimal RETBONUS { get; set; }

        [DisplayName(Name = "Discount")]
        public decimal discount { get; set; }

        [HiddenOnRender]
        [DisplayName(Name = "DT Start")]
        public DateTime dtStart { get; set; }

        [HiddenOnRender]
        [DisplayName(Name = "DT End")]
        public DateTime dtEnd { get; set; }

        [DisplayName(Name = "Transfered")]
        public decimal TRANSFERRED { get; set; }

        [DisplayName(Name = "Availability Quantity")]
        public decimal AvailabilityQty { get; set; }



    }
}
