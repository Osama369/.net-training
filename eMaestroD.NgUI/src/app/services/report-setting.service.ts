import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ReportSettings } from '../models/report-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportSettingService {
  constructor(private http: HttpClient) { }
  baseApiUrl: string = environment.BaseApiUrl;

  getReportSettings() {
    return this.http.get<ReportSettings[]>(this.baseApiUrl+'/ReportSettings');
  }

  saveReportSettings(rpt:ReportSettings[]): Observable<ReportSettings[]> {
    return this.http.post<ReportSettings[]>(this.baseApiUrl+'/ReportSettings',rpt);
  }

  GetInvoiceReportSettings() {
    return this.http.get<any[]>(this.baseApiUrl+'/InvoiceReportSettings');
  }

  SaveInvoiceReportSettings(rpt:any[]): Observable<any[]> {
    return this.http.post<any[]>(this.baseApiUrl+'/InvoiceReportSettings',rpt);
  }

}
