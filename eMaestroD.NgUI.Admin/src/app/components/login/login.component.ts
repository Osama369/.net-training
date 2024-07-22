import { Tenants } from 'src/app/models/tenants';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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
    private router: Router
    ) {
    this.layoutService.state.staticMenuDesktopInactive = true;
  }


  ngOnInit(): void {
    this.auth.canAuthenticate();
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
            next:(data: { idToken: any; })=>{
              if(data.idToken != "confirmation")
              {
                this.auth.storeToken(data.idToken);
                this.auth.canAuthenticate();
              }
              else
              {
                sessionStorage.setItem('email',this.formdata.email)
                this.router.navigate(["/Confirmation"]);
              }
            },
            error:(data: { error: string | undefined; })=>{
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
        next:(result: any)=>{
          this.toastr.success("Password has been Successfully send to Your Email Address.");
          this.resetPasswordVisibility = false;
          this.saveDisable = false
        },
        error:(responce:any)=>{
          this.toastr.error(responce.error);
          this.saveDisable = false
        }
      });
    }
  }

}
