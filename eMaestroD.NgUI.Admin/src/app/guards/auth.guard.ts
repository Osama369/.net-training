import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth : AuthService, private router: Router,
    private toast: ToastrService){
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean{

    if(this.auth.isAuthenticated()){
      return true;
    }else{
      if(localStorage.getItem('token') == null)
      {
        this.toast.error("Please Login First!");
        this.router.navigate(['login']);
        return false;
      }
      return false;
    }
  }
}
