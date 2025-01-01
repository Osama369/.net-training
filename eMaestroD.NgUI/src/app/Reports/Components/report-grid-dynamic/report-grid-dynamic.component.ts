
import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, ViewChild, SimpleChanges } from "@angular/core";
import { Table } from "primeng/table";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { EmailService } from 'src/app/Administration/Services/email.service';
import { ProductsService } from 'src/app/Manage/Services/products.service';
import { ColumnTypes } from 'src/app/Shared/Models/columnstypes';
import { GenericService } from 'src/app/Shared/Services/generic.service';
import { ReportSettingService } from '../../Services/report-setting.service';
import { ReportSettings } from '../../Models/report-settings';
import { AppConfigService } from 'src/app/Shared/Services/app-config.service';

@Component({
  selector: 'app-report-grid-dynamic',
  templateUrl: './report-grid-dynamic.component.html',
  styleUrls: ['./report-grid-dynamic.component.scss'],
  providers:[ConfirmationService,MessageService]
})


export class ReportGridDynamicComponent {
  constructor(private productService:ProductsService,
    private genericService:GenericService,
    private reportSettingService:ReportSettingService,
    private router:Router,
    private confirmationService :ConfirmationService,
    private messageService :MessageService,
    private emailService :EmailService,
    private toastrService :ToastrService,
    private http: HttpClient,
    private appConfigService : AppConfigService,
    private datePipe: DatePipe){}

  @Input() public columns: any[];
  @Input() public dtFrom: any[];
  @Input() public dtTo: any[];
  @Input() public data: any[];
  @Input() heading : any = "Reports";
	@Input() AllowHeaderSetting : boolean = false;
	@Input() AllowSendMail : boolean = true;
	@Input() AllowGlobalFilter : boolean = false;
	@Input() AllowPrintButtons : boolean = false;
  logoPath = this.appConfigService.getConfig().LogoPath;

  row : any;
	cols: any[] = [];
	_selectedColumns: any[];
  exportColumns : any[] =[];
  reportHeader : any[] = [];
  companyName : any;
  companyAddress : any;
  companyVat : any;
  companyContact : any;
  header : any;
  date : any;
  headerlist : ReportSettings[]=[];
  checked: boolean = false;
  @ViewChild('dt') table!: Table;
  reportSettingVisiblity : boolean = false;

  getColumnSum(field: string): number {
    return this.data.reduce((sum, item) => {
      const value = parseFloat(item[field]);
      return !isNaN(value) ? sum + value : sum;
    }, 0);
  }


