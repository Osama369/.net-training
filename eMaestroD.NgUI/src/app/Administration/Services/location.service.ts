import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Location } from './../Models/location';
import { HttpClient } from '@angular/common/http';
//import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  locObj:Location={};
  baseApiUrl: string = environment.BaseApiUrl+'/Location/';
  constructor(private http: HttpClient) { }

  saveLoc(list:Location): Observable<Location> {
    return this.http.post<Location>(this.baseApiUrl,list);
  }

  getAllLoc(): Observable<Location[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<Location[]>(this.baseApiUrl+comID);
  }

  deleteLoc(locID: any){
    return this.http.delete<any>(this.baseApiUrl+locID);
  }

  ReplaceParentLoc(provinceLocID:number, regionLocID:number):Observable<Location>
  {
    console.log(provinceLocID)
    console.log(regionLocID)
    
    this.locObj.LocationId= provinceLocID;
    this.locObj.ParentLocationId= regionLocID;
    
    return this.http.post<Location>(this.baseApiUrl+'ReplaceParentLoc',this.locObj)
 
  }
}
