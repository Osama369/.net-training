using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eMaestroD.Models.Custom;
using eMaestroD.Models.Models;

namespace eMaestroD.Models.ReportModels  
{
    public class ChallanReport :IEntityBase
    {

      
     
        [DisplayName(Name ="BarCode")]
        public string? BarCode { set; get; }

        [DisplayName(Name = "Product")]
        public string? ProdName { set; get; }

        [DisplayName(Name = "Unit")]
        public string? Unit { set; get; }


        //[DisplayName(Name = "Q_Box")]
        //public decimal Q_Box { set; get; }


        [DisplayName(Name = "Quantity")]
        public decimal Q_Pcs { set; get; }


        [DisplayName(Name = "Bonus")]
        public decimal Bonus { set; get; }


        [DisplayName(Name = "Discount")]
        public decimal Discount { set; get; }


        [DisplayName(Name = "Tax")]
        public decimal Tax { set; get; }

        [DisplayName(Name = "Amount")]
        public decimal Amount { set; get; }


       


        
    }
}
