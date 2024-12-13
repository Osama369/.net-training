using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eMaestroD.Models.Models;
using eMaestroD.Models.Custom;

//G.[qty],
//G.[prodID],   
// PRODBC.[BarCode] AS prodCode,
// PROD.[prodName],
// PRODBC.[Unit]AS prodUnit,
// PROD.[unitQty]  
// ,CST.[cstName],
// CST.[city],   
// U.[firstName] + ' ' + U.[lastName] AS salesManName,
// G.[dtTx],
// G.[voucherNo],  
// G.[creditSum] AS AMOUNT
// , G.[discountSum]  
// ,G.[tradeOffer] AS OFFERs
// , @dtStart AS dtStart  
// , @dtEnd AS dtEnd  
// , G.[taxSum]  
// ,G.[bonusQty]
// ,CASE WHEN @userID = 0 THEN 'All' ELSE CST.[cstName] END AS empFilter  
// , CASE WHEN @prodID = 0 THEN 'All' ELSE CST.[city] END AS prodFilter  

namespace eMaestroD.Models.ReportModels
{
    public class SalemanItemWiseSaleReport :IEntityBase
    {

        [DisplayName(Name = "Date")]

        public DateTime dtTx { get; set; }

        [DisplayName(Name = "Customer Name")]
        public string? cstName { get; set; }



        [DisplayName(Name = "Invoice No")]
        public string? voucherNo { get; set; }


        [DisplayName(Name = "Product Name")]
        public string? prodName { get; set; }

        [HiddenOnRender]
        [DisplayName(Name ="Quantity")  ]
       public decimal qty { get; set; }

        [HiddenOnRender]
        [DisplayName(Name = "Product ID")]
        public int prodID { get; set; }

        [HiddenOnRender]
        [DisplayName(Name = "Product Code")]
        public string? prodCode { get; set; }


        
        [DisplayName(Name = "Product Unit")]
        public string? prodUnit { get; set; }

        [DisplayName(Name = "Unit QTY")]
        public decimal unitQty { get; set; }

        [DisplayName(Name = "SalesMan Name")]
        public string? salesManName { get; set; }

     
        [DisplayName(Name = "Amount")]
        public decimal amount { get; set; }

        [DisplayName(Name = "Discount Sum")]

        public decimal discountSum { get; set; }

        [DisplayName(Name = "date start")]
        public DateTime dtStart { get; set; }

        [DisplayName(Name = "date End")]
        public DateTime dtEnd { get; set; }

        [DisplayName(Name = "Offers")]
        public decimal offers { get; set; }

        [DisplayName(Name = "Tax Sum")]
        public decimal taxSum { get; set; }

        [DisplayName(Name = "Bonus Qty")]
        public decimal bonusQty { get; set; }

        [DisplayName(Name = "City")]
        public string? city { get; set; }
    }


}
