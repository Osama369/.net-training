import { HttpClient } from '@angular/common/http';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LocationService } from 'src/app/Administration/Services/location.service';
import { CustomersService } from 'src/app/Manage/Services/customers.service';
import { VendorService } from 'src/app/Manage/Services/vendor.service';
import { Vendor } from 'src/app/Manage/Models/vendor';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { ReportService } from '../../Services/report.service';
import { Location } from './../../../Administration/Models/location';
import { SharedDataService } from 'src/app/Shared/Services/shared-data.service';
import { prodGroups } from 'src/app/Manage/Models/prodGroups';
import { ProductCategoryService } from 'src/app/Manage/Services/product-category.service';
import { Products } from 'src/app/Manage/Models/products';
import { InvoicesService } from 'src/app/Invoices/Services/invoices.service';
import { Invoice } from 'src/app/Invoices/Models/invoice';
import { GLTxTypes } from 'src/app/Invoices/Enum/GLTxTypes.enum';

@Component({
  selector: 'app-purchase-grn-orde-reportr',
  templateUrl: './purchase-grn-orde-reportr.component.html',
  styleUrls: ['./purchase-grn-orde-reportr.component.scss']
})
export class PurchaseGrnOrdeReportrComponent {
  constructor(
    private authService : AuthService,
    public bookmarkService: BookmarkService,
    public route : ActivatedRoute,
    private sharedDataService:SharedDataService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private locationService:LocationService,
    private datePipe: DatePipe,
    private productCategoryService : ProductCategoryService,
    private reportService: ReportService,
    private voucherService: InvoicesService
  ){

    }
   

  Vendor: Vendor[];
  SelectedVendor:any;
  vendorlist: Vendor[];
  FilterVendorlist: Vendor[];
  SelectedType:any;
  FilterTypelist: any;
  SelectedProduct:any;
  productlist: Products[];
  allProductlist: Products[];
  Filterproductlist: Products[];
  products: Products[] = [];
  
txTypeIDList:any[]=[];
txtypeSelected:any;


vTolist:Invoice[];
vToSelected:any;


  selectedLocation:any;
  locationlist: Location[];
  allLocations: Location[];
  FilterLocationslist: Location[];
  Locations: Location[] = [];

  @ViewChildren('inputField') inputFields: QueryList<any>;
  DateFrom :any;
  DateTo :any;
  pdfUrl: SafeResourceUrl;

  allowBtn: boolean = false;
  cols:any []= [];
  data:any[];
  bookmark : boolean = false;
  
  LocationList : Location[];
  locations : Location[];
  productGrouplist: prodGroups[];
  FilterProductGrouplist: prodGroups[];
  SelectedproductGrouplist: any;

  type :any[] = [ {
    name:'All',
    value: 0
  },
  {
    name:'Sale Tax',
    value: 4
   },
   {
    name:'Purchase Tax',
    value: 1
   },
   {
    name:'Journal Voucher',
    value: 8
   }
  ];

