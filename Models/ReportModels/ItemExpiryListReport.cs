using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using eMaestroD.Models.Custom;
using eMaestroD.Models.Models;

//V.vendID, V.vendName
//  ,ISNULL(P.prodID, 0) AS prodID
//   , ISNULL(P.prodCode, '') AS prodCode  
//  , ISNULL(P.prodName, '') AS prodName  
//  , ISNULL(P.prodUnit, '') AS prodUnit  
//  , ISNULL(P.purchRate, 0) AS DP  
//  , ISNULL(P.tP, 0) AS TP  
//  , ISNULL(G.batchNo, '') AS BatchNo  
//  , ISNULL(G.qtyBal, 0) AS AvailQty  
//  , ISNULL(G.expiry, '1/1/1900') AS expiryDate  


namespace eMaestroD.Models.ReportModels
{
    public class ItemExpiryListReport: IEntityBase
    {
        [HiddenOnRender]
        [DisplayName(Name = "VendID")]
        public int vendID { get; set; }

        [DisplayName(Name = "Supplier")]
      
        public string? vendName { get; set; }


        [HiddenOnRender]
        [DisplayName(Name = "prodID")]
        public int? prodID { get; set; }

        [DisplayName(Name = "Bar Code")]
        public string? prodCode { get; set; }



        [DisplayName(Name = "Product Name")]
        public string? prodName { get; set; }


    

        [DisplayName(Name = "Batch No")]
        public string BatchNo { get; set; }

        [DisplayName(Name = "Expiry Date")]
        public DateTime expiryDate { get; set; }

        [HiddenOnRender]
        [DisplayName(Name = "Prod Unit")]
        public string prodUnit { get; set; }

        [HiddenOnRender]
        [DisplayName(Name = "Purchase Price")]
        public decimal DP { get; set; }


        [DisplayName(Name = "Quantity")]
        public decimal AvailQty { get; set; }

        [HiddenOnRender]
        [DisplayName(Name = "Unit Price")]
        public decimal TP { get; set; }

      

       

    }
}
