import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { prodGroups } from '../../Models/prodGroups';
import { Products } from '../../Models/products';
import { ProductCategoryService } from '../../Services/product-category.service';


@Component({
  selector: 'app-product-groups',
  templateUrl: './product-groups.component.html',
  styleUrls: ['./product-groups.component.scss']
})
export class ProductGroupsComponent {
  cols:any []= [];
  exportData:any []= [];
  productsGroup: prodGroups[];
  prdID: any;
  loading: boolean = true;
  ProductVisible: boolean = false;
  prdList : Products[];
  productgrouplist : prodGroups[];
  title :any;
  grouptitle :any;
  UploadToolVisibility : boolean = false;
  methodName : any;
  serviceName : any;
  ProductGroupVisible: boolean = false;
  isPos : boolean = localStorage.getItem("isPos") === 'true';
  label = 'Brand';


  constructor(
      private productCategoryService: ProductCategoryService,
      private router: Router,
      private confirmationService: ConfirmationService,
      private messageService: MessageService,
      private authService : AuthService,
      private ToastrService : ToastrService
      )
  { }

  ngOnInit() {
    this.label = this.isPos ? "Brand" : "Category";

    this.productCategoryService.getAllGroups().subscribe(prd => {
        this.productsGroup = (prd as { [key: string]: any })["enttityDataSource"];
        this.cols = (prd as { [key: string]: any })["entityModel"];
        this.loading = false;
    });
  }

  handleChildData(data: any) {
    if(data.type == 'add')
    {
    this.authService.checkPermission('ProductCategoryCreate').subscribe(x=>{
        if(x)
        {
          this.grouptitle = this.label+" Registration";
          this.productgrouplist = [];
          this.ProductGroupVisible = true;
        }
        else{
          this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }
    else if(data.type == 'edit')
    {

    this.authService.checkPermission('ProductCategoryEdit').subscribe(x=>{
        if(x)
        {
          this.grouptitle = this.label+" Edit";
          this.productgrouplist = data.value;
          this.ProductGroupVisible = true;
        }
        else{
          this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }

    else if(data.type == 'delete')
    {
      this.authService.checkPermission('ProductCategoryDelete').subscribe(x=>{
        if(x)
        {
          this.deleteView(data.value.prodGrpID);
        }
        else{
          this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        }
      });

    }
    else if(data.type == 'groupAdded')
    {
        this.productsGroup.push(data.value);
        this.ProductGroupVisible = false;
    }
    else
    {
        this.ProductGroupVisible = false;
    }

}

deleteView(id:any)
{
  console.log(id);
    if (confirm("Are you sure you want to delete this?") == true) {
        this.loading = true;
       this.productCategoryService.deleteGroup(id).subscribe({
        next : (value:any) => {
          this.ToastrService.success("Brand has been successfully deleted!");
          this.productsGroup = this.productsGroup.filter(item => item.prodGrpID !== id);
          },
        error:(err:any)=> {
            this.ToastrService.error(err.error);
          },
        });
    } else {
    }
}

}
