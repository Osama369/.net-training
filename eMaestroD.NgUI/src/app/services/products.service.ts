import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Products } from '../models/products';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Companies } from '../models/companies';
import { Vendor } from '../models/vendor';
import { COA } from '../models/COA';
import { prodGroups } from '../models/prodGroups';
import { __await } from 'tslib';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  // baseApiUrl: string = "https://localhost:44386";
  baseApiUrl: string = environment.BaseApiUrl+ '/products/';

  constructor(private http: HttpClient) { }

  saveProduct(productlist: Products): Observable<Products[]> {
    return this.http.post<Products[]>(this.baseApiUrl, productlist);
  }

  deleteProduct(prodID: any) {
    return this.http.delete<any>(this.baseApiUrl+prodID);
  }

  getAllProducts(): Observable<Products[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<Products[]>(this.baseApiUrl+comID);
  }

  getAllProductsWithCategory(): Observable<Products[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<Products[]>(this.baseApiUrl+'getAllProductWithCategory/'+comID);
  }

  uploadProducts(formData:any){
    let com = localStorage.getItem('comID');
    const headers = new HttpHeaders({
      'comID': com != null? com : "",
    });
    const options = { headers: headers };
    return this.http.post<any>(this.baseApiUrl+'uploadProducts/', formData, options);
  }

  getProductStock(prdID : Products): Observable<Products[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<Products[]>(this.baseApiUrl+'GetStockofProduct/'+prdID+'/'+comID);
  }

  getLowStockProducts(): Observable<any[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<any[]>(this.baseApiUrl+'GetLowStockProducts/'+comID+'');
  }

  confirmProductCategory(formData:any): Observable<any[]> {
    let com = localStorage.getItem('comID');
    const headers = new HttpHeaders({
      'comID': com != null? com : "",
    });
    const options = { headers: headers };
    return this.http.post<any[]>(this.baseApiUrl+'confirmProductCategory/',formData, options);
  }

  GenerateBarcode(list:any): Observable<any> {
    return this.http.post<any>(this.baseApiUrl+'BarcodeGenerator/',list, {responseType:'text' as 'json'});
  }
}
