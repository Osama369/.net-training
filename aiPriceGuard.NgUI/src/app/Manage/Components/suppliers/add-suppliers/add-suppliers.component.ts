import { Component, Output,EventEmitter, ElementRef, QueryList, ViewChild, ViewChildren, Input, OnInit, OnChanges } from '@angular/core';
import { Router } from 'express';
import { SupplierService } from '../../../Services/supplier.service';
import { Supplier } from '../../../Models/supplier.model';
import { ToastrService } from 'ngx-toastr';
import { error } from 'console';



@Component({
  selector: 'app-add-suppliers',
  templateUrl: './add-suppliers.component.html',
  styleUrls: ['./add-suppliers.component.scss']
})
export class AddSuppliersComponent implements OnInit,OnChanges {
  name:string;
  address:string;
  fax:any;
  phone:any;
  state:any;
  postCode:any;
  suppCode:any;
  supplierId:any;
  notEditFieldDisable:boolean=true;
  Suburb:any;
  saveBtnDisabled:boolean =false;

 @Output() supplierData = new EventEmitter<any>();
 @Output() cancelPopup = new EventEmitter<any>();

 @Input() suppModel: any;
 @Input() notEditable:any;

  constructor(private supplierService:SupplierService,private toastr:ToastrService){

  }
  ngOnInit(){
  }
  ngOnChanges(){
    
    if(this.suppModel == undefined){
      this.notEditFieldDisable = false;
      this.name = "";
      this.address = "";
      this.supplierId = "";
      this.fax = "";
      this.phone = "";
      this.state = "";
      this.postCode = "";
      this.suppCode = "";
      
      
    }else{
      
      this.name = this.suppModel.SupplierName;
      this.address = this.suppModel.Address;
      this.supplierId = this.suppModel.SupplierId;
      this.fax = this.suppModel.Fax;
      this.phone = this.suppModel.Phone;
      this.state = this.suppModel.State;
      this.postCode = this.suppModel.PostCode;
      this.suppCode = this.suppModel.SupplierCode;
      this.notEditFieldDisable = true;
      
    }
    console.log('fax',this.suppModel);
    
   
    // console.log('fax',this.suppModel); 
    // console.log('name:',this.suppModel.name); 
    // console.log('editable:',this.notEditFieldDisable); 

  }
  clearVM(){
    this.name = "";
    this.address = "";
    this.supplierId = 0;
    this.fax = "";
    this.phone = "";
    this.state = "";
    this.postCode = "";
    this.suppCode = "";
  }
  Cancel(){
    this.cancelPopup.emit(false);
  }
  AddSupplier(){
    this.saveBtnDisabled=true;
    if(this.suppCode === '' || this.suppCode === undefined){
      this.toastr.error('Please provide supplier code');
    this.saveBtnDisabled=false;

    }else if(this.name === '' || this.name === undefined){
      this.toastr.error('Please provide supplier name');
    this.saveBtnDisabled=false;

    }else{

      let suppModel = new Supplier();
      suppModel.SupplierName = this.name;
      suppModel.SupplierCode = this.suppCode;
      suppModel.Phone = this.phone;
      suppModel.Address = this.address;
      suppModel.Fax = this.fax;
      suppModel.State = this.state;
      suppModel.PostCode = this.postCode;
      suppModel.comID = localStorage.getItem('comID');
      suppModel.Suburb =this.Suburb;
      if(this.supplierId!=undefined){
        suppModel.SupplierId = this.supplierId;
      }else{ 
        suppModel.SupplierId =0;
      }

      console.log('supModel:',suppModel)
      this.supplierService.UpsertSupplier(suppModel).subscribe(response =>{
        this.toastr.success('Supplier added successfully.');
   
        this.saveBtnDisabled=false;
        this.clearVM();
          this.supplierData.emit(response);

      },
      (error) =>{
        if(error && error.error){
          this.saveBtnDisabled=false;
          this.toastr.error(error.error);
        }
                
      });



    }
      
  }


}
