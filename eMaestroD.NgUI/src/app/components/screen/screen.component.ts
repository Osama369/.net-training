import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Customer } from 'src/app/models/customer';
import { InvoiceView } from 'src/app/models/invoice-view';
import { CustomersService } from 'src/app/services/customers.service';
import { InvoicesService } from 'src/app/services/invoices.service';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { GenericService } from 'src/app/services/generic.service';
import { Location } from 'src/app/models/location';
import { LocationService } from 'src/app/services/location.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { Users } from 'src/app/models/users';
import { Screen } from 'src/app/models/screen';
import { ScreenService } from 'src/app/services/screen.service';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.scss']
})

export class ScreenComponent implements OnInit {

    Screen : Screen[];
    ScreenList : Screen[];
    title : any = "";
    loading: boolean = true;
    columns : any[] = [];
    exportColumns : any[] =[];
    ScreenVisibility : boolean = false;

    constructor(private ScreenService: ScreenService,
      private toastr: ToastrService, private router: Router) { }

    ngOnInit() {
        this.ScreenService.getAllScreen().subscribe((sc: any) => {
          if(sc.length >0)
          {
            this.Screen = sc;
            this.columns = Object.keys(this.Screen[0]);
            this.exportColumns.push(new Object({title: "Screen Name",dataKey: "screenName"}));
            this.exportColumns.push(new Object({title: "Parent",dataKey: "screenParentName"}));
            this.loading = false;
          }
          else
          {
            this.loading = false;
          }
      });
    }


    clear(table: Table) {
        table.clear();
    }

    editView(data:any)
    {
      this.title = "Edit Screen"
      this.ScreenList = data;
      console.log(data);
      this.ScreenVisibility = true;
    }

    deleteView(locID:any)
    {
        if (confirm("Are you sure you want to delete this Location?") == true) {
            this.loading = true;
            //  this.locationService.deleteLoc(locID).subscribe(asd=>{
            //   this.toastr.show("Successfully Deleted!");
            //   this.locationService.getAllLoc().subscribe(loc => {
            //     this.loading = false;
            //     this.loc = loc;
            //   })
            // });
        } else {
        }
    }

  exportExcel() {
    var date = new Date();
    var dateFormate = `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`;
    let filtercols = this.columns.filter((f) => {
      return f.isHidden == true;
    });
    let filterList = this.Screen;
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
      this.saveAsExcelFile(excelBuffer, "Screens");
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
        (doc as any).autoTable(this.exportColumns, this.Screen);

        doc.save('Screens.pdf');

      });
    });
  }

  handleChildData(data: any) {

    if(data.type == 'added')
    {
        this.Screen.push(data.value);
        this.ScreenVisibility = false;
    }
    else
    {
        this.ScreenVisibility = false;
    }
  }

  AddNewUser()
  {
    this.ScreenList = [];
    this.title= "Screen Registration";
    this.ScreenVisibility = true;
  }

}

