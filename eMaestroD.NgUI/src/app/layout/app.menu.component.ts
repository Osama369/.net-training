import { ScreenService } from './../services/screen.service';
import { Screen } from './../models/screen';
import { OnInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { Router } from '@angular/router';
import { AutoComplete } from 'primeng/autocomplete';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})

export class AppMenuComponent implements OnInit {

    model: any[] = [];
    selectedItem: any="";

    searchText: string = '';
    filteredItems: any[]=[];
    @ViewChild('autoComplete') autoComplete!: AutoComplete | undefined;

    constructor(public layoutService: LayoutService,public ScreenService: ScreenService,private router: Router) {
     }

     filterItems(event: any) {
      const allItems = this.model.flatMap(parent => {
        const childItems = parent.items.flatMap((item: any) => item.items ? item.items.map((child: any) => ({  child: child.label, routerLink: child.routerLink })) : []);
        return [...childItems]; // Include parent label as well
      });
      allItems.unshift({ parent: "Dashboard", child: "Dashboard", routerLink: ['/Dashboard'] });
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
        this.model = [
            {
                label: '',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Manage', icon: 'pi pi-fw pi-pencil',
                        items:[
                            {label: 'Re-Order Products', routerLink: ['/ReOrder']},
                            {label: 'Product Category', routerLink: ['/ProductCategory']},
                            {label: 'Products', routerLink: ['/Products']},
                            {label: 'Print Barcode', routerLink: ['/ProductBarcode']},
                            {label: 'Customers', routerLink: ['/Customers']},
                            {label: 'Suppliers', routerLink: ['/Suppliers']},
                            {label: 'Bank', routerLink: ['/Bank']},
                            {label: 'Credit Card', routerLink: ['/CreditCard']},
                            {label: 'Bulk Stock Update', routerLink: ['/bulkStockUpdate']},
                        ]
                    },
                    { label: 'Invoices', icon: 'pi pi-fw pi-shopping-cart',
                        items:[
                          {label: 'Purchase Order', routerLink: ['/PurchaseOrder']},
                          {label: 'Purchase', routerLink: ['/Purchase']},
                          {label: 'Purchase Return', routerLink: ['/PurchaseReturn']},
                          {label: 'Quotations', routerLink: ['/Quotations']},
                          {label: 'Sale Invoices', routerLink: ['/SaleInvoices']},
                          {label: 'Sale Return', routerLink: ['/SaleReturn']},
                          {label: 'Service Invoices', routerLink: ['/ServiceInvoices']},
                       //   {label: 'Stock Shortage', routerLink: ['/StockShortage']},
                        ]
                    },
                    { label: 'Transactions', icon: 'pi pi-fw pi-money-bill',
                    items:[
                        {label: 'Receipt Voucher', routerLink: ['/Receipt']},
                        {label: 'Payment Voucher', routerLink: ['/Payment']},
                        {label: 'Journal Voucher', routerLink: ['/Journal']},
                        {label: 'Expense Voucher', routerLink: ['/Expense']},
                        {label: 'Day Book', routerLink: ['/DayBook']},
                    ]
                    },
                    { label: 'Reports', icon: 'pi pi-fw pi-file-pdf',
                        items: [
                        {
                            label: 'Inventory Reports',
                            items: [
                                { label: 'Daily Sale', routerLink: ['/DailySaleReport']  },
                                { label: 'Sale History', routerLink: ['/SaleHistoryReport']  },
                                { label: 'Stock', routerLink: ['/StockReport']  },
                                { label: 'Stock Valuation', routerLink: ['/StockValuationReport']  },
                                { label: 'Stock Sale And Return', routerLink: ['/StockSaleAndReturnReport']  },
                            ],
                        },
                        {
                            label: 'Account Reports',
                            items: [
                                { label: 'Advanced Search', routerLink: ['/AdvancedSearchReport']  },
                                { label: 'Account Receivable', routerLink: ['/AccountReceivable']  },
                                { label: 'Account Payable', routerLink: ['/AccountPayable']  },
                                { label: 'Bank Book', routerLink: ['/BankBookReport']  },
                                { label: 'Credit Card', routerLink: ['/CreditCardReport']  },
                                { label: 'Cash Book', routerLink: ['/CashBookReport']  },
                                { label: 'Cash Register', routerLink: ['/CashRegisterReport']  },
                                { label: 'Monthly Sales', routerLink: ['/MonthlySales']  },
                                { label : 'Tax Reports',
                                items :[
                                  { label: 'Tax Report', routerLink: ['/TaxDetail']  },
                                  { label: 'Sales Tax Report', routerLink: ['/TaxDetailByCustomer']  },
                                  { label: 'Purchase Tax Report', routerLink: ['/TaxDetailBySupplier']  },
                                  { label: 'Tax Summary', routerLink: ['/TaxSummary']  },
                                  ]
                                },
                                { label: 'General Journal', routerLink: ['/GeneralJournalReport']  },
                                { label : 'Ledger Reports',
                                items :[
                                  { label: 'General Ledger', routerLink: ['/GeneralLedgerReport']  },
                                  { label: 'Item Ledger', routerLink: ['/ItemLedgerReport']  },
                                  { label: 'Party ledger', routerLink: ['/PartyLedgerReport']  },
                                  ]
                                },
                                { label: 'Trial Balance', routerLink: ['/TrialBalanceReport']  },
                                { label: 'Balance Sheet', routerLink: ['/BalanceSheetReport']  },
                                { label : 'Profit Reports',
                                items :[
                                  { label: 'Item Wise Profit', routerLink: ['/ItemWiseProfitReport']  },
                                  { label: 'Invoice Wise Profit', routerLink: ['/InvoiceWiseProfit']  },
                                  { label: 'Profit And Loss', routerLink: ['/ProfitAndLossReport']  },
                                  ]
                                }
                              ],

                        },

                        ]

                    },
                    { label: 'Administration', icon: 'pi pi-fw pi-cog',
                      items:[
                        {label: 'Location', routerLink: ['/Location']},
                        {label: 'Taxes', routerLink: ['/Taxes']},
                        {label: 'Chart Of Accounts', routerLink: ['/COA']},
                        {label: 'Users', routerLink: ['/Users']},
                        {label: 'Fiscal Year', routerLink: ['/FiscalYear']},
                        {label: 'Authorization', routerLink: ['/PermissionScreen']},
                        {label: 'Notification', routerLink: ['/Notification']},
                        {label: 'Notification Alert', routerLink: ['/NotificationAlert']},
                        {label: 'Company Setting', routerLink: ['/Configuration']}
                      ]
                    },
                ]
            }
        ];
    }
}
