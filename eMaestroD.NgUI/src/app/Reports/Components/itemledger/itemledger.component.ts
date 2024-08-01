import { HttpClient } from '@angular/common/http';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Products } from 'src/app/Manage/Models/products';
import { ProductsService } from 'src/app/Manage/Services/products.service';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { ReportService } from '../../Services/report.service';



@Component({
  selector: 'app-itemledger',
  templateUrl: './itemledger.component.html',
  styleUrls: ['./itemledger.component.css']
})

export class ItemledgerComponent {
  constructor(private authService : AuthService,
    public bookmarkService: BookmarkService,
    public route : ActivatedRoute,private productService:ProductsService,private http: HttpClient, private sanitizer: DomSanitizer, private datePipe: DatePipe,private reportService: ReportService){}

  products: Products[] = [];
  SelectedProduct:any;
  productlist: Products[];
  Filterproductlist: Products[];
  @ViewChildren('inputField') inputFields: QueryList<any>;
  DateFrom :any;
  DateTo :any;
  pdfUrl: SafeResourceUrl;

  allowBtn: boolean = false;
  cols:any []= [];
  data:any[];
  bookmark : boolean = false;
  ngOnInit(): void {
    let today = new Date();
    this.DateFrom = new Date(today.getFullYear(), today.getMonth(), 1);
    this.DateTo = today;

    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = (products as { [key: string]: any })["enttityDataSource"];
        this.products.unshift({
            prodID : 0,
            prodGrpID : undefined,
            comID : undefined,
            comName : undefined,
            prodGrpName : undefined,
            prodCode : undefined,
            shortName : undefined,
            prodName : "---ALL---",
            descr : undefined,
            prodUnit : undefined,
            unitQty : undefined,
            qty:undefined,
            tax:undefined,
            discount:undefined,
            purchRate : undefined,
            amount:undefined,
            sellRate : undefined,
            batch:undefined,
            retailprice : undefined,
            bonusQty:undefined,
            tP : undefined,
            isDiscount : false,
            isTaxable : false,
            isStore : false,
            isRaw : false,
            isBonus : false,
            minQty : undefined,
            maxQty : undefined,
            mega : true,
            active : true,
            crtBy : undefined,
            crtDate : undefined,
            modby : undefined,
            modDate : undefined,
            expirydate : undefined,
            qtyBal:undefined,
            GLID:undefined,
            TxID:undefined,
            unitPrice:undefined
          }
    );
    this.SelectedProduct = {prodID:  0, prodName: '---ALL---'};
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


filterProduct(event: any) {
  // In a real application, make a request to a remote URL with the query and return filtered results. For demo, we filter at the client-side.
  const filtered: any[] = [];
  const query = event.query.toLowerCase().trim();
  for (const product of this.products) {
    if (product.prodName.toLowerCase().includes(query)) {
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
    this.reportService.runReportWith3Para("ItemLedger",d1,d2,this.SelectedProduct.prodID,0).subscribe(data => {
      this.data = (data as { [key: string]: any })["enttityDataSource"];
      this.cols = (data as { [key: string]: any })["entityModel"];
      this.allowBtn = true;
    });
  }
}


