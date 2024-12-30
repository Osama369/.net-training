using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eMaestroD.Models.Custom;
using eMaestroD.Models.Models;   

namespace eMaestroD.Models.ReportModels
{
    public class PurchaseOrderGrn :IEntityBase
    {

        [DisplayName(Name = "Date")]
        public DateTime dtTx { get; set; }

        [link]
        [DisplayName(Name = "Invoice No")]
        public string? voucherNo { get; set; }


        [DisplayName(Name = "Vendor")]
        public string? vendName { get; set; }

        //[DisplayName(Name = "Product Name")]
        //public string? prodName { get; set; }

        //[DisplayName(Name ="Qty")]
        //public decimal qty { get; set; }


        [DisplayName(Name = "Discount Sum")]
        public decimal discountSum { get; set; }


        [DisplayName(Name = "Tax Sum")]
        public decimal taxSum { get; set; }


        [DisplayName(Name = "Amount")]
        public decimal amount { get; set; }


     

       


  


    }
}
