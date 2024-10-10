import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../Shared/Services/auth.service';
import { SignalrService } from '../../../Shared/Services/signalr.service';
import { Tenants } from 'src/app/Administration/Models/tenants';
import { APP_ROUTES } from 'src/app/app-routes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  APP_ROUTES = APP_ROUTES;
  formdata = {email:"",password:""};
  tenant : Tenants[] = [];
  submit=false;
  resetPasswordVisibility: boolean = false;
  saveDisable: boolean = false;
  emailAddress:any;
  // loading=false;
  errorMessage="";
  constructor(private auth:AuthService,
    private layoutService: LayoutService,
    private toastr: ToastrService,
    private singlarService: SignalrService,
    private router: Router,
    private route: ActivatedRoute
    ) {
    this.layoutService.state.staticMenuDesktopInactive = true;
  }


  ngOnInit(): void {
    this.auth.canAuthenticate();
    this.route.queryParams.subscribe((params:any) => {
      this.formdata.email  = params['email'] || ''; // Default message if email param is not provided
    });
  }



  validateEmail(email :any){
    let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(pattern)) {
      return true;
    }
    return false;
  }

  onSubmit(){
    // this.loading=true;
    //call login service
    if(!this.validateEmail(this.formdata.email))
    {
      this.toastr.error("Email address incorrect!")
    }
    else
    {
        this.tenant[0] = {
          email : this.formdata.email,
          password : this.formdata.password
        };
        this.auth.login(this.tenant[0])
        .subscribe({
            next:(data:any)=>{
              if(data.idToken != "confirmation")
              {
                localStorage.setItem('tenantNames', JSON.stringify(data.tenantNames));
                this.auth.storeToken(data.idToken);
                this.auth.canAuthenticate();
              }
              else
              {
                sessionStorage.setItem('email',this.formdata.email)
                this.router.navigate([APP_ROUTES.account.confirmation]);
              }
            },
            error:data=>{
              this.toastr.error(data.error);
            }
        }).add(()=>{
            // this.loading =false;
        })
    }
  }

  OpenForgetPasswordPopup()
  {
    this.emailAddress = "";
    this.resetPasswordVisibility = true;
  }

  ForgetPassword()
  {
    if(!this.validateEmail(this.emailAddress)){
      this.toastr.error("Email address incorrect!")
    }
    else{
      this.saveDisable = true;
      this.auth.ForgetPassword(this.emailAddress).subscribe({
        next:(result)=>{
          this.toastr.success("Password has been successfully sended to your Email Address.");
          this.resetPasswordVisibility = false;
          this.saveDisable = false
        },
        error:(responce)=>{
          this.toastr.error(responce.error);
          this.saveDisable = false
        }
      });
    }
  }

}
