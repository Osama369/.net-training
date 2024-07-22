
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Customer } from '../models/customer';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  // baseApiUrl: string = "https://localhost:44386";
  baseApiUrl: string = environment.BaseApiUrl + '/customers/';

  constructor(private http: HttpClient) { }

  getAllCustomers(): Observable<Customer[]> {
    let comID = localStorage.getItem('comID');
    return this.http.get<Customer[]>(this.baseApiUrl+comID);
  }

  GetAllCustomerIncludeWalkIn(){
    let comID = localStorage.getItem('comID');
    return this.http.get<Customer[]>(this.baseApiUrl+'GetAllCustomerIncludeWalkIn/'+comID);
  }


  deleteCustomer(cstID: any) {
    return this.http.delete<any>(this.baseApiUrl+cstID);
  }

  saveCustomer(customerList: Customer): Observable<Customer[]> {
    return this.http.post<Customer[]>(this.baseApiUrl, customerList);
  }

  uploadCustomers(formData:any){
    let com = localStorage.getItem('comID');
    const headers = new HttpHeaders({
      'comID': com != null? com : "",
    });
    const options = { headers: headers };
    return this.http.post<any>(this.baseApiUrl+'uploadCustomers/', formData, options);
  }

  GetCustomerByPhoneNo(phoneNo : any)
  {
    let comID = localStorage.getItem('comID');
    return this.http.get<Customer>(this.baseApiUrl+'GetCustomerByPhoneNo/'+phoneNo+'/'+comID);
  }

  GetCstCode(){
    let comID = localStorage.getItem('comID');
    return this.http.get<string>(this.baseApiUrl+'GetCustomerByPhoneNo/'+comID);
  }
}
