import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppConfig } from '../Models/app-config';
import { Observable } from 'rxjs';
import { ConfigSetting } from '../Models/config-setting';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private appConfig: AppConfig;
  baseApiUrl: string = environment.BaseApiUrl+'/config';

  constructor(private http: HttpClient) { }

  loadAppConfig() {
    return this.http.get(this.baseApiUrl)
      .toPromise()
      .then((data:any) => {
        this.appConfig = data;
      });
  }

  getConfig() {
    return this.appConfig;
  }

  GetConfigSettings(): Observable<ConfigSetting[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<ConfigSetting[]>(this.baseApiUrl+'/GetConfigSettings/'+comID);
  }

  SaveConfigSetting(data: ConfigSetting[]): Observable<void> {
    return this.http.post<void>(this.baseApiUrl, data);
  }
}
