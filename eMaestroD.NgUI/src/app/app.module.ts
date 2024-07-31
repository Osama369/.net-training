import { NgModule,Pipe, PipeTransform } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { NewInvoiceComponent } from './components/add-sale-invoice/addnewsale.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Toast, ToastrModule } from 'ngx-toastr';
import { CustomersComponent } from './components/customers/customers.component';
import { ProductsComponent } from './components/products/products.component';
import { StockComponent } from './components/reports/stock/stock.component';
import { DailyinvoiceComponent } from './components/reports/dailyinvoice/dailyinvoice.component';
import { CommonModule, DatePipe } from '@angular/common';
import { AppLayoutModule } from './layout/app.layout.module';
import { PartyledgerComponent } from './components/reports/partyledger/partyledger.component';
import { VendorledgerComponent } from './components/reports/vendorledger/vendorledger.component';
import { GeneralledgerComponent } from './components/reports/generalledger/generalledger.component';
import { SalehistoryComponent } from './components/reports/salehistory/salehistory.component';
import { ProfitandlossComponent } from './components/reports/profitandloss/profitandloss.component';
import { StocksaleandreturnComponent } from './components/reports/stocksaleandreturn/stocksaleandreturn.component';
import { StockStatusCommulativeValuationComponent } from './components/reports/stock-status-commulative-valuation/stock-status-commulative-valuation.component';
import { ItemledgerComponent } from './components/reports/itemledger/itemledger.component';
import { BankBookComponent } from './components/reports/bank-book/bank-book.component';
import { CashBookComponent } from './components/reports/cash-book/cash-book.component';
import { CashRegisterComponent } from './components/reports/cash-register/cash-register.component';
import { QuotationInvoiceComponent } from './components/add-new-quotation/addNewQuotation.component';
import { SaleInvoiceComponent } from './components/sale-invoice/sale-invoice.component';
import { QuotationComponent } from './components/quotation/quotation.component';
import { PurchaseComponent } from './components/purchase/purchase.component';
import { AddPurchaseComponent } from './components/add-purchase/add-purchase.component';
import { VendorsComponent } from './components/vendors/vendors.component';
import { AddNewProductComponent } from './components/products/add-new-product/add-new-product.component';
import { AddNewVendorComponent } from './components/vendors/add-new-vendor/add-new-vendor.component';
import { AddNewCustomerComponent } from './components/customers/add-new-customer/add-new-customer.component'
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { AddNewRecieptVoucherComponent } from './components/add-new-reciept-voucher/add-new-reciept-voucher.component';
import { ReceiptVoucherComponent } from './components/receipt-voucher/receipt-voucher.component';
import { PaymentVoucherComponent } from './components/payment-voucher/payment-voucher.component';
import { AddNewPaymentVoucherComponent } from './components/add-new-payment-voucher/add-new-payment-voucher.component';
import { JournalVoucherComponent } from './components/journal-voucher/journal-voucher.component';
import { AddNewJournalVoucherComponent } from './components/add-new-journal-voucher/add-new-journal-voucher.component';
import { AddNewPurchaseOrderComponent } from './components/add-new-purchase-order/add-new-purchase-order.component';
import { PurchaseOrderComponent } from './components/purchase-order/purchase-order.component';
import { AddNewProdGroupComponent } from './components/products/add-new-prod-group/add-new-prod-group.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { DaybookComponent } from './components/daybook/daybook.component';
import { InvoiceDetailViewComponent } from './components/invoice-detail-view/invoice-detail-view.component';
import { VoucherDetailViewComponent } from './components/voucher-detail-view/voucher-detail-view.component';
import { JournalVoucherDetailViewComponent } from './components/journal-voucher-detail-view/journal-voucher-detail-view.component';
import { AddServiceInvoiceComponent } from './components/add-service-invoice/add-service-invoice.component';
import { ServiceInvoiceComponent } from './components/service-invoice/service-invoice.component';
import { TaxReportComponent } from './components/reports/tax-report/tax-report.component';
import { TaxSummaryComponent } from './components/reports/tax-summary/tax-summary.component';
import { TaxReportByCustomerComponent } from './components/reports/tax-report-by-customer/tax-report-by-customer.component';
import { TaxReportBySupplierComponent } from './components/reports/tax-report-by-supplier/tax-report-by-supplier.component';
import { AddPurchaseReturnComponent } from './components/add-purchase-return/add-purchase-return.component';
import { AddSaleReturnComponent } from './components/add-sale-return/add-sale-return.component';
import { PurchaseReturnComponent } from './components/purchase-return/purchase-return.component';
import { SaleReturnComponent } from './components/sale-return/sale-return.component';
import { ReportGirdComponent } from './components/reports/report-gird/report-gird.component';
import { ReportSettingComponent } from './components/reports/report-setting/report-setting.component';
import { COAComponent } from './components/coa/coa.component';
import { AddCoaComponent } from './components/add-coa/add-coa.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { LocationsComponent } from './components/locations/locations.component';
import { AddLocationComponent } from './components/add-location/add-location.component';
 import { RecaptchaModule } from "ng-recaptcha";
