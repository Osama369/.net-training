using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eMaestroD.Models.Models;
using eMaestroD.Models.Custom;
namespace eMaestroD.Models.ReportModels
{
    public   class ReceiptJournal :IEntityBase
    {
        
        [DisplayName(Name ="Date")]
          
        public DateTime dtTx { get; set; }

        [link]
        [DisplayName(Name = "Invoice No")]
        public string? voucherNo { get; set; }


        [DisplayName(Name = "CR")]
        public decimal CR { get; set; }

        
        [DisplayName(Name = "DR")]
        public decimal DR { get; set; }
       
        
        [DisplayName(Name = "Comment")]
        public string? comments { get; set; }

        
        [DisplayName(Name = "Payment Method")]
        public string? treeName { get; set; }

        
        [DisplayName(Name = "Item")]
        public string? Item { get; set; }





    }
}
