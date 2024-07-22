import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Location } from '../models/location';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  baseApiUrl: string = environment.BaseApiUrl+'/Location/';
  constructor(private http: HttpClient) { }

  saveLoc(list:Location): Observable<Location[]> {
    return this.http.post<Location[]>(this.baseApiUrl,list);
  }

  getAllLoc(): Observable<Location[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<Location[]>(this.baseApiUrl+comID);
  }

  deleteLoc(locID: any){
    return this.http.delete<any>(this.baseApiUrl+locID);
  }
}
