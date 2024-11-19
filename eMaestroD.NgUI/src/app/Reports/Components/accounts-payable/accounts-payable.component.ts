import { HttpClient } from '@angular/common/http';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Vendor } from 'src/app/Manage/Models/vendor';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { ReportService } from '../../Services/report.service';
import { SharedDataService } from 'src/app/Shared/Services/shared-data.service';


@Component({
  selector: 'app-accounts-payable',
  templateUrl: './accounts-payable.component.html',
  styleUrls: ['./accounts-payable.component.scss']
})

export class AccountsPayableComponent {
  vendors: Vendor[] = [];
  SelectedProduct:any;
  productlist: Vendor[];
  Filterproductlist: Vendor[];
  @ViewChildren('inputField') inputFields: QueryList<any>;
  DateFrom :any;
  DateTo :any;
  pdfUrl: SafeResourceUrl;
  bookmark : boolean = false;

  constructor(private sharedDataService : SharedDataService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private reportService: ReportService,
    private authService : AuthService,
    public bookmarkService: BookmarkService,
    public route : ActivatedRoute
      ){}

  allowBtn: boolean = false;
  cols:any []= [];
  data:any[];

  ngOnInit(): void {
    let today = new Date();
    this.DateFrom = new Date(today.getFullYear(), today.getMonth(), 1);
    this.DateTo = today;

    this.sharedDataService.getVendors$().subscribe({
      next: (vendors) => {
        this.vendors = [...(vendors as { [key: string]: any })["enttityDataSource"]];
        console.log(this.vendors);
          this.vendors.unshift(this.createNewVendor());
        console.log(this.vendors);
        this.SelectedProduct = {vendID:  0, vendName: '---ALL---'};
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
    for (let i = 0; i < this.vendors.length; i++) {
      let product = this.vendors[i];
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

    this.reportService.runReportWith3Para("AccountPayable",d1,d2,this.SelectedProduct.vendID,0).subscribe(data => {
      this.data = (data as { [key: string]: any })["enttityDataSource"];
      this.cols = (data as { [key: string]: any })["entityModel"];
      this.allowBtn = true;
    });
  }

  createNewVendor() {
    return {
      vendID : 0,
      vendName : "---ALL---",
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



