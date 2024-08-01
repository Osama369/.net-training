import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { InvoicesService } from 'src/app/Invoices/Services/invoices.service';
import { InvoiceView } from 'src/app/Invoices/Models/invoice-view';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { GenericService } from 'src/app/Shared/Services/generic.service';

@Component({
  selector: 'app-expense-voucher',
  templateUrl: './expense-voucher.component.html',
  styleUrls: ['./expense-voucher.component.scss']
})

export class ExpenseVoucherComponent implements OnInit {
    heading = "Expense Vouchers";
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
      private authService: AuthService,
      private toastr: ToastrService,
      public bookmarkService: BookmarkService,
      public route : ActivatedRoute
      ) { }

    ngOnInit() {

        // this.genericService.getCurrency().subscribe(c =>{
        //   this.CurrencyCode = c[0].CurrencyCode;
        // })
        this.invoiceService.getInvoicesList(42).subscribe(invoices => {
            this.invoices = invoices;
            this.loading = false;
            this.exportColumns.push(new Object({title: "Date",dataKey: "dtTx"}));
            this.exportColumns.push(new Object({title: "Invoice No",dataKey: "voucherNo"}));
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


    clear(table: Table) {
        table.clear();
    }

    printView(invoiceNo:any)
    {
        this.invoiceNo = invoiceNo;
        this.PrintringVisible = true;
    }

    OpenLedger() {
      // Converts the route into a string that can be used
      // with the window.open() function
      const url = this.router.serializeUrl(
        this.router.createUrlTree([`./../Reports/GeneralLedgerReport`])
      );

      window.open(url, '_blank');
    }

    editView(invoiceNo:any)
    {
        this.router.navigateByUrl('/AddNewExpense/'+invoiceNo);
    }

    deleteView(invoiceNo:any)
    {

      if (confirm("Are you sure you want to delete this Expense Voucher?") == true) {
        this.authService.checkPermission('ExpenseVoucherDelete').subscribe((x:any)=>{
          if(x)
          {
            this.invoiceService.deleteJournalVoucher(invoiceNo).subscribe({
              next: x =>{
                this.toastr.success("Expense voucher has been successfully deleted!");
                this.invoiceService.getInvoicesList(42).subscribe(invoices => {
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
        this.router.navigateByUrl('/JournalVoucherDetail/'+invoiceNo);
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
        const doc = new jsPDF.default('p', 'px', 'a4');
        (doc as any).autoTable(this.exportColumns, this.invoices);
        doc.save(this.heading+'.pdf');
      });
    });
  }
}
