import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CoaService } from 'src/app/Administration/Services/coa.service';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { CategoryService } from '../../Services/category.service';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
  cols:any []= [];
  exportData:any []= [];
  data: any[] = [];
  prdID: any;
  loading: boolean = true;
  ProductVisible: boolean = false;
  dataList : any[];
  title :any;
  grouptitle :any;
  UploadToolVisibility : boolean = false;
  methodName : any;
  serviceName : any;
  DailogVisible: boolean = false;

  constructor(
      private categoryService: CategoryService,
      private authService : AuthService,
      private ToastrService : ToastrService
      )
  { }

  ngOnInit() {
    this.categoryService.getAllCategories().subscribe(result => {
      this.data = (result as { [key: string]: any })["enttityDataSource"];
      this.cols = (result as { [key: string]: any })["entityModel"];
      this.loading = false;
    });
  }

  handleChildData(data: any) {
    if(data.type == 'add')
    {
    this.authService.checkPermission('CategoryCreate').subscribe(x=>{
        if(x)
        {
          this.grouptitle = "Category Registration";
          this.dataList = [];
          this.DailogVisible = true;
        }
        else{
          this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }
    else if(data.type == 'edit')
    {

    this.authService.checkPermission('CategoryEdit').subscribe(x=>{
        if(x)
        {
          this.grouptitle = "Category Edit";
          this.dataList = data.value;
          this.DailogVisible = true;
        }
        else{
          this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }

    else if(data.type == 'delete')
    {
      this.authService.checkPermission('CategoryDelete').subscribe(x=>{
        if(x)
        {
          this.deleteView(data.value.categoryID);
        }
        else{
          this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }
    else if(data.type == 'added')
    {
        this.data.push(data.value);
        this.DailogVisible = false;
    }
    else
    {
        this.DailogVisible = false;
    }

}

deleteView(id:any)
{
    if (confirm("Are you sure you want to delete this Category?") == true) {
        this.loading = true;
       this.categoryService.deleteCategory(id).subscribe({
        next : (value:any) => {
          this.ToastrService.success("Category has been successfully deleted!");
          this.data = this.data.filter(item => item.categoryID !== id);
          },
        error:(err:any)=> {
            this.ToastrService.error(err.error);
          },
        });
    } else {
    }
}

}
