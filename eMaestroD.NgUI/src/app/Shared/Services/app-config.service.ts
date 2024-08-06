import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private appConfig: any;
  baseApiUrl: string = environment.BaseApiUrl;

  constructor(private http: HttpClient) { }

  loadAppConfig() {
    return this.http.get(this.baseApiUrl+'/config')
      .toPromise()
      .then(data => {
        this.appConfig = data;
      });
  }

  getConfig() {
    return this.appConfig;
  }
}
