import { Vendor } from './../../../models/vendor';
import { HttpClient } from '@angular/common/http';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { CustomersService } from 'src/app/services/customers.service';
import { Customer } from 'src/app/models/customer';
import { ProductsService } from 'src/app/services/products.service';
import { GenericService } from 'src/app/services/generic.service';
import { VendorService } from 'src/app/services/vendor.service';
import { ReportService } from 'src/app/services/report.service';
import { Location } from 'src/app/models/location';
import { LocationService } from 'src/app/services/location.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BookmarkService } from 'src/app/services/bookmark.service';

@Component({
  selector: 'app-tax-report',
  templateUrl: './tax-report.component.html',
  styleUrls: ['./tax-report.component.css']
})
export class TaxReportComponent {
  constructor(
    private authService : AuthService,
    public bookmarkService: BookmarkService,
    public route : ActivatedRoute,
    private customerService:CustomersService,
    private vendorService:VendorService,
    private http: HttpClient,
    private locationService:LocationService,
     private sanitizer: DomSanitizer,
     private datePipe: DatePipe,
     private reportService: ReportService){}

  customers: Customer[];
  SelectedCustomer:any;
  SelectedType:any;
  customerlist: Customer[];
  FilterTypelist: any;
  Filtercustomerlist: Customer[];
  @ViewChildren('inputField') inputFields: QueryList<any>;
  DateFrom :any;
  DateTo :any;
  pdfUrl: SafeResourceUrl;

  allowBtn: boolean = false;
  cols:any []= [];
  data:any[];

  selectedLocation:any;
  LocationList : Location[];
  locations : Location[];
  bookmark : boolean = false;
  type :any[] = [ {
    name:'All',
    value: 0
  },
  {
    name:'Sale Tax',
    value: 4
   },
   {
    name:'Purchase Tax',
    value: 1
   },
  ];

  ngOnInit(): void {
    let today = new Date();
    this.DateFrom = new Date(today.getFullYear(), today.getMonth(), 1);
    this.DateTo = today;
    this.SelectedType = {name:this.type[0].name,value:this.type[0].value};

    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customers = (customers as { [key: string]: any })["enttityDataSource"];;
        this.customers.unshift({
          cstID : 0,
          regionID : undefined,
          regionName : undefined,
          cityID : undefined,
          cityName : undefined,
          areasID : undefined,
          areasName : undefined,
          cstCode : undefined,
          cstName : "---ALL---",
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
          }
    );


    this.SelectedCustomer = {cstID:  0, cstName: '---ALL---'};
      },
      error: (response) => {
        console.log(response);
      },
    });


    this.vendorService.getAllVendor().subscribe({
      next: (Vendor) => {
        let list = (Vendor as { [key: string]: any })["enttityDataSource"];
        list.forEach((elem: any) => {
          this.customers.push({cstID:elem.vendID,cstName:elem.vendName});
        });
      }
    });

    this.locationService.getAllLoc().subscribe({
      next : (loc:any)=>{
        this.locations = loc;
    	this.locations.unshift({
          locID : 0,
          locName : "---ALL---"
          }
        );
        this.selectedLocation = {locID : this.locations[0].locID, locName : this.locations[0].locName}
      }
    })

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


  filterType(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.type.length; i++) {
      let product = this.type[i];
      if (product.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(product);
      }
    }
    this.FilterTypelist = filtered;
  }


  filterCustomer(event:any) {
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

  filterLocation(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.locations.length; i++) {
      let loc = this.locations[i];
      if (loc.locName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(loc);
      }
    }
    this.LocationList = filtered;
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

  submit()
  {
    let d1 = this.datePipe.transform(this.DateFrom, "yyyy-MM-dd");
    let d2 =  this.datePipe.transform(this.DateTo, "yyyy-MM-dd");
    this.reportService.runReportWith4Para("TaxReport",d1,d2,this.SelectedType.value,0,this.selectedLocation.locID).subscribe(data => {
      this.data = (data as { [key: string]: any })["enttityDataSource"];
      this.cols = (data as { [key: string]: any })["entityModel"];
      this.allowBtn = true;
    });
  }
}






