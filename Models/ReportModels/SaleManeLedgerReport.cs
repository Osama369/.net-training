using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eMaestroD.Models.Custom;
using eMaestroD.Models.Models;

//U.salesManID,  
//U.saleManName,  
//sale.voucherNo,  
//sale.voucherID,  
//ISNULL(sale.cr, 0) ,  
//ISNULL(sale.dr, 0) ,  
//sale.dtTx ,  
//ISNULL(sale.treeName, '') ,  
//ISNULL(sale.glComments, ''),  
//ISNULL(balf.balance, 0),  
//@dtStart ,  
//@dtEnd,  
//sale.cstName
//ISNULL(sale.voucherNo, ''),    
//ISNULL(sale.voucherID, ''),
//ISNULL(U.salesManID, 0), 
//@dtStart ,    
//@dtEnd, 
namespace eMaestroD.Models.ReportModels
{
    public class SaleManeLedgerReport :IEntityBase
    {
        [DisplayName(Name = "Date")]
        public DateTime dtTx { get; set; }
        
        [link]
        [DisplayName(Name = "Invoice No")]
        public string? voucherNo { get; set; }

        [DisplayName(Name = "Customer Name")]
        public string? cstName { get; set; }


        [DisplayName(Name = "SalesMan")]
        public string? saleManName { get; set; }

        [HiddenOnRender]
        [DisplayName(Name = "salesMan ID")]
        public int? salesManID { get; set; }



     

        [HiddenOnRender]
        [DisplayName(Name = "voucher ID")]
        public string? voucherID { get; set; }

        [DisplayName(Name = "Credit")]
        public decimal cr { get; set; }


        [DisplayName(Name = "Debit")]
        public decimal dr { get; set; }


      

        [HiddenOnRender]
        [DisplayName(Name = "Tree Name")]
        public string? treeName { get; set; }

        [HiddenOnRender]
        [DisplayName(Name = "GL Comments")]
        public string? glComments { get; set; }


        [DisplayName(Name = "Bal")]
        public decimal balBF { get; set; }
        
        [HiddenOnRender]
        [DisplayName(Name = "Date Start")]
        public DateTime dtStart { get; set; }
        
        [HiddenOnRender]
        [DisplayName(Name = "Date End")]
        public DateTime dtEnd { get; set; }

 
    }
}