import { environment } from 'src/environments/environment';
import { TaxesComponent } from './components/taxes/taxes.component';
import { AddNewTaxesComponent } from './components/add-new-taxes/add-new-taxes.component';
import {DashboardModule} from './components/dashboard/dashboard.module';
import { LowStockComponent } from './components/low-stock/low-stock.component';
import { TrialBalanceComponent } from './components/reports/trial-balance/trial-balance.component';
import { BalanceSheetComponent } from './components/reports/balance-sheet/balance-sheet.component';
import { UsersComponent } from './components/users/users.component';
import { AddNewUserComponent } from './components/add-new-user/add-new-user.component';
import { RoleAuthorizationComponent } from './components/role-authorization/role-authorization.component';
import { ScreenComponent } from './components/screen/screen.component';
import { AddNewScreenComponent } from './components/add-new-screen/add-new-screen.component';
import { PermissionGuard } from './guards/permission.guard';
import { ItemWiseProfitComponent } from './components/reports/item-wise-profit/item-wise-profit.component';
import { AdvancedSearchReportComponent } from './components/reports/advanced-search-report/advanced-search-report.component';
import { ProductGroupsComponent } from './components/product-groups/product-groups.component';
import { GeneralJournalComponent } from './components/reports/general-journal/general-journal.component';
import { ConfirmCategoryComponent } from './components/products/confirm-category/confirm-category.component';
import { BankComponent } from './components/bank/bank.component';
import { AddNewBankComponent } from './components/bank/add-new-bank/add-new-bank.component';
import { NotificationAlertComponent } from './components/notification-alert/notification-alert.component';
import { AddNotificaitonAlertComponent } from './components/notification-alert/add-notificaiton-alert/add-notificaiton-alert.component';
import { NotificationComponent } from './components/notification/notification.component';
import { FiscalYearComponent } from './components/fiscal-year/fiscal-year.component';
import { AddNewFiscalYearComponent } from './components/add-new-fiscal-year/add-new-fiscal-year.component';
import { AddPurchaseReturn2Component } from './components/add-purchase-return2/add-purchase-return2.component';
import { AddSaleReturn2Component } from './components/add-sale-return2/add-sale-return2.component';
import { SaleReturn2Component } from './components/sale-return2/sale-return2.component';
import { PurchaseReturn2Component } from './components/purchase-return2/purchase-return2.component';
import { EndFiscalYearComponent } from './components/end-fiscal-year/end-fiscal-year.component';
import { AccountsReceivableComponent } from './components/reports/accounts-receivable/accounts-receivable.component';
import { AccountsPayableComponent } from './components/reports/accounts-payable/accounts-payable.component';
import { ProductBarcodeComponent } from './components/product-barcode/product-barcode.component';
import { ExpenseVoucherComponent } from './components/expense-voucher/expense-voucher.component';
import { AddNewExpenseVoucherComponent } from './components/add-new-expense-voucher/add-new-expense-voucher.component';
import { InvoiceReportSettingsComponent } from './components/invoice-report-settings/invoice-report-settings.component';
import { AddQuotationToSaleComponent } from './components/add-quotation-to-sale/add-quotation-to-sale.component';
import { AddNewCustomerForInvoiceComponent } from './components/customers/add-new-customer-for-invoice/add-new-customer-for-invoice.component';
import { MonthlySalesReportComponent } from './components/reports/monthly-sales-report/monthly-sales-report.component';
import { BankSummaryComponent } from './components/reports/bank-summary/bank-summary.component';
import { InvoiceWiseProfitComponent } from './components/reports/invoice-wise-profit/invoice-wise-profit.component';
import { ReportGirdTreeTableComponent } from './components/reports/report-gird-tree-table/report-gird-tree-table.component';
import { AddOrderToPurchaseComponent } from './components/add-order-to-purchase/add-order-to-purchase.component';
import { StockShortageComponent } from './components/stock-shortage/stock-shortage.component';
import { AddNewStockShortageComponent } from './components/add-new-stock-shortage/add-new-stock-shortage.component';
import { CreditCardComponent } from './components/credit-card/credit-card.component';
import { AddNewCreditCardComponent } from './components/credit-card/add-new-credit-card/add-new-credit-card.component';
import { CreditCardReportComponent } from './components/reports/credit-card-report/credit-card-report.component';
import { BulkStockUpdateComponent } from './components/bulk-stock-update/bulk-stock-update.component';
import { AddNewBulkStockUpdateComponent } from './components/add-new-bulk-stock-update/add-new-bulk-stock-update.component';
import { SharedModule } from './Shared/shared.module';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    InvoicesComponent,
    NewInvoiceComponent,
    CustomersComponent,
    ProductsComponent,
    StockComponent,
    DailyinvoiceComponent,
    PartyledgerComponent,
    VendorledgerComponent,
    GeneralledgerComponent,
    SalehistoryComponent,
    ProfitandlossComponent,
    StocksaleandreturnComponent,
    StockStatusCommulativeValuationComponent,
    ItemledgerComponent,
    BankBookComponent,
    CashBookComponent,
    CashRegisterComponent,
    QuotationInvoiceComponent,
    SaleInvoiceComponent,
    QuotationComponent,
    PurchaseComponent,
    AddPurchaseComponent,
    VendorsComponent,
    AddNewProductComponent,
    AddNewVendorComponent,
    AddNewCustomerComponent,
    FileUploadComponent,
    AddNewRecieptVoucherComponent,
    ReceiptVoucherComponent,
    PaymentVoucherComponent,
    AddNewPaymentVoucherComponent,
    JournalVoucherComponent,
    AddNewJournalVoucherComponent,
    AddNewPurchaseOrderComponent,
    PurchaseOrderComponent,
    AddNewProdGroupComponent,
    ConfigurationComponent,
    DaybookComponent,
    InvoiceDetailViewComponent,
    VoucherDetailViewComponent,
    JournalVoucherDetailViewComponent,
    AddServiceInvoiceComponent,
    ServiceInvoiceComponent,
    TaxReportComponent,
    TaxSummaryComponent,
    TaxReportByCustomerComponent,
    TaxReportBySupplierComponent,
    AddPurchaseReturnComponent,
    AddSaleReturnComponent,
    PurchaseReturnComponent,
    SaleReturnComponent,
    ReportGirdComponent,
    ReportSettingComponent,
    COAComponent,
    AddCoaComponent,
    LocationsComponent,
    AddLocationComponent,
    TaxesComponent,
    AddNewTaxesComponent,
    LowStockComponent,
    TrialBalanceComponent,
    BalanceSheetComponent,
    UsersComponent,
    AddNewUserComponent,
    RoleAuthorizationComponent,
    ScreenComponent,
    AddNewScreenComponent,
    ItemWiseProfitComponent,
    AdvancedSearchReportComponent,
    ProductGroupsComponent,
    GeneralJournalComponent,
    ConfirmCategoryComponent,
    BankComponent,
    AddNewBankComponent,
    NotificationAlertComponent,
    AddNotificaitonAlertComponent,
    NotificationComponent,
    FiscalYearComponent,
    AddNewFiscalYearComponent,
    AddPurchaseReturn2Component,
    AddSaleReturn2Component,
    SaleReturn2Component,
    PurchaseReturn2Component,
    EndFiscalYearComponent,
    AccountsReceivableComponent,
    AccountsPayableComponent,
    ProductBarcodeComponent,
    ExpenseVoucherComponent,
    AddNewExpenseVoucherComponent,
    InvoiceReportSettingsComponent,
    AddQuotationToSaleComponent,
    AddNewCustomerForInvoiceComponent,
    MonthlySalesReportComponent,
    BankSummaryComponent,
    InvoiceWiseProfitComponent,
    ReportGirdTreeTableComponent,
    AddOrderToPurchaseComponent,
    StockShortageComponent,
    AddNewStockShortageComponent,
    CreditCardComponent,
    AddNewCreditCardComponent,
    CreditCardReportComponent,
    BulkStockUpdateComponent,
    AddNewBulkStockUpdateComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    CommonModule,
    AppLayoutModule,
    RecaptchaModule,
    DashboardModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    })
    ],
    providers: [
      DatePipe,
      AddPurchaseComponent,
      NewInvoiceComponent,
      QuotationInvoiceComponent,
      ProductsComponent,
      CustomersComponent,
      VendorsComponent,
      MessageService,
      PermissionGuard,
      ConfirmationService,
      {
        provide:HTTP_INTERCEPTORS,
        useClass:TokenInterceptor,
        multi:true,
      },
    ],
  bootstrap: [AppComponent],
})
export class AppModule { }
