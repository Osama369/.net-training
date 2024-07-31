import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { FiscalYear } from '../../Models/FiscalYear';
import { FiscalyearService } from '../../Services/fiscalyear.service';


@Component({
  selector: 'app-fiscal-year',
  templateUrl: './fiscal-year.component.html',
  styleUrls: ['./fiscal-year.component.scss'],
  providers:[ConfirmationService,MessageService]
})

export class FiscalYearComponent implements OnInit {
  constructor(
    private fiscalyearService: FiscalyearService,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
    public bookmarkService: BookmarkService,
    public route : ActivatedRoute
    ) { }

    @ViewChild(Table) private dataTable: Table;
    FYlist: FiscalYear[];
    exportColumns : any[] = [];
    loading : boolean = true;
    IsEdit : boolean = false;
    AddFiscalYearVisibility:boolean = false;
    endFiscalYearVisibility:boolean = false;
    title:any;
    title1:any;
    list:FiscalYear[]
    bookmark : boolean = false;
    ngOnInit() {

        this.fiscalyearService.GetAllFiscalYear().subscribe(taxlst => {
            this.FYlist = taxlst;
            this.loading = false;
            this.exportColumns.push(new Object({title: "period",dataKey: "period"}));
            this.exportColumns.push(new Object({title: "Start Date",dataKey: "dtStart"}));
            this.exportColumns.push(new Object({title: "End Date",dataKey: "dtEnd"}));
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

    handleChange(FY:FiscalYear)
    {
      this.authService.checkPermission('FiscalYearEdit').subscribe(x=>{
        if(x)
        {
          if(FY.active == true)
          {
            this.fiscalyearService.UpdateFicalYearActive(FY).subscribe({
              next: (lst)=> {
                this.FYlist = lst;
              },
            })
          }
        }
        else{
          this.toastr.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }

    editView(tax :any)
    {

      this.authService.checkPermission('FiscalYearEdit').subscribe(x=>{
        if(x)
        {
          this.title = "Edit Fiscal Year";
          this.list = tax;
          this.IsEdit = true;
          this.AddFiscalYearVisibility = true;
        }
        else{
          this.toastr.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }
    AddNew()
    {
      this.authService.checkPermission('FiscalYearCreate').subscribe(x=>{
        if(x)
        {
          this.title = "Add New Fiscal Year";
          this.list = [];
          this.IsEdit = false;
          this.AddFiscalYearVisibility = true;
        }
        else{
          this.toastr.error("Unauthorized Access! You don't have permission to access.");
        }
      });

    }


    EndFiscalYear()
    {
      this.authService.checkPermission('FiscalYearCreate').subscribe(x=>{
        if(x)
        {
          this.title1 = "End Fiscal Year";
          this.IsEdit = true;
          this.list = this.FYlist.filter(x=>x.active == true);
          this.endFiscalYearVisibility = true;
        }
        else{
          this.toastr.error("Unauthorized Access! You don't have permission to access.");
        }
      });

    }

    Delete(FY :FiscalYear)
    {
      this.authService.checkPermission('FiscalYearDelete').subscribe(x=>{
        if(x)
        {
          this.confirmationService.confirm({
            message: 'Are you sure that you want to Delete?',
            header: ' ',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              if(FY.active == false)
              {
                this.fiscalyearService.DeleteFiscalYear(FY.period).subscribe({
                  next: (lst)=> {
                    this.toastr.success("Fiscal year has been successfully deleted!");
                    this.fiscalyearService.GetAllFiscalYear().subscribe(lst => {
                      this.FYlist = lst;
                    })
                  },
                  error:(err)=>{
                    this.toastr.error(err.error);
                  }
                })
              }
              else
              {
                this.toastr.error("Can't Delete Active Fiscal Year.")
              }
            }
          });
        }
        else{
          this.toastr.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }
  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.FYlist);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, "FiscalYear");
    });
  }

  handleChildData(data: any) {
    if(data.type == 'added')
     {
        this.FYlist = data.value;
     }
     else
     {
        this.FYlist = this.FYlist.map(list => {
          if (list.fID === data.value.fID) {
              return data.value; // Update the matching customer with new values
          } else {
              return list; // Keep other customers unchanged
          }
          });
      }
      this.AddFiscalYearVisibility = false;
      this.endFiscalYearVisibility = false;
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
        (doc as any).autoTable(this.exportColumns, this.FYlist);

        doc.save('FiscalYear.pdf');

      });
    });
  }
}
