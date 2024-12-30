import { Component } from '@angular/core';
import { CompanyCSEService } from '../../Services/company-cse.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyCSE } from '../../Models/company-cse';

@Component({
  selector: 'app-company-mse',
  templateUrl: './company-mse.component.html',
  styleUrls: ['./company-mse.component.scss']
})
export class CompanyMseComponent {
  cols: any[] = [];
  exportedCol: any[] = [];
  companyCse: CompanyCSE[];
  cseID: any;
  loading: boolean = true;
  cseVisible: boolean = false;
  cseList : CompanyCSE = {};
  title :any;
  UploadToolVisibility : boolean = false;
  methodName : any;
  serviceName : any;

  constructor(private companyCSEService: CompanyCSEService,
    private router: Router,
    private authService: AuthService,
    private ToastrService: ToastrService,
    ) { }

    ngOnInit() {
      this.companyCSEService.getAllCompanyCSE().subscribe(cst => {
          this.companyCse = (cst as { [key: string]: any })["enttityDataSource"];
          this.cols = (cst as { [key: string]: any })["entityModel"];
          console.log(this.companyCse);
          this.loading = false;
      });
  }

  handleChildData(data: any) {
    if(data.type == 'add')
    {
      this.authService.checkPermission('CompanyCSECreate').subscribe(x=>{
        if(x)
        {
          this.title = "Company CSE Registration";
          this.cseList = {};
          this.cseVisible = true;
        }
        else{
          this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        }
      });

    }
    else if(data.type == 'edit')
    {
        this.authService.checkPermission('CompanyCSEEdit').subscribe(x=>{
        if(x)
        {
          this.title = "Company CSE Edit";
          this.cseList = data.value;
          this.cseVisible = true;
        }
        else{
          this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        }
      });

    }
    else if(data.type == 'added')
    {
        const index = this.companyCse.findIndex((cse) => cse.CSEID === data.value.CSEID);
        if (index !== -1) {
          this.companyCse[index] = data.value; // Update existing entry
        }
        else {
          this.companyCse.push(data.value);
        }
        this.cseVisible = false;
    }
    else if(data.type == 'delete')
    {

      this.authService.checkPermission('CompanyCSEDelete').subscribe(x=>{
        if(x)
        {
          this.deleteView(data.value.CSEID);
        }
        else{
          this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }
    else
    {
        this.cseVisible = false;
    }
  }

  deleteView(CSEID:any)
  {
      if (confirm("Are you sure you want to delete this Comapny CSE?") == true) {
          this.loading = true;
          this.companyCSEService.delete(CSEID).subscribe({
            next:(result)=>{
              this.companyCse = this.companyCse.filter(x => x.CSEID !== CSEID);
              this.ToastrService.success("Company CSE has been successfully deleted.");
            },
            error:(responce)=>{
              this.ToastrService.error(responce.error);
            }
          });
      }
  }
}
