import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { COA } from '../models/COA';
import { Creditcard } from '../models/creditcard';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {

  baseApiUrl: string = environment.BaseApiUrl+'/CreditCard/';
  constructor(private http: HttpClient) { }

  GetAllCreditCard(): Observable<Creditcard[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<Creditcard[]>(this.baseApiUrl + 'GetAllCreditCard/'+comID);
  }

  SaveCreditCard(list:Creditcard): Observable<Creditcard[]> {
    let com = localStorage.getItem('comID');
    const headers = new HttpHeaders({
      'comID': com != null? com : "",
    });
    const options = { headers: headers };
    return this.http.post<Creditcard[]>(this.baseApiUrl + 'SaveCreditCard',list, options);
  }

  DeleteCreditCard(id : any){
    let com = localStorage.getItem('comID');
    const headers = new HttpHeaders({
      'comID': com != null? com : "",
    });
    const options = { headers: headers };
    return this.http.delete<any>(this.baseApiUrl + 'DeleteCreditCard/'+id, options);
  }

  UpdateIsDefault(activeList:Creditcard): Observable<Creditcard[]> {
    let com = localStorage.getItem('comID');
    const headers = new HttpHeaders({
      'comID': com != null? com : "",
    });
    const options = { headers: headers };
    return this.http.post<Creditcard[]>(this.baseApiUrl+'UpdateIsDefault/', activeList,options);
  }
}
