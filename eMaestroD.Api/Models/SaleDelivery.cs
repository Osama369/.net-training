using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace eMaestroD.Api.Models
{
    public class SaleDelivery
    {
        public int COAID { get; set; }
        public int relCOAID { get; set; }
        public decimal qty { get; set; }

        public decimal bonusQty { get; set; }

        public decimal unitPrice { get; set; }

        public decimal discountSum { get; set; }

        public decimal totalDiscount { get; set; }

        public string? voucherNo { get; set; }

        public string? voucherID { get; set; }

        public decimal paidSum { get; set; }

        public decimal creditSum { get; set; }

        public decimal debitSum { get; set; }

        public string? empName { get; set; }

        public DateTime dtTx { get; set; }

        public string? prodName { get; set; }

        public string? prodCode { get; set; }

        public string? cstName { get; set; }

        public string? cstCode { get; set; }

        public int prodID { get; set; }

        public decimal voidedSum { get; set; }

        public string? comments { get; set; }

        public string? address { get; set; }
        public string? amountInWords { get; set; }

        public decimal taxSum { get; set; }
        public string? checkName { get; set; }
        public string? taxInWords { get; set; }

        public string? companyName { get; set; }
        public string? companyAddress { get; set; }
        public string? companyContactNo { get; set; }
        public string? companyVAT { get; set; }
        [NotMapped]
        public string? modBy { get; set; }
    }
}
