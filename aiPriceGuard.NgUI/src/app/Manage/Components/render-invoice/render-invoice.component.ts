import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../../Shared/Services/shared-data.service';
import { RenderJson } from '../../Models/render-json';
import { FileUploadService } from '../../Services/file-upload.service';
import { lastValueFrom } from 'rxjs';
import { InvoiceServiceService } from '../../Services/invoice-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-render-invoice',
  templateUrl: './render-invoice.component.html',
  styleUrls: ['./render-invoice.component.scss']
})
export class RenderInvoiceComponent implements OnInit {
  JsonData:RenderJson ={};
  hideSaveBtn:boolean=true;
  constructor(private sharedService:SharedDataService ,private fileUploadService:FileUploadService
    ,private invoiceService:InvoiceServiceService,private toastr:ToastrService
  ){}
  ngOnInit(): void {
    this.JsonData = this.sharedService.GetJsonData();
    if(this.JsonData.OrderDate){
      this.hideSaveBtn= false;
    }else{
      this.hideSaveBtn= true;
    }
    // console.log('hideSveBtn:',this.hideSaveBtn);
    // console.log('jsonOBJ:',this.JsonData);

  }
  async ValidateDuplicate(eventDt:any){
    const text = eventDt.target as HTMLInputElement;


    // let isDuplicate= await lastValueFrom(this.invoiceService.ValidateDuplicateProductCode(text.value));
    let isDuplicate= false;

    if(isDuplicate){
      this.toastr.error("This Product Code Already Exist");
      this.hideSaveBtn=true;
    }else{
      this.hideSaveBtn=false;
    }
    
  }
  save(){
    const responseObj =   lastValueFrom(this.invoiceService.Save(this.JsonData));
    
  }
}
