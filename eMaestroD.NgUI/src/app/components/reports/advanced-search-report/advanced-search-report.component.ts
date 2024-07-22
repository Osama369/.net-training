import { HttpClient } from '@angular/common/http';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { Companies } from 'src/app/models/companies';
import { Vendor } from 'src/app/models/vendor';
import { VendorService } from 'src/app/services/vendor.service';
import { ReportService } from 'src/app/services/report.service';
import { Customer } from 'src/app/models/customer';
import { CustomersService } from 'src/app/services/customers.service';
import { ProductsService } from 'src/app/services/products.service';
import { Products } from 'src/app/models/products';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BookmarkService } from 'src/app/services/bookmark.service';


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
    private vendorService:VendorService,
    private customerService:CustomersService,
    private productService:ProductsService,
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

    this.vendorService.getAllVendor().subscribe({
      next: (vendors) => {
        this.vendors = (vendors as { [key: string]: any })["enttityDataSource"];;
        this.vendors.unshift(this.createNewVendor());
    this.Selectedvendor = {vendID:  0, vendName: '---ALL---'};
      },
      error: (response) => {
        console.log(response);
      },
    });


    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customers = (customers as { [key: string]: any })["enttityDataSource"];;
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
          taxValue : undefined    ,
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

    this.reportService.runReportWith5Para("AdvancedSearch",d1,d2,this.SelectedCustomer.cstID,this.Selectedvendor.vendID,this.SelectedProduct.prodID,0).subscribe(data => {
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



