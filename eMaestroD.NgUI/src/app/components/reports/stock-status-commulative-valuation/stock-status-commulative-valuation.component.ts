import { HttpClient } from '@angular/common/http';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ReportService } from 'src/app/services/report.service';
import { Location } from 'src/app/models/location';
import { LocationService } from 'src/app/services/location.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BookmarkService } from 'src/app/services/bookmark.service';
import { prodGroups } from 'src/app/models/prodGroups';
import { ProductCategoryService } from 'src/app/services/product-category.service';

@Component({
  selector: 'app-stock-status-commulative-valuation',
  templateUrl: './stock-status-commulative-valuation.component.html',
  styleUrls: ['./stock-status-commulative-valuation.component.css']
})
export class StockStatusCommulativeValuationComponent {
  constructor(private authService : AuthService,
    public bookmarkService: BookmarkService,
    public route : ActivatedRoute,private http: HttpClient,private productCategoryService : ProductCategoryService ,private locationService:LocationService, private sanitizer: DomSanitizer, private datePipe: DatePipe,private reportService: ReportService){}

  @ViewChildren('inputField') inputFields: QueryList<any>;
  DateFrom :any;
  DateTo :any;
  pdfUrl: SafeResourceUrl;

  allowBtn: boolean = false;
  cols:any []= [];
  data:any[];

  productGrouplist: prodGroups[];
  FilterProductGrouplist: prodGroups[];
  SelectedproductGrouplist: any;

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

  filterProductCategory(event: any) {
    // In a real application, make a request to a remote URL with the query and return filtered results. For demo, we filter at the client-side.
    const filtered: any[] = [];
    const query = event.query.toLowerCase().trim();
    for (const product of this.productGrouplist) {
      if (product.prodGrpName.toLowerCase().includes(query)) {
        filtered.push(product);
      }
    }
    this.FilterProductGrouplist = filtered;
  }


  submit()
  {

    let d1 = this.datePipe.transform('1900-01-01', "yyyy-MM-dd");
    let d2 =  this.datePipe.transform(this.DateTo, "yyyy-MM-dd");

    this.reportService.runReportWith2Para("StockStatusCumulativeValuation",d1,d2,this.selectedLocation.locID, this.SelectedproductGrouplist.prodGrpID).subscribe(data => {
      this.data = (data as { [key: string]: any })["enttityDataSource"];
      this.cols = (data as { [key: string]: any })["entityModel"];
      this.allowBtn = true;
    });
  }
}