  ngOnInit(): void {
    let today = new Date();
    this.DateFrom = new Date(today.getFullYear(), today.getMonth(), 1);
    this.DateTo = today;
    this.SelectedType = {name:this.type[0].name,value:this.type[0].value};

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
    this.txTypeIDList.push({id:0, txTypeName:"---All----"})
    this.txTypeIDList.push({id:1, txTypeName:'Purchase Invoice'})
    this.txTypeIDList.push({id:3, txTypeName:'Purchase Order'})
    this.txTypeIDList.push({id:12, txTypeName:'Goods Received Note'})
    console.log(this.txTypeIDList);
    
    this.sharedDataService.getVendors$().subscribe({
      next: (Vendor) => {
        this.Vendor = [...(Vendor as { [key: string]: any })["enttityDataSource"]];
        this.Vendor.unshift({
          vendID : 0,
          vendName : "---ALL---",
          }
    );


    this.SelectedVendor = {vendID:  0, vendName: '---ALL---'};
      },
      error: (response) => {
        console.log(response);
      },
    });

    this.sharedDataService.getLocations$().subscribe({
      next : (loc:any)=>{
        this.locations = loc.filter(x=>x.LocTypeId == 5);
          this.locations.unshift({
            LocationId : 0,
            LocationName : "---ALL---"
            }
          );
        this.selectedLocation = {LocationId : this.locations[0].LocationId, LocationName : this.locations[0].LocationName};
      }
    })


    this.authService.GetBookmarkScreen(this.route.snapshot?.data['requiredPermission']).subscribe(x=>{
      this.bookmark = x;
  });
  this.LoadLocations()
}

LoadLocations()
  {
    this.locationlist = undefined;
    this.selectedLocation = [];
    this.sharedDataService.getLocations$().subscribe((us:any)=>{
      this.locationlist = us;
      this.locationlist= this.locationlist.filter(x=>x.LocTypeId==5);
      this.locationlist.unshift({
          
          LocationId : 0,
          LocationName : "---ALL---"});
     })
    
  }

  filterLocation(event: any) {
    // In a real application, make a request to a remote URL with the query and return filtered results. For demo, we filter at the client-side.
    const filtered: any[] = [];
    const query = event.query.toLowerCase().trim();
    for (const location of this.Locations) {
      if (location.LocationName.toLowerCase().includes(query)) {
        filtered.push(location);
      }
    }
    this.FilterLocationslist = filtered;
  }
        UpdateBookmark(value:any){
  this.bookmarkService.Updatebookmark(this.route.snapshot.data['requiredPermission'],value).subscribe({
    next: (result: any) => {
      this.bookmark = value;
    },
  });;
}



  filterType(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.type.length; i++) {
      let product = this.type[i];
      if (product.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(product);
      }
    }
    this.FilterTypelist = filtered;
  }


  filterVendor(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.Vendor.length; i++) {
      let product = this.Vendor[i];
      if (product.vendName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(product);
      }
    }
    this.FilterVendorlist = filtered;
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

//  onToDateChange(event: any):void{


  
//   if(this.DateFrom != undefined && this.DateTo!=undefined)
//     {
      
//     console.log()
//     this.voucherService.GetInvoices(GLTxTypes.SaleInvoice,0).subscribe({
//       next:(list=>{
//         console.log(list);
//         console.log(this.DateFrom)
      
//       this.vFromlist= list.filter((x)=> new Date(x.invoiceDate)>= new Date(this.DateFrom) &&  new Date(x.invoiceDate)<=new Date(this.DateTo))
//       this.vTolist= this.vFromlist;
//       this.vToSelected= this.vTolist.length > 0 ? this.vTolist[this.vTolist.length-1]: null;
//      console.log(this.vFromlist)

//       })

//     })
//   }


// }

  changeProductDropdown()
  {
    if(this.SelectedproductGrouplist.prodGrpID != 0)
    {
      this.products = this.allProductlist.filter(x=>x.prodGrpID == this.SelectedproductGrouplist.prodGrpID);
      this.products.unshift({
        prodBCID : 0,
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
    this.SelectedProduct = {prodBCID:  0, prodName: '---ALL---'};

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
    let d1 = this.datePipe.transform(this.DateFrom, "yyyy-MM-dd");
    let d2 =  this.datePipe.transform(this.DateTo, "yyyy-MM-dd");
                                                              // para1:any, para2:any, para3:any, para4:any, para5:any,locID:any) 
    this.reportService.runReportWith4Para("PurchaseOrderGRN",d1,d2,this.txtypeSelected.id, this.SelectedVendor.vendID,this.selectedLocation.LocationId).subscribe(data => {
      this.data = (data as { [key: string]: any })["enttityDataSource"];
      this.cols = (data as { [key: string]: any })["entityModel"];
      this.allowBtn = true;
    });
  }
}






