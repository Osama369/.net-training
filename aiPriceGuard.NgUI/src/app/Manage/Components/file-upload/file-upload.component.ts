import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../../Shared/Services/shared-data.service';
import { FileVM } from '../../Models/file-vm.model';
import { SupplierService } from '../../Services/supplier.service';
import { lastValueFrom } from 'rxjs';
import { FileUploadService } from '../../Services/file-upload.service';
import {  Router } from '@angular/router';
import { InvoiceServiceService } from '../../Services/invoice-service.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
FileModelVisible:boolean=false;
FileList:FileVM[];
cols:any[];

// supplierData:any;
constructor(private sharedService:SharedDataService,private supplierService:SupplierService
  ,private fileService:FileUploadService,private route:Router,private invoiceService:InvoiceServiceService
){}
async ngOnInit() {

  const response = await lastValueFrom(this.fileService.GetAllFiles());
  this.FileList = (response as { [key: string]: any })["enttityDataSource"];
  this.cols = (response as { [key: string]: any })["entityModel"];
  this.sharedService.SetFileList(this.FileList);
  // this.FileList =this.sharedService.GetAllFile();

}
call(){
  this.route.navigateByUrl('/Manage/Invoice');
}
async handleChildData(childData:any){
  console.log('child',childData);
  if(childData.FileObj){
    // console.log('fileOBJ:',childData.FileObj);
    // console.log('supplierID:',childData.FileObj.supplierID);
    console.log('fileOBJ',childData.FileObj);
    let Response =await lastValueFrom(this.invoiceService.ProcessFile(childData.FileObj.FileId,childData.FileObj.supplierID));
    Response.fileURL =  childData.FileObj.FileUrl;
    this.sharedService.SetJsonData(Response);
    this.route.navigateByUrl('/Manage/Invoice');
    // console.log("response:",Response);

  }
  if(!childData.flag && childData.data===undefined){
   
    this.FileModelVisible = childData.flag;
  }
    if(childData && childData.type){
      // console.log('type');
      if(childData.type =='add'){
        this.FileModelVisible =true;
      }
    }
  }
}
