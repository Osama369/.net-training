import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsPayableComponent } from './Components/accounts-payable/accounts-payable.component';
import { AccountsReceivableComponent } from './Components/accounts-receivable/accounts-receivable.component';
import { AdvancedSearchReportComponent } from './Components/advanced-search-report/advanced-search-report.component';
import { BalanceSheetComponent } from './Components/balance-sheet/balance-sheet.component';
import { BankBookComponent } from './Components/bank-book/bank-book.component';
import { BankSummaryComponent } from './Components/bank-summary/bank-summary.component';
import { CashBookComponent } from './Components/cash-book/cash-book.component';
import { CashRegisterComponent } from './Components/cash-register/cash-register.component';
import { CreditCardReportComponent } from './Components/credit-card-report/credit-card-report.component';
import { DailyinvoiceComponent } from './Components/dailyinvoice/dailyinvoice.component';
import { GeneralJournalComponent } from './Components/general-journal/general-journal.component';
import { GeneralledgerComponent } from './Components/generalledger/generalledger.component';
import { InvoiceWiseProfitComponent } from './Components/invoice-wise-profit/invoice-wise-profit.component';
import { ItemWiseProfitComponent } from './Components/item-wise-profit/item-wise-profit.component';
import { ItemledgerComponent } from './Components/itemledger/itemledger.component';
import { MonthlySalesReportComponent } from './Components/monthly-sales-report/monthly-sales-report.component';
import { PartyledgerComponent } from './Components/partyledger/partyledger.component';
import { ProfitandlossComponent } from './Components/profitandloss/profitandloss.component';
import { ReportGirdComponent } from './Components/report-gird/report-gird.component';
import { ReportGirdTreeTableComponent } from './Components/report-gird-tree-table/report-gird-tree-table.component';
import { ReportSettingComponent } from './Components/report-setting/report-setting.component';
import { SalehistoryComponent } from './Components/salehistory/salehistory.component';
import { StockComponent } from './Components/stock/stock.component';
import { StockStatusCommulativeValuationComponent } from './Components/stock-status-commulative-valuation/stock-status-commulative-valuation.component';
import { StocksaleandreturnComponent } from './Components/stocksaleandreturn/stocksaleandreturn.component';
import { TaxReportByCustomerComponent } from './Components/tax-report-by-customer/tax-report-by-customer.component';
import { TaxSummaryComponent } from './Components/tax-summary/tax-summary.component';
import { TaxReportBySupplierComponent } from './Components/tax-report-by-supplier/tax-report-by-supplier.component';
import { TaxReportComponent } from './Components/tax-report/tax-report.component';
import { TrialBalanceComponent } from './Components/trial-balance/trial-balance.component';
import { VendorledgerComponent } from './Components/vendorledger/vendorledger.component';
import { SharedModule } from '../Shared/shared.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { BonusClaimsComponent } from './Components/bonus-claims/bonus-claims.component';
import { DiscountClaimComponent } from './Components/discount-claim/discount-claim.component';
import { ItemExpiryListComponent } from './Components/item-expiry-list/item-expiry-list.component';
import { SSRWithAvailabilityComponent } from './Components/ssrwith-availability/ssrwith-availability.component';
import { SaleManLedgerReportComponent } from './Components/sale-man-ledger-report/sale-man-ledger-report.component';



@NgModule({
  declarations: [
    AccountsPayableComponent,
    AccountsReceivableComponent,
    AdvancedSearchReportComponent,
    BalanceSheetComponent,
    BankBookComponent,
    BankSummaryComponent,
    CashBookComponent,
    CashRegisterComponent,
    CreditCardReportComponent,
    DailyinvoiceComponent,
    GeneralJournalComponent,
    GeneralledgerComponent,
    InvoiceWiseProfitComponent,
    ItemWiseProfitComponent,
    ItemledgerComponent,
    MonthlySalesReportComponent,
    PartyledgerComponent,
    ProfitandlossComponent,
    ReportGirdComponent,
    ReportGirdTreeTableComponent,
    ReportSettingComponent,
    SalehistoryComponent,
    StockComponent,
    StockStatusCommulativeValuationComponent,
    StocksaleandreturnComponent,
    TaxReportByCustomerComponent,
    TaxSummaryComponent,
    TaxReportBySupplierComponent,
    TaxReportComponent,
    TrialBalanceComponent,
    VendorledgerComponent,
    BonusClaimsComponent,
    DiscountClaimComponent,
    ItemExpiryListComponent,
    SSRWithAvailabilityComponent,
    SaleManLedgerReportComponent

  ],
  imports: [
    CommonModule,
    SharedModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
