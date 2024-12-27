export interface Dashboard {

  TotalProducts?:any;
  TotalCustomers?:any;
  TotalVendors?:any;
  CashSale?:any;
  CreditSale?:any;
  TotalReceivable?:any;
  CreditPurchase?:any;
  CashPurchase?:any;
  TotalPayable?:any;

  CashInHand?:any;
  BankAccounts?:any;
  TotalValuation?:any;
  CreditCard?:any;
  // TotalSales?:any;
  // TotalPurchases?:any;
  // TotalValuation?:any;
  // TotalReceived?:any;
  // TotalPay?:any;
  // TotalExpenses?:any;
  // NetProfitOrLoss?:any;

  prodID?:any;
  prodName?:any;
  TotalUnitsSold?:any;
  TotalSalesAmount?:any;

  SaleMonthNo?:any;
  SaleMonth?:any;
  TotalSalesAmountMonthWise?:any;

  cstID:any;
  cstName:any
  Days30 :any;
  Days60 :any;
  Days90 :any;
  Over90Days :any;
  TotalOutstanding :any;
}
