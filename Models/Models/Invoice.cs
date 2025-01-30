using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.Models.Models
{
    public class Invoice
    {
        public int InvoiceID { get; set; }
        public int? TxID { get; set; }
        public int? RelTxID { get; set; }
        public int? COAID { get; set; }
        public int? RelCOAID { get; set; }
        public int? PostTypeID { get; set; }
        public int? JournalID { get; set; }
        public int? TxTypeID { get; set; }
        public int? DepositID { get; set; }
        public int? SalesManID { get; set; }
        public int? BookerID { get; set; }
        public int? LocID { get; set; }
        public int? EmpID { get; set; }
        public int? CstID { get; set; }
        public int? VendID { get; set; }
        public int? ProdID { get; set; }
        public decimal? Qty { get; set; }
        public decimal? QtyBal { get; set; }
        public decimal? UnitPrice { get; set; }
        public decimal? BonusQty { get; set; }
        public decimal? BonusSum { get; set; }
        public decimal? InstituteOffer { get; set; }
        public decimal? CreditOffer { get; set; }
        public decimal? TradeOffer { get; set; }
        public decimal? AcctBal { get; set; }
        public decimal? BalSum { get; set; }
        public decimal? CreditSum { get; set; }
        public decimal? DebitSum { get; set; }
        public decimal? DiscountSum { get; set; }
        public decimal? PaidSum { get; set; }
        public decimal? TaxSum { get; set; }
        public decimal? UnusedSum { get; set; }
        public decimal? VoidedSum { get; set; }
        public DateTime? DtTx { get; set; }
        public DateTime? DtDue { get; set; }
        public string GlComments { get; set; }
        public bool? IsCleared { get; set; }
        public bool? IsDeposited { get; set; }
        public bool? IsPaid { get; set; }
        public bool? IsVoided { get; set; }
        public string CheckName { get; set; }
        public string BatchNo { get; set; }
        public DateTime? Expiry { get; set; }
        public decimal? Claim { get; set; }
        public string CheckAdd { get; set; }
        public string CheckNo { get; set; }
        public string VoucherID { get; set; }
        public string VoucherNo { get; set; }
        public bool? Active { get; set; }
        public string CrtBy { get; set; }
        public DateTime? CrtDate { get; set; }
        public string ModBy { get; set; }
        public DateTime? ModDate { get; set; }
        public int? ComID { get; set; }
        public string AcctNo { get; set; }
        public string RelAcctNo { get; set; }
        public int ProdBCID { get; set; }
        public decimal? ExtraDiscountSum { get; set; }
        public decimal? RebateSum { get; set; }
        public bool? IsConverted { get; set; }
        public decimal? Mrp { get; set; }
        public decimal? SellPrice { get; set; }
        public decimal? LastCost { get; set; }

        [NotMapped]
        public List<Product> Products { get; set; }

    }
}
