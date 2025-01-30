import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../Models/product';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

 baseApiUrl :string =  environment.BaseApiUrl +'/Product';
 comID =localStorage.getItem('comID');
  constructor(private http:HttpClient) { }

  // GetOneProductDetail(prodID:any):Observable<Product>{
  //   let comID = localStorage.getItem('comID');
  //   return this.http.get<Product>(this.baseApiUrl+'/GetOneProductDetail/'+comID+'/'+prodID);
  // }
  IsBarcodeExist(xd:any,yc:any):Observable<boolean>{
   
    let prodID =1;
    return this.http.get<boolean>(this.baseApiUrl+'GetOneProductDetail/'+this.comID+'/'+prodID);
  }
  GetAllProducts():Observable<Product[]>{
    return this.http.get<Product[]>(this.baseApiUrl + '/GetAllProducts'+'/'+this.comID);
  } 
  saveProduct(product:Product):Observable<any>{    
    return this.http.post<Product>(this.baseApiUrl+'/UpsertProduct',product);
  }
  deleteProduct(prodID:any):Observable<any>{    
   console.log('prodID:',prodID);
    return this.http.delete<Product>(this.baseApiUrl+'/Delete/'+prodID+'/'+this.comID);
  }
  GetOnProductDetails(comID:any,prodID):Observable<Product>{
   return this.http.get<Product>(this.baseApiUrl+'/GetOneProductDetail/'+this.comID+'/'+prodID) 
  }
}
