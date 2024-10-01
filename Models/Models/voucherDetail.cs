namespace eMaestroD.Models.Models
{
    public class voucherDetail
    {
        public int GLID { get; set; }
        public int? COAID { get; set; }
        public int? relCOAID { get; set; }
        public int? txTypeID { get; set; }
        public int cstID { get; set; }
        public string cstName { get; set; }
        public decimal total { get; set; }
        public string voucherNo { get; set; }
        public DateTime dtTx { get; set; }
        public decimal amount { get; set; }
        public decimal enterAmount { get; set; }
        public string glComments { get; set; }
        public DateTime invoiceDate { get; set; }

    }
}
