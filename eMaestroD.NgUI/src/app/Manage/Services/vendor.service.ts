import { Vendor } from './../Models/vendor';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  //baseApiUrl: string = "https://localhost:44386";
  baseApiUrl: string = environment.BaseApiUrl + '/Vendor/';

  constructor(private http: HttpClient) { }

  getAllVendor(): Observable<Vendor[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<Vendor[]>(this.baseApiUrl+comID);
  }

  deleteVendor(vendID: any){
    return this.http.delete<any>(this.baseApiUrl+vendID);
  }

  saveVendor(vendorList: Vendor): Observable<Vendor[]> {
    return this.http.post<Vendor[]>(this.baseApiUrl, vendorList);
  }

  uploadVendors(formData:any){
    let com = localStorage.getItem('comID');
    const headers = new HttpHeaders({
      'comID': com != null? com : "",
    });
    const options = { headers: headers };
    return this.http.post<any>(this.baseApiUrl+'uploadVendors/', formData, options);
  }

  GetVndCode(){
    let comID = localStorage.getItem('comID');
    return this.http.get<string>(this.baseApiUrl+'GetVndCode/'+comID);
  }

}
