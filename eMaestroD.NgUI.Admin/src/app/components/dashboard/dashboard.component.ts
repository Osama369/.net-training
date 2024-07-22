import * as FileSaver from 'file-saver';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
//import { Product } from '../../api/product';
//import { ProductService } from '../../service/product.service';
import { Subscription, filter } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { TenantService } from 'src/app/services/tenant.service';


@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  totalTenants:any = "00";
  TrialTenants:any = "00";
  LicenseTenants:any = "00";
  ActiveTrialTenants:any = "00";
  ExpireTrialTenants:any = "00";
  ActiveLicenseTenants:any = "00";
  ExpireLicenseTenants:any = "00";

    items!: MenuItem[];

    products!: [];

    chartData: any;

    chartOptions: any;
    horizontalOptions:any;
    subscription!: Subscription;

    constructor(public layoutService: LayoutService, public tenantService: TenantService, private ref: ChangeDetectorRef) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initChart();
            this.ref.detectChanges();

        });
    }


    ngOnInit() {
        //this.productService.getProductsSmall().then(data => this.products = data);

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];

        this.tenantService.getAllTenants().subscribe({
          next:(list)=>{
            this.totalTenants = list.length;
            this.TrialTenants =  list.filter(x=>x.subscriptionType == "Trial").length;
            this.LicenseTenants = list.filter(x=>x.subscriptionType == "License").length
            this.ActiveTrialTenants = list.filter(x=>x.subscriptionType == "Trial" && x.isSuspended == false).length;
            this.ExpireTrialTenants = list.filter(x=>x.subscriptionType == "Trial" && x.isSuspended == true).length;
            this.ActiveLicenseTenants = list.filter(x=>x.subscriptionType == "License" && x.isSuspended == false).length;
            this.ExpireLicenseTenants = list.filter(x=>x.subscriptionType == "License" && x.isSuspended == true).length;
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
  }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
