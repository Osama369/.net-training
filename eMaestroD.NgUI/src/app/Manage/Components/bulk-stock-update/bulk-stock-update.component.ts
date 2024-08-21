import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { LocationService } from 'src/app/Administration/Services/location.service';
import { InvoicesService } from 'src/app/Invoices/Services/invoices.service';
import { InvoiceView } from 'src/app/Invoices/Models/invoice-view';
import { ReportSettingService } from 'src/app/Reports/Services/report-setting.service';
import { ReportService } from 'src/app/Reports/Services/report.service';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { GenericService } from 'src/app/Shared/Services/generic.service';
import { ProductCategoryService } from '../../Services/product-category.service';
import { Location } from './../../../Administration/Models/location';

@Component({
  selector: 'app-bulk-stock-update',
  templateUrl: './bulk-stock-update.component.html',
  styleUrls: ['./bulk-stock-update.component.scss']
})

export class BulkStockUpdateComponent implements OnInit {

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
    isBankInfo : boolean = false;
    bankDetail  : boolean = false;
    reportSettingVisiblity : boolean = false;
    reportSettingItemList : any[]=[];
    isProductCode: boolean = false;
    isArabic: boolean = false;
    bookmark : boolean = false;

    uploadedFiles: any[] = [];
    UploadToolVisibility : boolean = false;
    methodName : any;
    serviceName : any;
    @ViewChild('file') fileUpload: any;
    UploadBtnDisable : boolean = false;

    exportedCol: any[] = [];

    selectedLocation:any;
    LocationList : Location[];
    locations : Location[];
    stockList : any;
    productlist:any[];
    selectedCategory : any;
    categoryList : any[];


    constructor(private invoiceService: InvoicesService,
      private genericService: GenericService,
      private router: Router,
      private toasterService: ToastrService,
      private authService : AuthService,
      private reportSettingService : ReportSettingService,
      private reportService : ReportService,
      private productCategoryService : ProductCategoryService,
      private locationService : LocationService,
      public bookmarkService: BookmarkService,
      public route : ActivatedRoute
      ) { }

    async ngOnInit() {

        this.reportSettingService.GetInvoiceReportSettings().subscribe(rpt=>{
          this.reportSettingItemList = rpt.filter(x=>x.screenName.toLowerCase() == "sale");
        })

        this.invoiceService.getInvoicesList(43).subscribe(invoices => {
            this.invoices = invoices;
            this.loading = false;
            this.exportColumns.push(new Object({title: "Date",dataKey: "dtTx"}));
            this.exportColumns.push(new Object({title: "Invoice No",dataKey: "voucherNo"}));
        });

      this.authService.GetBookmarkScreen(this.route.snapshot?.data['requiredPermission']).subscribe(x=>{
        this.bookmark = x;
    });



    this.productCategoryService.getAllGroups().subscribe({
      next: (result) => {
        this.categoryList =(result as { [key: string]: any })["enttityDataSource"];
        this.categoryList.unshift({
          prodGrpID:0,
          prodGrpName:"---ALL---"
        })
        this.selectedCategory = {prodGrpID:0,prodGrpName:"---ALL---"};
      },
      error: (response) => {
        console.log(response);
      },
    });





  const loc = await lastValueFrom(this.locationService.getAllLoc());
    this.locations = loc;
    if (this.locations && this.locations.length > 0) {
      this.selectedLocation = {
        locID: this.locations[0].locID,
        locName: this.locations[0].locName,
      };
    }
    const reportData = await lastValueFrom(
      this.reportService.runReportWith1Para("StockList", 0, 0, 0)
    );
    this.stockList = (reportData as { [key: string]: any })["enttityDataSource"];
      if (this.selectedLocation && this.stockList) {
        this.productlist = this.stockList.filter(
          (x: any) => x.locID === this.selectedLocation.locID
          );
      }
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
        this.router.navigateByUrl('/AddNewSale/'+invoiceNo);
    }

