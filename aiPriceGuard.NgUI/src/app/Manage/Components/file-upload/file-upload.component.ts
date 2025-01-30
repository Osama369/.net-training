import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../../Shared/Services/shared-data.service';
import { FileVM } from '../../Models/file-vm.model';
import { SupplierService } from '../../Services/supplier.service';
import { lastValueFrom } from 'rxjs';
import { FileUploadService } from '../../Services/file-upload.service';

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
  ,private fileService:FileUploadService
){}
async ngOnInit() {

  const response = await lastValueFrom(this.fileService.GetAllFiles());
  this.FileList = (response as { [key: string]: any })["enttityDataSource"];
  this.cols = (response as { [key: string]: any })["entityModel"];
  this.sharedService.SetFileList(this.FileList);
  // this.FileList =this.sharedService.GetAllFile();

}
async handleChildData(childData:any){
  // console.log('child',childData);
  if(childData.FileObj){
    const Response =await lastValueFrom(this.fileService.ProcessFile(childData.FileObj.FileId));
    this.sharedService.UpsertFile(Response);

  }
  if(!childData.flag && childData.data===undefined){
   
    this.FileModelVisible = childData.flag;
  }
    if(childData && childData.type){
      console.log('type');
      if(childData.type =='add'){
        this.FileModelVisible =true;
      }
    }
  }
}
