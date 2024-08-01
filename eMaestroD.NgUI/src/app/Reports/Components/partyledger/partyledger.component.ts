

import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CustomersService } from 'src/app/Manage/Services/customers.service';
import { VendorService } from 'src/app/Manage/Services/vendor.service';
import { Customer } from 'src/app/Manage/Models/customer';
import { Vendor } from 'src/app/Manage/Models/vendor';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { ReportService } from '../../Services/report.service';



@Component({
  selector: 'app-partyledger',
  templateUrl: './partyledger.component.html',
  styleUrls: ['./partyledger.component.css']
})
export class PartyledgerComponent {
  constructor(private authService : AuthService,
    public bookmarkService: BookmarkService,
    private cdr: ChangeDetectorRef,
    public route : ActivatedRoute,private customerService:CustomersService,private vendorService:VendorService,private http: HttpClient, private sanitizer: DomSanitizer, private datePipe: DatePipe,private reportService: ReportService){}
  customers: Customer[] = [];
  SelectedCustomer:any;
  customerlist: Customer[];

  vendors: Vendor[] = [];
  SelectedVendor:any;

  combinedlist: any[] = [];
  SelectedAccount:any;
  Filtercustomerlist: Customer[];
  @ViewChildren('inputField') inputFields: QueryList<any>;
  DateFrom :any;
  DateTo :any;
  pdfUrl: SafeResourceUrl;

  allowBtn: boolean = false;
  cols:any []= [];
  data:any[];
  bookmark : boolean = false;
  cstID : any;
  vendID : any;

  ngOnInit(): void {
    this.route.params.subscribe(params1 => {
      this.cstID = parseInt(params1['id'], 10);
   });
    let today = new Date();
    this.DateFrom = new Date(today.getFullYear(), today.getMonth(), 1);
    this.DateTo = today;

    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customers = (customers as { [key: string]: any })["enttityDataSource"];;
        this.customers.unshift({
          cstID : -11,
          regionID : undefined,
          regionName : undefined,
          cityID : undefined,
          cityName : undefined,
          areasID : undefined,
          areasName : undefined,
          cstCode : undefined,
          cstName : "---Select Customer---",
          cstShortName : undefined,
          isLicence : true,
          city : undefined,
          state : undefined,
          active : true,
          crtBy : undefined,
          crtDate : undefined,
          modby : undefined,
          modDate : undefined,
          taxNo : undefined,
          taxValue : undefined    ,
          address:undefined,
          contPhone:undefined,
          comment : undefined
      });
    //  this.SelectedCustomer = {cstID:  -11, cstName: '---Select Customer---'};
    this.cdr.detectChanges();

    this.customers.forEach(elem => {
      if(elem.empID > 0){
        this.combinedlist.push(elem);
      }
    });

    this.combinedlist.unshift({cstName: "Select Account"})
    this.SelectedAccount = {cstName: "Select Account"};
        if(this.cstID != undefined){
          const foundCustomer = this.customers.find((c) => c.cstID === this.cstID);
          if (foundCustomer) {
            this.SelectedCustomer = foundCustomer;
          }

          this.submitPartyLedger();
        }
      },
      error: (response) => {
        console.log(response);
      },
    });

    this.vendorService.getAllVendor().subscribe({
      next: (result) => {
        this.vendors = (result as { [key: string]: any })["enttityDataSource"];;
        this.vendors.unshift(this.createNewVendor());

        this.cdr.detectChanges();
        if(this.vendID != undefined){
          const foundVendor = this.vendors.find((c) => c.vendID === this.vendID);
          if (foundVendor) {
            this.SelectedVendor = foundVendor;
          }

          this.submitVendorLedger();
        }
      },
      error: (response) => {
        console.log(response);
      },
    });



    this.authService.GetBookmarkScreen(this.route.snapshot?.data['requiredPermission']).subscribe(x=>{
      this.bookmark = x;
  });

}
        UpdateBookmark(value:any){
  this.bookmarkService.Updatebookmark(this.route.snapshot.data['requiredPermission'],value).subscribe({
    next: (result: any) => {
      this.bookmark = value;
    },
  });;
}


  filterProduct(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.customers.length; i++) {
      let product = this.customers[i];
      if (product.cstName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(product);
      }
    }
    this.Filtercustomerlist = filtered;
  }


  onEnterComplex(index: number) {
    if (index < this.inputFields.length - 1) {
      this.focusOnComplexInput(index + 1);
    }
  }

  private focusOnComplexInput(index: number) {
    const inputFieldARRAY = this.inputFields.toArray();
    const check = inputFieldARRAY[index-1].el.nativeElement.tagName;
    const inputField = inputFieldARRAY[index].el.nativeElement.querySelector('input');
      inputField.focus();
      inputField.select();
  }

  submitPartyLedger()
  {
    let d1 = this.datePipe.transform(this.DateFrom, "yyyy-MM-dd");
    let d2 =  this.datePipe.transform(this.DateTo, "yyyy-MM-dd");

    this.reportService.runReportWith3Para("PartyLedger",d1,d2,this.SelectedCustomer.cstID,0).subscribe(data => {
      this.data = (data as { [key: string]: any })["enttityDataSource"];
      this.cols = (data as { [key: string]: any })["entityModel"];
      this.allowBtn = true;
    });
  }

  submitVendorLedger(){
    let d1 = this.datePipe.transform(this.DateFrom, "yyyy-MM-dd");
    let d2 =  this.datePipe.transform(this.DateTo, "yyyy-MM-dd");

    this.reportService.runReportWith3Para("VendorLedger",d1,d2,this.SelectedVendor.vendID,0).subscribe(data => {
      this.data = (data as { [key: string]: any })["enttityDataSource"];
      this.cols = (data as { [key: string]: any })["entityModel"];
      this.allowBtn = true;
    });
  }

  submitCustomerVendorLedger(){
    let d1 = this.datePipe.transform(this.DateFrom, "yyyy-MM-dd");
    let d2 =  this.datePipe.transform(this.DateTo, "yyyy-MM-dd");

    this.reportService.runReportWith4Para("CustomerVendorLedger",d1,d2,this.SelectedAccount.cstID,this.SelectedAccount.empID,0).subscribe(data => {
      this.data = (data as { [key: string]: any })["enttityDataSource"];
      this.cols = (data as { [key: string]: any })["entityModel"];
      this.allowBtn = true;
    });
  }

  createNewVendor() {
    return {
      vendID : -11,
      vendName : "---Select Vendor---",
      comID: undefined,
      comName : undefined,
      vendCode : undefined,
      address : undefined,
      city : undefined,
      state : undefined,
      zip : undefined,
      vendPhone : undefined,
      vendFax : undefined,
      contName : undefined,
      contPhone : undefined,
      active : undefined,
      crtBy : undefined,
      crtDate : undefined,
      modby : undefined,
      modDate : undefined,
      vendTypeID : undefined,
      vendTypeName : undefined,
      email : undefined,
      isEmail : undefined,
      taxNo : undefined,
      taxValue : undefined
    };
  }
}






