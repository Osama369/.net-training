import { Component } from '@angular/core';
import { CompanyCSEService } from '../../Services/company-cse.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-mse',
  templateUrl: './company-mse.component.html',
  styleUrls: ['./company-mse.component.scss']
})
export class CompanyMseComponent {
  cols: any[] = [];
  exportedCol: any[] = [];
  customers: any[];
  cstID: any;
  loading: boolean = true;
  CustomerVisible: boolean = false;
  cstList : any[];
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
          this.customers = (cst as { [key: string]: any })["enttityDataSource"];
          this.cols = (cst as { [key: string]: any })["entityModel"];
          console.log(this.customers);
          this.loading = false;
      });
  }
}
