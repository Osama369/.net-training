import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { prodGroups } from '../models/prodGroups';
import { Observable } from 'rxjs/internal/Observable';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  constructor(private http: HttpClient) {


  }


  // baseApiUrl: string = "https://localhost:44386";
  baseApiUrl: string = environment.BaseApiUrl+ '/ProductGroups/';



  getAllGroups(): Observable<prodGroups[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<prodGroups[]>(this.baseApiUrl+comID);
  }

  saveProductGroup(grouplist: prodGroups): Observable<prodGroups[]> {
    let com = localStorage.getItem('comID');
    const headers = new HttpHeaders({
      'comID': com != null? com : "",
    });
    const options = { headers: headers };
    return this.http.post<prodGroups[]>(this.baseApiUrl, grouplist, options);
  }

  deleteGroup(groupID : any) {
    let com = localStorage.getItem('comID');
    const headers = new HttpHeaders({
      'comID': com != null? com : "",
    });
    const options = { headers: headers };
    return this.http.delete<any>(this.baseApiUrl+groupID, options);
  }

}
