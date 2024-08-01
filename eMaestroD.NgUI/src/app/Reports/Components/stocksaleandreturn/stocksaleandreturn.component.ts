import { HttpClient } from '@angular/common/http';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LocationService } from 'src/app/Administration/Services/location.service';
import { ProductCategoryService } from 'src/app/Manage/Services/product-category.service';
import { ProductsService } from 'src/app/Manage/Services/products.service';
import { prodGroups } from 'src/app/Manage/Models/prodGroups';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { ReportService } from '../../Services/report.service';
import { Location } from './../../../Administration/Models/location';


@Component({
  selector: 'app-stocksaleandreturn',
  templateUrl: './stocksaleandreturn.component.html',
  styleUrls: ['./stocksaleandreturn.component.css']
})
export class StocksaleandreturnComponent {
  constructor(private authService : AuthService,
    public bookmarkService: BookmarkService,
    public route : ActivatedRoute,private productService : ProductsService,private locationService:LocationService,private productCategoryService : ProductCategoryService,private http: HttpClient, private sanitizer: DomSanitizer, private datePipe: DatePipe,private reportService: ReportService){}

  @ViewChildren('inputField') inputFields: QueryList<any>;
  DateFrom :any;
  DateTo :any;
  productGrouplist: prodGroups[];
  FilterProductGrouplist: prodGroups[];
  SelectedproductGrouplist: any;
  pdfUrl: SafeResourceUrl;

  allowBtn: boolean = false;
  cols:any []= [];
  data:any[];
  selectedLocation:any;
  LocationList : Location[];
  locations : Location[];
  bookmark : boolean = false;

  ngOnInit(): void {
    let today = new Date();
    this.DateFrom = new Date(today.getFullYear(), today.getMonth(), 1);
    this.DateTo = today;

    this.productCategoryService.getAllGroups().subscribe({
      next: (comp) => {
        this.productGrouplist =(comp as { [key: string]: any })["enttityDataSource"];;
        this.productGrouplist.unshift({
          prodGrpID:0,
          prodGrpName:"---ALL---"
        })
        this.SelectedproductGrouplist = {prodGrpID:0,prodGrpName:"---ALL---"};
      },
      error: (response) => {
        console.log(response);
      },
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


  filterProduct(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.productGrouplist.length; i++) {
      let product = this.productGrouplist[i];
      if (product.prodGrpName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(product);
      }
    }
    this.FilterProductGrouplist = filtered;
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

  submit()
  {

    let d1 = this.datePipe.transform(this.DateFrom, "yyyy-MM-dd");
    let d2 =  this.datePipe.transform(this.DateTo, "yyyy-MM-dd");

    this.reportService.runReportWith3Para("StockSaleAndReturn",d1,d2,this.SelectedproductGrouplist.prodGrpID,this.selectedLocation.locID).subscribe(data => {
      this.data = (data as { [key: string]: any })["enttityDataSource"];
      this.cols = (data as { [key: string]: any })["entityModel"];
      this.allowBtn = true;
    });
  }
}
