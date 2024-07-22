import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Products } from '../models/products';
import { HttpClient } from '@angular/common/http';
import { Cities } from '../models/cities';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {
  // baseApiUrl: string = "https://localhost:44386";
  baseApiUrl: string = environment.BaseApiUrl + '/cities';
  
  constructor(private http: HttpClient) { }

  getAllCities(): Observable<Cities[]> {
    return this.http.get<Cities[]>(this.baseApiUrl);
  }
}
