import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProdManufacture } from '../Models/prod-manufacture';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProdManufactureService {

  private apiUrl = `${environment.BaseApiUrl}/ProdManufactures`;

  constructor(private http: HttpClient) {}

  getProdManufactures(): Observable<ProdManufacture[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<ProdManufacture[]>(`${this.apiUrl}?comID=${comID}`);
  }

  upsertProdManufacture(prodManufacture: ProdManufacture): Observable<ProdManufacture> {
    let comID = localStorage.getItem('comID');
    prodManufacture.comID = comID;
    return this.http.post<ProdManufacture>(this.apiUrl, prodManufacture);
  }

  deleteProdManufacture(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
