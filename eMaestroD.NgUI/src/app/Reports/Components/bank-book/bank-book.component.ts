import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { COA } from 'src/app/Administration/Models/COA';
import { ProductsService } from 'src/app/Manage/Services/products.service';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { GenericService } from 'src/app/Shared/Services/generic.service';
import { ReportService } from '../../Services/report.service';


@Component({
  selector: 'app-bank-book',
  templateUrl: './bank-book.component.html',
  styleUrls: ['./bank-book.component.css']
})

export class BankBookComponent {
  products: COA[] = [];
  SelectedProduct:any;
  productlist: COA[];
  Filterproductlist: COA[];
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

    this.genericService.getAllBanks().subscribe({
      next: (banks) => {
        this.products = (banks as { [key: string]: any })["enttityDataSource"];
        this.products.unshift({
          COAID : 0,
          parentCOAID : 0,
          acctName : "---ALL---",
          parentAcctType : undefined
          }
    );
    this.SelectedProduct = {COAID:  0, acctName: "---ALL---"};
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

  constructor(
    private authService : AuthService,
    public bookmarkService: BookmarkService,
    public route : ActivatedRoute,
    private productService:ProductsService,
    private genericService : GenericService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private reportService: ReportService,
    private toastrService: ToastrService
    ){}

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
    // const apiUrl = 'https://localhost:44386/api/report/BankBook/'+d1+'/'+d2+'/'+this.SelectedProduct.COAID; // Replace with your actual API URL
    // this.http.get(apiUrl, { responseType: 'arraybuffer' }).subscribe(data => {
    //   const pdfBlob = new Blob([data], { type: 'application/pdf' });
    //   const url = URL.createObjectURL(pdfBlob);
    //   this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    // });

      this.cols = [];
      this.data = [];
      let locID = 0;
      this.reportService.runReportWith3Para("BankBook",d1,d2,this.SelectedProduct.COAID,locID).subscribe(data => {
        this.data = (data as { [key: string]: any })["enttityDataSource"];
        this.cols = (data as { [key: string]: any })["entityModel"];
        this.allowBtn = true;
      });
  }
}


