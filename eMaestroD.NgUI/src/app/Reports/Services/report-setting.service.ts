import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ReportSettings } from '../Models/report-settings';
import { Observable } from 'rxjs';
import { InvoiceReportSettings } from '../Models/invoice-report-settings';

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
    return this.http.get<InvoiceReportSettings[]>(this.baseApiUrl+'/InvoiceReportSettings');
  }

  SaveInvoiceReportSettings(rpt:InvoiceReportSettings[]): Observable<InvoiceReportSettings[]> {
    return this.http.post<InvoiceReportSettings[]>(this.baseApiUrl+'/InvoiceReportSettings',rpt);
  }

}
