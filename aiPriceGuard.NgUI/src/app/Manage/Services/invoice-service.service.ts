import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RenderJson } from '../Models/render-json';
import { environment } from '../../../environments/environment';
import { json } from 'stream/consumers';

@Injectable({
  providedIn: 'root'
})
export class InvoiceServiceService {
  private BaseUrlForInvoice = environment.BaseApiUrl +'/Invoice';
  comID :any = localStorage.getItem('comID');
  constructor(private http:HttpClient) { }
  ProcessFile(FileID:any,supplierID:any){
    return this.http.get<RenderJson>(this.BaseUrlForInvoice+'/ProcessFile/'+FileID+'/'+this.comID+'/'+supplierID);
  }
  ValidateDuplicateProductCode(prodCode:any){
    console.log('func:',prodCode);
    return this.http.get<any>(this.BaseUrlForInvoice+'/CheckDuplicate/'+prodCode);
  }
  Save(jsonObj:RenderJson){
    jsonObj.comID = this.comID;
    console.log('comID',this.comID);
    return this.http.post<RenderJson>(this.BaseUrlForInvoice+'/Save',jsonObj);
  }
  
}
