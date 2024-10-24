import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../Shared/Services/auth.service';
import { APP_ROUTES } from '../app-routes';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private toast: ToastrService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken = this.auth.getToken();

    // this.start.load();
    if(myToken){
    const decodedToken: any = jwt_decode.jwtDecode(myToken);
      // 'exp' claim contains the expiration time in seconds
    const expirationTimeInSeconds = decodedToken.exp;

    // Convert expiration time from seconds to milliseconds
    const expirationTimeInMillis = expirationTimeInSeconds * 1000;

    // Create a Date object representing the expiration time
    const expirationDate = new Date(expirationTimeInMillis);
    if( expirationDate  > new Date()) {

          request = request.clone({
            setHeaders: {Authorization:`Bearer ${myToken}`}  // "Bearer "+myToken
          })
            }
        else {
            localStorage.clear();
            this.router.navigate([APP_ROUTES.account.login]);
        }
      }
    return next.handle(request);
  }
  // handleUnAuthorizedError(req: HttpRequest<any>, next: HttpHandler){
  //   let tokeApiModel = new TokenApiModel();
  //   tokeApiModel.accessToken = this.auth.getToken()!;
  //   tokeApiModel.refreshToken = this.auth.getRefreshToken()!;
  //   return this.auth.renewToken(tokeApiModel)
  //   .pipe(
  //     switchMap((data:TokenApiModel)=>{
  //       this.auth.storeRefreshToken(data.refreshToken);
  //       this.auth.storeToken(data.accessToken);
  //       req = req.clone({
  //         setHeaders: {Authorization:`Bearer ${data.accessToken}`}  // "Bearer "+myToken
  //       })
  //       return next.handle(req);
  //     }),
  //     catchError((err)=>{
  //       return throwError(()=>{
  //         this.toast.warning({detail:"Warning", summary:"Token is expired, Please Login again"});
  //       })
  //     })
  //   )
  // }
}

export class TokenApiModel{
  accessToken!:string;
  refreshToken!:string;
}
