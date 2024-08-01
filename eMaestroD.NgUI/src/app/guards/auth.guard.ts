import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ScreenService } from '../Administration/Services/screen.service';
import { AuthService } from '../Shared/Services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth : AuthService, private router: Router,
    private screenService : ScreenService,
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
      else{
        this.toast.error("Please Select Company!");
        this.router.navigate(['login']);
        return false;
      }
    }

  }
}
