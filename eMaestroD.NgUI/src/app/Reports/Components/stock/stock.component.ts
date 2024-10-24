import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LocationService } from 'src/app/Administration/Services/location.service';
import { Products } from 'src/app/Manage/Models/products';
import { ProductCategoryService } from 'src/app/Manage/Services/product-category.service';
import { ProductsService } from 'src/app/Manage/Services/products.service';
import { prodGroups } from 'src/app/Manage/Models/prodGroups';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { ReportService } from '../../Services/report.service';
import { Location } from './../../../Administration/Models/location';
import { Vendor } from 'src/app/Manage/Models/vendor';
import { SharedDataService } from 'src/app/Shared/Services/shared-data.service';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent {
  constructor(private authService : AuthService,
    public bookmarkService: BookmarkService,
    public route : ActivatedRoute,private productService:ProductsService,
    private productCategoryService : ProductCategoryService ,private sharedDataService:SharedDataService,private http: HttpClient, private sanitizer: DomSanitizer,private reportService: ReportService){}

  SelectedProduct:any;
  productlist: Products[];
  allProductlist: Products[];
  Filterproductlist: Products[];
  products: Products[] = [];
  pdfUrl:SafeResourceUrl;

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
  Vendor: Vendor[];
  SelectedVendor:any;
  vendorlist: Vendor[];
  FilterVendorlist: Vendor[];


  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = (products as { [key: string]: any })["enttityDataSource"];
        this.allProductlist = (products as { [key: string]: any })["enttityDataSource"];
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

    this.sharedDataService.getLocations$().subscribe({
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

    this.sharedDataService.getVendors$().subscribe({
      next: (vnd) => {
        this.Vendor = (vnd as { [key: string]: any })["enttityDataSource"];;
        this.Vendor.unshift({
          vendID : 0,
          vendName : "---ALL---",
          });

          this.SelectedVendor = {vendID:  0, vendName: '---ALL---'};
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

  changeProductDropdown()
  {
    if(this.SelectedproductGrouplist.prodGrpID != 0)
    {
      this.products = this.allProductlist.filter(x=>x.prodGrpID == this.SelectedproductGrouplist.prodGrpID);
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

    }else{
      this.products = this.allProductlist;
    }
    this.SelectedProduct = {prodID:  0, prodName: '---ALL---'};

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

  submit()
  {
    this.reportService.runReportWith1Para("StockList",this.SelectedProduct.prodID,this.selectedLocation.locID, this.SelectedproductGrouplist.prodGrpID,this.SelectedVendor.vendID).subscribe(data => {
      this.data = (data as { [key: string]: any })["enttityDataSource"];
      this.cols = (data as { [key: string]: any })["entityModel"];
      this.allowBtn = true;
    });
  }
}
