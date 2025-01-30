import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Companies } from 'src/app/Administration/Models/companies';
import { Currency } from 'src/app/Administration/Models/currency';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenericService {

  baseApiUrl: string = environment.BaseApiUrl;
  constructor(private http: HttpClient) { }

  getAllCurrency() : Observable<Currency[]> {
    return this.http.get<any>(this.baseApiUrl+'/company/getAllCurrency')
  }

  


 

 

  getConfiguration(): Observable<Companies[]> {
    let comID = localStorage.getItem('comID');
    
    return this.http.get<Companies[]>(this.baseApiUrl + '/Company/getOneCompanyDetail/'+comID);
  }
  getCompanylist():Observable<Companies[]> {
    return this.http.get<Companies[]>(this.baseApiUrl + '/Company/getCompanyList/');
  }
  saveConfiguration(cfglsit: Companies): Observable<Companies[]> {
    return this.http.post<Companies[]>(this.baseApiUrl+ '/Company/saveCompanyDetail', cfglsit);
  }

  saveFile(formData:any){
    let com = localStorage.getItem('comID');
    let comName = localStorage.getItem('comName');
    const headers = new HttpHeaders({
      'comID': com != null? com : "",
      'comName': comName != null? comName : "",
    });
    return this.http.post<any>(this.baseApiUrl+'/Company/savefile', formData, {
      headers: headers,
      responseType: 'text' as 'json'
    }
    );
  }

  getDayBook(date:any){
    let comID = localStorage.getItem('comID');
    return this.http.get<any>(this.baseApiUrl+'/Generic/getDayBook/'+date+'/'+comID);
  }

  GetSalesSummary(date:any){
    let comID = localStorage.getItem('comID');
    return this.http.get<any>(this.baseApiUrl+'/Generic/getSalesSummary/'+date+'/'+comID);
  }

  getServiceTax(){
    let comID = localStorage.getItem('comID');
    return this.http.get<any>(this.baseApiUrl+'/Generic/getServiceTax/'+comID);
  }

  getAllRoles(){
    return this.http.get<any>(this.baseApiUrl+'/Generic/getAllRoles/');
  }

  // getDashBoardData(filterType:any):Observable<Dashboard[]> {
  //   let comID = localStorage.getItem('comID');
  //   return this.http.get<Dashboard[]>(this.baseApiUrl+'/Generic/getDashboardData/'+comID+'/'+filterType);
  // }

  getLogoPath() {
    let comID = localStorage.getItem('comID') == null? 0 : localStorage.getItem('comID');
    return this.http.get(this.baseApiUrl+'/Generic/getLogoPath/'+comID, {responseType: 'text'});
  }

  GetTimeZone():Observable<any[]> {
    return this.http.get<any[]>(this.baseApiUrl+'/Generic/GetTimeZone/');
  }


  getAllDropdownData(): Observable<any> {
    let comID = localStorage.getItem('comID');
    return this.http.get<any>(`${this.baseApiUrl}/Generic/getAllDropdownData/${comID}`);
  }

  GetBarcodeConfigSetting(): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/Generic/GetBarcodeConfigSetting/`);
  }
  SaveBarcodeConfigSetting(list : any): Observable<void> {
    return this.http.post<void>(`${this.baseApiUrl}/Generic/SaveBarcodeConfigSetting/`, list);
  }
}
