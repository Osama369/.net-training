using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eMaestroD.Models.Models;
using eMaestroD.Models.Custom;

namespace eMaestroD.Models.ReportModels
{
    public  class MSECompanyWiseSale :IEntityBase
    {
        //        Select Tab1.cstName as cstName, Tab1.vendName, Tab1.prodName, Tab1.prodUnit, SUM(Tab1.qty) as qty
        //, Tab1.unitPrice, Sum(Tab1.bonusQty) as bonusQty, sum(Tab1.discountSum) as discountSum, (((SUM(Tab1.qty) - ISNULL(MAX(Tab2.SRQty),0)) * Tab1.unitPrice)) as creditSum--sum(Tab1.creditSum) as creditSum
        //,ISNULL(MAX(Tab2.SRQty),0) as SRQTY ,Tab1.RepName,Tab1.dtTx, Tab1.voucherNo


        [DisplayName(Name = "Date")]
        public DateTime? dtTx { get; set; }

        [link]
        [DisplayName(Name = "Invoice No")]
        public string? voucherNo { get; set; }

        [DisplayName(Name = "CSE Name")]
        public string? RepName { get; set; }



        [DisplayName(Name ="Cusotmer Name")]
        public string? cstName { get; set; }

        [DisplayName(Name = "Supplier")]
        public string? vendName { get; set; }

        [DisplayName(Name = "Product Name")]
        public string? prodName { get; set; }

        [DisplayName(Name = "Unit")]
        public string? prodUnit { get; set; }

        [DisplayName(Name = "qty")]
        public decimal? qty { get; set; }

        [DisplayName(Name = "Return Qty")]
        public decimal? SRQTY { get; set; }

        [HiddenOnRender]
        [DisplayName(Name = "Bonus Qty")]
        public decimal? bonusQty { get; set; }

        [DisplayName(Name = "Discount")]
        public decimal? discountSum { get; set; }

        [DisplayName(Name = "Amount")]
        public decimal? creditSum { get; set; }


    }
}
