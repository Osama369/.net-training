import { filter } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ProductsService } from 'src/app/services/products.service';
import { Products } from 'src/app/models/products';
import { COA } from 'src/app/models/COA';
import { GenericService } from 'src/app/services/generic.service';
import { ReportService } from 'src/app/services/report.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BookmarkService } from 'src/app/services/bookmark.service';


@Component({
  selector: 'app-generalledger',
  templateUrl: './generalledger.component.html',
  styleUrls: ['./generalledger.component.css']
})

export class GeneralledgerComponent {
  constructor(private authService : AuthService,
    public bookmarkService: BookmarkService,
    public route : ActivatedRoute,
    private productService:ProductsService,
    private genericService : GenericService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private reportService: ReportService
    ){}

  allowBtn: boolean = false;
  cols:any []= [];
  data:any[];
  products: COA[] = [];
  SelectedProduct:any;
  productlist: COA[];
  Filterproductlist: COA[];
  @ViewChildren('inputField') inputFields: QueryList<any>;
  DateFrom :any;
  DateTo :any;
  pdfUrl: SafeResourceUrl;
  bookmark : boolean = false;
  ngOnInit(): void {
    let today = new Date();
    this.DateFrom = new Date(today.getFullYear(), today.getMonth(), 1);
    this.DateTo = today;

    this.genericService.getAllCOAWithoutTradeDebtors().subscribe({
      next: (COA) => {
        this.products = COA.filter(x=> (x.parentCOAID != 25 && x.parentCOAID != 83) && (x.COAlevel == 3 || x.COAlevel == 4) );
        this.products.unshift({
          COAID : -11,
          parentCOAID : -11,
          acctName : "---Select Account---",
          parentAcctType : undefined
          }
    );
    this.SelectedProduct = {COAID:  -11, acctName: "---Select Account---"};
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
      if (product.acctName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
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
    this.reportService.runReportWith3Para("GeneralLedger",d1,d2,this.SelectedProduct.COAID,0).subscribe(data => {
      this.data = (data as { [key: string]: any })["enttityDataSource"];
      this.cols = (data as { [key: string]: any })["entityModel"];
      this.allowBtn = true;
    });
  }
}


