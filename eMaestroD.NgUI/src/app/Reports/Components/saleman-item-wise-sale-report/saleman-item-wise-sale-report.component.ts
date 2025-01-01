import { HttpClient } from '@angular/common/http';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { ReportService } from '../../Services/report.service';
import { Vendor } from 'src/app/Manage/Models/vendor';

import { SharedDataService } from 'src/app/Shared/Services/shared-data.service';
import { Users } from 'src/app/Administration/Models/users';
import { Products } from 'src/app/Manage/Models/products';
import { UserService } from 'src/app/Administration/Services/user.service';
import { ProductsService } from 'src/app/Manage/Services/products.service';


@Component({
  selector: 'app-saleman-item-wise-sale-report',
  templateUrl: './saleman-item-wise-sale-report.component.html',
  styleUrls: ['./saleman-item-wise-sale-report.component.scss']
})

export class SalemanItemWiseSaleReportComponent {
  constructor(
    private authService : AuthService,
    public bookmarkService: BookmarkService,
    public route : ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private sharedDataService: SharedDataService,
    private datePipe: DatePipe,
    private reportService: ReportService,
    private userService:UserService,
 
  
  ) {}

  @ViewChildren('inputField') inputFields: QueryList<any>;
  DateFrom: any;
  DateTo: any;
  vendID: any;
  pdfUrl: SafeResourceUrl;

  allowBtn: boolean = false;
  cols: any[] = [];
  data: any[];
  Vendor: Vendor[];
  SelectedVendor: any;
  selectedUser:any;
  FilteredUserList:any;
  datalist :any;
  userList : Users[];

SelectedProduct:any;
  productlist: Products[];
  allProductlist: Products[];
  Filterproductlist: Products[];
  products: Products[] = [];

  bookmark: boolean = false;

  ngOnInit(): void {
    let today = new Date();
    this.DateFrom = new Date(today.getFullYear(), today.getMonth(), 1);
    this.DateTo = today;
    this.vendID = "434";

    this.authService.GetBookmarkScreen(this.route.snapshot?.data['requiredPermission']).subscribe(x => {
      this.bookmark = x;
    });

    this.sharedDataService.getVendors$().subscribe({
      next: (Vendor) => {
        this.Vendor = [...(Vendor as { [key: string]: any })["enttityDataSource"]];
        this.Vendor.unshift({
          vendID: 0,
          vendName: "---ALL---",
        });
        this.SelectedVendor = { vendID: 0, vendName: '---ALL---' };
      },
      error: (response) => {
        console.log(response);
      },
    });
    this.roleOnChange(7);
    this.LoadProducts()
  }
  LoadProducts()
  {
    this.productlist = undefined;
    this.SelectedProduct = [];
    this.sharedDataService.getProducts$().subscribe((us:any)=>{
      this.productlist = [...(us as { [key: string]: any })["enttityDataSource"]];

      this.productlist.unshift({
          prodBCID : 0,
          prodID : 0,
          prodName : "---ALL---"
        });
    })
    
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


  filterUserlist(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    console.log(this.userList);
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.userList.length; i++) {
      let p = this.userList[i];
      console.log(p.UserName);
      if (p.UserName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(p);
      }
    }
    this.FilteredUserList = filtered;
  }
  
  UpdateBookmark(value: any) {
    this.bookmarkService.Updatebookmark(this.route.snapshot.data['requiredPermission'], value).subscribe({
      next: (result: any) => {
        this.bookmark = value;
      },
    });
  }

  onEnterComplex(index: number) {
    if (index < this.inputFields.length - 1) {
      this.focusOnComplexInput(index + 1);
    }
  }

  private focusOnComplexInput(index: number) {
    const inputFieldARRAY = this.inputFields.toArray();
    const check = inputFieldARRAY[index - 1].el.nativeElement.tagName;
    const inputField = inputFieldARRAY[index].el.nativeElement.querySelector('input');
    inputField.focus();
    inputField.select();
  }
 roleOnChange(roleID : any)
  {
    this.datalist = undefined;
    this.selectedUser = [];
    this.userService.getAllUsers().subscribe((us:any)=>{
      this.userList = us;
      this.userList = this.userList.filter(x=>x.RoleID == roleID);
      this.userList.unshift({
        UserID : 0,
        UserName : "---ALL---"});
    })
   // this.selectedUser= this.userList[0].UserID;
  }
  submit() {
    let d1 = this.datePipe.transform(this.DateFrom, "yyyy-MM-dd");
    let d2 = this.datePipe.transform(this.DateTo, "yyyy-MM-dd");

    this.reportService.runReportWith4Para("SalemanItemWiseSaleReport", d1, d2,this.selectedUser.UserID,this.SelectedProduct.prodID,0).subscribe(data => {
      this.data = (data as { [key: string]: any })["enttityDataSource"];
      this.cols = (data as { [key: string]: any })["entityModel"];
      this.allowBtn = true;
    });
  }
}







