using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using eMaestroD.Models.Custom;
using eMaestroD.Models.Models;


//TAB2.prodName, TAB2.unitPrice as tp, TAB2.prodUnit, Tab2.bonusQty,  
// TAB2.voucherNo,TAB2.dtTx,TAB2.cstName,(TAB2.qtyBal - Tab2.bonusQty) as qty
// , (TAB2.bonusQty * TAB2.purchRate) AS Amount
// , @dtStart as dtStart , @dtEnd as dtEnd 

namespace eMaestroD.Models.ReportModels
{
    public class BonusClaimReport : IEntityBase 
    {

        [DisplayName(Name = "Date")]
        public DateTime dtTx { get; set; }

        [DisplayName(Name = "Voucher No")]
        [link]
        public string? voucherNo { get; set; }

        [DisplayName(Name = "Customer Name")]
        public string? cstName { get; set; }

        [DisplayName(Name = "Product Name")]
        public string? prodName { get; set; }
        [DisplayName(Name = "Product Unit")]
        public string? prodUnit { get; set; }

        [DisplayName(Name = "Unit Price")]
        public decimal tp { get; set; }

        [DisplayName(Name = "Quantiyt")]
        public decimal qty { get; set; }     

        [DisplayName(Name = "Bonus Qty")]
        public decimal bonusQty { get; set; }

        [DisplayName(Name = "Amount")]
        public decimal Amount { get; set; }

       



    }
}
