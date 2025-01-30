import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from '../Shared/Services/auth.service';
import { APP_ROUTES } from '../app-routes';

@Injectable({
  providedIn: 'root',
})

export class PermissionGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean{
    let key : boolean = true;
    const screenName = route.data['requiredPermission'];
    // Make a request to the server to check the user's permissions
    this.authService.checkPermission(screenName).subscribe((hasPermission: any) => {
        if (hasPermission) {
          key = true;
        } else {
          this.router.navigate([APP_ROUTES.notAuthorized]);
          key= false;
        }
      });
      return key;
  }
}

