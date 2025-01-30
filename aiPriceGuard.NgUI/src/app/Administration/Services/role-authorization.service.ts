import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Authorizataion } from '../Models/authorizataion';

@Injectable({
  providedIn: 'root'
})
export class RoleAuthorizationService {

  baseApiUrl: string = environment.BaseApiUrl + '/Authorizations/';

  constructor(private http: HttpClient) { }

  saveAuthorizaScreen(list: Authorizataion[]): Observable<Authorizataion[]> {
    let com = localStorage.getItem('comID');
    const headers = new HttpHeaders({
      'comID': com != null? com : "",
    });
    const options = { headers: headers };
    return this.http.post<Authorizataion[]>(this.baseApiUrl+'saveAuthorizaScreen', list, options);
  }

  getAuthorizeScreen(userID : any): Observable<Authorizataion[]> {
    return this.http.get<Authorizataion[]>(this.baseApiUrl+'getAuthorizeScreen/'+userID);
  }
}
