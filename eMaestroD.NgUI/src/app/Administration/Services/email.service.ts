import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  baseApiUrl: string = environment.BaseApiUrl+'/Email/';
  constructor(private http: HttpClient) { }

  SavePdfAndSend(File: any): Observable<any> {
    return this.http.post<any>(this.baseApiUrl+'SavePdfAndSend', File, {responseType:'text' as 'json'});
  }

}
