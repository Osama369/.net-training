import { Tenants } from 'src/app/models/tenants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '../layout/service/app.layout.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router:Router,private http:HttpClient,
    private layoutService : LayoutService,
    ) { }
  baseApiUrl: string = environment.BaseApiUrl;

  isAuthenticated():boolean{

    if (localStorage.getItem('token')!==null) {
      return true;
    }

    return false;
  }


  isAuthenticatedForURL():boolean{
    if (localStorage.getItem('token')!==null ) {
        return true;
    }
    return false;
  }

  getToken(){
    return localStorage.getItem('token')
  }

  canAccess(){
    if (!this.isAuthenticated()) {
        this.router.navigate(['/login']);
    }
  }
  canAuthenticate(){
    if (this.isAuthenticated()) {
      this.layoutService.state.staticMenuDesktopInactive = false;
      this.router.navigate(['/Dashboard']);
    }
  }
  storeToken(token:string){
    localStorage.setItem('token',token);
  }

  login(tenant:any){
      return this.http
      .post<{idToken:string}>(
        this.baseApiUrl + '/Account/LoginAdminPanel/',tenant);
  }

  removeToken(){
    this.layoutService.state.staticMenuDesktopInactive = true;
    localStorage.removeItem('token');
    localStorage.removeItem('comID');
    localStorage.removeItem('comName');
  }


  ForgetPassword(emailAddress:any){
    return this.http.get(this.baseApiUrl + '/Account/ForgetPassword/'+emailAddress, {responseType: 'text'});
  }

}
