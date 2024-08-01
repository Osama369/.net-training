import { OnInit, ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { Router } from '@angular/router';
import { AutoComplete } from 'primeng/autocomplete';
import { ScreenService } from '../Administration/Services/screen.service';

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
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/Dashboard'] },
                    { label: 'Manage', icon: 'pi pi-fw pi-pencil',
                        items:[
                            {label: 'Re-Order Products', routerLink: ['/Manage/ReOrder']},
                            {label: 'Product Category', routerLink: ['/Manage/ProductCategory']},
                            {label: 'Products', routerLink: ['/Manage/Products']},
                            {label: 'Print Barcode', routerLink: ['/Manage/ProductBarcode']},
                            {label: 'Customers', routerLink: ['/Manage/Customers']},
                            {label: 'Suppliers', routerLink: ['/Manage/Suppliers']},
                            {label: 'Bank', routerLink: ['/Manage/Bank']},
                            {label: 'Credit Card', routerLink: ['/Manage/CreditCard']},
                            {label: 'Bulk Stock Update', routerLink: ['/Manage/bulkStockUpdate']},
                        ]
                    },
                    { label: 'Invoices', icon: 'pi pi-fw pi-shopping-cart',
                        items:[
                          {label: 'Purchase Order', routerLink: ['/Invoices/PurchaseOrder']},
                          {label: 'Purchase', routerLink: ['/Invoices/Purchase']},
                          {label: 'Purchase Return', routerLink: ['/Invoices/PurchaseReturn']},
                          {label: 'Quotations', routerLink: ['/Invoices/Quotations']},
                          {label: 'Sale Invoices', routerLink: ['/Invoices/SaleInvoices']},
                          {label: 'Sale Return', routerLink: ['/Invoices/SaleReturn']},
                          {label: 'Service Invoices', routerLink: ['/Invoices/ServiceInvoices']},
                       //   {label: 'Stock Shortage', routerLink: ['/StockShortage']},
                        ]
                    },
                    { label: 'Transactions', icon: 'pi pi-fw pi-money-bill',
                    items:[
                        {label: 'Receipt Voucher', routerLink: ['/Transactions/Receipt']},
                        {label: 'Payment Voucher', routerLink: ['/Transactions/Payment']},
                        {label: 'Journal Voucher', routerLink: ['/Transactions/Journal']},
                        {label: 'Expense Voucher', routerLink: ['/Transactions/Expense']},
                        {label: 'Day Book', routerLink: ['/Transactions/DayBook']},
                    ]
                    },
                    { label: 'Reports', icon: 'pi pi-fw pi-file-pdf',
                        items: [
                        {
                            label: 'Inventory Reports',
                            items: [
                                { label: 'Daily Sale', routerLink: ['/Reports/DailySaleReport']  },
                                { label: 'Sale History', routerLink: ['/Reports/SaleHistoryReport']  },
                                { label: 'Stock', routerLink: ['/Reports/StockReport']  },
                                { label: 'Stock Valuation', routerLink: ['/Reports/StockValuationReport']  },
                                { label: 'Stock Sale And Return', routerLink: ['/Reports/StockSaleAndReturnReport']  },
                            ],
                        },
                        {
                            label: 'Account Reports',
                            items: [
                                { label: 'Advanced Search', routerLink: ['/Reports/AdvancedSearchReport']  },
                                { label: 'Account Receivable', routerLink: ['/Reports/AccountReceivable']  },
                                { label: 'Account Payable', routerLink: ['/Reports/AccountPayable']  },
                                { label: 'Bank Book', routerLink: ['/Reports/BankBookReport']  },
                                { label: 'Credit Card', routerLink: ['/Reports/CreditCardReport']  },
                                { label: 'Cash Book', routerLink: ['/Reports/CashBookReport']  },
                                { label: 'Cash Register', routerLink: ['/Reports/CashRegisterReport']  },
                                { label: 'Monthly Sales', routerLink: ['/Reports/MonthlySales']  },
                                { label : 'Tax Reports',
                                items :[
                                  { label: 'Tax Report', routerLink: ['/Reports/TaxDetail']  },
                                  { label: 'Sales Tax Report', routerLink: ['/Reports/TaxDetailByCustomer']  },
                                  { label: 'Purchase Tax Report', routerLink: ['/Reports/TaxDetailBySupplier']  },
                                  { label: 'Tax Summary', routerLink: ['/Reports/TaxSummary']  },
                                  ]
                                },
                                { label: 'General Journal', routerLink: ['/Reports/GeneralJournalReport']  },
                                { label : 'Ledger Reports',
                                items :[
                                  { label: 'General Ledger', routerLink: ['/Reports/GeneralLedgerReport']  },
                                  { label: 'Item Ledger', routerLink: ['/Reports/ItemLedgerReport']  },
                                  { label: 'Party ledger', routerLink: ['/Reports/PartyLedgerReport']  },
                                  ]
                                },
                                { label: 'Trial Balance', routerLink: ['/Reports/TrialBalanceReport']  },
                                { label: 'Balance Sheet', routerLink: ['/Reports/BalanceSheetReport']  },
                                { label : 'Profit Reports',
                                items :[
                                  { label: 'Item Wise Profit', routerLink: ['/Reports/ItemWiseProfitReport']  },
                                  { label: 'Invoice Wise Profit', routerLink: ['/Reports/InvoiceWiseProfit']  },
                                  { label: 'Profit And Loss', routerLink: ['/Reports/ProfitAndLossReport']  },
                                  ]
                                }
                              ],

                        },

                        ]

                    },
                    { label: 'Administration', icon: 'pi pi-fw pi-cog',
                      items:[
                        {label: 'Location', routerLink: ['/Administration/Location']},
                        {label: 'Taxes', routerLink: ['/Administration/Taxes']},
                        {label: 'Chart Of Accounts', routerLink: ['/Administration/COA']},
                        {label: 'Users', routerLink: ['/Administration/Users']},
                        {label: 'Fiscal Year', routerLink: ['/Administration/FiscalYear']},
                        {label: 'Authorization', routerLink: ['/Administration/PermissionScreen']},
                        {label: 'Notification', routerLink: ['/Administration/Notification']},
                        {label: 'Notification Alert', routerLink: ['/Administration/NotificationAlert']},
                        {label: 'Company Setting', routerLink: ['/Administration/Configuration']}
                      ]
                    },
                ]
            }
        ];
    }
}
