import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyCSEService {

  baseApiUrl: string = environment.BaseApiUrl + '/CompanyCSE/';

  constructor(private http: HttpClient) { }

  getAllCompanyCSE(): Observable<any[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<any[]>(this.baseApiUrl+comID);
  }
}
