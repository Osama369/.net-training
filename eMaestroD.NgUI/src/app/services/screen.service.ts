import { Injectable } from '@angular/core';
import { Screen } from '../models/screen';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {

  baseApiUrl: string = environment.BaseApiUrl + '/Screen/';

  constructor(private http: HttpClient) { }

  saveScreen(list: Screen): Observable<Screen> {
    return this.http.post<Screen>(this.baseApiUrl, list);
  }

  getAllScreen(): Observable<Screen[]> {
    return this.http.get<Screen[]>(this.baseApiUrl);
  }
}
