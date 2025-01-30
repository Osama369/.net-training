import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
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

  getAllTenants() {
    return this.http.get<any[]>(this.baseApiUrl+'getAllTenants');
  }

  deleteTenant(tenantID:any) {
    return this.http.delete<any>(this.baseApiUrl+'deleteTenant/'+tenantID);
  }

  sendEmailToTenant(Tenants:Tenants[]): Observable<Tenants[]> {
    return this.http.post<Tenants[]>(this.baseApiUrl+'sendEmailToTenant',Tenants);
  }

  SuspendTenant(Tenants:Tenants): Observable<Tenants[]> {
    return this.http.post<any>(this.baseApiUrl+'SuspendTenant',Tenants);
  }
}
