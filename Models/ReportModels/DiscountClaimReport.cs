using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using eMaestroD.Models.Custom;
using eMaestroD.Models.Models;

namespace eMaestroD.Models.ReportModels
{
    public class DiscountClaimReport: IEntityBase
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
        

        [DisplayName(Name = "Unit Price")]
        public decimal tp { get; set; }

        [DisplayName(Name = "Quantiyt")]
        public decimal qty { get; set; }
        [DisplayName(Name = "Claim Amount")]
        public decimal ClaimAmount { get; set; }
        
        [DisplayName(Name = "Amount")]
        public decimal Amount { get; set; } 



        
    }
}
