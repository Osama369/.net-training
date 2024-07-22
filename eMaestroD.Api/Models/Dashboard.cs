namespace eMaestroD.Api.Models
{
    public class Dashboard
    {
        // Properties representing the result sets from the stored procedure
        public int? TotalProducts { get; set; }
        public int? TotalCustomers { get; set; }
        public int? TotalVendors { get; set; }
        public decimal? CashSale { get; set; }
        public decimal? CreditSale { get; set; }
        public decimal? TotalReceivable { get; set; }
        public decimal? CashPurchase { get; set; }
        public decimal? CreditPurchase { get; set; }
        public decimal? TotalPayable { get; set; }

        public decimal? CashInHand { get; set; }
        public decimal? BankAccounts { get; set; }
        public decimal? CreditCard { get; set; }

        public decimal? TotalValuation { get; set; }


        public int? prodID { get; set; }
        public string? prodName { get; set; }
        public int? TotalUnitsSold { get; set; }
        public decimal? TotalSalesAmount { get; set; }

        public string? SaleMonth { get; set; }
        public decimal? TotalSalesAmountMonthWise { get; set; }


        public int? cstID { get; set; }
        public string? cstName { get; set; }
        public decimal? Days30 { get; set; }
        public decimal? Days60 { get; set; }
        public decimal? Days90 { get; set; }
        public decimal? Over90Days { get; set; }
        public decimal? TotalOutstanding { get; set; }
    }
}
