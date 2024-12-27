using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eMaestroD.Models.Models;
using eMaestroD.Models.Custom;
using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Models.ReportModels
{
    public class BulkReceipt :IEntityBase
    {
        [DisplayName(Name = "Date")]

        public DateTime dtTx { get; set; }

        [DisplayName(Name = "Saleman Name")]
        public string? empName { get; set; }


        [link]
        [DisplayName(Name = "Invoice No")]
        public string? voucherNo { get; set; }


        [DisplayName(Name = "Payment Method")]
        public string? treeName { get; set; }



        [DisplayName(Name = "Comment")]
        public string? comments { get; set; }

        [DisplayName(Name = "CR")]
        public decimal CR { get; set; }


        [DisplayName(Name = "DR")]
        public decimal DR { get; set; }





        [HiddenOnRender]
        [DisplayName(Name = "Item")]
        public string? Item { get; set; }

    }
}
