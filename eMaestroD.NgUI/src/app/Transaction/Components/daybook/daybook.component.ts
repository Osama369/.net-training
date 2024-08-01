import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { DatePipe, getCurrencySymbol } from '@angular/common';
import { groupBy, sumBy } from 'lodash';
import jsPDF from 'jspdf';
import { environment } from 'src/environments/environment';
import { InvoicesService } from 'src/app/Invoices/Services/invoices.service';
import { InvoiceView } from 'src/app/Invoices/Models/invoice-view';
import { GenericService } from 'src/app/Shared/Services/generic.service';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';

@Component({
  selector: 'app-daybook',
  templateUrl: './daybook.component.html',
  styleUrls: ['./daybook.component.css']
})

export class DaybookComponent implements OnInit {

    heading : any = "Day Book";
    headingSaleSummary : any = "Sales Summary";
    invoices: InvoiceView[];
    invoiceNo: any;
    loading: boolean = true;
    PrintringVisible: boolean = false;
    InvoiceDetailvisible: boolean = false;
    Reportvisible: boolean = false;
    printtype:any = "A4";
    columns : any[] = [];
    exportColumns : any[] =[];
    exportColumnsSalesSummary : any[] =[];
    CurrencyCode : any;
    selectedDate : any;
    bookmark : boolean = false;
    SummaryList : any;

    logoPath = environment.logoPath;
    reportHeader : any[] = [];
    companyName : any;
    companyAddress : any;
    companyVat : any;
    companyContact : any;

    constructor(private invoiceService: InvoicesService,
      private genericService: GenericService,
      private router: Router,
      private datePipe: DatePipe,
      private authService : AuthService,
      public bookmarkService: BookmarkService,
      public route : ActivatedRoute) { }

    ngOnInit() {

      let today = new Date();
      this.selectedDate = today;
      let d1 = this.datePipe.transform(this.selectedDate, "yyyy-MM-dd");
      this.exportColumns.push(new Object({title: "Date",dataKey: "dtTx"}));
      this.exportColumns.push(new Object({title: "Invoice No",dataKey: "voucherNo"}));
      this.exportColumns.push(new Object({title: "Name",dataKey: "cstName"}));
      this.exportColumns.push(new Object({title: "Type",dataKey: "type"}));
      this.exportColumns.push(new Object({title: "Debit",dataKey: "debit"}));
      this.exportColumns.push(new Object({title: "Credit",dataKey: "credit"}));

      this.exportColumnsSalesSummary.push(new Object({title: "Payment Method",dataKey: "paymentMethod"}));
      this.exportColumnsSalesSummary.push(new Object({title: "Sales",dataKey: "totalSales"}));
      this.exportColumnsSalesSummary.push(new Object({title: "Sales Return",dataKey: "totalSalesReturn"}));
      this.exportColumnsSalesSummary.push(new Object({title: "Net Sales",dataKey: "netSales"}));

      this.getData();

      this.authService.GetBookmarkScreen(this.route.snapshot?.data['requiredPermission']).subscribe(x=>{
        this.bookmark = x;
      });

      this.genericService.getConfiguration().subscribe(confg=>{
        this.reportHeader = confg;
        this.companyName = confg[0].companyName;
        this.companyAddress = confg[0].address;
        this.companyContact = confg[0].contactNo;
        this.companyVat = confg[0].productionType;
      });
    }

    UpdateBookmark(value:any){
      this.bookmarkService.Updatebookmark(this.route.snapshot.data['requiredPermission'],value).subscribe({
        next: (result: any) => {
          this.bookmark = value;
        },
      });;


    }


    getData()
    {
      let d1 = this.datePipe.transform(this.selectedDate, "yyyy-MM-dd");
      this.genericService.getDayBook(d1).subscribe(invoices => {
        if(invoices !=  null)
        {
          this.invoices = invoices;
        }
        else
        {
          this.invoices = [];
        }
          this.loading = false;
      });

      this.genericService.GetSalesSummary(d1).subscribe(salesList => {
        if(salesList !=  null)
        {
          this.SummaryList = salesList;
          this.calculateSummary();
        }
        else
        {
          this.SummaryList = [];
        }
          this.loading = false;
      });

    }


