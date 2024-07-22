import * as FileSaver from 'file-saver';
import { GenericService } from './../../services/generic.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
//import { Product } from '../../api/product';
//import { ProductService } from '../../service/product.service';
import { Subscription, filter } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { SignalrService } from 'src/app/services/signalr.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';


@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  totalProducts:any = "00";
  totalCustomers:any = "00";
  totalSuppliers:any = "00";
  CashSale:any = "00";
  CreditSale:any = "00";
  TotalReceivable:any = "00";
  CashPurchase:any = "00";
  CreditPurchase:any = "00";
  TotalPayable:any = "00";
  CashInHand:any = "00";
  BankAccounts:any = "00";
  TotalValuation:any = "00";
  CreditCard : any = "00";
  period :any[] = [
    'Today',
    'Current Week',
    'Current Month',
    'Current Fiscal'
  ]
  selectedPeriod : any = 'Today';
  loading: Boolean = false;
  last5Month:any;
  DataList:any[] = [];
  topSellingList: any[] = [];
  last5MonthList:any[] = [];
  agingData: any;
  agingDataList: any[]=[];

    items!: MenuItem[];

    products!: [];

    chartData: any;

    chartOptions: any;
    horizontalOptions:any;
    subscription!: Subscription;

    constructor(public layoutService: LayoutService, public genericService: GenericService,
      private ref: ChangeDetectorRef, private signalrService : SignalrService,
      private authService : AuthService, private router : Router) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initChart();
            this.ref.detectChanges();

        });
    }


    ngOnInit() {
        //this.productService.getProductsSmall().then(data => this.products = data);

        this.signalrService.ClearNotification();

        this.authService.checkPermission('Dashboard').subscribe((x:any)=>{
          if(x)
          {
            this.items = [
                { label: 'Add New', icon: 'pi pi-fw pi-plus' },
                { label: 'Remove', icon: 'pi pi-fw pi-minus' }
            ];

          this.loading = true;
          this.genericService.getDashBoardData(this.selectedPeriod).subscribe({
            next:(list)=>{
            this.loading = false;
            this.totalProducts = list[0].TotalProducts;
            this.totalCustomers = list[0].TotalCustomers;
            this.totalSuppliers = list[0].TotalVendors;
            this.CashSale = list[0].CashSale;
            this.CreditSale = list[0].CreditSale;
            this.TotalReceivable = list[0].TotalReceivable;
            this.CashPurchase = list[0].CashPurchase;
            this.CreditPurchase = list[0].CreditPurchase;
            this.TotalPayable = list[0].TotalPayable;
            this.CashInHand = list[0].CashInHand;
            this.BankAccounts = list[0].BankAccounts;
            this.TotalValuation = list[0].TotalValuation;
            this.CreditCard = list[0].CreditCard;

            this.DataList =list;

            this.topSellingList = this.removeDuplicates(this.DataList, "prodID")
            this.last5MonthList = this.removeDuplicates(this.DataList, "SaleMonth")
            this.agingDataList = this.removeDuplicates(this.DataList, "cstID");
            this.initChart();
            }
          })
        }
        else{
          this.router.navigateByUrl('/SaleInvoices');
        }
      });
    }

    RefreshData(){
      this.loading = true;
      this.genericService.getDashBoardData(this.selectedPeriod).subscribe({
        next:(list)=>{
        this.loading = false;
        this.totalProducts = list[0].TotalProducts;
        this.totalCustomers = list[0].TotalCustomers;
        this.totalSuppliers = list[0].TotalVendors;
        this.CashSale = list[0].CashSale;
        this.CreditSale = list[0].CreditSale;
        this.TotalReceivable = list[0].TotalReceivable;
        this.CashPurchase = list[0].CashPurchase;
        this.CreditPurchase = list[0].CreditPurchase;
        this.TotalPayable = list[0].TotalPayable;
        this.CashInHand = list[0].CashInHand;
        this.BankAccounts = list[0].BankAccounts;
        this.TotalValuation = list[0].TotalValuation;
        this.CreditCard = list[0].CreditCard;

        this.DataList =list;

        this.topSellingList = this.removeDuplicates(this.DataList, "prodID")
        this.last5MonthList = this.removeDuplicates(this.DataList, "SaleMonth")
        this.agingDataList = this.removeDuplicates(this.DataList, "cstID");
        this.initChart();
        }
      })
    }

    removeDuplicates(myArray:any, Prop:any) {
      return myArray.filter((obj:any, pos:any, arr:any) => {
        return arr.map((mapObj:any) => mapObj[Prop]).indexOf(obj[Prop]) === pos;
      });
    }

    initChart() {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');


      this.chartData = {

          labels: [],
          datasets: [
              {
                data: [],
                backgroundColor: [
                    "#FF7F50",
                    "#7CFC00",
                    "#20B2AA",
                    "#4682B4",
                    "#800000"
                ],
              }
          ]
      };

      this.topSellingList.forEach(element => {
        this.chartData.labels.push(element.prodName);
        this.chartData.datasets[0].data.push(element.TotalUnitsSold);
      });

      this.horizontalOptions = {
        indexAxis: 'y',
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };




      this.last5Month = {
        labels: [],
        datasets: [
            {
                label: 'Sales',
                backgroundColor: '#FFA726',
                data: []
            },
        ]
    };

    this.last5MonthList.forEach(element => {
      this.last5Month.labels.push(element.SaleMonth);
      this.last5Month.datasets[0].data.push(element.TotalSalesAmountMonthWise);
    });


      this.chartOptions = {
          plugins: {
              legend: {
                  labels: {
                      color: textColor
                  }
              }
          },
          scales: {
              x: {
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              },
              y: {
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder,
                      drawBorder: false
                  }
              }
          }
      };
  }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
