import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { Observable, map } from 'rxjs';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { Vendor } from '../../Models/vendor';
import { VendorService } from '../../Services/vendor.service';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css']
})

export class VendorsComponent implements OnInit {
    cols:any []= [];
    exportedCol:any []= [];
    data:any[];
    vendors: Vendor[];
    VendorID: any;
    loading: boolean = true;
    VendorVisible: boolean = false;
    vndList : Vendor[];
    title :any;
    UploadToolVisibility : boolean = false;
    methodName : any;
    serviceName : any;

    // Visibility: boolean = false;

    constructor(private vendorService: VendorService, private router: Router,
      private authService : AuthService, private ToastrService : ToastrService
      ) { }

    ngOnInit() {
        this.vendorService.getAllVendor().subscribe(vnd => {
            this.vendors = (vnd as { [key: string]: any })["enttityDataSource"];
            this.cols = (vnd as { [key: string]: any })["entityModel"];
            this.vendors.filter(x=>x.vendName.toLowerCase() == "opening stock")[0].isActionBtn  = true;
            this.loading = false;
        });
    }


    clear(table: Table) {
        table.clear();
    }

    editView(invoiceNo:any)
    {
        this.router.navigateByUrl('/AddNewSale/'+invoiceNo);
    }

    deleteView(vendID:any)
    {
        if (confirm("Are you sure you want to delete this Vendor?") == true) {
            this.loading = true;
            this.vendorService.deleteVendor(vendID).subscribe({
              next:(result)=>{
                this.ToastrService.success("Vendor has been successfully deleted!");
                  this.vendors = this.vendors.filter(item => item.vendID !== vendID);
              },
              error:(responce)=>{
                this.ToastrService.error(responce.error);
              }
            })
        }
    }
    closeVendorRegistration()
    {

    }

    handleChildData(data: any) {
        if(data.type == 'add')
        {
          this.authService.checkPermission('SuppliersCreate').subscribe(x=>{
            if(x)
            {
              this.title = "Supplier Registration";
              this.vndList = [];
              this.VendorVisible = true;
            }
            else{
              this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
            }
          });

        }
        else if(data.type == 'edit')
        {
          this.authService.checkPermission('SuppliersEdit').subscribe(x=>{
            if(x)
            {
              this.title = "Supplier Edit";
              this.vndList = data.value;
              this.VendorVisible = true;
            }
            else{
              this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
            }
          });

        }
        else if(data.type == 'added')
        {
            this.vendors.push(data.value);
            this.VendorVisible = false;
        }
        else if(data.type == 'delete')
        {
          this.authService.checkPermission('SuppliersDelete').subscribe(x=>{
            if(x)
            {
              this.deleteView(data.value.vendID);
            }
            else{
              this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
            }
          });
        }
        else
        {
          this.vendors = this.vendors.map(vendors => {
            if (vendors.vendID === data.value.vendID) {
                return data.value; // Update the matching customer with new values
            } else {
                return vendors; // Keep other customers unchanged
            }
            });
            this.VendorVisible = false;
        }
    }

    handleTool(data:any)
    {

      this.authService.checkPermission('SuppliersCreate').subscribe(x=>{
        if(x)
        {
          this.UploadToolVisibility = data;
          this.exportedCol = [{
                  "CODE":"000",
                  "NAME":  "Any",
                  "ADDRESS": "xyz",
                  "PHONE": "0000000000",
                  "VAT NO": "000000",
                  'VAT %': "0",
                  "OPENING BALANCE":0,
                  "LOCATION":"Any",
              }]
          this.serviceName = "VendorService";
          this.methodName = "uploadVendors";
        }
        else{
          this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        }
      });

    }

    getInsertedRow(data:any)
    {
        if(this.vendors != undefined)
        {
          data.forEach((elem: any) => {
            this.vendors.push(elem);
          });
        }
        this.UploadToolVisibility = !this.UploadToolVisibility;
    }
}
