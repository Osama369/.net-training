import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Offer } from '../Models/offer';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private apiUrl = `${environment.BaseApiUrl}/Offer`;

  constructor(private http: HttpClient) { }

  // Get all offers
  getOffers(): Observable<Offer[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<Offer[]>(`${this.apiUrl}/${comID}`);
  }

  // Upsert offer (add or update)
  upsertOffer(offer: Offer): Observable<Offer> {
    let comID = localStorage.getItem('comID');
    offer.comID = comID;
    return this.http.post<Offer>(`${this.apiUrl}/upsert`, offer);
  }

  // Delete offer
  deleteOffer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
