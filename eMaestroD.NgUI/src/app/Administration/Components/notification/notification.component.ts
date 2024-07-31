import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { SignalrService } from 'src/app/Shared/Services/signalr.service';
import { NotificationService } from '../../Services/notification.service';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})

export class NotificationComponent implements OnInit {

    notificationList : any[];
    title : any = "";
    loading: boolean = true;
    columns : any[] = [];
    exportColumns : any[] =[];
    selectedNotificaiton:any[]=[];
    bookmark : boolean = false;

    constructor(private notificationService: NotificationService,
      private toastr: ToastrService,
      private router: Router,
      private authService:AuthService,
      private signalrService:SignalrService,
      public bookmarkService: BookmarkService,
      public route : ActivatedRoute
      ) { }

    ngOnInit() {
        this.notificationService.GetNotification().subscribe(alert => {
            this.notificationList = alert;
            if(this.notificationList.length > 0)
            {
              this.columns = Object.keys(this.notificationList[0]);
              this.exportColumns.push(new Object({title: "Date",dataKey: "createdDate"}));
              this.exportColumns.push(new Object({title: "User Name",dataKey: "username"}));
              this.exportColumns.push(new Object({title: "User Email",dataKey: "email"}));
              this.exportColumns.push(new Object({title: "Message",dataKey: "message"}));
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


    redirectToInvoice(invoiceNo : any)
    {
      var prefix = invoiceNo.substring(0, 3);
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
     else if(prefix == "JV-" || prefix == "EXP"){
       const url = this.router.serializeUrl(
         this.router.createUrlTree([`JournalVoucherDetail/`+invoiceNo])
       );
       window.open(url, '_blank');
     }
    }

    clear(table: Table) {
        table.clear();
    }

    MarkAsRead()
    {
      this.notificationService.UpdateNotificationStatus(this.selectedNotificaiton).subscribe(alert => {

        this.notificationService.GetNotification().subscribe(alert => {
          this.toastr.success("Notification has been successfully mark as read!");
          this.notificationList = alert;
        });
          this.signalrService.ClearNotification();
      });
    }

  exportExcel() {
    var date = new Date();
    var dateFormate = `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`;
    let filtercols = this.columns.filter((f) => {
      return f.isHidden == true;
    });
    let filterList = this.notificationList;
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
      this.saveAsExcelFile(excelBuffer, "Notifications");
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
        (doc as any).autoTable(this.exportColumns, this.notificationList);

        doc.save('Notifications.pdf');

      });
    });
  }
}
