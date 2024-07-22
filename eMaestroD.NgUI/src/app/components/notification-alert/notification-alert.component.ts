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
import { ToastrService } from 'ngx-toastr';
import { NotificationAlert } from 'src/app/models/notification-alert';
import { NotificationService } from 'src/app/services/notification.service';
import { BookmarkService } from 'src/app/services/bookmark.service';

@Component({
  selector: 'app-notification-alert',
  templateUrl: './notification-alert.component.html',
  styleUrls: ['./notification-alert.component.scss']
})

export class NotificationAlertComponent implements OnInit {

    alert : NotificationAlert[];
    alertList : NotificationAlert[];
    title : any = "";
    loading: boolean = true;
    columns : any[] = [];
    exportColumns : any[] =[];
    NotificationAlertVisibility : boolean = false;
    bookmark : boolean = false;

    constructor(private notificationService: NotificationService,
      private toastr: ToastrService, private router: Router,private authService:AuthService,
      public bookmarkService: BookmarkService,
      public route : ActivatedRoute) { }

    ngOnInit() {
        this.notificationService.GetNotificationAlert().subscribe(alert => {
            this.alert = alert;
            if(this.alert.length > 0)
            {
              this.columns = Object.keys(this.alert[0]);
              this.exportColumns.push(new Object({title: "Role",dataKey: "roleName"}));
              this.exportColumns.push(new Object({title: "Screen",dataKey: "screenName"}));
              this.exportColumns.push(new Object({title: "onSave",dataKey: "onSave"}));
              this.exportColumns.push(new Object({title: "onEdit",dataKey: "onEdit"}));
              this.exportColumns.push(new Object({title: "onDelete",dataKey: "onDelete"}));
              this.exportColumns.push(new Object({title: "active",dataKey: "active"}));
            }
            this.loading = false;
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

    editView(alert:any)
    {
      this.authService.checkPermission('NotificationAlertEdit').subscribe(x=>{
        if(x)
        {
          this.title = "Edit Notification Alert"
          this.alertList = alert;
          this.NotificationAlertVisibility = true;
        }
        else{
          this.toastr.error("Unauthorized Access! You don't have permission to access.");
        }
      });

    }

    deleteView(alertID:any)
    {
      this.authService.checkPermission('NotificationAlertDelete').subscribe(x=>{
        if(x)
        {
          if (confirm("Are you sure you want to delete this Notification Alert?") == true) {
            this.loading = true;
             this.notificationService.DeleteNotificationAlert(alertID).subscribe({
              next: x =>{
                this.toastr.success("Notification alert has been successfully deleted!");
                this.notificationService.GetNotificationAlert().subscribe(alert => {
                this.loading = false;
                this.alert = alert;
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
    let filterList = this.alert;
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
      this.saveAsExcelFile(excelBuffer, "NotificationAlert");
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
        (doc as any).autoTable(this.exportColumns, this.alert);

        doc.save('NotificationAlert.pdf');

      });
    });
  }

  handleChildData(data: any) {

    if(data.type == 'added')
    {
        this.alert.push(data.value);
        this.NotificationAlertVisibility = false;
    }
    else
    {
        this.NotificationAlertVisibility = false;
    }
  }

  AddNewNotificationAlert()
  {

    this.authService.checkPermission('NotificationAlertCreate').subscribe(x=>{
      if(x)
      {
        this.alertList = [];
      this.title= "Notification Alert Registration";
      this.NotificationAlertVisibility = true;
      }
      else{
        this.toastr.error("Unauthorized Access! You don't have permission to access.");
      }
    });

  }

}
