
import { HttpClient } from '@angular/common/http';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LocationService } from 'src/app/Administration/Services/location.service';
import { CustomersService } from 'src/app/Manage/Services/customers.service';
import { Customer } from 'src/app/Manage/Models/customer';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { ReportService } from '../../Services/report.service';
import { Location } from './../../../Administration/Models/location';
import { SharedDataService } from 'src/app/Shared/Services/shared-data.service';
import { Products } from 'src/app/Manage/Models/products';
import { forEach } from 'lodash';
import { Vendor } from 'src/app/Manage/Models/vendor';
import { CSECustomer } from 'src/app/Manage/Models/csecustomer';
import { CompanyCSE } from 'src/app/Manage/Models/company-cse';
import { CompanyCSEService } from 'src/app/Manage/Services/company-cse.service';


@Component({
  selector: 'app-mse-company-wise-sale',
  templateUrl: './mse-company-wise-sale.component.html',
  styleUrls: ['./mse-company-wise-sale.component.scss']
})

export class MseCompanyWiseSaleComponent {
  constructor(private authService : AuthService,
    public bookmarkService: BookmarkService,
    public companyCSEService: CompanyCSEService,
    public route : ActivatedRoute,private sharedDataService:SharedDataService, private http: HttpClient, private sanitizer: DomSanitizer, private datePipe: DatePipe,private reportService: ReportService){}
   
  customers: Customer[] = [];
  SelectedCustomer:any;
  customerlist: Customer[];
  allcseList:CompanyCSE[];
  cselist:CompanyCSE[];
  selectedCSE:any;
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
   AllproductList:Products[];
   productList:Products[];
   selectedProduct: any;
    vendorlist:Vendor[];
    selectedVendor:any;
  bookmark : boolean = false;
  ngOnInit(): void {
    let today = new Date();
    this.DateFrom = new Date(today.getFullYear(), today.getMonth(), 1);
    this.DateTo = today;
    this.sharedDataService.getVendors$().subscribe({
      next:(list)=>{
       this.vendorlist=[...(list as {[key:string]:any})["enttityDataSource"]];
        this.vendorlist.unshift({
          vendID:0, vendName:'---All---'
        });
        this.selectedVendor={vendID:0, vendName:'---All---'}
      }
      
      
    
      
    });
    console.log(this.vendorlist);
    this.companyCSEService.getAllCompanyCSE().subscribe(list=>{
        this.allcseList=[...(list as {[key:string]:any})['enttityDataSource']];
        this.cselist= this.allcseList;
        this.cselist.unshift({
        CSEID:0, RepName:'---All---'});
       
        this.selectedCSE={CSEID:0,RepName:'---All---'};

    });
    console.log(`cseList : ${this.cselist}`);
    this.sharedDataService.getCustomers$().subscribe({
      next: (customers) => {
        this.customers = [...(customers as { [key: string]: any })["enttityDataSource"]];
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
          taxValue : undefined   ,
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


    this.sharedDataService.getProducts$().subscribe((us:any)=>{

        this.AllproductList= [...(us as {[key: string]: any})['enttityDataSource']];
        this.productList= this.AllproductList;
        this.productList.unshift({
          prodID:0,
          prodName:"---All---"
        });
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
  getIdsFromSelectedProducts(): string{

    return this.selectedProduct.map(x=>x.prodID).join(',');
  }
  private focusOnComplexInput(index: number) {
    const inputFieldARRAY = this.inputFields.toArray();
    const check = inputFieldARRAY[index-1].el.nativeElement.tagName;
    const inputField = inputFieldARRAY[index].el.nativeElement.querySelector('input');
      inputField.focus();
      inputField.select();
  }

onVendorChange(){
   
    this.productList = this.AllproductList.filter((x)=>x.vendID===this.selectedVendor.vendID);
    this.productList.unshift({
      prodID:0,
      prodName:"---All---"
    });
    this.selectedProduct={prodID:0, prodName:'---All---'}
  
    this.cselist= this.allcseList.filter(x=>x.vendID===this.selectedVendor.vendID);
    this.cselist.unshift({
      CSEID:0, RepName:'---All---'
    });
    this.selectedCSE={vendID:0, vendName:'---All---'}
  console.log(`product list ${this.productList}`)
}

  submit()
  {

    let d1 = this.datePipe.transform(this.DateFrom, "yyyy-MM-dd");
    let d2 =  this.datePipe.transform(this.DateTo, "yyyy-MM-dd");
 
  
    this.reportService.runReportWith5Para("MSECompanyWiseSale",d1,d2,this.selectedVendor.vendID, this.selectedCSE.CSEID ,this.selectedProduct.prodID,this.selectedLocation.LocationId).subscribe(data => {
      this.data = (data as { [key: string]: any })["enttityDataSource"];
      this.cols = (data as { [key: string]: any })["entityModel"];
      this.allowBtn = true;
    });
  }


}


