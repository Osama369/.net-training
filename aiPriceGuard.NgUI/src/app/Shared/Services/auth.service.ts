import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { environment } from 'src/environments/environment';
import { GenericService } from './generic.service';
import { ThemeService } from '../Services/theme.service';
import { ScreenService } from 'src/app/Administration/Services/screen.service';
import { APP_ROUTES } from 'src/app/app-routes';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router:Router,private http:HttpClient,
    private layoutService : LayoutService,
    private themeService: ThemeService,
    private genericService: GenericService,
    private screenService: ScreenService
    ) { }
  // baseApiUrl: string = "https://localhost:44386";
  baseApiUrl: string = environment.BaseApiUrl;

  isAuthenticated():boolean{

    if (localStorage.getItem('token')!==null && localStorage.getItem('comID') != null) {
      return true;
    }

    return false;
  }

  isAuthenticatedforLogin():boolean{
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
        //redirect to login
        this.router.navigate([APP_ROUTES.account.login]);
    }
  }
  canAuthenticate(){
    if (this.isAuthenticated()) {
      //redirect to dashboard
      this.layoutService.state.staticMenuDesktopInactive = false;
      this.router.navigate([APP_ROUTES.administration.companySetting]);
    }
    else if(localStorage.getItem('token')!==null && localStorage.getItem('comID') == null)
    {
      this.router.navigate([APP_ROUTES.account.selectCompany]);
    }
  }

  checkPermission(screenUrl:any){
    return this.http.get<any>(this.baseApiUrl+"/Authorizations/checkPermission/"+screenUrl)
  }

  UpdateBookmarkScreen(screenUrl:any,value:any){
    return this.http.get<any>(this.baseApiUrl+"/Authorizations/UpdateBookmarkScreen/"+screenUrl+'/'+value)
  }

  GetBookmarkScreen(screenUrl:any){
    return this.http.get<any>(this.baseApiUrl+"/Authorizations/GetBookmarkScreen/"+screenUrl)
  }
  GetAllBookmarkScreen(){
    return this.http.get<any>(this.baseApiUrl+"/Authorizations/GetAllBookmarkScreen/")
  }
  // register(name:string,email:string,password:string){
  //     //send data to register api (firebase)
  //    return this.http
  //     .post<{idToken:string}>(
  //       'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]',
  //         {displayName:name,email,password}
  //     );
  // }

  storeToken(token:string){
    localStorage.setItem('token',token);
  }

  login(tenant:any){
      return this.http
      .post<{idToken:string}>(
        this.baseApiUrl + '/Account/loginUser/',tenant);
  }

  UpdateConnectionString(tenantID:any)
  {
    return this.http.get<any>(this.baseApiUrl+"/Account/UpdateConnectionString/"+tenantID);
  }

  // detail(){
  //   let token = sessionStorage.getItem('token');

  //   return this.http.post<{users:Array<{localId:string,displayName:string}>}>(
  //       'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=[API_KEY]',
  //       {idToken:token}
  //   );
  // }

  removeToken(){
    this.layoutService.state.staticMenuDesktopInactive = true;
    localStorage.removeItem('tenantNames');
    localStorage.removeItem('tenantID');
    localStorage.removeItem('token');
    localStorage.removeItem('comID');
    localStorage.removeItem('comName');
    localStorage.removeItem("isPos");
  }


  ForgetPassword(emailAddress:any){
    return this.http.get(this.baseApiUrl + '/Account/ForgetPassword/'+emailAddress, {responseType: 'text'});
  }

}
