import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Taxes } from '../models/taxes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaxesService {

  baseApiUrl: string = environment.BaseApiUrl+'/Taxes/';
  constructor(private http: HttpClient) { }

  getAllTaxes(): Observable<Taxes[]> {
    return this.http.get<Taxes[]>(this.baseApiUrl);
  }

  saveTaxes(taxlist: Taxes): Observable<Taxes[]> {
    let com = localStorage.getItem('comID');
    const headers = new HttpHeaders({
      'comID': com != null? com : "",
    });
    const options = { headers: headers };
    return this.http.post<Taxes[]>(this.baseApiUrl, taxlist, options);
  }

  updateIsDefault(taxlist:Taxes): Observable<Taxes[]> {
    let com = localStorage.getItem('comID');
    const headers = new HttpHeaders({
      'comID': com != null? com : "",
    });
    const options = { headers: headers };
    return this.http.post<Taxes[]>(this.baseApiUrl+'updateIsDefault/', taxlist,options);
  }

  deleteTax(taxID: any) {
    let com = localStorage.getItem('comID');
    const headers = new HttpHeaders({
      'comID': com != null? com : "",
    });
    const options = { headers: headers };
    return this.http.delete<any>(this.baseApiUrl+taxID, options);
  }
}
