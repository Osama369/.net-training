import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Bank } from '../Models/bank';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  baseApiUrl: string = environment.BaseApiUrl+'/Bank/';
  constructor(private http: HttpClient) { }

  GetAllBanks(): Observable<Bank[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<Bank[]>(this.baseApiUrl + 'GetAllBank/'+comID);
  }

  SaveBank(list:Bank): Observable<Bank[]> {
    let com = localStorage.getItem('comID');
    const headers = new HttpHeaders({
      'comID': com != null? com : "",
    });
    const options = { headers: headers };
    return this.http.post<Bank[]>(this.baseApiUrl + 'SaveBank',list, options);
  }

  DeleteBank(id : any){
    let com = localStorage.getItem('comID');
    const headers = new HttpHeaders({
      'comID': com != null? com : "",
    });
    const options = { headers: headers };
    return this.http.delete<any>(this.baseApiUrl + 'DeleteBank/'+id, options);
  }

  UpdateIsDefault(activeList:Bank): Observable<Bank[]> {
    let com = localStorage.getItem('comID');
    const headers = new HttpHeaders({
      'comID': com != null? com : "",
    });
    const options = { headers: headers };
    return this.http.post<Bank[]>(this.baseApiUrl+'UpdateIsDefault/', activeList,options);
  }
}
