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

       [DisplayName(Name ="Qty")]
        public decimal qty { get; set; }

        [DisplayName(Name = "Amount")]
        public decimal amount { get; set; }

        [DisplayName(Name = "Rate")]
        public decimal Rate { get; set; }

        [DisplayName(Name = "Invoice No")]
        public string? voucherNo { get; set; }

        [DisplayName(Name = "Date")]
        public DateTime dtTx { get; set; }


        [DisplayName(Name = "OFFERs")]
        public decimal OFFERs { get; set; }

        [DisplayName(Name = "Vendor")]
        public string? vendName { get; set; }

        [DisplayName(Name = "Product")]
        public string? prodName { get; set; }

    }
}
