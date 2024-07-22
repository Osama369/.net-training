import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FiscalYear } from './../models/FiscalYear';

@Injectable({
  providedIn: 'root'
})
export class FiscalyearService {

  baseApiUrl: string = environment.BaseApiUrl+'/FiscalYear/';
  constructor(private http: HttpClient) { }

  GetAllFiscalYear(): Observable<FiscalYear[]> {
    let comID   = localStorage.getItem('comID');
    return this.http.get<FiscalYear[]>(this.baseApiUrl+comID);
  }

  SaveFiscalYear(fiscalYear: FiscalYear): Observable<FiscalYear[]> {
    let com = localStorage.getItem('comID');
    const headers = new HttpHeaders({
      'comID': com != null? com : "",
    });
    const options = { headers: headers };
    return this.http.post<FiscalYear[]>(this.baseApiUrl, fiscalYear, options);
  }

  UpdateFicalYearActive(fiscalYear:FiscalYear): Observable<FiscalYear[]> {
    let com = localStorage.getItem('comID');
    const headers = new HttpHeaders({
      'comID': com != null? com : "",
    });
    const options = { headers: headers };
    return this.http.post<FiscalYear[]>(this.baseApiUrl+'UpdateFicalYearActive/', fiscalYear,options);
  }

  DeleteFiscalYear(fiscalYear: any) {
    let com = localStorage.getItem('comID');
    const headers = new HttpHeaders({
      'comID': com != null? com : "",
    });
    const options = { headers: headers };
    return this.http.delete<any>(this.baseApiUrl+fiscalYear, options);
  }

  EndFiscalYear(isCreateNew:any){
    let com = localStorage.getItem('comID');
    const headers = new HttpHeaders({
      'comID': com != null? com : "",
    });
    const options = { headers: headers };
    return this.http.get<any>(this.baseApiUrl+'EndFiscalYear/'+isCreateNew,options);
  }
}
