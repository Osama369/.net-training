import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewInvoiceComponent } from './components/add-sale-invoice/addnewsale.component';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { CustomersComponent } from './components/customers/customers.component';
import { ProductsComponent } from './components/products/products.component';
import { DailyinvoiceComponent } from './components/reports/dailyinvoice/dailyinvoice.component';
import { StockComponent } from './components/reports/stock/stock.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BankBookComponent } from './components/reports/bank-book/bank-book.component';
import { CashBookComponent } from './components/reports/cash-book/cash-book.component';
import { CashRegisterComponent } from './components/reports/cash-register/cash-register.component';
import { GeneralledgerComponent } from './components/reports/generalledger/generalledger.component';
import { ItemledgerComponent } from './components/reports/itemledger/itemledger.component';
import { PartyledgerComponent } from './components/reports/partyledger/partyledger.component';
import { ProfitandlossComponent } from './components/reports/profitandloss/profitandloss.component';
import { TrialBalanceComponent } from './components/reports/trial-balance/trial-balance.component';
import { SalehistoryComponent } from './components/reports/salehistory/salehistory.component';
import { StockStatusCommulativeValuationComponent } from './components/reports/stock-status-commulative-valuation/stock-status-commulative-valuation.component';
import { StocksaleandreturnComponent } from './components/reports/stocksaleandreturn/stocksaleandreturn.component';
import { VendorledgerComponent } from './components/reports/vendorledger/vendorledger.component';
import { QuotationInvoiceComponent } from './components/add-new-quotation/addNewQuotation.component';
import { SaleInvoiceComponent } from './components/sale-invoice/sale-invoice.component';
import { QuotationComponent } from './components/quotation/quotation.component';
import { PurchaseComponent } from './components/purchase/purchase.component';
import { AddPurchaseComponent } from './components/add-purchase/add-purchase.component';
import { VendorsComponent } from './components/vendors/vendors.component';
import { AddNewRecieptVoucherComponent } from './components/add-new-reciept-voucher/add-new-reciept-voucher.component';
import { ReceiptVoucherComponent } from './components/receipt-voucher/receipt-voucher.component';
import { AddNewPaymentVoucherComponent } from './components/add-new-payment-voucher/add-new-payment-voucher.component';
import { PaymentVoucherComponent } from './components/payment-voucher/payment-voucher.component';
import { AddNewJournalVoucherComponent } from './components/add-new-journal-voucher/add-new-journal-voucher.component';
import { JournalVoucherComponent } from './components/journal-voucher/journal-voucher.component';
import { AddNewPurchaseOrderComponent } from './components/add-new-purchase-order/add-new-purchase-order.component';
import { PurchaseOrderComponent } from './components/purchase-order/purchase-order.component';
import { DaybookComponent } from './components/daybook/daybook.component';
import { InvoiceDetailViewComponent } from './components/invoice-detail-view/invoice-detail-view.component';
import { VoucherDetailViewComponent } from './components/voucher-detail-view/voucher-detail-view.component';
import { JournalVoucherDetailViewComponent } from './components/journal-voucher-detail-view/journal-voucher-detail-view.component';
import { ServiceInvoiceComponent } from './components/service-invoice/service-invoice.component';
import { AddServiceInvoiceComponent } from './components/add-service-invoice/add-service-invoice.component';
import { TaxReportComponent } from './components/reports/tax-report/tax-report.component';
import { TaxSummaryComponent } from './components/reports/tax-summary/tax-summary.component';
import { TaxReportByCustomerComponent } from './components/reports/tax-report-by-customer/tax-report-by-customer.component';
import { TaxReportBySupplierComponent } from './components/reports/tax-report-by-supplier/tax-report-by-supplier.component';
import { PurchaseReturnComponent } from './components/purchase-return/purchase-return.component';
import { AddPurchaseReturnComponent } from './components/add-purchase-return/add-purchase-return.component';
import { AddSaleReturnComponent } from './components/add-sale-return/add-sale-return.component';
import { SaleReturnComponent } from './components/sale-return/sale-return.component';
import { ReportGirdComponent } from './components/reports/report-gird/report-gird.component';
import { ReportSettingComponent } from './components/reports/report-setting/report-setting.component';
import { LowStockComponent } from './components/low-stock/low-stock.component';
import { AuthGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';
import { BalanceSheetComponent } from './components/reports/balance-sheet/balance-sheet.component';
import { PermissionGuard } from './guards/permission.guard';
import { ItemWiseProfitComponent } from './components/reports/item-wise-profit/item-wise-profit.component';
import { AdvancedSearchReportComponent } from './components/reports/advanced-search-report/advanced-search-report.component';
import { AppTopBarComponent } from './layout/app.topbar.component';
import { ProductGroupsComponent } from './components/product-groups/product-groups.component';
import { GeneralJournalComponent } from './components/reports/general-journal/general-journal.component';
import { BankComponent } from './components/bank/bank.component';
import { AddPurchaseReturn2Component } from './components/add-purchase-return2/add-purchase-return2.component';
import { AddSaleReturn2Component } from './components/add-sale-return2/add-sale-return2.component';
import { SaleReturn2Component } from './components/sale-return2/sale-return2.component';
import { PurchaseReturn2Component } from './components/purchase-return2/purchase-return2.component';
import { AccountsPayableComponent } from './components/reports/accounts-payable/accounts-payable.component';
import { AccountsReceivableComponent } from './components/reports/accounts-receivable/accounts-receivable.component';
import { ProductBarcodeComponent } from './components/product-barcode/product-barcode.component';
import { AddNewExpenseVoucherComponent } from './components/add-new-expense-voucher/add-new-expense-voucher.component';
import { ExpenseVoucherComponent } from './components/expense-voucher/expense-voucher.component';
import { AddQuotationToSaleComponent } from './components/add-quotation-to-sale/add-quotation-to-sale.component';
import { MonthlySalesReportComponent } from './components/reports/monthly-sales-report/monthly-sales-report.component';
import { BankSummaryComponent } from './components/reports/bank-summary/bank-summary.component';
import { InvoiceWiseProfitComponent } from './components/reports/invoice-wise-profit/invoice-wise-profit.component';
import { AddOrderToPurchaseComponent } from './components/add-order-to-purchase/add-order-to-purchase.component';
import { StockShortageComponent } from './components/stock-shortage/stock-shortage.component';
import { AddNewStockShortageComponent } from './components/add-new-stock-shortage/add-new-stock-shortage.component';
import { CreditCardComponent } from './components/credit-card/credit-card.component';
import { CreditCardReportComponent } from './components/reports/credit-card-report/credit-card-report.component';
import { BulkStockUpdateComponent } from './components/bulk-stock-update/bulk-stock-update.component';
import { AddNewBulkStockUpdateComponent } from './components/add-new-bulk-stock-update/add-new-bulk-stock-update.component';
import { ConfirmVerificationComponent } from './Shared/Components/confirm-verification/confirm-verification.component';
import { LoginComponent } from './Shared/Components/login/login.component';
import { NotAuthorizeComponent } from './Shared/Components/not-authorize/not-authorize.component';
import { NotFoundComponent } from './Shared/Components/not-found/not-found.component';
import { RegisterComponent } from './Shared/Components/register/register.component';
import { SelectCompanyComponent } from './Shared/Components/select-company/select-company.component';
import { SignUpComponent } from './Shared/Components/sign-up/sign-up.component';
import { NotificationAlertComponent } from './Administration/Components/notification-alert/notification-alert.component';
import { COAComponent } from './Administration/Components/coa/coa.component';
import { ConfigurationComponent } from './Administration/Components/configuration/configuration.component';
import { FiscalYearComponent } from './Administration/Components/fiscal-year/fiscal-year.component';
import { LocationsComponent } from './Administration/Components/locations/locations.component';
import { NotificationComponent } from './Administration/Components/notification/notification.component';
import { ScreenComponent } from './Administration/Components/screen/screen.component';
import { TaxesComponent } from './Administration/Components/taxes/taxes.component';
import { UsersComponent } from './Administration/Components/users/users.component';
import { RoleAuthorizationComponent } from './Administration/Components/role-authorization/role-authorization.component';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {path: '', component: AppLayoutComponent,
     children: [
      { path: 'login', component: LoginComponent },
      { path: 'SignUp', component: SignUpComponent },
      { path: 'Register', component: RegisterComponent },
      { path: '404', component: NotFoundComponent },
      { path: 'topbar', component: AppTopBarComponent },
      { path: 'not-authorized', component: NotAuthorizeComponent },
      { path: 'SelectCompany', component: SelectCompanyComponent, canActivate:[loginGuard] },
      { path: 'Confirmation', component: ConfirmVerificationComponent },
      { path: 'Dashboard', component: DashboardComponent, canActivate:[AuthGuard, PermissionGuard] , data: { requiredPermission: 'Dashboard' } },
      { path: 'AddNewSale', component: NewInvoiceComponent , canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'SaleInvoicesCreate' }  },
      { path: 'AddNewSale/:id', component: NewInvoiceComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'SaleInvoicesEdit' }  },
      { path: 'AddNewSales/:id', component: AddQuotationToSaleComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'SaleInvoicesCreate' }  },
      { path: 'AddNewQuotation', component: QuotationInvoiceComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'QuotationsCreate' }  },
      { path: 'AddNewQuotation/:id', component: QuotationInvoiceComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'QuotationsEdit' }  },
      { path: 'inoviceDetail/:voucher', component: InvoicesComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'InvoiceDetail' }  },
      { path: 'Customers', component: CustomersComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Customers' }  },
      { path: 'Products', component: ProductsComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Products' }  },
      { path: 'ProductBarcode', component: ProductBarcodeComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ProductBarcode' }  },
      { path: 'ProductCategory', component: ProductGroupsComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ProductCategory' }  },
      { path: 'Bank', component: BankComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Bank' }  },
      { path: 'DailySaleReport', component: DailyinvoiceComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'DailySale' }  },
      { path: 'StockReport', component: StockComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Stock' }  },
      { path: 'BankBookReport', component: BankBookComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'BankBook' }  },
      { path: 'CashBookReport', component: CashBookComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'CashBook' }  },
      { path: 'CashRegisterReport', component: CashRegisterComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'CashRegister' }  },
      { path: 'GeneralLedgerReport', component: GeneralledgerComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'GeneralLedger' }  },
      { path: 'GeneralJournalReport', component: GeneralJournalComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'GeneralJournal' }  },
      { path: 'ItemLedgerReport', component: ItemledgerComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ItemLedger' }  },
      { path: 'ItemWiseProfitReport', component: ItemWiseProfitComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ItemWiseProfit' }  },
      { path: 'PartyLedgerReport', component: PartyledgerComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'PartyLedger' }  },
      { path: 'PartyLedgerReport/:id', component: PartyledgerComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'PartyLedger' }  },
      { path: 'ProfitAndLossReport', component: ProfitandlossComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ProfitAndLoss' }  },
      { path: 'TrialBalanceReport', component: TrialBalanceComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'TrialBalance' }  },
      { path: 'BalanceSheetReport', component: BalanceSheetComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'BalanceSheet' }  },
      { path: 'AdvancedSearchReport', component: AdvancedSearchReportComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'AdvancedSearch' }  },
      { path: 'SaleHistoryReport', component: SalehistoryComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'SaleHistory' }  },
      { path: 'StockValuationReport', component: StockStatusCommulativeValuationComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'StockValuation' }  },
      { path: 'StockSaleAndReturnReport', component: StocksaleandreturnComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'StockSaleAndReturn' }  },
      { path: 'SupplierLedgerReport', component: VendorledgerComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'SupplierLedger' }  },
      { path: 'SupplierLedgerReport/:id', component: VendorledgerComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'SupplierLedger' }  },
      { path: 'AccountReceivable', component: AccountsReceivableComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'AccountReceivable' }  },
      { path: 'AccountPayable', component: AccountsPayableComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'AccountPayable' }  },
      { path: 'SaleInvoices', component: SaleInvoiceComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'SaleInvoices' }  },
      { path: 'Quotations', component: QuotationComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Quotations' }  },
      { path: 'Purchase', component: PurchaseComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Purchase' }  },
      { path: 'AddNewPurchase', component: AddPurchaseComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'PurchaseCreate' }  },
      { path: 'AddNewPurchase/:id', component: AddPurchaseComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'PurchaseEdit' }  },
      { path: 'AddNewPurchases/:id', component: AddOrderToPurchaseComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'PurchaseCreate' }  },
      { path: 'Suppliers', component: VendorsComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Suppliers' }  },
      { path: 'AddNewReceipt', component: AddNewRecieptVoucherComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ReceiptVoucherCreate' }  },
      { path: 'AddNewReceipt/:id', component: AddNewRecieptVoucherComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ReceiptVoucherEdit' }  },
      { path: 'Receipt', component: ReceiptVoucherComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ReceiptVoucher' }  },
      { path: 'Payment', component: PaymentVoucherComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'PaymentVoucher' }  },
      { path: 'AddNewPayment', component: AddNewPaymentVoucherComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'PaymentVoucherCreate' }  },
      { path: 'AddNewPayment/:id', component: AddNewPaymentVoucherComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'PaymentVoucherEdit' }  },
      { path: 'Journal', component: JournalVoucherComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'JournalVoucher' }  },
      { path: 'Expense', component: ExpenseVoucherComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ExpenseVoucher' }  },
      { path: 'AddNewJournal', component: AddNewJournalVoucherComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'JournalVoucherCreate' }  },
      { path: 'AddNewExpense', component: AddNewExpenseVoucherComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ExpenseVoucherCreate' }  },
      { path: 'AddNewExpense/:id', component: AddNewExpenseVoucherComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ExpenseVoucherEdit' }  },
      { path: 'AddNewJournal/:id', component: AddNewJournalVoucherComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'JournalVoucherEdit' }  },
      { path: 'AddNewPurchaseOrder', component: AddNewPurchaseOrderComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'PurchaseOrderCreate' }  },
      { path: 'AddNewPurchaseOrder/:id', component: AddNewPurchaseOrderComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'PurchaseOrderEdit' }  },
      { path: 'PurchaseOrder', component: PurchaseOrderComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'PurchaseOrder' }  },
      { path: 'Configuration', component: ConfigurationComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'CompanySetting' }  },
      { path: 'DayBook', component: DaybookComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'DayBook' }  },
      { path: 'Detail/:id', component: InvoiceDetailViewComponent, canActivate:[AuthGuard], data: { requiredPermission: 'InvoiceDetailView' }  },
      { path: 'VoucherDetail/:id', component: VoucherDetailViewComponent, canActivate:[AuthGuard], data: { requiredPermission: 'VoucherDetail' }  },
      { path: 'JournalVoucherDetail/:id', component: JournalVoucherDetailViewComponent, canActivate:[AuthGuard], data: { requiredPermission: 'JournalVoucherDetail' }  },
      { path: 'ServiceInvoices', component: ServiceInvoiceComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ServiceInvoices' }  },
      { path: 'AddNewServiceInvoice', component: AddServiceInvoiceComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ServiceInvoicesCreate' }  },
      { path: 'AddNewServiceInvoice/:id', component: AddServiceInvoiceComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ServiceInvoicesEdit' }  },
      { path: 'TaxDetail', component: TaxReportComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'TaxReport' }  },
      { path: 'TaxSummary', component: TaxSummaryComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'TaxSummary' }  },
      { path: 'TaxDetailByCustomer', component: TaxReportByCustomerComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'TaxReportByCustomer' }  },
      { path: 'TaxDetailBySupplier', component: TaxReportBySupplierComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'TaxReportBySupplier' }  },
      { path: 'DebitNote', component: PurchaseReturnComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'DebitNote' }  },
      { path: 'PurchaseReturn', component: PurchaseReturn2Component, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'DebitNote' }  },
      { path: 'AddNewDebitNote', component: AddPurchaseReturnComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'DebitNoteCreate' }  },
      { path: 'AddNewDebitNote/:id', component: AddPurchaseReturnComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'DebitNoteEdit' }  },
      { path: 'AddNewPurchaseReturn', component: AddPurchaseReturn2Component, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'DebitNoteCreate' }  },
      { path: 'AddNewPurchaseReturn/:id', component: AddPurchaseReturn2Component, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'DebitNoteCreate' }  },
      { path: 'CreditNote', component: SaleReturnComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'CreditNote' }  },
      { path: 'SaleReturn', component: SaleReturn2Component, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'CreditNote' }  },
      { path: 'AddNewCreditNote', component: AddSaleReturnComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'CreditNoteCreate' }  },
      { path: 'AddNewCreditNote/:id', component: AddSaleReturnComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'CreditNoteEdit' }  },
      { path: 'AddNewSaleReturn', component: AddSaleReturn2Component, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'CreditNoteCreate' }  },
      { path: 'AddNewSaleReturn/:id', component: AddSaleReturn2Component, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'CreditNoteEdit' }  },
      { path: 'ReportGird', component: ReportGirdComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ReportGird' }  },
      { path: 'ReportSetting', component: ReportSettingComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ReportSetting' }  },
      { path: 'COA', component: COAComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ChartOfAccounts' }  },
      { path: 'Location', component: LocationsComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Location' }  },
      { path: 'Taxes', component: TaxesComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Taxes' }  },
      { path: 'ReOrder', component: LowStockComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ReOrderProducts' }  },
      { path: 'Users', component: UsersComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Users' }  },
      { path: 'Screens', component: ScreenComponent, canActivate:[AuthGuard], data: { requiredPermission: 'Screen' }  },
      { path: 'PermissionScreen', component: RoleAuthorizationComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Authorization' }  },
      { path: 'PermissionScreen/:id', component: RoleAuthorizationComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Authorization' }  },
      { path: 'NotificationAlert', component: NotificationAlertComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'NotificationAlert' }  },
      { path: 'Notification', component: NotificationComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Notification' }  },
      { path: 'FiscalYear', component: FiscalYearComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'FiscalYear' }  },
      { path: 'MonthlySales', component: MonthlySalesReportComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'MonthlySales' }  },
      { path: 'BankSummary', component: BankSummaryComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'BankSummary' }  },
      { path: 'InvoiceWiseProfit', component: InvoiceWiseProfitComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'InvoiceWiseProfit' }  },
      { path: 'StockShortage', component: StockShortageComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'StockShortage' }  },
      { path: 'AddNewStockShortage', component: AddNewStockShortageComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'StockShortageCreate' }  },
      { path: 'AddNewStockShortage/:id', component: AddNewStockShortageComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'StockShortageEdit' }  },
      { path: 'CreditCard', component: CreditCardComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'CreditCard' }  },
      { path: 'CreditCardReport', component: CreditCardReportComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'CreditCardReport' }  },
      { path: 'bulkStockUpdate', component: BulkStockUpdateComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'bulkStockUpdate' }  },
      { path: 'AddNewBulkStockUpdate', component: AddNewBulkStockUpdateComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'bulkStockUpdateCreate' }  },
    ]
  },
  { path: '**', redirectTo: '404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ bindToComponentInputs:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
