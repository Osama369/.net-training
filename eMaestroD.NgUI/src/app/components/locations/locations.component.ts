import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Customer } from 'src/app/models/customer';
import { InvoiceView } from 'src/app/models/invoice-view';
import { CustomersService } from 'src/app/services/customers.service';
import { InvoicesService } from 'src/app/services/invoices.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { GenericService } from 'src/app/services/generic.service';
import { Location } from 'src/app/models/location';
import { LocationService } from 'src/app/services/location.service';
import { ToastrService } from 'ngx-toastr';
import { BookmarkService } from 'src/app/services/bookmark.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})

export class LocationsComponent implements OnInit {

    loc : Location[];
    locList : Location[];
    title : any = "";
    loading: boolean = true;
    columns : any[] = [];
    exportColumns : any[] =[];
    locationVisibility : boolean = false;
    bookmark : boolean = false;

    constructor(private locationService: LocationService,
      private toastr: ToastrService, private router: Router,private authService:AuthService,
      public bookmarkService: BookmarkService,
      public route : ActivatedRoute
      ) { }

    ngOnInit() {
        this.locationService.getAllLoc().subscribe(loc => {
          if(loc.length >0)
          {

            this.loc = loc;
            this.loc = this.loc.filter(x=>x.comID == localStorage.getItem('comID'));
            if(this.loc.length > 0)
            {

              this.columns = Object.keys(this.loc[0]);
              this.exportColumns.push(new Object({title: "Code",dataKey: "locCode"}));
              this.exportColumns.push(new Object({title: "Name",dataKey: "locName"}));
              this.exportColumns.push(new Object({title: "Descripton",dataKey: "descr"}));
              this.exportColumns.push(new Object({title: "Address",dataKey: "locAddress"}));
              this.exportColumns.push(new Object({title: "Phone",dataKey: "locPhone"}));
            }
            this.loading = false;
          }
          else
          {
            this.loading = false;
          }
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

    editView(loc:any)
    {
      this.authService.checkPermission('LocationEdit').subscribe(x=>{
        if(x)
        {
          this.title = "Edit Location"
          this.locList = loc;
          this.locationVisibility = true;
        }
        else{
          this.toastr.error("Unauthorized Access! You don't have permission to access.");
        }
      });

    }

    deleteView(locID:any)
    {
      this.authService.checkPermission('LocationDelete').subscribe(x=>{
        if(x)
        {
          if (confirm("Are you sure you want to delete this Location?") == true) {
             this.locationService.deleteLoc(locID).subscribe({
              next: x =>{
                this.toastr.success("Location has been successfully deleted!");
                this.locationService.getAllLoc().subscribe(loc => {
                this.loc = loc;
                })
              },
              error:err=>{
                this.toastr.error(err.error);
                }
              }
            );
        }
        }
        else{
          this.toastr.error("Unauthorized Access! You don't have permission to access.");
        }
      });


    }

  exportExcel() {
    var date = new Date();
    var dateFormate = `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`;
    let filtercols = this.columns.filter((f) => {
      return f.isHidden == true;
    });
    let filterList = this.loc;
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
      this.saveAsExcelFile(excelBuffer, "location");
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
        (doc as any).autoTable(this.exportColumns, this.loc);

        doc.save('location.pdf');

      });
    });
  }

  handleChildData(data: any) {

    if(data.type == 'added')
    {
        this.loc.push(data.value);
        this.locationVisibility = false;
    }
    else
    {
        this.locationVisibility = false;
    }
  }

  AddNewLocation()
  {

    this.authService.checkPermission('LocationCreate').subscribe(x=>{
      if(x)
      {
        this.locList = [];
      this.title= "Location Registration";
      this.locationVisibility = true;
      }
      else{
        this.toastr.error("Unauthorized Access! You don't have permission to access.");
      }
    });

  }

}