    calculateSummary() {
      this.SummaryList.push({paymentMethod:"Grand Total",   sales: sumBy(this.SummaryList, 'sales').toFixed(2),
      salesReturn: sumBy(this.SummaryList, 'salesReturn').toFixed(2),
      netSales: sumBy(this.SummaryList, 'netSales').toFixed(2)})
    }


    OpenLedger() {
      // Converts the route into a string that can be used
      // with the window.open() function
      const url = this.router.serializeUrl(
        this.router.createUrlTree([`./../SupplierLedgerReport`])
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
        //this.router.navigateByUrl('/AddNewSale/'+invoiceNo);
    }

    deleteView(invoiceNo:any)
    {
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
        // this.invoiceNo = invoiceNo;
        // this.InvoiceDetailvisible = true;
        let prefix = invoiceNo.split('-')[0];
        if(prefix == "PNV" || prefix == "PRT" || prefix == "POV" ||
        prefix == "SNV" || prefix == "SRT" || prefix == "SRV" || prefix == "QOV"){
         const url = this.router.serializeUrl(
           this.router.createUrlTree([`Detail/`+invoiceNo])
         );
         window.open(url, '_blank');
       }
       else if (prefix == "RCT" || prefix == "PMT"){
         const url = this.router.serializeUrl(
           this.router.createUrlTree([`VoucherDetail/`+invoiceNo])
         );
         window.open(url, '_blank');
       }
       else if(prefix == "JV" || prefix == "EXP"){
         const url = this.router.serializeUrl(
           this.router.createUrlTree([`JournalVoucherDetail/`+invoiceNo])
         );
         window.open(url, '_blank');
       }
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

  exportPdfSalesSummary() {
    var date = new Date();
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default('p', 'px', 'a4');
        (doc as any).autoTable({
          columns: this.exportColumnsSalesSummary,
          body: this.SummaryList,
          styles: { overflow: "linebreak" },
          bodyStyles: { valign: "middle" },
          headStyles:{valign:"middle",halign:"center", fillColor: [0, 102, 204],  // RGB for a blue header background color
          textColor: [255, 255, 255],  // White text color
          fontSize: 10},
          theme: "grid",
          showHead: "everyPage",
          margin: {top:90},
        });

        const addHeader = (doc: jsPDF) => {
          var totalPages = doc.getNumberOfPages();
          for (var i = 1; i <= totalPages; i++) {
            let heightMargin = 0;
            doc.setPage(i);
            doc.setFontSize(16);
            let width = doc.internal.pageSize.getWidth()/2;
              heightMargin += 15;
              doc.text(this.companyName,width-(doc.getStringUnitWidth(this.companyName) * doc.getFontSize() / 2),heightMargin);
              heightMargin += 15;
              doc.text(this.companyContact,width-(doc.getStringUnitWidth(this.companyContact) * doc.getFontSize() / 2),heightMargin);
              heightMargin += 15;
              doc.text(this.companyVat,width-(doc.getStringUnitWidth(this.companyVat) * doc.getFontSize() / 2),heightMargin);
              heightMargin += 15;
              doc.text(this.headingSaleSummary,width-(doc.getStringUnitWidth(this.headingSaleSummary) * doc.getFontSize() / 2),heightMargin);
              if(heightMargin == 0)
              {
                heightMargin += 60;
              }
              else if(heightMargin < 41){ heightMargin += 20}
              doc.addImage(this.logoPath, 'png', 40, 10,60, 40)
              heightMargin += 20;
              let d1 = this.datePipe.transform(this.selectedDate.toString(), "dd-MM-yyyy");
              doc.setFontSize(10);
              doc.text("Date : "+d1,40,heightMargin);
          }
        }



        addHeader(doc)

        doc.save(this.headingSaleSummary+'.pdf');

      });
    });
  }
}

