import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { COA } from '../Models/COA';

@Injectable({
  providedIn: 'root'
})
export class CoaService {

  baseApiUrl: string = environment.BaseApiUrl+'/coa';
  constructor(private http: HttpClient) { }

  saveCOA(list:COA): Observable<COA[]> {
    let com = localStorage.getItem('comID');
    const headers = new HttpHeaders({
      'comID': com != null? com : "",
    });
    const options = { headers: headers };
    return this.http.post<COA[]>(this.baseApiUrl + '/saveCOA',list, options);
  }

  getAllCOA(): Observable<COA[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<COA[]>(this.baseApiUrl + '/GetAllCOA/'+comID);
  }

  getAllCOAForGird(): Observable<COA[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<COA[]>(this.baseApiUrl + '/GetAllCOAForGird/'+comID);
  }


  deleteCOA(COAID : any){
    let com = localStorage.getItem('comID');
    const headers = new HttpHeaders({
      'comID': com != null? com : "",
    });
    const options = { headers: headers };
    return this.http.delete<any>(this.baseApiUrl + '/DeleteCOA/'+COAID, options);
  }
}
