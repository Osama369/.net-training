import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { DatePipe, getCurrencySymbol } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ReportSettingService } from 'src/app/Reports/Services/report-setting.service';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { GenericService } from 'src/app/Shared/Services/generic.service';
import { InvoicesService } from '../../Services/invoices.service';
import { InvoiceView } from '../../Models/invoice-view';
import { GLTxTypes } from '../../Enum/GLTxTypes.enum';
import { lastValueFrom } from 'rxjs';
import { Invoice } from '../../Models/invoice';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-invoice-posting',
  templateUrl: './invoice-posting.component.html',
  styleUrls: ['./invoice-posting.component.scss']
})
export class InvoicePostingComponent implements OnInit {

    invoices: Invoice[] = [];
    tempinvoices: Invoice[] = [];
    invoiceNo: any;
    loading: boolean = true;
    PrintringVisible: boolean = false;
    InvoiceDetailvisible: boolean = false;
    Reportvisible: boolean = false;
    printtype:any = "A4";
    columns : any[] = [];
    exportColumns : any[] =[];
    CurrencyCode : any;
    reportSettingVisiblity : boolean = false;
    isProductCode : boolean = false;
    isArabic: boolean = false;
    reportSettingItemList : any[]=[];
    bookmark : boolean = false;
    DateFrom : any;
    DateTo : any;
    minDateTo: Date;
    maxDateTo: Date;

    selectedInvoice: Invoice[] = [];

    constructor(private invoiceService: InvoicesService,
      private genericService: GenericService,
      private router: Router,
      private toasterService: ToastrService,
      private authService : AuthService,
      private reportSettingService : ReportSettingService,
      public bookmarkService: BookmarkService,
      public route : ActivatedRoute,
      public confirmationService : ConfirmationService,
      private datePipe: DatePipe
      ) { }

    async ngOnInit() {

      this.reportSettingService.GetInvoiceReportSettings().subscribe(rpt=>{
        this.reportSettingItemList = rpt.filter(x=>x.screenName.toLowerCase() == "purchase");
      })

      let today = new Date();
      this.DateFrom = new Date(today.getFullYear(), today.getMonth(), 1);
      this.DateTo = today;

      try{
        var result = await lastValueFrom(this.invoiceService.GetInvoices(GLTxTypes.GoodsReceivedNote,0));
        this.tempinvoices = result;
        this.loading = false;
      }
      catch(error){
        this.toasterService.error(error);
      }


        // this.invoiceService.getInvoicesList(12).subscribe(invoices => {
        //     this.invoices = invoices;
        //     this.loading = false;
        //     this.exportColumns.push(new Object({title: "Date",dataKey: "dtTx"}));
        //     this.exportColumns.push(new Object({title: "Invoice No",dataKey: "voucherNo"}));
        //     this.exportColumns.push(new Object({title: "Name",dataKey: "cstName"}));
        //     this.exportColumns.push(new Object({title: "Comments",dataKey: "glComments"}));
        //     this.exportColumns.push(new Object({title: "Total",dataKey: "amount"}));
        // });

        this.authService.GetBookmarkScreen(this.route.snapshot?.data['requiredPermission']).subscribe(x=>{
          this.bookmark = x;
      });

    }

    UpdateBookmark(value:any){
      this.bookmarkService.Updatebookmark(this.route.snapshot.data['requiredPermission'],value).subscribe({
        next: (result: any) => {
          this.bookmark = value;
        },
      });;
    }


    clear(table: Table) {
        table.clear();
    }

    printView(invoiceNo:any)
    {
        this.invoiceNo = invoiceNo;
        if(this.reportSettingItemList.find(x=>x.key == "A4" && x.value == true) != undefined){
          this.printtype = "A4"
        }
        else{
          this.printtype = "Thermal"
        }
        this.isProductCode = this.reportSettingItemList.find(x=>x.key=="Add Product Code").value.toLocaleString();
        if(this.reportSettingItemList.find(x=>x.key == "English Only" && x.value == true) != undefined){
          this.isArabic = true;
        }
        else{
          this.isArabic = false;
        }
        this.Reportvisible = true;
        //this.PrintringVisible = true;
    }

    editView(invoiceNo:any)
    {
        this.router.navigateByUrl('/Invoices/AddNewGRN/'+invoiceNo);
    }

    deleteView(invoiceNo:any)
    {
      this.authService.checkPermission('GRNDelete').subscribe((x:any)=>{
        if(x)
        {
        if (confirm("Are you sure you want to delete this invoice?") == true) {
            this.loading = true;
            this.invoiceService.DeleteInvoice(invoiceNo).subscribe(asd => {
              this.toasterService.success("GRN has been successfully deleted!");
                this.invoices = this.invoices.filter(x=>x.invoiceVoucherNo != invoiceNo);
                this.loading = false;
              },
              responce =>{
                this.toasterService.error(responce.error);
                this.loading = false;
              }
            );
      }
      }
      else{
        this.toasterService.error("Unauthorized Access! You don't have permission to access.");
      }
      });
    }

    onChangePrint(e:any) {
        this.printtype= e.target.value;
     }

     onPrinterClick()
     {
       this.PrintringVisible = false;
       this.Reportvisible = true;
     }
     viewInvoiceDetail(invoiceNo:any)
     {
      this.router.navigateByUrl('/Invoices/Detail/'+invoiceNo);
     }




     Save()
     {
      this.confirmationService.confirm({
        header: 'Confirm Posting',
        message: 'Are you sure you want to Post this Invoices? This action can\'t be undone.',
        accept: async () => {
         try{
           await lastValueFrom(this.invoiceService.PostInvoices(this.selectedInvoice));
           var result = await lastValueFrom(this.invoiceService.GetInvoices(GLTxTypes.GoodsReceivedNote,0));
           this.tempinvoices = result;
           this.invoices = [];
           this.toasterService.success("Invoices Succesfully Posted!");
          }
          catch{
            this.toasterService.error("Something went wrong.");
          }

        },
      });
     }


      submit()
      {
        console.log(this.invoices);

        let d1 = this.datePipe.transform(this.DateFrom, "yyyy-MM-dd");
        let d2 = this.datePipe.transform(this.DateTo, "yyyy-MM-dd");

        this.invoices = this.tempinvoices.filter(x => {
            // Convert invoiceDate to "yyyy-MM-dd" format
            const invoiceDate = this.datePipe.transform(new Date(x.invoiceDate), "yyyy-MM-dd");
            return (
                invoiceDate >= d1 &&
                invoiceDate <= d2 &&
                x.transactionStatus === "Approved"
            );
        });

        console.log(this.invoices);

      }


      onDateFromSelect() {
        if (this.DateFrom) {
          const startOfMonth = new Date(this.DateFrom.getFullYear(), this.DateFrom.getMonth(), 1);
          const endOfMonth = new Date(this.DateFrom.getFullYear(), this.DateFrom.getMonth() + 1, 0);
          this.minDateTo = startOfMonth;
          this.maxDateTo = endOfMonth;
          this.DateTo = endOfMonth;
        }
      }
}
