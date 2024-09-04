import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { SchemesService } from '../../Services/schemes.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-schemes',
  templateUrl: './schemes.component.html',
  styleUrls: ['./schemes.component.scss']
})

export class SchemesComponent {
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
      private schemesService: SchemesService,
      private authService : AuthService,
      private ToastrService : ToastrService,
      private router : Router
      )
  { }

  ngOnInit() {
    this.schemesService.getAllSchemes().subscribe(result => {
      this.data = (result as { [key: string]: any })["enttityDataSource"];
      this.cols = (result as { [key: string]: any })["entityModel"];
      this.loading = false;
    });
  }

  handleChildData(data: any) {
    if(data.type == 'add')
    {
    this.authService.checkPermission('SchemesCreate').subscribe(x=>{
        if(x)
        {
          // this.grouptitle = "Schemes Registration";
          // this.dataList = [];
          // this.DailogVisible = true;

          this.router.navigateByUrl('/Manage/AddSchemes');
        }
        else{
          this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }
    else if(data.type == 'edit')
    {

    this.authService.checkPermission('SchemesEdit').subscribe(x=>{
        if(x)
        {
          this.router.navigateByUrl('/Manage/AddSchemes/'+data.value.prodDiscID);
        }
        else{
          this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }

    else if(data.type == 'delete')
    {
      this.authService.checkPermission('SchemesDelete').subscribe(x=>{
        if(x)
        {
          this.deleteView(data.value.prodDiscID);
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
    if (confirm("Are you sure you want to delete this Schemes?") == true) {
        this.loading = true;
       this.schemesService.deleteSchemes(id).subscribe({
        next : (value:any) => {
          this.ToastrService.success("Schemes has been successfully deleted!");
          this.data = this.data.filter(item => item.prodDiscID !== id);
          },
        error:(err:any)=> {
            this.ToastrService.error(err.error);
          },
        });
    } else {
    }
}

}
