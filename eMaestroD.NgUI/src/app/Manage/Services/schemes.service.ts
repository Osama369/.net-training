import { Injectable } from '@angular/core';
import { ProdDiscount } from '../Models/prod-discount';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchemesService {
  private baseUrl = `${environment.BaseApiUrl}/Schemas`;

  constructor(private http: HttpClient) {}

  // Get all ProdDiscounts
  getAllSchemes(): Observable<ProdDiscount[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<ProdDiscount[]>(`${this.baseUrl}/${comID}`);
  }


  // Upsert (add or update) a ProdDiscount
  saveSchemes(prodDiscount: ProdDiscount[]): Observable<ProdDiscount> {
    return this.http.post<ProdDiscount>(`${this.baseUrl}/SaveProdDiscount`, prodDiscount);
  }

  updateSchemes(prodDiscount: ProdDiscount[]): Observable<ProdDiscount> {
    return this.http.post<ProdDiscount>(`${this.baseUrl}/UpdateProdDiscount`, prodDiscount);
  }

  // Delete a ProdDiscount by ID
  deleteSchemes(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
