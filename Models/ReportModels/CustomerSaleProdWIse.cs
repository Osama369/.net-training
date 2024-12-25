using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eMaestroD.Models.Custom;
using eMaestroD.Models.Models;
namespace eMaestroD.Models.ReportModels
{
    public class CustomerSaleProdWIse :IEntityBase
    {
 //       G.[voucherNo], G.[prodID],           
 //ISNULL(G.[creditSum],0) + ISNULL(G.[discountSum],0)  as creditSum ,    pro.prodName  as prodName, 
 //G.[dtTx], G.[cstID], G.[qty], G.[unitPrice] AS Rate, ISNULL(G.[discountSum],0) as discountSum, ISNULL(G.taxSum,0) as OFFERs,                    
 // 0 as amount                
 //,C.[cstName], ISNULL(C.[city],'') city                
 //,@dtStart AS dtStart, @dtEnd AS dtEnd


        [DisplayName(Name = "Date")]

        public DateTime dtTx { get; set; }

        [HiddenOnRender]
        [DisplayName(Name = "Date")]
        public DateTime dtStart { get; set; }

        [HiddenOnRender]
        [DisplayName(Name = "Date")]
        public DateTime dtEnd { get; set; }


        [link]
        [DisplayName(Name = "Invoice No")]
        public string? voucherNo { get; set; }

        [DisplayName(Name = "Customer Name")]
        public string? cstName { get; set; }

     


        [DisplayName(Name = "Product Name")]
        public string? prodName { get; set; }

     
        [DisplayName(Name = "Quantity")]
        public decimal qty { get; set; }

        //[HiddenOnRender]
        //[DisplayName(Name = "Product ID")]
        //public int prodID { get; set; }
       
        [DisplayName(Name = "Unit price")]
        public decimal Rate { get; set; }




        [HiddenOnRender]
        [DisplayName(Name = "Credit Sum")]
        public decimal creditSum { get; set; }


        [DisplayName(Name = "Discount")]

        public decimal discountSum { get; set; }


        [DisplayName(Name = "Amount")]
        public decimal amount { get; set; }

      
    

    
        [HiddenOnRender]
        [DisplayName(Name = "Offers")]
        public decimal offers { get; set; }

        //[DisplayName(Name = "Tax Sum")]
        //public decimal taxSum { get; set; }

        //[DisplayName(Name = "Bonus Qty")]
        //public decimal bonusQty { get; set; }
        [HiddenOnRender]
        [DisplayName(Name = "City")]
        public string? city { get; set; }
    }
}
