import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CoaService } from 'src/app/Administration/Services/coa.service';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { ProdManufactureService } from '../../Services/prod-manufacture.service';


@Component({
  selector: 'app-prod-manufacture',
  templateUrl: './prod-manufacture.component.html',
  styleUrls: ['./prod-manufacture.component.scss']
})
export class ProdManufactureComponent {
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
      private prodManufactureService: ProdManufactureService,
      private authService : AuthService,
      private ToastrService : ToastrService
      )
  { }

  ngOnInit() {
    this.prodManufactureService.getProdManufactures().subscribe(result => {
      this.data = (result as { [key: string]: any })["enttityDataSource"];
      this.cols = (result as { [key: string]: any })["entityModel"];
      this.loading = false;
    });
  }

  handleChildData(data: any) {
    if(data.type == 'add')
    {
    this.authService.checkPermission('ManufactureCreate').subscribe(x=>{
        if(x)
        {
          this.grouptitle = "Manufacture Registration";
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

    this.authService.checkPermission('ManufactureEdit').subscribe(x=>{
        if(x)
        {
          this.grouptitle = "Manufacture Edit";
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
      this.authService.checkPermission('ManufactureDelete').subscribe(x=>{
        if(x)
        {
          this.deleteView(data.value.prodManuID);
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
    if (confirm("Are you sure you want to delete this Manufacture?") == true) {
        this.loading = true;
       this.prodManufactureService.deleteProdManufacture(id).subscribe({
        next : (value:any) => {
          this.ToastrService.success("Manufacture has been successfully deleted!");
          this.data = this.data.filter(item => item.prodManuID !== id);
          },
        error:(err:any)=> {
            this.ToastrService.error(err.error);
          },
        });
    } else {
    }
}

}
