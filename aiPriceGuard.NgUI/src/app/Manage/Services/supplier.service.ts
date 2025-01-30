import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  baseApiUrl:any = environment.BaseApiUrl+'/Supplier'
   comID:any =localStorage.getItem('comID');
  constructor(private http:HttpClient) { }


  GetAllSuppliers():Observable<any>{
     return this.http.get<any>(this.baseApiUrl+'/GetAllSuppliers/'+this.comID)
  }
  UpsertSupplier(supplier:any):Observable<any>{
   return this.http.post<any>(this.baseApiUrl+'/UpsertSupplier',supplier);
  }
  Delete(supplier:any):Observable<any>{
    return this.http.delete<any>(this.baseApiUrl+'/Delete',{
    body:supplier,
    headers: { 'Content-Type': 'application/json' }
    });
  }
}
