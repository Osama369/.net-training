import { Toast, ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { empty } from 'rxjs';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { Products } from '../../Models/products';
import { ProductsService } from '../../Services/products.service';
import { prodGroups } from '../../Models/prodGroups';
import { SharedDataService } from 'src/app/Shared/Services/shared-data.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers:[ConfirmationService,MessageService]
})

export class ProductsComponent implements OnInit {
    cols:any []= [];
    exportData:any []= [];
    products: Products[];
    prdID: any;
    loading: boolean = true;
    ProductVisible: boolean = false;
    prdList : Products[];
    productgrouplist : prodGroups[];
    ProductGroupVisible: boolean = false;
    grouptitle :any;
    title :any;
    UploadToolVisibility : boolean = false;
    methodName : any;
    serviceName : any;
    catBool : boolean = true;

    constructor(
        private productService: ProductsService,
        private sharedDataResolver: SharedDataService,
        private router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private authService : AuthService,
        private ToastrService : ToastrService,
        private cdr : ChangeDetectorRef
        )
    { }
    ngOnInit() {
        this.sharedDataResolver.getProducts$().subscribe(prd => {
            this.products = (prd as { [key: string]: any })["enttityDataSource"];
            if(this.products[0].prodID == 0)
            {
              this.products = [];
            }
            this.cols = (prd as { [key: string]: any })["entityModel"];

          
            this.loading = false;
        });
    }

   
    handleChildData(data: any) {
      console.log(data)
        if(data.type == 'add')
        {
        this.authService.checkPermission('ProductsCreate').subscribe(x=>{
            if(x)
            {
              //this.title = "Product Registration";
              //this.prdList = [];
              //this.ProductVisible = true;
              this.router.navigateByUrl('/Manage/AddProduct');
            }
            else{
              this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
            }
          });
        }
        else if(data.type == 'edit')
        {

        this.authService.checkPermission('ProductsEdit').subscribe(x=>{
            if(x)
            {
              // this.title = "Product Edit";
              // this.prdList = data.value;
              // this.ProductVisible = true;
              this.router.navigateByUrl('/Manage/AddProduct/'+data.value.prodID);
            }
            else{
              this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
            }
          });
        }
        else if(data.type == 'added')
        {
            this.products.push(data.value);
            this.ProductVisible = false;
        }
        else if(data.type == 'delete')
        {
          this.authService.checkPermission('ProductsDelete').subscribe(x=>{
            if(x)
            {
              this.deleteView(data.value.prodID);
            }
            else{
              this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
            }
          });

        }
        else if(data.type == 'openGroup')
        {
            this.grouptitle = "Product Category Registration";
            this.ProductGroupVisible = true;
        }
        else if(data.type == 'groupAdded')
        {
            this.productgrouplist = data.value;
            this.ProductGroupVisible = false;
        }
        else if(data.type == 'closeGroup')
        {
            this.ProductGroupVisible = false;
        }
        else
        {
          const index = this.products.findIndex(product => product.prodID === data.value.prodID);

          if (index !== -1) {
              // Replace the existing product with the new data
              this.products[index] = data.value;
          }

          this.ProductVisible = false; // Hide the product input form
        }
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
      this.authService.checkPermission('ProductsCreate').subscribe(x=>{
        if(x)
        {
          this.UploadToolVisibility = data;
          this.exportData = [{
              "CATEGORY":"Any Category Name",
              "CODE":  "0",
              "NAME": "Any Name",
              "TYPE": "Goods",
              "UNIT": "pcs",
              "PURCHASE RATE": 0,
              "SELL RATE": 0,
              "MIN QTY":0,
              "MAX QTY":0,
              "OPENING STOCK": 0
              // companyName: localStorage.getItem('comName')
              }
            ]
          this.serviceName = "ProductService";
          this.methodName = "uploadProducts";
          this.catBool = true;
        }
        else{
          this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        }
      });

    }

    getInsertedRows(data:any)
    {
        if(this.products != undefined)
        {
          data.forEach((elem: any) => {
            this.products.push(elem);
          });
        }
        this.UploadToolVisibility = !this.UploadToolVisibility;
    }
}
