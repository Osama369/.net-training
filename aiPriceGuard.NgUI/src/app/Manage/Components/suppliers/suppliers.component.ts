import { Component, OnInit } from '@angular/core';
import{SupplierService} from '../../Services/supplier.service'
import { Supplier } from '../../Models/supplier.model';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit{
  suppliers:any;
  suppData : any;
  cols:any;
  SupplierVisible:boolean=false;
  notEditable:boolean=false;
  constructor(private suppService:SupplierService,private toastr:ToastrService){}
  ngOnInit(){
  
    this.suppService.GetAllSuppliers().subscribe(suppList =>{

      this.suppliers = (suppList as { [key: string]: any })["enttityDataSource"];
      this.cols = (suppList as { [key: string]: any })["entityModel"];
 
      // this.vendors.filter(x=>x.vendName.toLowerCase() == "opening stock")[0].isActionBtn  = true;
    });
    
}
GetChildCompData(eventData:any){
  this.SupplierVisible = false;

  if(eventData.SupplierId!=0){
    let addFlag =true;
    this.suppliers.forEach(element => {
      if(element.SupplierId === eventData.SupplierId){
        //element = eventData;
        element.SupplierName = eventData.SupplierName;
        element.Address = eventData.Address;
        element.Fax = eventData.Fax;
        element.Phone = eventData.Phone;
        element.State = eventData.State;
        element.PostCode = eventData.PostCode;
        addFlag=false;
      }
    });
    if(addFlag==true){
      this.suppliers.push(eventData);

    }
  }
 
}
DeleteSupplier(supplier:any){
 
  
  if(supplier.SupplierId!=0){

    this.suppService.Delete(supplier).subscribe(resp=>{
    
     this.toastr.success('Supplier Deleted Successfully');
     this.suppliers =this.suppliers.filter(x=> x.SupplierId!= resp.SupplierId);
     

    },
    error => {
      // Error handler
      let errorMessage = 'An error occurred while deleting the supplier.';
      if (error && error.error && error.error.message) {
        errorMessage = error.error.message;  // Assuming the server returns an error message in this format
      }
      this.toastr.error(errorMessage);
    });
  }
}
CancelPopup(event:any){
  this.SupplierVisible = event;
}
handleTool(event:any){
        if(event.type === 'add'){
          this.SupplierVisible = true;
          this.notEditable =false;
          this.suppData =undefined
        }else if(event.type ==='edit'){
          this.SupplierVisible = true;
          this.suppData = event.value;
          this.notEditable=true;
          // let suppM = this.suppliers.find(x=> x.)
        }else if(event.type==='delete'){
  
          this.DeleteSupplier(event.value);
        }
  }
}
