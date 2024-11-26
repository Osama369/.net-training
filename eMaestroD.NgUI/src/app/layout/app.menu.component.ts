import { OnInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { Router } from '@angular/router';
import { AutoComplete } from 'primeng/autocomplete';
import { ScreenService } from '../Administration/Services/screen.service';
import { APP_ROUTES } from '../app-routes';
import { SharedDataService } from '../Shared/Services/shared-data.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})

export class AppMenuComponent implements OnInit {

    model: any[] = [];
    selectedItem: any="";

    searchText: string = '';
    filteredItems: any[]=[];
    isPos: boolean = localStorage.getItem("isPos") === 'true';
    isShowPurchase:any;
    @ViewChild('autoComplete') autoComplete!: AutoComplete | undefined;

    constructor(public layoutService: LayoutService,
      public ScreenService: ScreenService,
      private router: Router,
      private sharedDataService: SharedDataService
    ) {
     }

     filterItems(event: any) {
      const allItems = this.model.flatMap(parent => {
        const childItems = parent.items.flatMap((item: any) => item.items ? item.items.map((child: any) => ({  child: child.label, routerLink: child.routerLink })) : []);
        return [...childItems]; // Include parent label as well
      });
      allItems.unshift({ parent: "Dashboard", child: "Dashboard", routerLink: [APP_ROUTES.dashboard] });
      this.filteredItems = allItems.filter(item => item.child.toLowerCase().includes(this.selectedItem.toLowerCase()));
    }


    onAutocompleteSelect(event: any) {
      const routeToNavigate = this.selectedItem.routerLink; // Assuming the selected item has a routerLink property
      this.selectedItem = "";
      if (this.autoComplete?.inputEL?.nativeElement) {
        this.autoComplete.inputEL.nativeElement.value  = '';
      }
      if (routeToNavigate) {
        this.router.navigate(routeToNavigate);
      }
    }

    ngOnInit() {
      this.sharedDataService.getConfigSettings$().subscribe({
        next : (result:any[])=>{
          this.isShowPurchase = result.find(x=>x.key === "Purchase Through GRN").value;
        }
      })

      this.model = [
        {
          label: '',
          items: [
            {
              label: 'Dashboard',
              icon: 'pi pi-fw pi-home',
              routerLink: [APP_ROUTES.dashboard],
            },
            {
              label: 'Manage',
              icon: 'pi pi-fw pi-pencil',
              items: [
                { label: 'Re-Order Products', routerLink: [APP_ROUTES.manage.reorder] },
                { label: 'Manufacture', routerLink: [APP_ROUTES.manage.manufacture] },
                { label: 'Brand', routerLink: [APP_ROUTES.manage.brand] },
                { label: 'Departments', routerLink: [APP_ROUTES.manage.department] },
                { label: 'Category', routerLink: [APP_ROUTES.manage.category] },
                { label: 'Products', routerLink: [APP_ROUTES.manage.products] },
                { label: 'Print Barcode', routerLink: [APP_ROUTES.manage.productBarcode] },
                { label: 'Offer', routerLink: [APP_ROUTES.manage.offer] },
                { label: 'Schemes', routerLink: [APP_ROUTES.manage.schemes] },
                { label: 'Customers', routerLink: [APP_ROUTES.manage.customers] },
                { label: 'Suppliers', routerLink: [APP_ROUTES.manage.suppliers] },
                { label: 'Bank', routerLink: [APP_ROUTES.manage.bank] },
                { label: 'Credit Card', routerLink: [APP_ROUTES.manage.creditCard] },
                { label: 'Bulk Stock Update', routerLink: [APP_ROUTES.manage.bulkStockUpdate] },
              ],
            },
            {
              label: 'Invoices',
              icon: 'pi pi-fw pi-shopping-cart',
              items: [
                { label: 'Purchase Order', routerLink: [APP_ROUTES.invoices.purchaseOrder] },
                { label: 'Goods Received Note', routerLink: [APP_ROUTES.invoices.grn] },
                ...(!this.isShowPurchase ? [{ label: 'Purchase', routerLink: [APP_ROUTES.invoices.purchase] }] : []),
                { label: 'Purchase Return', routerLink: [APP_ROUTES.invoices.purchaseReturn] },
                { label: this.getDynamicLabel(this.isPos, 'Quotations', 'Sale Order'), routerLink: [APP_ROUTES.invoices.quotations] },
                { label: 'Sale Invoices', routerLink: [APP_ROUTES.invoices.saleInvoices] },
                { label: 'Sale Return', routerLink: [APP_ROUTES.invoices.saleReturn] },
                { label: 'Service Invoices', routerLink: [APP_ROUTES.invoices.serviceInvoices] },
                { label: 'Invoice Posting', routerLink: [APP_ROUTES.invoices.invoicePosting] },
                // { label: 'Stock Shortage', routerLink: [APP_ROUTES.invoices.stockShortage] },
              ],
            },
            {
              label: 'Transactions',
              icon: 'pi pi-fw pi-money-bill',
              items: [
                { label: 'Receipt Voucher', routerLink: [APP_ROUTES.transactions.receipt] },
                { label: 'Payment Voucher', routerLink: [APP_ROUTES.transactions.payment] },
                { label: 'Journal Voucher', routerLink: [APP_ROUTES.transactions.journal] },
                { label: 'Expense Voucher', routerLink: [APP_ROUTES.transactions.expense] },
                { label: 'Day Book', routerLink: [APP_ROUTES.transactions.dayBook] },
              ],
            },
            {
              label: 'Reports',
              icon: 'pi pi-fw pi-file-pdf',
              items: [
                {
                  label: 'Inventory Reports',
                  items: [
                    { label: 'Daily Sale', routerLink: [APP_ROUTES.reports.inventoryReports.dailySale] },
                    { label: 'Sale History', routerLink: [APP_ROUTES.reports.inventoryReports.saleHistory] },
                    { label: 'Stock', routerLink: [APP_ROUTES.reports.inventoryReports.stock] },
                    { label: 'Stock Valuation', routerLink: [APP_ROUTES.reports.inventoryReports.stockValuation] },
                    { label: 'Stock Sale And Return', routerLink: [APP_ROUTES.reports.inventoryReports.stockSaleAndReturn] },
                  ],
                },
                {
                  label: 'Account Reports',
                  items: [
                    { label: 'Advanced Search', routerLink: [APP_ROUTES.reports.accountReports.advancedSearch] },
                    { label: 'Account Receivable', routerLink: [APP_ROUTES.reports.accountReports.accountReceivable] },
                    { label: 'Account Payable', routerLink: [APP_ROUTES.reports.accountReports.accountPayable] },
                    { label: 'Bank Book', routerLink: [APP_ROUTES.reports.accountReports.bankBook] },
                    { label: 'Credit Card', routerLink: [APP_ROUTES.reports.accountReports.creditCard] },
                    { label: 'Cash Book', routerLink: [APP_ROUTES.reports.accountReports.cashBook] },
                    { label: 'Cash Register', routerLink: [APP_ROUTES.reports.accountReports.cashRegister] },
                    { label: 'Monthly Sales', routerLink: [APP_ROUTES.reports.accountReports.monthlySales] },
                    {
                      label: 'Tax Reports',
                      items: [
                        { label: 'Tax Report', routerLink: [APP_ROUTES.reports.accountReports.taxReports.taxDetail] },
                        { label: 'Sales Tax Report', routerLink: [APP_ROUTES.reports.accountReports.taxReports.taxDetailByCustomer] },
                        { label: 'Purchase Tax Report', routerLink: [APP_ROUTES.reports.accountReports.taxReports.taxDetailBySupplier] },
                        { label: 'Tax Summary', routerLink: [APP_ROUTES.reports.accountReports.taxReports.taxSummary] },
                      ],
                    },
                    { label: 'General Journal', routerLink: [APP_ROUTES.reports.accountReports.generalJournal] },
                    {
                      label: 'Ledger Reports',
                      items: [
                        { label: 'General Ledger', routerLink: [APP_ROUTES.reports.accountReports.ledgerReports.generalLedger] },
                        { label: 'Item Ledger', routerLink: [APP_ROUTES.reports.accountReports.ledgerReports.itemLedger] },
                        { label: 'Party Ledger', routerLink: [APP_ROUTES.reports.accountReports.ledgerReports.partyLedger] },
                      ],
                    },
                    { label: 'Trial Balance', routerLink: [APP_ROUTES.reports.accountReports.trialBalance] },
                    { label: 'Balance Sheet', routerLink: [APP_ROUTES.reports.accountReports.balanceSheet] },
                    {
                      label: 'Profit Reports',
                      items: [
                        { label: 'Item Wise Profit', routerLink: [APP_ROUTES.reports.accountReports.profitReports.itemWiseProfit] },
                        { label: 'Invoice Wise Profit', routerLink: [APP_ROUTES.reports.accountReports.profitReports.invoiceWiseProfit] },
                        { label: 'Profit And Loss', routerLink: [APP_ROUTES.reports.accountReports.profitReports.profitAndLoss] },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              label: 'Administration',
              icon: 'pi pi-fw pi-cog',
              items: [
                { label: 'Location', routerLink: [APP_ROUTES.administration.location] },
                { label: 'Taxes', routerLink: [APP_ROUTES.administration.taxes] },
                { label: 'Chart Of Accounts', routerLink: [APP_ROUTES.administration.chartOfAccounts] },
                { label: 'Users', routerLink: [APP_ROUTES.administration.users] },
                { label: 'Fiscal Year', routerLink: [APP_ROUTES.administration.fiscalYear] },
                { label: 'Authorization', routerLink: [APP_ROUTES.administration.authorization] },
                { label: 'Notification', routerLink: [APP_ROUTES.administration.notification] },
                { label: 'Notification Alert', routerLink: [APP_ROUTES.administration.notificationAlert] },
                { label: 'Company Setting', routerLink: [APP_ROUTES.administration.companySetting] },
              ],
            },
          ],
        },
      ];
    }

    getDynamicLabel(condition: boolean, trueLabel: string, falseLabel: string): string {
      return condition ? trueLabel : falseLabel;
    }
}
