import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private http: HttpClient) { }
  baseApiUrl: string = environment.BaseApiUrl + '/Report';

  runReportWith1Para(Reportname : any,para1:any,locID:any, catID:any, vendID?:any) {

    const headers = new HttpHeaders({
      'catID': catID != null? catID : 0,
      'vendID': vendID != null? vendID : 0,
    });

    let comID = localStorage.getItem('comID');
    return this.http.get<any>(this.baseApiUrl+'/'+Reportname+'/'+para1+'/'+locID+'/'+comID, { headers: headers });
  }

  runReportWith2Para(Reportname : any, para1:any, para2:any,locID:any, catID:any) {
    let comID = localStorage.getItem('comID');
    const headers = new HttpHeaders({
      'catID': catID != null? catID : 0,
    });
    return this.http.get<any>(this.baseApiUrl+'/'+Reportname+'/'+para1+'/'+para2+'/'+locID+'/'+comID, { headers: headers });
  }

  runReportWith3Para(Reportname : any, para1:any, para2:any, para3:any,locID:any) {
    let comID = localStorage.getItem('comID');
    return this.http.get<any>(this.baseApiUrl+'/'+Reportname+'/'+para1+'/'+para2+'/'+para3+'/'+locID+'/'+comID);
  }

  runReportWith4Para(Reportname : any, para1:any, para2:any, para3:any, para4:any,locID:any) {
    let comID = localStorage.getItem('comID');
    return this.http.get<any>(this.baseApiUrl+'/'+Reportname+'/'+para1+'/'+para2+'/'+para3+'/'+para4+'/'+locID+'/'+comID);
  }

  runReportWith5Para(Reportname : any, para1:any, para2:any, para3:any, para4:any, para5:any,locID:any) {
    let comID = localStorage.getItem('comID');
    return this.http.get<any>(this.baseApiUrl+'/'+Reportname+'/'+para1+'/'+para2+'/'+para3+'/'+para4+'/'+para5+'/'+locID+'/'+comID);
  }

}
