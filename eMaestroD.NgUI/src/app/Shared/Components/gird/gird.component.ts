import { getCurrencySymbol } from '@angular/common';
import { Component, EventEmitter, Input, Output, Pipe } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ColumnTypes } from '../../Models/columnstypes';
import { BookmarkService } from '../../Services/bookmark.service';
import { AuthService } from '../../../Shared/Services/auth.service';
import { GenericService } from '../../Services/generic.service';
import { ProductCategoryService } from 'src/app/Manage/Services/product-category.service';

@Component({
  selector: 'app-gird',
  templateUrl: './gird.component.html',
  styleUrls: ['./gird.component.css']
})
export class GirdComponent {
  constructor(private _router: Router,private genericService : GenericService,
    private authService : AuthService,
    public bookmarkService: BookmarkService,
    public productCategoryService: ProductCategoryService,
    public route : ActivatedRoute) {}

    bookmark : boolean = false;

  @Input() public columns: any[];
  @Input() public data: any[];
  @Input() public tableheading: string = 'No Heading';
  @Input() public rowcount: number = 10;
  @Input() public allowPaggination: boolean = true;
  @Input() public allowColSort: boolean = true;
  @Input() public allowColFilter: boolean = true;
  @Input() public allowGlobalFilter: boolean = true;
  @Input() public allowActionButtons: boolean = true;
  @Input() public allowUploadButtons: boolean = true;
  @Input() public allowPdfButton: boolean = false;
  @Input() public allowExportButtons: boolean = true;
  @Input() public allowAddButtons: boolean = true;
  @Output() dataEvent = new EventEmitter<any>();
  @Output() handleToolVisibility = new EventEmitter<any>();
  exportColumns : any[] = [];
  CurrencyCode : any;
  first = 0;

  FilterProductGrouplist: any[];
  SelectedproductGrouplist: any;
  productGrouplist : any[];
  productsForFilter : any[];

  sendDataToParent(type:any,value:any) {
    this.dataEvent.emit({type: type, value: value});
  }
  sendDataToParentforUpload()
  {
    this.handleToolVisibility.emit(true);
  }

  applyFilterGlobal($event: any, stringVal: any, table: any) {
    table.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  public get enum_ColTypes() {
    return ColumnTypes;
  }

  ngOnInit() {
    this.authService.GetBookmarkScreen(this.route.snapshot?.data['requiredPermission']).subscribe(x=>{
      this.bookmark = x;
    });

    this.productCategoryService.getAllGroups().subscribe({
      next: (comp) => {
        this.productGrouplist =(comp as { [key: string]: any })["enttityDataSource"];
       
        this.productsForFilter = this.data;
        this.productGrouplist.unshift({
          prodGrpID:0,
          prodGrpName:"---ALL---"
        })
        this.SelectedproductGrouplist = {prodGrpID:0,prodGrpName:"---ALL---"};
      },
      error: (response) => {
        console.log(response);
      },
    });

  }

  UpdateBookmark(value:any){
    this.bookmarkService.Updatebookmark(this.route.snapshot.data['requiredPermission'],value).subscribe({
      next: (result: any) => {
        this.bookmark = value;
      },
    });;
  }

  ngOnChanges() {
    if (this.columns) {
      this.columns.filter((f) => {
        this.productsForFilter = this.data;
        if (f.isHidden == false) {
          this.exportColumns.push(
            new Object({
              title: f.header,
              dataKey: f.field,
            })
          );
        }
      });
    }
  }

  exportExcel() {
    let filtercols = this.columns.filter((f) => {
      return f.isHidden == true;
    });
    let filterList = this.data;
    filterList.filter((f) => {
      if(this.tableheading == "Products"){ f["openingStock"] = 0;}
      else if(this.tableheading == "Customers"){ f["OpeningBalance"] = 0;}
      else if(this.tableheading == "Suppliers"){ f["OpeningBalance"] = 0;}
      filtercols.map((m) => {
        delete f[m.field];
      });
    });

    // Get the headers from your exportColumns list
    const headers = this.exportColumns.map(column => column.title);

    // Map the headers to the worksheet
    const filteredData = filterList.map(item => {
      const newItem : any = {};
      headers.forEach((header, index) => {
        newItem[header] = item[Object.keys(item)[index]];
      });
      return newItem;
    });

    filteredData.filter((f) => {
      if(this.tableheading == "Products"){ f["OPENING STOCK"] = 0;}
      else if(this.tableheading == "Customers"){ f["OPENING BALANCE"] = 0;}
      else if(this.tableheading == "Suppliers"){ f["OPENING BALANCE"] = 0;}
    });

    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(filteredData);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, this.tableheading.toString());
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
        (doc as any).autoTable(this.exportColumns, this.data);

        doc.save(this.tableheading.toString()+'.pdf');

      });
    });
  }

  filterCategory(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.productGrouplist.length; i++) {
      let product = this.productGrouplist[i];
      if (product.prodGrpName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(product);
      }
    }
    this.FilterProductGrouplist = filtered;
  }

  ChangeProducts()
  {
    if(this.SelectedproductGrouplist.prodGrpID != 0)
    {
      this.data = this.productsForFilter.filter(x=>x.prodGrpID == this.SelectedproductGrouplist.prodGrpID);
    }
    else{
      this.data = this.productsForFilter;
    }
  }

}
