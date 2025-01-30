import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FileVM } from '../Models/file-vm.model';
import { Observable,of } from 'rxjs';
import { GenericService } from '../../Shared/Services/generic.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  
  private BaseUrl = environment.BaseApiUrl +'/FileUpload';
  private form:FormData=new FormData();
  private comID:any = localStorage.getItem('comID'); 
  constructor(private http:HttpClient,private genericService:GenericService) { }
  UpsertFile(file:any,suppID:any,suppName:any):Observable<any>{
    
      const fileDt = file.files[0];
      this.form.append("file",fileDt,fileDt.name);
      this.form.append('FileName',fileDt.name);
      this.form.append('FileType',fileDt.type);
      this.form.append('supplierID',suppID);
      this.form.append('comID',this.comID);
      this.form.append('supplierName',suppName);
      

      return this.http.post<FileVM>(this.BaseUrl+'/UpsertFile',this.form);   
  }
  GetAllFiles():Observable<any>{
      return this.http.get<any>(this.BaseUrl+'/GetAllFiles/'+this.comID);    
  }
  ProcessFile(FileID:any){
    return this.http.get<any>(this.BaseUrl+'/ProcessFile/'+FileID+'/'+this.comID);
  }
}
