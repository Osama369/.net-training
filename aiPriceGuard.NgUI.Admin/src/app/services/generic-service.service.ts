import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenericServiceService {


  baseApiUrl: string = environment.BaseApiUrl;

  constructor(private http: HttpClient) { }

  SaveAuthorizationTemplate(list: any[]): Observable<any[]> {
    return this.http.post<any[]>(this.baseApiUrl+'/Authorizations/SaveAuthorizationTemplate', list);
  }

  GetAuthorizationTemplate(userID : any): Observable<any[]> {
    return this.http.get<any[]>(this.baseApiUrl+'/Authorizations/GetAuthorizationTemplate/'+userID);
  }
}
