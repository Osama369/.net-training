import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { Table } from 'primeng/table';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../../../Shared/Services/shared-data.service';
import { Product, ProductBarCodes } from '../../Models/product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  // cols:any[];
    products:any[];
    constructor(
    private sharedDataResolver: SharedDataService,
    private router: Router,
    // private confirmationService: ConfirmationService,
    // private messageService: MessageService,
    // private authService : AuthService,
    private ToastrService : ToastrService,
    private cdr : ChangeDetectorRef,
    private productService:ProductService
    )
{ }
  // constructor(private router:Router,private productService:ProductService){

  // }

// ngOnInit(): void {

// }
  // handleTool(eventDt:any){
    
  //   if(eventDt.type =='add'){
      
  //        this.router.navigateByUrl('Manage/AddProducts');
  //   }
  // }

  cols:any []= [];
  exportData:any []= [];
  exportUnitsData:any []= [];
  // products: Products[];
  prdID: any;
  loading: boolean = true;
  ProductVisible: boolean = false;
  prdList : Product[];
  ProductGroupVisible: boolean = false;
  grouptitle :any;
  title :any;
  UploadToolVisibility : boolean = false;
  methodName : any;
  serviceName : any;
  catBool : boolean = false;


  UploadDescriptionEnglish: string =
  `These columns are mandatory: Supplier Name, Category, Barcode, Product Name.` +
  `There are two sheets: one for products' main information and another for subunits.` +
  `Please provide one base quantity (Base Qty) for every product.` +
  `If you add Opening Stock, then you must provide the Purchase Rate and Sale Rate for that stock.`;

  UploadDescriptionUrdu: string =
  `یہ کالم لازمی ہیں: سپلائر کا نام، زمرہ، بارکوڈ، نام۔` +
  `دو شیٹس ہیں: ایک مصنوعات کی بنیادی معلومات کے لیے اور دوسری ذیلی یونٹس کے لیے۔` +
  `براہ کرم ہر پروڈکٹ کے لیے ایک بنیادی مقدار (Base Qty) فراہم کریں۔` +
  `اگر آپ اوپننگ اسٹاک شامل کرتے ہیں تو آپ کو اس اسٹاک کے لیے خریداری کی شرح اور فروخت کی شرح فراہم کرنا ہوگی۔`;


  ngOnInit() {
      this.productService.GetAllProducts().subscribe(prd => {
          this.products = (prd as { [key: string]: any })["enttityDataSource"];
          this.sharedDataResolver.SetProductList(this.products);
          if(this.products[0].prodID == 0)
          {
            this.products = [];
          }
          this.cols = (prd as { [key: string]: any })["entityModel"];


          this.loading = false;
      });

      // this.sharedDataResolver.GetAllProducts().subscribe(prd => {
      //     this.products = (prd as { [key: string]: any })["enttityDataSource"];
      //     if(this.products[0].prodID == 0)
      //     {
      //       this.products = [];
      //     }
      //     this.cols = (prd as { [key: string]: any })["entityModel"];


      //     this.loading = false;
      // });
  }


  handleChildData(data: any) {
    console.log(data)
      if(data.type == 'add')
      {
     
            this.router.navigateByUrl('/Manage/AddProducts');
      }     
      else if(data.type == 'edit')
      {
            this.router.navigateByUrl('/Manage/AddProducts/'+data.value.prodID);
       
      }
      else if(data.type == 'added')
      {
          this.products.push(data.value);
          this.ProductVisible = false;
      }
      else if(data.type == 'delete')
      {
        // console.log('id:',data.value.prodID);
        this.productService.deleteProduct(data.value.prodID).subscribe(x=>{
          this.products = this.products.filter(x=>x.prodID
             == data.value.prodID)
          this.sharedDataResolver.DeleteProduct(data.value);
        });
        // this.authService.checkPermission('ProductsDelete').subscribe(x=>{
        //   if(x)
        //   {
        //     this.deleteView(data.value.prodID);
        //   }
        //   else{
        //     this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        //   }
        // });

      }
      // else if(data.type == 'openGroup')
      // {
      //     this.grouptitle = "Product Category Registration";
      //     this.ProductGroupVisible = true;
      // }
      // else if(data.type == 'groupAdded')
      // {
      //     this.productgrouplist = data.value;
      //     this.ProductGroupVisible = false;
      // }
      // else if(data.type == 'closeGroup')
      // {
      //     this.ProductGroupVisible = false;
      // }
      // else
      // {
      //   const index = this.products.findIndex(product => product.prodID === data.value.prodID);

      //   if (index !== -1) {
      //       // Replace the existing product with the new data
      //       this.products[index] = data.value;
      //   }

      //   this.ProductVisible = false; // Hide the product input form
      // }
  }

  clear(table: Table) {
      table.clear();
  }


  deleteView(prdID:any)
  {
      if (confirm("Are you sure you want to delete this Product?") == true) {
          this.loading = true;
          this.productService.deleteProduct(prdID).subscribe({
            next:(result)=>{
              this.ToastrService.success("Product has been successfully deleted!");
              this.products = this.products.filter(item => item.prodID !== prdID);
            },
            error:(responce)=>{
              this.ToastrService.error(responce.error);
            }
          });
      }
  }


  handleTool(data:any)
  {
    if(data.type =='add'){
      
             this.router.navigateByUrl('Manage/AddProducts');
    }
    console.log('ret:',data);
    // this.authService.checkPermission('ProductsCreate').subscribe(x=>{
    //   if(x)
    //   {
    //     this.UploadToolVisibility = data;
    //       this.exportData = [{
    //           "SUPPLIER NAME" : "",
    //           "DEPARTMENT" : "",
    //           "CATEGORY" : "",
    //           "PRODUCT BARCODE" : "",
    //           "PRODUCT NAME" : "Any Name",
    //           "MIN QTY":0,
    //           "MAX QTY":0,
    //           "OPENING STOCK": 0,
    //           "PURCHASE RATE": 0,
    //           "SALE RATE": 0
    //           }
    //         ]
    //       this.exportUnitsData = [{
    //         "BARCODE":"",
    //         "PRODUCT NAME":"Any Name",
    //         "UNIT":  "Pack",
    //         "BASE QTY": "1"
    //         }
    //       ]
    //     this.serviceName = "ProductService";
    //     this.methodName = "uploadProducts";
    //     this.catBool = false;
    //   }
    //   else{
    //     this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
    //   }
    // });

  }

  getInsertedRows(data: any) {
    this.UploadToolVisibility = !this.UploadToolVisibility;

    // Wait for 2 to 3 seconds, then reload the page
    setTimeout(() => {
        window.location.reload();
    }, 2500); // 2500ms = 2.5 seconds
}

}
