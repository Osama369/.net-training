import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppConfig } from '../Models/app-config';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private appConfig: AppConfig;
  baseApiUrl: string = environment.BaseApiUrl;

  constructor(private http: HttpClient) { }

  loadAppConfig() {
    return this.http.get(this.baseApiUrl+'/config')
      .toPromise()
      .then((data:any) => {
        this.appConfig = data;
      });
  }

  getConfig() {
    return this.appConfig;
  }
}
