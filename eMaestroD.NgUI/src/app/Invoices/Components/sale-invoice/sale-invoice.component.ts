import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { ReportSettingService } from 'src/app/Reports/Services/report-setting.service';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { GenericService } from 'src/app/Shared/Services/generic.service';
import { InvoicesService } from '../../Services/invoices.service';
import { InvoiceView } from '../../Models/invoice-view';
import { ToastrService } from 'ngx-toastr';
import { Invoice } from '../../Models/invoice';
import { GLTxTypes } from '../../Enum/GLTxTypes.enum';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-sale-invoice',
  templateUrl: './sale-invoice.component.html',
  styleUrls: ['./sale-invoice.component.css']
})

export class SaleInvoiceComponent implements OnInit {

    invoices: Invoice[];
    invoiceNo: any;
    loading: boolean = true;
    PrintringVisible: boolean = false;
    InvoiceDetailvisible: boolean = false;
    Reportvisible: boolean = false;
    printtype:any = "A4";
    columns : any[] = [];
    exportColumns : any[] =[];
    CurrencyCode : any;
    isBankInfo : boolean = false;
    bankDetail  : boolean = false;
    reportSettingVisiblity : boolean = false;
    reportSettingItemList : any[]=[];
    isProductCode: boolean = false;
    isArabic: boolean = false;
    bookmark : boolean = false;

    constructor(private invoiceService: InvoicesService,
      private genericService: GenericService,
      private router: Router,
      private toasterService: ToastrService,
      private authService : AuthService,
      private reportSettingService : ReportSettingService,
      public bookmarkService: BookmarkService,
      public route : ActivatedRoute

      ) { }
    async ngOnInit() {

        // this.genericService.getCurrency().subscribe(c =>{
        //   this.CurrencyCode = c[0].CurrencyCode;
        // })

        this.reportSettingService.GetInvoiceReportSettings().subscribe(rpt=>{
          this.reportSettingItemList = rpt.filter(x=>x.screenName.toLowerCase() == "sale");
        })

      //   this.invoiceService.getInvoicesList(4).subscribe(invoices => {
      //       this.invoices = invoices;
      //       this.loading = false;
      //       this.exportColumns.push(new Object({title: "Date",dataKey: "dtTx"}));
      //       this.exportColumns.push(new Object({title: "Invoice No",dataKey: "voucherNo"}));
      //       this.exportColumns.push(new Object({title: "Name",dataKey: "cstName"}));
      //       this.exportColumns.push(new Object({title: "Comments",dataKey: "glComments"}));
      //       this.exportColumns.push(new Object({title: "Total",dataKey: "amount"}));
      // });

      try{
        var result = await lastValueFrom(this.invoiceService.GetInvoices(GLTxTypes.SaleInvoice,0));
        this.invoices = result;
        console.log(this.invoices);
        this.loading = false;
      }
      catch(error){
        this.toasterService.error(error);
      }

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
        this.isBankInfo = this.reportSettingItemList.find(x=>x.key == "Include Bank Detail").value;
        this.isProductCode = this.reportSettingItemList.find(x=>x.key=="Add Product Code").value.toLocaleString();
        if(this.reportSettingItemList.find(x=>x.key == "English Only" && x.value == true) != undefined){
          this.isArabic = true;
        }
        else{
          this.isArabic = false;
        }
        this.Reportvisible = true;

    }

    editView(invoiceNo:any)
    {
        this.router.navigateByUrl('/Invoices/AddNewSale/'+invoiceNo);
    }

    deleteView(invoiceNo:any)
    {
      this.authService.checkPermission('SaleInvoicesDelete').subscribe((x:any)=>{
        if(x)
        {
          if (confirm("Are you sure you want to delete this invoice?") == true) {
              this.loading = true;
              this.invoiceService.DeleteInvoice(invoiceNo).subscribe(asd => {
                this.toasterService.success("Sale Invoice has been successfully deleted!");
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
    //     this.invoiceNo = invoiceNo;
    //     this.InvoiceDetailvisible = true;
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
      this.saveAsExcelFile(excelBuffer, "Sale Invoice");
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

        doc.save('SaleInvoice.pdf');

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
