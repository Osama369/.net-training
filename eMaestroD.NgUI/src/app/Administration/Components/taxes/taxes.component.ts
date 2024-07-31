import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { Taxes } from '../../Models/taxes';
import { TaxesService } from '../../Services/taxes.service';
import { AuthService } from './../../../Shared/Services/auth.service';


@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.css'],
  providers:[ConfirmationService,MessageService]

})

export class TaxesComponent implements OnInit {
  constructor(
    private taxesService: TaxesService,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
    public bookmarkService: BookmarkService,
    public route : ActivatedRoute
    ) { }

    @ViewChild(Table) private dataTable: Table;
    taxlist: Taxes[];
    exportColumns : any[] = [];
    loading : boolean = true;
    IsEdit : boolean = false;
    AddTaxesVisibility:boolean = false;
    title:any;
    list:Taxes[]
    bookmark : boolean = false;

    ngOnInit() {

        this.taxesService.getAllTaxes().subscribe(taxlst => {
            this.taxlist = taxlst;
            this.loading = false;
            this.exportColumns.push(new Object({title: "Tax Name",dataKey: "TaxName"}));
            this.exportColumns.push(new Object({title: "Value",dataKey: "taxValue"}));
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

    handleChange(tax:Taxes)
    {
      this.authService.checkPermission('TaxesEdit').subscribe(x=>{
        if(x)
        {
          if(tax.isDefault == true)
          {
            this.taxesService.updateIsDefault(tax).subscribe({
              next: (lst)=> {
                this.taxlist = lst;
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

      this.authService.checkPermission('TaxesEdit').subscribe(x=>{
        if(x)
        {
          this.title = "Edit Tax";
          this.list = tax;
          this.IsEdit = true;
          this.AddTaxesVisibility = true;
        }
        else{
          this.toastr.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }
    AddNew()
    {
      this.authService.checkPermission('TaxesCreate').subscribe(x=>{
        if(x)
        {
          this.title = "Add New Tax";
          this.list = [];
          this.IsEdit = false;
          this.AddTaxesVisibility = true;
        }
        else{
          this.toastr.error("Unauthorized Access! You don't have permission to access.");
        }
      });

    }
    Delete(tax :Taxes)
    {
      this.authService.checkPermission('TaxesDelete').subscribe(x=>{
        if(x)
        {
          this.confirmationService.confirm({
            message: 'Are you sure that you want to Delete?',
            header: ' ',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              if(tax.isDefault == false)
              {
                this.taxesService.deleteTax(tax.TaxID).subscribe({
                  next: (lst)=> {
                    this.toastr.success("Tax has been successfully deleted!");
                    this.taxesService.getAllTaxes().subscribe(taxlst => {
                      this.taxlist = taxlst;
                    })
                  },
                  error:(err)=>{
                    this.toastr.error(err.error);
                  }
                })
              }
              else
              {
                this.toastr.error("Can't Delete Default Tax.")
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
      const worksheet = xlsx.utils.json_to_sheet(this.taxlist);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, "Taxes");
    });
  }

  handleChildData(data: any) {
    if(data.type == 'added')
     {
        this.taxlist.push(data.value);
         this.AddTaxesVisibility = false;
     }
     else
     {
         this.AddTaxesVisibility = false;
     }
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
        (doc as any).autoTable(this.exportColumns, this.taxlist);

        doc.save('Taxes.pdf');

      });
    });
  }
}
