import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { getCurrencySymbol } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { InvoicesService } from 'src/app/Invoices/Services/invoices.service';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { GenericService } from 'src/app/Shared/Services/generic.service';
import { InvoiceView } from 'src/app/Invoices/Models/invoice-view';


@Component({
  selector: 'app-payment-voucher',
  templateUrl: './payment-voucher.component.html',
  styleUrls: ['./payment-voucher.component.css']
})

export class PaymentVoucherComponent implements OnInit {

    heading : any = "Payment Vouchers";
    invoices: InvoiceView[];
    invoiceNo: any;
    loading: boolean = true;
    PrintringVisible: boolean = false;
    InvoiceDetailvisible: boolean = false;
    Reportvisible: boolean = false;
    printtype:any = "A4";
    columns : any[] = [];
    exportColumns : any[] =[];
    CurrencyCode : any;
    bookmark : boolean = false;
    constructor(
      private invoiceService: InvoicesService,
      private genericService: GenericService,
      private router: Router,
      private toastr: ToastrService,
      private authService: AuthService,
      public bookmarkService: BookmarkService,
      public route : ActivatedRoute
      ) { }

    ngOnInit() {

        // this.genericService.getCurrency().subscribe(c =>{
        //   this.CurrencyCode = c[0].CurrencyCode;
        //   this.CurrencyCode = getCurrencySymbol(this.CurrencyCode,'narrow');
        // })
        this.invoiceService.getInvoicesList(7).subscribe(invoices => {
            this.invoices = invoices;
            this.loading = false;
            this.exportColumns.push(new Object({title: "Date",dataKey: "dtTx"}));
            this.exportColumns.push(new Object({title: "Invoice No",dataKey: "voucherNo"}));
            this.exportColumns.push(new Object({title: "Name",dataKey: "cstName"}));
            this.exportColumns.push(new Object({title: "Total",dataKey: "amount"}));
            this.exportColumns.push(new Object({title: "Comments",dataKey: "glComments"}));
      });

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


    OpenLedger() {
      // Converts the route into a string that can be used
      // with the window.open() function
      const url = this.router.serializeUrl(
        this.router.createUrlTree([`./../Reports/SupplierLedgerReport`])
      );

      window.open(url, '_blank');
    }

    clear(table: Table) {
        table.clear();
    }

    printView(invoiceNo:any)
    {
        this.invoiceNo = invoiceNo;
        this.PrintringVisible = true;
    }

    editView(invoiceNo:any)
    {
      this.router.navigateByUrl('/Transactions/AddNewPayment/'+invoiceNo);
        //this.router.navigateByUrl('/AddNewSale/'+invoiceNo);
    }

    deleteView(invoiceNo:any)
    {
      if (confirm("Are you sure you want to delete this Payment Voucher?") == true) {
        this.authService.checkPermission('PaymentVoucherDelete').subscribe((x:any)=>{
          if(x)
          {
            this.invoiceService.deletePaymentVoucher(invoiceNo).subscribe({
              next: x =>{
                this.toastr.success("Payment voucher has been successfully deleted!");
                this.invoiceService.getInvoicesList(7).subscribe(invoices => {
                  this.invoices = invoices;
                  this.loading = false;
              });
              },
              error:err=>{
                this.toastr.error(err.error);
                }
              })
          }
          else{
            this.toastr.error("Unauthorized Access! You don't have permission to access.");
          }
        });
      }

        // if (confirm("Are you sure you want to delete this invoice?") == true) {
        //     this.loading = true;
        //     this.invoiceService.deleteInvoice(invoiceNo).subscribe(asd => {
        //         this.invoiceService.getInvoicesList(4).subscribe(invoices => {
        //             this.invoices = invoices;
        //             this.loading = false;
        //         });
        //     });
        // } else {
        // }
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
        this.router.navigateByUrl('/Invoices/VoucherDetail/'+invoiceNo);
        // this.invoiceNo = invoiceNo;
        // this.InvoiceDetailvisible = true;
     }



  exportExcel() {
    var date = new Date();
    var dateFormate = `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`;
    let filtercols = this.columns.filter((f) => {
      return f.isHidden == true;
    });
    let filterList = this.invoices;
    filterList.filter((f: { [x: string]: any; }) => {
      filtercols.map((m) => {
        delete f[m.field];
      });
    });
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(filterList);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, this.heading);
    });
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
    var date = new Date();
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default('l', 'px', 'a4');
        (doc as any).autoTable(this.exportColumns, this.invoices);

        doc.save(this.heading+'.pdf');

      });
    });
  }
}
