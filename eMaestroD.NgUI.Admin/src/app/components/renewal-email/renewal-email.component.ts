import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { TenantService } from 'src/app/services/tenant.service';
import { Tenants } from 'src/app/models/tenants';
import { ConfirmationService, MessageService } from 'primeng/api';


@Component({
  selector: 'app-renewal-email',
  templateUrl: './renewal-email.component.html',
  styleUrls: ['./renewal-email.component.scss'],
  providers: [ConfirmationService,MessageService]
})

export class RenewalEmailComponent implements OnInit {
  constructor(
    private _TenantService: TenantService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private _ToastrService: ToastrService,
    ) { }

    tenantlist: Tenants[] = [];
    exportColumns : any[] = [];
    loading : boolean = true;
    IsEdit : boolean = false;
    AddTenantVisibility:boolean = false;
    title:any;
    list:Tenants[]= [];
    todayDate : any;
    selectedList: any[] = [];

    ngOnInit() {
        this._TenantService.getAllTenants().subscribe(tenant => {
          this.tenantlist = tenant;
            this.loading = false;
            this.exportColumns.push(new Object({title: "Company Name",dataKey: "tenantName"}));
            this.exportColumns.push(new Object({title: "First Name",dataKey: "firstName"}));
            this.exportColumns.push(new Object({title: "Last Name",dataKey: "lastName"}));
            this.exportColumns.push(new Object({title: "Address",dataKey: "address1"}));
            this.exportColumns.push(new Object({title: "Email Address",dataKey: "email"}));
            this.exportColumns.push(new Object({title: "Phone",dataKey: "businessPhone"}));
            this.exportColumns.push(new Object({title: "Email Confirmed",dataKey: "isEmailConfirmed"}));
            this.exportColumns.push(new Object({title: "Country",dataKey: "country"}));
            this.exportColumns.push(new Object({title: "Type",dataKey: "subscriptionType"}));
            this.exportColumns.push(new Object({title: "SignUp Date",dataKey: "subscriptionDate"}));
            this.exportColumns.push(new Object({title: "Sub End Date",dataKey: "subscriptionEndDate"}));
            this.exportColumns.push(new Object({title: "Suspended",dataKey: "isSuspended"}));
            this.exportColumns.push(new Object({title: "Max User",dataKey: "maxUserCount"}));
            this.exportColumns.push(new Object({title: "Max Companies",dataKey: "maxCompaniesCount"}));
            this.exportColumns.push(new Object({title: "Max Location",dataKey: "maxLocationCount"}));
      });


    }
    isExpired(subscriptionEndDate: string): boolean {
    const endDate = new Date(subscriptionEndDate);
    const todayDate = new Date();
    return endDate < todayDate;
    }
    sendEmailToTenant()
    {
      if(this.selectedList.length > 0)
      {
        this._TenantService.sendEmailToTenant(this.selectedList).subscribe({
            next:(result)=>{
                this._ToastrService.success("Email Has Been Successfully Sended");
            },
            error:(err)=>{
              this._ToastrService.error(err.error);
            }
        })
      }
        else
      {
        this._ToastrService.error("Please Select Alteast One Tenant!");
      }
    }
    editView(tenantlist :any)
    {
      this.title = "Tenant Edit";
      this.list = tenantlist;
      this.IsEdit = true;
      this.AddTenantVisibility = true;

      // this.authService.checkPermission('TaxesEdit').subscribe(x=>{
      //   if(x)
      //   {
      //     this.title = "Edit Tax";
      //     this.list = tax;
      //     this.IsEdit = true;
      //     this.AddTenantVisibility = true;
      //   }
      //   else{
      //     this.toastr.error("Unauthorized Access! You don't have permission to access.");
      //   }
      // });
    }
    AddNew()
    {
      // this.authService.checkPermission('TaxesCreate').subscribe(x=>{
      //   if(x)
      //   {
      //     this.title = "Add New Tax";
      //     this.list = [];
      //     this.IsEdit = false;
      //     this.AddTenantVisibility = true;
      //   }
      //   else{
      //     this.toastr.error("Unauthorized Access! You don't have permission to access.");
      //   }
      // });

    }


    Delete(tenant :Tenants)
    {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to Delete, it Remove Database of this tenant Aslo?',
        header: ' ',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this._TenantService.deleteTenant(tenant.tenantID).subscribe({
              next:(list) =>{

                this._TenantService.getAllTenants().subscribe(tenant => {
                  this.tenantlist = tenant;
                });
                this._ToastrService.success("Successfully Deleted.");
              },
              error : (err)=>{
                this._ToastrService.error(err.error);
              }
              })
        }
      });
      // this.authService.checkPermission('TaxesDelete').subscribe(x=>{
      //   if(x)
      //   {
      //     this.confirmationService.confirm({
      //       message: 'Are you sure that you want to Delete?',
      //       header: ' ',
      //       icon: 'pi pi-exclamation-triangle',
      //       accept: () => {
      //         if(tax.isDefault == false)
      //         {
      //           this.taxesService.deleteTax(tax.TaxID).subscribe({
      //             next: (lst)=> {
      //               this.toastr.show("Successfully Deleted!");
      //               this.taxesService.getAllTaxes().subscribe(taxlst => {
      //                 this.taxlist = taxlst;
      //               })
      //             },
      //           })
      //         }
      //         else
      //         {
      //           this.toastr.error("Can't Delete Default Tax.")
      //         }
      //       }
      //     });
      //   }
      //   else{
      //     this.toastr.error("Unauthorized Access! You don't have permission to access.");
      //   }
      // });
    }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.tenantlist);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, "Tenants");
    });
  }

  handleChildData(data: any) {
      this._TenantService.getAllTenants().subscribe(tenant => {
        this.tenantlist = tenant;
      });
        this.AddTenantVisibility = false;
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  exportPdf() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default('l', 'px', 'a4');
        (doc as any).autoTable(this.exportColumns, this.tenantlist);

        doc.save('Tenants.pdf');
      });
    });
  }
}
