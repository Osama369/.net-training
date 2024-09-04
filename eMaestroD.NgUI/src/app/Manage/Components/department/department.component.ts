import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CoaService } from 'src/app/Administration/Services/coa.service';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { DepartmentService } from '../../Services/department.service';


@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent {
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
      private departmentService: DepartmentService,
      private authService : AuthService,
      private ToastrService : ToastrService
      )
  { }

  ngOnInit() {
    this.departmentService.getAllDepartments().subscribe(result => {
      this.data = (result as { [key: string]: any })["enttityDataSource"];
      this.cols = (result as { [key: string]: any })["entityModel"];
      this.loading = false;
    });
  }

  handleChildData(data: any) {
    if(data.type == 'add')
    {
    this.authService.checkPermission('DepartmentCreate').subscribe(x=>{
        if(x)
        {
          this.grouptitle = "Department Registration";
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

    this.authService.checkPermission('DepartmentEdit').subscribe(x=>{
        if(x)
        {
          this.grouptitle = "Department Edit";
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
      this.authService.checkPermission('DepartmentDelete').subscribe(x=>{
        if(x)
        {
          this.deleteView(data.value.depID);
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
    if (confirm("Are you sure you want to delete this Department?") == true) {
        this.loading = true;
       this.departmentService.deleteDepartment(id).subscribe({
        next : (value:any) => {
          this.ToastrService.success("Department has been successfully deleted!");
          this.data = this.data.filter(item => item.depID !== id);
          },
        error:(err:any)=> {
            this.ToastrService.error(err.error);
          },
        });
    } else {
    }
}

}
