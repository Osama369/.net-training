import { HttpClient } from '@angular/common/http';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LocationService } from 'src/app/Administration/Services/location.service';
import { CustomersService } from 'src/app/Manage/Services/customers.service';
import { VendorService } from 'src/app/Manage/Services/vendor.service';
import { Vendor } from 'src/app/Manage/Models/vendor';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { ReportService } from '../../Services/report.service';
import { Location } from './../../../Administration/Models/location';
import { SharedDataService } from 'src/app/Shared/Services/shared-data.service';

@Component({
  selector: 'app-tax-report-by-supplier',
  templateUrl: './tax-report-by-supplier.component.html',
  styleUrls: ['./tax-report-by-supplier.component.css']
})
export class TaxReportBySupplierComponent {
  constructor(
    private authService : AuthService,
    public bookmarkService: BookmarkService,
    public route : ActivatedRoute,
    private sharedDataService:SharedDataService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private locationService:LocationService,
    private datePipe: DatePipe,
    private reportService: ReportService){}

  Vendor: Vendor[];
  SelectedVendor:any;
  vendorlist: Vendor[];
  FilterVendorlist: Vendor[];
  SelectedType:any;
  FilterTypelist: any;
  @ViewChildren('inputField') inputFields: QueryList<any>;
  DateFrom :any;
  DateTo :any;
  pdfUrl: SafeResourceUrl;

  allowBtn: boolean = false;
  cols:any []= [];
  data:any[];
  bookmark : boolean = false;
  selectedLocation:any;
  LocationList : Location[];
  locations : Location[];

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
   {
    name:'Journal Voucher',
    value: 8
   }
  ];

  ngOnInit(): void {
    let today = new Date();
    this.DateFrom = new Date(today.getFullYear(), today.getMonth(), 1);
    this.DateTo = today;
    this.SelectedType = {name:this.type[0].name,value:this.type[0].value};


    this.sharedDataService.getVendors$().subscribe({
      next: (Vendor) => {
        this.Vendor = [...(Vendor as { [key: string]: any })["enttityDataSource"]];
        this.Vendor.unshift({
          vendID : 0,
          vendName : "---ALL---",
          }
    );


    this.SelectedVendor = {vendID:  0, vendName: '---ALL---'};
      },
      error: (response) => {
        console.log(response);
      },
    });

    this.sharedDataService.getLocations$().subscribe({
      next : (loc:any)=>{
        this.locations = loc.filter(x=>x.LocTypeId == 5);
          this.locations.unshift({
            LocationId : 0,
            LocationName : "---ALL---"
            }
          );
        this.selectedLocation = {LocationId : this.locations[0].LocationId, LocationName : this.locations[0].LocationName};
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


  filterVendor(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.Vendor.length; i++) {
      let product = this.Vendor[i];
      if (product.vendName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(product);
      }
    }
    this.FilterVendorlist = filtered;
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

    this.reportService.runReportWith4Para("TaxReportBySupplier",d1,d2,0,this.SelectedVendor.vendID,this.selectedLocation.LocationId).subscribe(data => {
      
      this.data = (data as { [key: string]: any })["enttityDataSource"];
      this.cols = (data as { [key: string]: any })["entityModel"];
      console.log(this.data);
      this.allowBtn = true;
    });
  }
}






