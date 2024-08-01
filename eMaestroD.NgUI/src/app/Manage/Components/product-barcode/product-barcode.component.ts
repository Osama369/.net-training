import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { SignalrService } from 'src/app/Shared/Services/signalr.service';
import { ProductCategoryService } from '../../Services/product-category.service';
import { ProductsService } from '../../Services/products.service';
import { prodGroups } from '../../Models/prodGroups';


@Component({
  selector: 'app-product-barcode',
  templateUrl: './product-barcode.component.html',
  styleUrls: ['./product-barcode.component.scss']
})

export class ProductBarcodeComponent implements OnInit {

    productsForFilter : any[];
    products : any[];
    title : any = "";
    loading: boolean = true;
    columns : any[] = [];
    exportColumns : any[] =[];
    selectedProducts:any[]=[];
    printView : boolean = false;
    pageSettingView : boolean = false;
    url : any;
    productGrouplist: prodGroups[];
    FilterProductGrouplist: prodGroups[];
    SelectedproductGrouplist: any;
    quantity : any = 1;
    bookmark : boolean = false;

    width:any = "80";
    height:any = "28";
    marginLeft:any = "2";
    marginRight:any = "2";
    marginTop:any = "2";
    marginBottom:any = "0";
    noOfBarcode:any = "2";

    constructor(private productService: ProductsService,
      private toastr: ToastrService,
      private router: Router,
      private authService:AuthService,
      private signalrService:SignalrService,
      private sanitizer: DomSanitizer,
      private productCategoryService : ProductCategoryService,
      public bookmarkService: BookmarkService,
      public route : ActivatedRoute
      ) { }

    ngOnInit() {

      this.productService.getAllProductsWithCategory().subscribe(prd => {
        this.products = (prd as { [key: string]: any })["enttityDataSource"];
        this.productsForFilter = (prd as { [key: string]: any })["enttityDataSource"];
        if(this.products[0].prodID == 0)
        {
          this.products = [];
        }
        this.columns = (prd as { [key: string]: any })["entityModel"];
        this.loading = false;
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

    filterCategory(event:any) {
      //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
      let filtered: any[] = [];
      let query = event.query;
      for (let i = 0; i < this.productGrouplist.length; i++) {
        let product = this.productGrouplist[i];
        if (product.prodGrpName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(product);
        }
      }
      this.FilterProductGrouplist = filtered;
    }
    CheckQty()
    {
      if(this.quantity == 0 || this.quantity == "")
      {
        this.quantity = 1;
      }
    }
    ChangeProducts()
    {
      if(this.SelectedproductGrouplist.prodGrpID != 0)
      {
        this.products = this.productsForFilter.filter(x=>x.prodGrpID == this.SelectedproductGrouplist.prodGrpID);
      }
      else{
        this.products = this.productsForFilter;
      }
    }
    checkNoOfBarcode()
    {
      if(this.noOfBarcode == 0 || this.noOfBarcode == "")
      {
        this.noOfBarcode = 1;
      }
      else if(this.noOfBarcode > 2)
      {
        this.noOfBarcode = 2;
      }
    }
    clear(table: Table) {
        table.clear();
    }

    showPageSetting()
    {
      if(this.selectedProducts.length > 0)
      {
        this.pageSettingView = true;
      }
      else
      {
        this.toastr.error("please select alteast one product.");
      }
    }

    ShowPrintView()
    {
      if(this.selectedProducts.length > 0)
      {
        this.pageSettingView = false;
        this.selectedProducts[0].comment = this.width + "/"+this.height+ "/"+this.marginTop+ "/"+this.marginLeft+ "/"+this.marginRight+ "/"+this.marginBottom+'/'+this.noOfBarcode;
        this.selectedProducts[0].unitQty = this.quantity;
        this.productService.GenerateBarcode(this.selectedProducts).subscribe(x=>{
        this.printView = true;
        console.log(x);
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(x);
        this.selectedProducts = [];
        this.quantity = 1;
      })
      }
      else
      {
        this.toastr.error("please select alteast one product.");
      }
    }

  exportExcel() {
    var date = new Date();
    var dateFormate = `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`;
    let filtercols = this.columns.filter((f) => {
      return f.isHidden == true;
    });
    let filterList = this.products;
    filterList.filter((f: { [x: string]: any; }) => {
      filtercols.map((m) => {
        delete f[m.field];
      });
    });
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(filterList);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, "ProductBarcode");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  exportPdf() {
    var date = new Date();
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default('p', 'px', 'a4');
        (doc as any).autoTable(this.exportColumns, this.products);

        doc.save('ProductBarcode.pdf');

      });
    });
  }
}
