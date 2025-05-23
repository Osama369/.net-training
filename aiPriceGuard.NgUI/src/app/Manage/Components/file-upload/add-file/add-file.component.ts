import { Component, Output,EventEmitter, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Supplier } from '../../../Models/supplier.model';
import { SharedDataService } from '../../../../Shared/Services/shared-data.service';
import { SupplierService } from '../../../Services/supplier.service';
import { lastValueFrom } from 'rxjs';
import { FileUploadService } from '../../../Services/file-upload.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.scss']
})
export class AddFileComponent implements OnInit{

filteredSuppliers:Supplier[];
Suppliers:Supplier[]= [];
SelectedSupplier:Supplier;
fileTypes:any;
fileSize:any;
UploadBtnDisable:boolean=true;
FileModule:any;
FormValidate:boolean = false;
// suppSelected:boolean = false;
@Output() dataEvent= new EventEmitter<any>();
@Input() supplierData:any;
@ViewChild('file') file:any;
constructor(private sharedService:SharedDataService,private supplierService:SupplierService,
            private fileService:FileUploadService,private toastr: ToastrService
){}
async ngOnInit() {

   const response = await lastValueFrom(this.supplierService.GetAllSuppliers());
   this.filteredSuppliers = (response as {[key:string]:any})["enttityDataSource"];
   const companyConfig =await this.sharedService.GetCompanyConfig();
  this.fileTypes = companyConfig[0].FileTypes;
  this.fileSize = companyConfig[0].FileSize;

}


  filterSupplier(event:any){
    
    const queryCase = event.query.toLowerCase(); 
    this.filteredSuppliers =this.filteredSuppliers.filter(x=> x.SupplierName?.toLowerCase().includes(queryCase));
  }
  onSupplierSelect()
  {
    
  }
  ValidationCheck(){
   
    if(this.file && this.file.files.length >0 && this.SelectedSupplier){
      console.log('supplierSelected');
      this.FormValidate = true;
      this.UploadBtnDisable = false;
    }
  
  }
  async onUpload(){
   

    if(!this.UploadBtnDisable){
    
      console.log('file:',this.file)
      if(this.file.files && this.file.files.length>0){
     
        // console.log('Supplier:',this.SelectedSupplier);

        // console.log('SupplierID:',this.SelectedSupplier.SupplierId);
        const response =await lastValueFrom(this.fileService.UpsertFile(this.file,this.SelectedSupplier.SupplierId,this.SelectedSupplier.SupplierName));
        // console.log('response:',response);
        if(response){
          this.toastr.success('File Added Successfully.');
        this.sharedService.UpsertFile(response);
            this.dataEvent.emit({flag:false,data:undefined});
        }
      //  console.log('respnonse',response);
      }

    }
  }

}
