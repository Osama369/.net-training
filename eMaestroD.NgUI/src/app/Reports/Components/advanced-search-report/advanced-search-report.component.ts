import { HttpClient } from '@angular/common/http';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Products } from 'src/app/Manage/Models/products';
import { CustomersService } from 'src/app/Manage/Services/customers.service';
import { ProductsService } from 'src/app/Manage/Services/products.service';
import { VendorService } from 'src/app/Manage/Services/vendor.service';
import { Customer } from 'src/app/Manage/Models/customer';
import { Vendor } from 'src/app/Manage/Models/vendor';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { ReportService } from '../../Services/report.service';
import { SharedDataService } from 'src/app/Shared/Services/shared-data.service';



@Component({
  selector: 'app-advanced-search-report',
  templateUrl: './advanced-search-report.component.html',
  styleUrls: ['./advanced-search-report.component.scss']
})

export class AdvancedSearchReportComponent {
  vendors: Vendor[] = [];
  Selectedvendor:any;
  vendorlist: Vendor[];
  Filtervendorlist: Vendor[];
  @ViewChildren('inputField') inputFields: QueryList<any>;
  DateFrom :any;
  DateTo :any;
  pdfUrl: SafeResourceUrl;

  customers: Customer[] = [];
  SelectedCustomer:any;
  customerlist: Customer[];
  Filtercustomerlist: Customer[];

  products: Products[] = [];
  SelectedProduct:any;
  productlist: Products[];
  Filterproductlist: Products[];

  constructor(
    private authService : AuthService,
    public bookmarkService: BookmarkService,
    public route : ActivatedRoute,
    private sharedDataService : SharedDataService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private reportService: ReportService
    ){}

  allowBtn: boolean = false;
  cols:any []= [];
  data:any[];
  bookmark : boolean = false;
  ngOnInit(): void {
    let today = new Date();
    this.DateFrom = new Date(today.getFullYear(), today.getMonth(), 1);
    this.DateTo = today;

    this.sharedDataService.getVendors$().subscribe({
      next: (vendors) => {
        this.vendors = [...(vendors as { [key: string]: any })["enttityDataSource"]];
        this.vendors.unshift(this.createNewVendor());
        this.Selectedvendor = {vendID:  0, vendName: '---ALL---'};
      },
      error: (response) => {
        console.log(response);
      },
    });


    this.sharedDataService.getCustomers$().subscribe({
      next: (customers) => {
        this.customers = [...(customers as { [key: string]: any })["enttityDataSource"]];
        this.customers.unshift({
          cstID : 0,
          cstName : "---ALL---",
          }
    );
    this.SelectedCustomer = {cstID:  0, cstName: '---ALL---'};
      },
      error: (response) => {
        console.log(response);
      },
    });

    this.sharedDataService.getProducts$().subscribe({
      next: (products) => {
        console.log(products);
        this.products = [...(products as { [key: string]: any })["enttityDataSource"]];
        console.log(this.products);
        this.products.unshift({
            prodName : "---ALL---",
            prodBCID : 0
          }
    );
    this.SelectedProduct = {prodBCID:  0, prodName: '---ALL---'};
      },
      error: (response:any) => {
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


  filtervendor(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.vendors.length; i++) {
      let vendor = this.vendors[i];
      if (vendor.vendName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(vendor);
      }
    }
    this.Filtervendorlist = filtered;
  }

  filterCustomer(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.customers.length; i++) {
      let cst = this.customers[i];
      if (cst.cstName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(cst);
      }
    }
    this.Filtercustomerlist = filtered;
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

    this.reportService.runReportWith5Para("AdvancedSearch",d1,d2,this.SelectedCustomer.cstID,this.Selectedvendor.vendID,this.SelectedProduct.prodBCID,0).subscribe(data => {
      this.data = (data as { [key: string]: any })["enttityDataSource"];
      this.cols = (data as { [key: string]: any })["entityModel"];
      this.allowBtn = true;
    });
  }

  createNewVendor() {
    return {
      vendID : 0,
      vendName : "---ALL---",
    };
  }
}



