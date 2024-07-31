import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { Tenants } from 'src/app/models/tenants';
import { TenantService } from 'src/app/services/tenant.service';

@Component({
  selector: 'app-confirm-verification',
  templateUrl: './confirm-verification.component.html',
  styleUrls: ['./confirm-verification.component.css']
})
export class ConfirmVerificationComponent implements OnInit {
  constructor(private auth:AuthService,
    private layoutService: LayoutService,
    private toastr : ToastrService,
    private tenantService : TenantService,
    private router : Router
    ) {
    this.layoutService.state.staticMenuDesktopInactive = true;
  }

  disable : boolean = false;
  confirmCode : any = "";
  email : any = "";
  lst : Tenants[];

  ngOnInit(): void {
    this.auth.canAuthenticate();
    this.email = sessionStorage.getItem("email");
  }

  submit()
  {
    if(this.confirmCode == "")
    {
      this.toastr.error("Please Write Code!")
    }
    else
    {
      this.disable = true;
      this.email = sessionStorage.getItem("email");

      this.lst = [{
        firstName:"",
        lastName:"",
        tenantName:"",
        isEmailConfirmed:false,
        businessPhone:"",
        connectionString:"",
        password:"",
        tenantID:0,
        verificationCode:this.confirmCode,
        email:this.email
      }];
      this.toastr.info("Email Verifying, Please Wait.....","",{ timeOut: 2000000 });
      this.tenantService.confirmTenantVerification(this.lst[0]).subscribe({
        next: (cnf) =>{
          this.toastr.clear();
          this.toastr.success("Email Verified Successfully, Log In!");
          this.router.navigate(['/login']);
        },
        error: (err) =>{
          this.toastr.clear();
          this.toastr.error(err.error);
          this.disable = false;
        },
      });
    }
  }
}


