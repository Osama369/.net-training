
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Tenants } from '../models/tenants';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  baseApiUrl: string = environment.BaseApiUrl + '/Account/';

  constructor(private http: HttpClient) { }

  saveTenant(list: Tenants): Observable<Tenants[]> {
    return this.http.post<Tenants[]>(this.baseApiUrl+'saveTenant', list);
  }

  confirmTenantVerification(lst:Tenants) {
    return this.http.post<any>(this.baseApiUrl+'confirmTenantVerification',lst);
  }

  VerifyEmailAddress(email:any){
    return this.http.get<any>(this.baseApiUrl+'VerifyEmailAddress/'+email, {responseType:'text' as 'json'});
  }

  saveTenantPaymentDetail(list: any): Observable<any> {
    return this.http.post<any>(this.baseApiUrl+'saveTenantPaymentDetail', list, {responseType:'text' as 'json'});
  }
}

