import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { ReportSettingService } from 'src/app/Reports/Services/report-setting.service';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { GenericService } from 'src/app/Shared/Services/generic.service';
import { InvoicesService } from '../../Services/invoices.service';
import { InvoiceView } from '../../Models/invoice-view';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sale-return',
  templateUrl: './sale-return.component.html',
  styleUrls: ['./sale-return.component.css']
})

export class SaleReturnComponent implements OnInit {

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
    reportSettingVisiblity : boolean = false;
    reportSettingItemList : any[]=[];

    constructor(private invoiceService: InvoicesService,
      private genericService: GenericService,
      private router: Router,
      private toasterService: ToastrService,
      private authService : AuthService,
      private reportSettingService : ReportSettingService
      ) { }
    ngOnInit() {

        // this.genericService.getCurrency().subscribe(c =>{
        //   this.CurrencyCode = c[0].CurrencyCode;
        // })
        this.invoiceService.getInvoicesList(5).subscribe(invoices => {
            if(invoices != null)
            {
              this.invoices = invoices.filter(x=>x.checkName == '');
            }
            this.loading = false;
            this.exportColumns.push(new Object({title: "Date",dataKey: "dtTx"}));
            this.exportColumns.push(new Object({title: "Invoice No",dataKey: "voucherNo"}));
            this.exportColumns.push(new Object({title: "Name",dataKey: "cstName"}));
            this.exportColumns.push(new Object({title: "Comments",dataKey: "glComments"}));
            this.exportColumns.push(new Object({title: "Total",dataKey: "amount"}));
      });


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
        this.router.navigateByUrl('/AddNewCreditNote/'+invoiceNo);
    }

    deleteView(invoiceNo:any)
    {
      this.authService.checkPermission('CreditNoteDelete').subscribe((x:any)=>{
        if(x)
        {
          if (confirm("Are you sure you want to delete this invoice?") == true) {
              this.loading = true;
              this.invoiceService.deleteInvoice(invoiceNo).subscribe(asd => {
                this.toasterService.success("Sale Return has been successfully deleted.");
                  this.invoiceService.getInvoicesList(5).subscribe(invoices => {
                      if(invoices != null)
                      {
                        this.invoices = invoices.filter(x=>x.checkName == '');
                      }
                      this.loading = false;
                  });
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
      this.router.navigateByUrl('/Detail/'+invoiceNo);
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
      this.saveAsExcelFile(excelBuffer, "Credit Note");
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

        doc.save('CreditNote.pdf');

      });
    });
  }

  handleChildData(data: any) {

    this.reportSettingVisiblity = false;
    if(typeof(data) != 'boolean')
    {
      this.reportSettingItemList = data;
    }

  }
}