  @Input() AllowTotal : boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    this.cols = [];
    this.exportColumns = [];
    if(this.columns)
    {
      this.row = 0;
      this.columns.forEach((element: any) => {
            if(element.isHidden != true)
            {
              this.cols.push({
                field:element.field,
                header:element.header,
                controlType:element.controlType,
              })
              // this.exportColumns.push(new Object({title: element.header,dataKey: element.field}));
            }
      });
      this._selectedColumns = this.cols;

      this.reportSettingService.getReportSettings().subscribe(rpt=>{
        this.headerlist = rpt;
      })

      const months = new Set<string>();
      if(this.data!=undefined && this.data!=null){
        this.data.forEach((record) => {
          Object.keys(record.MonthWiseSales).forEach((month) => months.add(month));
        });
      }

      this.exportColumns.push({
        title: 'Customer Name', // Header for the column
        dataKey: 'CustomerName', // Key used for data mapping
      });


      Array.from(months).forEach(month => {
        this.exportColumns.push({
          title: month, // Month name as the title
          dataKey: month, // Month key as the dataKey
        });
      });

      this._selectedColumns = Array.from(months);
      console.log(this._selectedColumns);
    }
    else
    {
      this.row = 1;
    }
  }


	ngOnInit() {
    let today = new Date();
    this.date = today;
    this.genericService.getConfiguration().subscribe(confg=>{
      this.reportHeader = confg;
      this.companyName = confg[0].companyName;
      this.companyAddress = confg[0].address;
      this.companyContact = confg[0].contactNo;
      this.companyVat = confg[0].productionType;
    });

    this.reportSettingService.getReportSettings().subscribe(rpt=>{
      this.headerlist = rpt;
    })

		this._selectedColumns = this.cols;
	}

	@Input() get selectedColumns(): any[] {
		return this._selectedColumns;
	}

  public get enum_ColTypes() {
    return ColumnTypes;
  }

	set selectedColumns(val: any[]) {
		this._selectedColumns =
			this.cols.filter((col) => val.includes(col));
      this.exportColumns.splice(0,this.exportColumns.length);
      this._selectedColumns.forEach(element => {
        this.exportColumns.push(new Object({title: element.header,dataKey: element.field}));
      });

	}






  exportPdf() {

    this.data = this.data.filter(x=>x.customerName != '');
    const formattedData = this.data.map((record: any) => {
      const row: any = {};

      // Dynamically map data using exportColumns
      this.exportColumns.forEach((col: any) => {
        if (col.dataKey === 'CustomerName') {
          // Map customer name
          row[col.dataKey] = record.customerName || '';
        } else {
          // Map month-wise sales or default to 0
          row[col.dataKey] = record.MonthWiseSales[col.dataKey] || 0;
        }
      });

      return row;
    });

    let footerLen  = this.headerlist.filter(x=>x.value == true && (x.key == "Footer Date" || x.key == "Page Number")).length;
    let totalheight = (this.headerlist.filter(x=>x.value == true && x.key != "Company Logo").length)-footerLen;
    if(totalheight < 3)
    {
      totalheight += 3;
    }

    this.http.get('assets/Amiri/Amiri.txt', { responseType: 'text' })
    .subscribe((data:any) => {


      let arabicFontBase64  =  atob(data);
     let doc = new jsPDF('p', 'pt');

     doc.addFileToVFS('Amiri-Regular.ttf', arabicFontBase64);
     doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
     doc.setFont('Amiri');
    if(this.exportColumns.length >= 8)
    {
      doc = new jsPDF('l','pt');
    }
    autoTable(doc, {
      columns: this.exportColumns,
      body: formattedData,
      didParseCell: (data) => {
        if (data.section === 'body') {
            if (this.isArabic(data.cell.raw)) {
                data.cell.styles.font = 'Amiri';
            } else {
                data.cell.styles.font = 'helvetica';
            }
        }
      },
      styles: { overflow: "linebreak" },
      bodyStyles: { valign: "middle" },
      headStyles:{valign:"middle",halign:"center", fillColor: [0, 102, 204],  // RGB for a blue header background color
      textColor: [255, 255, 255],  // White text color
      fontSize: 10,
      font:"helvetica"
    },
      theme: "grid",
      showHead: "everyPage",
      margin: {top: (totalheight*21)},
    });

    const addHeader = (doc: jsPDF) => {
      var totalPages = doc.getNumberOfPages();
      for (var i = 1; i <= totalPages; i++) {
          let heightMargin = 0;
          doc.setPage(i);
          doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');

          const addText = (text:any, x:any, y:any, fontSize = 16) => {
              if (this.isArabic(text)) {
                  doc.setFont('Amiri');
              } else {
                  doc.setFont('helvetica');
              }
              doc.setFontSize(fontSize);
              doc.text(text, x, y);
          };

          let width = doc.internal.pageSize.getWidth() / 2;
          if (this.headerlist.find(x => x.key == "Company Name")?.value == true) {
              heightMargin += 20;
              addText(this.companyName, width - (doc.getStringUnitWidth(this.companyName) * doc.getFontSize() / 2), heightMargin);
          }
          if (this.headerlist.find(x => x.key == "Address")?.value == true) {
              heightMargin += 20;
              addText(this.companyAddress, width - (doc.getStringUnitWidth(this.companyAddress) * doc.getFontSize() / 2), heightMargin);
          }
          if (this.headerlist.find(x => x.key == "Phone")?.value == true) {
              heightMargin += 20;
              addText(this.companyContact, width - (doc.getStringUnitWidth(this.companyContact) * doc.getFontSize() / 2), heightMargin);
          }
          if (this.headerlist.find(x => x.key == "VAT")?.value == true) {
              heightMargin += 20;
              addText(this.companyVat, width - (doc.getStringUnitWidth(this.companyVat) * doc.getFontSize() / 2), heightMargin);
          }
          if (this.headerlist.find(x => x.key == "Report Title")?.value == true) {
              heightMargin += 20;
              addText(this.heading, width - (doc.getStringUnitWidth(this.heading) * doc.getFontSize() / 2), heightMargin);
          }
          if (this.headerlist.find(x => x.key == "Company Logo")?.value == true) {
              if (heightMargin == 0) {
                  heightMargin += 60;
              } else if (heightMargin < 41) {
                  heightMargin += 20;
              }
              doc.addImage(this.logoPath, 'png', 40, 10, 120, 60);
          }
          if (this.headerlist.find(x => x.key == "Date From to To")?.value == true) {
              if (this.dtFrom != undefined && this.dtFrom != null && this.dtTo != undefined) {
                  heightMargin += 20;
                  let d1 = this.datePipe.transform(this.dtFrom.toString(), "dd-MM-yyyy");
                  let d2 = this.datePipe.transform(this.dtTo.toString(), "dd-MM-yyyy");
                  doc.setFontSize(10);
                  addText("Date From : " + d1 + "   Date To : " + d2, 40, heightMargin, 10);
              }
          }
      }
  };


    const addFooters = (doc: jsPDF) => {
      let height = doc.internal.pageSize.getHeight();
      let d1 = this.datePipe.transform(this.date, "dd-MM-yyyy");
      var totalPages = doc.getNumberOfPages();
      if(d1 != null)
      {
        for (var i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(10);
          doc.setTextColor(150);
          if(this.headerlist.find(x=>x.key == "Footer Date")?.value == true)
          {
            doc.text("Printed Date : "+d1,20,height-22);
          }
          if(this.headerlist.find(x=>x.key == "Page Number")?.value == true)
          {
            doc.text('Page ' + i + ' of ' + totalPages, doc.internal.pageSize.getWidth() - 100,height-22);
          }
        }
      }
    }
    addHeader(doc)
    addFooters(doc)
    doc.save(this.heading+'.pdf');
  });
    // })
    // .catch(error => {
    //   console.error('Error loading the font:', error);
    // });
  }

  async GeneratePDF(): Promise<Blob> {
    let footerLen = this.headerlist.filter(x => x.value === true && (x.key === "Footer Date" || x.key === "Page Number")).length;
    let totalheight = this.headerlist.filter(x => x.value === true && x.key !== "Company Logo").length - footerLen;

    if (totalheight < 3) {
      totalheight += 3;
    }

    const data = await this.http.get('assets/Amiri/Amiri.txt', { responseType: 'text' }).toPromise();

    if (data === undefined) {
      throw new Error("Font data could not be loaded");
    }

    let arabicFontBase64 = atob(data);
    let doc = new jsPDF('p', 'pt');

    doc.addFileToVFS('Amiri-Regular.ttf', arabicFontBase64);
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    doc.setFont('Amiri');

    if (this.exportColumns.length >= 8) {
      doc = new jsPDF('l', 'pt');
    }

    autoTable(doc, {
      columns: this.exportColumns,
      body: this.data,
      didParseCell: (data) => {
        if (data.section === 'body') {
          if (this.isArabic(data.cell.raw)) {
            data.cell.styles.font = 'Amiri';
          } else {
            data.cell.styles.font = 'helvetica';
          }
        }
      },
      styles: { overflow: "linebreak" },
      bodyStyles: { valign: "middle" },
      headStyles: {
        valign: "middle",
        halign: "center",
        fillColor: [0, 102, 204],  // RGB for a blue header background color
        textColor: [255, 255, 255],  // White text color
        fontSize: 10,
        font: "helvetica"
      },
      theme: "grid",
      showHead: "everyPage",
      margin: { top: (totalheight * 21) },
    });

    const addHeader = (doc: jsPDF) => {
      var totalPages = doc.getNumberOfPages();
      for (var i = 1; i <= totalPages; i++) {
        let heightMargin = 0;
        doc.setPage(i);
        doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');

        const addText = (text: any, x: any, y: any, fontSize = 16) => {
          if (this.isArabic(text)) {
            doc.setFont('Amiri');
          } else {
            doc.setFont('helvetica');
          }
          doc.setFontSize(fontSize);
          doc.text(text, x, y);
        };

        let width = doc.internal.pageSize.getWidth() / 2;
        if (this.headerlist.find(x => x.key === "Company Name")?.value === true) {
          heightMargin += 20;
          addText(this.companyName, width - (doc.getStringUnitWidth(this.companyName) * doc.getFontSize() / 2), heightMargin);
        }
        if (this.headerlist.find(x => x.key === "Address")?.value === true) {
          heightMargin += 20;
          addText(this.companyAddress, width - (doc.getStringUnitWidth(this.companyAddress) * doc.getFontSize() / 2), heightMargin);
        }
        if (this.headerlist.find(x => x.key === "Phone")?.value === true) {
          heightMargin += 20;
          addText(this.companyContact, width - (doc.getStringUnitWidth(this.companyContact) * doc.getFontSize() / 2), heightMargin);
        }
        if (this.headerlist.find(x => x.key === "VAT")?.value === true) {
          heightMargin += 20;
          addText(this.companyVat, width - (doc.getStringUnitWidth(this.companyVat) * doc.getFontSize() / 2), heightMargin);
        }
        if (this.headerlist.find(x => x.key === "Report Title")?.value === true) {
          heightMargin += 20;
          addText(this.heading, width - (doc.getStringUnitWidth(this.heading) * doc.getFontSize() / 2), heightMargin);
        }
        if (this.headerlist.find(x => x.key === "Company Logo")?.value === true) {
          if (heightMargin === 0) {
            heightMargin += 60;
          } else if (heightMargin < 41) {
            heightMargin += 20;
          }
          doc.addImage(this.logoPath, 'png', 40, 10, 120, 60);
        }
        if (this.headerlist.find(x => x.key === "Date From to To")?.value === true) {
          if (this.dtFrom !== undefined && this.dtFrom !== null && this.dtTo !== undefined) {
            heightMargin += 20;
            let d1 = this.datePipe.transform(this.dtFrom.toString(), "dd-MM-yyyy");
            let d2 = this.datePipe.transform(this.dtTo.toString(), "dd-MM-yyyy");
            doc.setFontSize(10);
            addText("Date From: " + d1 + "   Date To: " + d2, 40, heightMargin, 10);
          }
        }
      }
    };

    const addFooters = (doc: jsPDF) => {
      let height = doc.internal.pageSize.getHeight();
      let d1 = this.datePipe.transform(this.date, "dd-MM-yyyy");
      var totalPages = doc.getNumberOfPages();
      if (d1 !== null) {
        for (var i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(10);
          doc.setTextColor(150);
          if (this.headerlist.find(x => x.key === "Footer Date")?.value === true) {
            doc.text("Printed Date: " + d1, 20, height - 22);
          }
          if (this.headerlist.find(x => x.key === "Page Number")?.value === true) {
            doc.text('Page ' + i + ' of ' + totalPages, doc.internal.pageSize.getWidth() - 100, height - 22);
          }
        }
      }
    }

    addHeader(doc);
    addFooters(doc);

    return doc.output('blob');
  }


  applyFilterGlobal($event: any, stringVal: any, table: any) {
    table.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
  handleChildData(data: any) {

    this.reportSettingVisiblity = false;
    if(typeof(data) != 'boolean')
    {
      this.headerlist = data;
    }

  }

  viewInvoiceDetail(invoiceNo:any)
  {
     // this.invoiceNo = invoiceNo;
     // this.InvoiceDetailvisible = true;

     var prefix = invoiceNo.substring(0, 3);

     if(prefix == "PNV" || prefix == "PRT" || prefix == "POV" ||
     prefix == "SNV" || prefix == "SRT" || prefix == "SRV" || prefix == "QOV"){
      const url = this.router.serializeUrl(
        this.router.createUrlTree([`Invoices/Detail/`+invoiceNo])
      );
      window.open(url, '_blank');
    }
    else if (prefix == "RCT" || prefix == "PMT"){
      const url = this.router.serializeUrl(
        this.router.createUrlTree([`Invoices/VoucherDetail/`+invoiceNo])
      );
      window.open(url, '_blank');
    }
    else if(prefix == "JV-" || prefix == "EXP"){
      const url = this.router.serializeUrl(
        this.router.createUrlTree([`Transactions/JournalVoucherDetail/`+invoiceNo])
      );
      window.open(url, '_blank');
    }

  }

  confirmDailog()
  {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to send this Report To Admin?',
      header: ' ',
      icon: 'pi pi-info-circle',
      accept: async () => {
        let emailData : any[] = [];
        emailData = [{
          subject:this.heading
        }]

        const pdfBlob = await this.GeneratePDF();
        const formData = new FormData();
        formData.append('pdf', pdfBlob, 'generated-pdf.pdf');
        formData.append('subject',this.heading);
        this.emailService.SavePdfAndSend(formData).subscribe(
          (response) => {
            this.toastrService.success(response);
          },
          (err) => {
            this.toastrService.error(err.error);
          }
        );
      }
    });
  }

  public isArabic(text:any) {
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return arabicPattern.test(text);
  }


}



export interface Tutorials {
	title: string;
	category: string;
	rating?: number;
}

