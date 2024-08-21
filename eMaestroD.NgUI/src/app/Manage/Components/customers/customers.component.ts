import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { Customer } from '../../Models/customer';
import { CustomersService } from '../../Services/customers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})

export class CustomersComponent implements OnInit {
    cols: any[] = [];
    exportedCol: any[] = [];
    customers: Customer[];
    cstID: any;
    loading: boolean = true;
    CustomerVisible: boolean = false;
    cstList : Customer[];
    title :any;
    UploadToolVisibility : boolean = false;
    methodName : any;
    serviceName : any;

    constructor(private customerService: CustomersService,
      private router: Router,
      private authService: AuthService,
      private ToastrService: ToastrService,
      ) { }

    ngOnInit() {
        this.customerService.getAllCustomers().subscribe(cst => {
            this.customers = (cst as { [key: string]: any })["enttityDataSource"];
            this.cols = (cst as { [key: string]: any })["entityModel"];
            console.log(this.customers);
            this.customers.filter(x=>x.cstName.toLowerCase() == "walk in")[0].isActionBtn  = true;
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

    deleteView(cstID:any)
    {

        if (confirm("Are you sure you want to delete this Customer?") == true) {
            this.loading = true;
            this.customerService.deleteCustomer(cstID).subscribe({
              next:(result)=>{
                this.customers = this.customers.filter(x => x.cstID !== cstID);
                this.ToastrService.success("Customer has been successfully deleted.");
              },
              error:(responce)=>{
                this.ToastrService.error(responce.error);
              }
            });
        }
    }
    closeCustomerRegistration()
    {
        //   this.customerService.getAllCustomers().subscribe(cst => {
        //     this.customers = cst;
        //     this.loading = false;
        // });
    }

   handleChildData(data: any) {
        if(data.type == 'add')
        {
          this.authService.checkPermission('CustomersCreate').subscribe(x=>{
            if(x)
            {
              this.title = "Customer Registration";
              this.cstList = [];
              this.CustomerVisible = true;
            }
            else{
              this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
            }
          });

        }
        else if(data.type == 'edit')
        {
            this.authService.checkPermission('CustomersEdit').subscribe(x=>{
            if(x)
            {
              this.title = "Customer Edit";
              this.cstList = data.value;
              this.CustomerVisible = true;
            }
            else{
              this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
            }
          });

        }
        else if(data.type == 'added')
        {
            this.customers.push(data.value);
            this.CustomerVisible = false;
        }
        else if(data.type == 'delete')
        {

          this.authService.checkPermission('CustomersDelete').subscribe(x=>{
            if(x)
            {
              this.deleteView(data.value.cstID);
            }
            else{
              this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
            }
          });
        }
        else
        {
          this.customers = this.customers.map(customer => {
            if (customer.cstID === data.value.cstID) {
                return data.value; // Update the matching customer with new values
            } else {
                return customer; // Keep other customers unchanged
            }
            });
            this.CustomerVisible = false;
        }
    }


    handleTool(data:any)
    {
      this.authService.checkPermission('CustomersCreate').subscribe(x=>{
        if(x)
        {
          this.UploadToolVisibility = data;
          this.exportedCol  = [{
                  "CODE":"000",
                  "NAME":  "Any",
                  "ADDRESS": "xyz",
                  "PHONE": "0000000000",
                  "VAT NO": "000000",
                  'VAT %': "0",
                  "OPENING BALANCE":0
                  // companyName: localStorage.getItem('comName')
                  }]
          this.serviceName = "CustomerService";
          this.methodName = "uploadCustomers";
        }
        else{
          this.ToastrService.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }

    getInsertedRow(data:any)
    {
        if(this.customers != undefined)
        {
          data.forEach((elem: any) => {
            this.customers.push(elem);
          });
        }
        this.UploadToolVisibility = !this.UploadToolVisibility;
    }
}
