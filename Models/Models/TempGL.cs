using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.Models.Models
{
    public class TempGL
    {
        [Key]
        public int TempGLID { get; set; }
        public int txID { get; set; }
        public int? comID { get; set; }
        public int relTxID { get; set; }
        public int COAID { get; set; }
        public int relCOAID { get; set; }
        public int postTypeID { get; set; }
        public int txTypeID { get; set; }
        public int invoiceID { get; set; }
        public int depositID { get; set; }
        public int salesManID { get; set; }
        public int bookerID { get; set; }
        public int locID { get; set; }
        public int empID { get; set; }
        public int cstID { get; set; }
        public int vendID { get; set; }
        public int prodID { get; set; }
        public int journalID { get; set; }
        public decimal qty { get; set; }
        public decimal qtyBal { get; set; }
        public decimal unitPrice { get; set; }
        public decimal bonusQty { get; set; }
        public decimal bonusSum { get; set; }
        public decimal instituteOffer { get; set; }
        public decimal creditOffer { get; set; }
        public decimal tradeOffer { get; set; }
        public decimal acctBal { get; set; }
        public decimal balSum { get; set; }
        public decimal creditSum { get; set; }
        public decimal debitSum { get; set; }
        public decimal discountSum { get; set; }
        public decimal? extraDiscountSum { get; set; }
        public decimal paidSum { get; set; }
        public decimal taxSum { get; set; }
        public decimal unusedSum { get; set; }
        public decimal voidedSum { get; set; }
        public DateTime? dtTx { get; set; }
        public DateTime? dtDue { get; set; }
        public string? glComments { get; set; }
        public bool? isCleared { get; set; }
        public bool? isDeposited { get; set; }
        public bool? isPaid { get; set; }
        public bool? isVoided { get; set; }
        public string? checkName { get; set; }
        public string? batchNo { get; set; }
        public DateTime? expiry { get; set; }
        public decimal claim { get; set; }
        public string? checkAdd { get; set; }
        public string? checkNo { get; set; }
        public string? voucherID { get; set; }
        public string? voucherNo { get; set; }
        public bool? active { get; set; }
        public string? crtBy { get; set; }
        public DateTime? crtDate { get; set; }
        public string? modBy { get; set; }
        public DateTime? modDate { get; set; }
        public string? acctNo { get; set; }
        public string? relAcctNo { get; set; }
        public int prodBCID { get; set; }
        public decimal? rebateSum { get; set; }
        public bool? isConverted { get; set; }
        public string? TransactionStatus {get; set;}
        public DateTime? ApprovedDate  {get; set;}
        public string? ApprovedBy  {get; set;}
        public DateTime? Approved1Date  {get; set;}
        public string? Approved1By  {get; set;}
        public DateTime? PostedDate  {get; set;}
        public string? PostedBy { get; set; }
        public decimal? mrp { get; set; }
        public decimal? sellPrice { get; set; }
        public decimal? lastCost { get; set; }
        public List<TempGLDetail>? tempGLDetails { get; set; } = new List<TempGLDetail>();
    }
}
