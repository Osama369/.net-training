import { Injectable } from '@angular/core';
import { Product } from '../../Manage/Models/product';
import { FileVM } from '../../Manage/Models/file-vm.model';
import { GenericService } from './generic.service';
import { Companies } from 'src/app/Administration/Models/companies';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  producList: Product[] =[{}] ;
  fileList:FileVM[]=[];
  CompanyConfig:any;
  constructor(private genericService:GenericService) { }
  GetAllProducts():Product[]{
    return this.producList;
  }
  UpsertProduct(product:Product){
    if(product.IsUpdate){
       this.producList.forEach(element=>{
          if(element.prodID = product.prodID){
            element =element;
          }
      });
      console.log('update');
    }else{
      this.producList.push(product);
      console.log('ADD');
    }
  }
  GetProduct(ProdId:any):any{
    if(ProdId){
      console.log('List:',this.producList);
      return this.producList.find(x=> x.prodID ==ProdId);
    }
  
  }
  SetProductList(ProduList:any){
    this.producList = ProduList;
  }
  DeleteProduct(product:Product){
    this.producList = this.producList.filter(x=> x.prodID!= product.prodID);
    
  }
  UpsertFile(filedt:FileVM){
    const FileExist =this.fileList.find(x=> x.FileId=== filedt.FileId);
    if(FileExist){
      this.fileList.forEach(x=>{
        if(x.FileId===filedt.FileId){
          x=filedt;
        }
      });
    }else{
    this.fileList.push(filedt);
    }
  }
  GetFile(FileId:any):any{
    if(FileId){
      console.log('List:',this.producList);
      return this.fileList.find(x=> x.FileId ==FileId);
    }
  }
  GetAllFile():FileVM[]{
    return this.fileList;
  }
   async GetCompanyConfig():Promise<Companies>{
    let companyConfig:any;
    this.CompanyConfig = await lastValueFrom(this.genericService.getConfiguration());
    console.log('serv:',this.CompanyConfig);
    return this.CompanyConfig;
  }
  SetFileList(fileList:any){
    this.fileList = fileList;
  }
  
}