    deleteView(invoiceNo:any)
    {
      this.authService.checkPermission('bulkStockUpdateDelete').subscribe((x:any)=>{
        if(x)
        {
          if (confirm("Are you sure you want to delete this invoice?") == true) {
              this.loading = true;
              this.invoiceService.deleteInvoice(invoiceNo).subscribe(asd => {
                this.toasterService.success("Bulk Stock invoice has been successfully deleted!");
                  this.invoiceService.getInvoicesList(43).subscribe(invoices => {
                      this.invoices = invoices;
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
      this.router.navigateByUrl('/Invoices/Detail/'+invoiceNo);
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
      this.saveAsExcelFile(excelBuffer, "bulkStockUpdate");
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

        doc.save('bulkStockUpdate.pdf');

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

  handleTool(data:any)
    {
      this.authService.checkPermission('bulkStockUpdateCreate').subscribe(x=>{
        if(x)
        {
          this.UploadToolVisibility = data;
          this.exportedCol  = [{
                  "PRODUCT CODE":"000",
                  "PRODUCT NAME":  "Any",
                  "LOCATION":"ANY",
                  "AVALAIBLE QTY": "xyz",
                  "UPDATE QTY": "0000000000",
                  }]
          this.serviceName = "InvoiceService";
          this.methodName = "uploadStockAdjustment";
        }
        else{
          this.toasterService.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }

  onUpload() {

    this.UploadBtnDisable = true;
      const formData = new FormData();
      formData.append('file', this.fileUpload.files[0]);
      console.log(this.fileUpload.files[0]);
      this.toasterService.info("File is uploading Please Wait!", "", { timeOut: 2000000 });
      this.invoiceService.UploadStockAdjustment(formData).subscribe({
          next: (data:any) => {
            this.invoiceService.getInvoicesList(43).subscribe(invoices => {
              this.invoices = invoices;
              this.loading = false;
            });
            this.toasterService.clear();
            this.fileUpload.clear();
            this.toasterService.success("Stock succesfully updated!", "", { timeOut: 20000 });
            this.UploadBtnDisable = false;
            this.UploadToolVisibility = false;
          },
          error: (response:any) => {
            this.toasterService.clear();
            this.toasterService.error(response.error);
            this.UploadBtnDisable = false;
          },
        });
  }


  downloadTemplate()
  {
    this.ChangeProductList();
    this.exportExcelTemplate();
  }

  exportExcelTemplate() {
    import("xlsx").then(xlsx => {

      const columnMapping = {
        1: "PRODUCT CODE",
        2: "PRODUCT NAME",
        3: "AVAILABLE QTY",
        4: "UPDATE QTY",
        5: "LOCATION"
    };

    // Create a new array with the data mapped according to the defined column mapping
    const filteredProductList = this.productlist.map((product: any) => {
        let filteredProduct: any = {};

        // Iterate over the column mapping
        for (const [sourceIndex, targetColumn] of Object.entries(columnMapping)) {
            // Convert sourceIndex from string to number for indexing
            const sourceIndexNum = parseInt(sourceIndex, 10);

            // Retrieve the key name for the given index
            const columnKeys = Object.keys(product);
            const key = columnKeys[sourceIndexNum - 1]; // -1 because array index starts from 0

            // Assign the correct data to the target column
            filteredProduct[targetColumn] = product[key];
            if(sourceIndexNum == 5){
              filteredProduct[targetColumn] = this.selectedLocation.locName;
            }
        }

        return filteredProduct;
    });


        const worksheet = xlsx.utils.json_to_sheet(filteredProductList);
        const workbook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "Bulk Stock Update");
    });
  }

  filterLocation(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.locations.length; i++) {
      let loc = this.locations[i];
      if (loc.locName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(loc);
      }
    }
    this.LocationList = filtered;
  }

  ChangeProductList(){
    if(this.stockList)
    {
      if(this.selectedCategory.prodGrpID == 0)
      {
        this.productlist = this.stockList.filter((x:any)=>x.locID == this.selectedLocation.locID);
      }else{
        this.productlist = this.stockList.filter((x:any)=>x.prodGrpID == this.selectedCategory.prodGrpID && x.locID == this.selectedLocation.locID);
      }
    }
  }

  OpenUploadWindow()
  {
    this.authService.checkPermission('bulkStockUpdateCreate').subscribe(x=>{
      if(x)
      {
        this.UploadToolVisibility=true;
      }
      else{
        this.toasterService.error("Unauthorized Access! You don't have permission to access.");
      }
    });
  }
}
