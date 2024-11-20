import { HttpClient } from '@angular/common/http';
import { Component, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { VendorService } from 'src/app/Manage/Services/vendor.service';
import { Vendor } from 'src/app/Manage/Models/vendor';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { ReportService } from '../../Services/report.service';
import { Location } from './../../../Administration/Models/location';
import { SharedDataService } from 'src/app/Shared/Services/shared-data.service';



@Component({
  selector: 'app-vendorledger',
  templateUrl: './vendorledger.component.html',
  styleUrls: ['./vendorledger.component.css']
})

export class VendorledgerComponent {
  products: Vendor[] = [];
  SelectedProduct:any;
  productlist: Vendor[];
  Filterproductlist: Vendor[];
  @ViewChildren('inputField') inputFields: QueryList<any>;
  DateFrom :any;
  DateTo :any;
  pdfUrl: SafeResourceUrl;
  bookmark : boolean = false;
  constructor(
    private sharedDataService:SharedDataService,
    private http: HttpClient, private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private reportService: ReportService,
    private authService : AuthService,
    public bookmarkService: BookmarkService,
    public cdr: ChangeDetectorRef,
    public route : ActivatedRoute
    ){}

  allowBtn: boolean = false;
  cols:any []= [];
  data:any[];
  vendID : any;
  ngOnInit(): void {

    this.route.params.subscribe(params1 => {
      this.vendID = parseInt(params1['id'], 10);
   });


    let today = new Date();
    this.DateFrom = new Date(today.getFullYear(), today.getMonth(), 1);
    this.DateTo = today;

    this.sharedDataService.getVendors$().subscribe({
      next: (products) => {
        this.products  = [...(products as { [key: string]: any })["enttityDataSource"]];
        this.products.unshift(this.createNewVendor());

        this.cdr.detectChanges();
        if(this.vendID != undefined){
          const foundVendor = this.products.find((c) => c.vendID === this.vendID);
          if (foundVendor) {
            this.SelectedProduct = foundVendor;
          }

          this.submit();
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
    for (let i = 0; i < this.products.length; i++) {
      let product = this.products[i];
      if (product.vendName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(product);
      }
    }
    this.Filterproductlist = filtered;
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

    this.reportService.runReportWith3Para("VendorLedger",d1,d2,this.SelectedProduct.vendID,0).subscribe(data => {
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



