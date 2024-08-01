import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../Shared/Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class loginGuard implements CanActivate {
  constructor(private auth : AuthService, private router: Router
    , private toast: ToastrService){

  }
  canActivate():boolean{
    if(this.auth.isAuthenticatedforLogin()){
      return true
    }else{
      this.toast.error("Please Select Company First!");
      this.router.navigate(['SelectCompany'])
      return false;
    }
  }
}
