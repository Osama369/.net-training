import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { AccountsPayableComponent } from './Components/accounts-payable/accounts-payable.component';
import { AccountsReceivableComponent } from './Components/accounts-receivable/accounts-receivable.component';
import { AdvancedSearchReportComponent } from './Components/advanced-search-report/advanced-search-report.component';
import { BalanceSheetComponent } from './Components/balance-sheet/balance-sheet.component';
import { BankBookComponent } from './Components/bank-book/bank-book.component';
import { BankSummaryComponent } from './Components/bank-summary/bank-summary.component';
import { CashBookComponent } from './Components/cash-book/cash-book.component';
import { CashRegisterComponent } from './Components/cash-register/cash-register.component';
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
import { ReportSettingComponent } from './Components/report-setting/report-setting.component';
import { SalehistoryComponent } from './Components/salehistory/salehistory.component';
import { StockStatusCommulativeValuationComponent } from './Components/stock-status-commulative-valuation/stock-status-commulative-valuation.component';
import { StockComponent } from './Components/stock/stock.component';
import { StocksaleandreturnComponent } from './Components/stocksaleandreturn/stocksaleandreturn.component';
import { TaxReportByCustomerComponent } from './Components/tax-report-by-customer/tax-report-by-customer.component';
import { TaxReportBySupplierComponent } from './Components/tax-report-by-supplier/tax-report-by-supplier.component';
import { TaxReportComponent } from './Components/tax-report/tax-report.component';
import { TaxSummaryComponent } from './Components/tax-summary/tax-summary.component';
import { TrialBalanceComponent } from './Components/trial-balance/trial-balance.component';
import { VendorledgerComponent } from './Components/vendorledger/vendorledger.component';
import { CreditCardReportComponent } from './Components/credit-card-report/credit-card-report.component';
import { BonusClaimsComponent } from './Components/bonus-claims/bonus-claims.component';
import { DiscountClaimComponent } from './Components/discount-claim/discount-claim.component';
import { ItemExpiryListComponent } from './Components/item-expiry-list/item-expiry-list.component';
import { SSRWithAvailabilityComponent } from './Components/ssrwith-availability/ssrwith-availability.component';
import { SaleManLedgerReportComponent } from './Components/sale-man-ledger-report/sale-man-ledger-report.component';
import { SalemanItemWiseSaleReportComponent } from './Components/saleman-item-wise-sale-report/saleman-item-wise-sale-report.component';
import { SaleManWiseSaleReportComponent } from './Components/sale-man-wise-sale-report/sale-man-wise-sale-report.component';
import { ExpenseReportComponent } from './Components/expense-report/expense-report.component';
import { ChallanReportComponent } from './Components/challan-report/challan-report.component';
import { PurchaseComponent } from '../Invoices/Components/purchase/purchase.component';
import { PurchaseGrnOrdeReportrComponent } from './Components/purchase-grn-orde-reportr/purchase-grn-orde-reportr.component';
import { SaleClaimComponent } from './Components/sale-claim/sale-claim.component';
import { PayableAgingComponent } from './Components/payable-aging/payable-aging.component';
import { ReceivableAgingComponent } from './Components/receivable-aging/receivable-aging.component';

const routes: Routes = [
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
      { path: 'TaxDetail', component: TaxReportComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'TaxReport' }  },
      { path: 'TaxSummary', component: TaxSummaryComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'TaxSummary' }  },
      { path: 'TaxDetailByCustomer', component: TaxReportByCustomerComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'TaxReportByCustomer' }  },
      { path: 'TaxDetailBySupplier', component: TaxReportBySupplierComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'TaxReportBySupplier' }  },
      { path: 'ReportGird', component: ReportGirdComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ReportGird' }  },
      { path: 'ReportSetting', component: ReportSettingComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ReportSetting' }  },
      { path: 'MonthlySales', component: MonthlySalesReportComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'MonthlySales' }  },
      { path: 'BankSummary', component: BankSummaryComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'BankSummary' }  },
      { path: 'InvoiceWiseProfit', component: InvoiceWiseProfitComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'InvoiceWiseProfit' }  },
      { path: 'CreditCardReport', component: CreditCardReportComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'CreditCardReport' }  },
      { path: 'BonusClaimReport', component: BonusClaimsComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'BonusClaim' }  },
      { path: 'DiscountClaimReport', component: DiscountClaimComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'DiscountClaim' }  },
      { path: 'ItemExpiryListReport', component: ItemExpiryListComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ItemExpiryListReport' }  },
      { path: 'SSRWithAvailability', component: SSRWithAvailabilityComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'SSRWithAvailability' }  },
      { path: 'SalesManLedgerReport', component: SaleManLedgerReportComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'SalesManLedgerReport' }  },
      { path: 'SalemanItemWiseSaleReport', component: SalemanItemWiseSaleReportComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'SalemanItemWiseSaleReport' }  },
      { path: 'SalemanWiseSaleReport', component: SaleManWiseSaleReportComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'SalemanWiseSaleReport' }  },
      { path: 'SaleClaim', component: SaleClaimComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'SaleClaim' }  },
      { path: 'ExpenseReport', component: ExpenseReportComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ExpenseReport' }  },
      { path: 'ChallanReport', component: ChallanReportComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ChallanReport' }  },
      { path: 'PurchaseOrderGRNReport', component: PurchaseGrnOrdeReportrComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'PurchaseOrderGRN' }  },
      { path: 'PayableAging', component: PayableAgingComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'PayableAging' }  },
      { path: 'ReceivableAging', component:ReceivableAgingComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ReceivableAging' }  },

    ];


@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})

export class ReportsRoutingModule { }
