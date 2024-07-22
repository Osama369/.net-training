namespace eMaestroD.Api.Models
{
    public class StockStatus
    {
        public decimal Qty { get; set; }
        public string? prodName { get; set; }
        public string? prodCode { get; set; }
        public string? prodUnit { get; set; }
        public DateTime? asOfDate { get; set; }
        public string? locName { get; set; }
        public decimal prodAmount { get; set; }
        public int prodID { get; set; }
    }
}
