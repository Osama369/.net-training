import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { UserService } from '../../Services/user.service';
import { Users } from '../../Models/users';
import { APP_ROUTES } from 'src/app/app-routes';
import { SharedDataService } from 'src/app/Shared/Services/shared-data.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {

    User : Users[];
    UserList : Users[];
    resetPasswordUser : any;
    title : any = "";
    loading: boolean = true;
    columns : any[] = [];
    exportColumns : any[] =[];
    UserVisibility : boolean = false;
    resetPasswordVisibility : boolean = false;
    newPassword:any = "";
    bookmark : boolean = false;

    constructor(private userService: UserService,
      private toastr: ToastrService, private router: Router,
      private authService:AuthService,
      public bookmarkService: BookmarkService,
      public route : ActivatedRoute,
      private sharedDataService : SharedDataService
      ) { }

    ngOnInit() {
        this.userService.getAllUsers().subscribe(user => {
          console.log(this.User);
          if(user.length >0)
          {
            this.User = user;
            this.columns = Object.keys(this.User[0]);
            this.exportColumns.push(new Object({title: "First Name",dataKey: "FirstName"}));
            this.exportColumns.push(new Object({title: "Last Name",dataKey: "LastName"}));
            this.exportColumns.push(new Object({title: "Email",dataKey: "Email"}));
            this.exportColumns.push(new Object({title: "Phone",dataKey: "Mobile"}));
            this.exportColumns.push(new Object({title: "Role",dataKey: "RoleName"}));
            this.exportColumns.push(new Object({title: "Companies",dataKey: "Companies"}));
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

    editView(data:any)
    {
      this.authService.checkPermission('UsersEdit').subscribe(x=>{
        if(x)
        {
          this.title = "Edit User"
          this.UserList = data;
          this.UserVisibility = true;
        }
        else{
          this.toastr.error("Unauthorized Access! You don't have permission to access.");
        }
      });

    }

    ResetView(data:any)
    {
      this.authService.checkPermission('UsersEdit').subscribe(x=>{
        if(x)
        {
          this.resetPasswordUser = data;
          this.newPassword = "";
          this.resetPasswordVisibility = true;
        }
        else{
          this.toastr.error("Unauthorized Access! You don't have permission to access.");
        }
      });

    }
    SetAuthorization(user:any)
    {
      this.router.navigateByUrl(APP_ROUTES.administration.authorization+"/"+user.RoleID+','+user.UserID);

    }

    ResetPassword()
    {
      if(this.newPassword == ""){
        this.toastr.error("Please Enter Password");
      }
      else{
        this.resetPasswordUser.password = this.newPassword;
        this.userService.ResetPassword(this.resetPasswordUser).subscribe({
          next:(result)=>{
            this.toastr.success("User password has been successfully reset.");
            this.resetPasswordVisibility = false;
          },
          error:(responce)=>{
            this.toastr.error(responce.error);
          }
        })
      }
    }

    deleteView(ID:any)
    {
      this.authService.checkPermission('UsersDelete').subscribe(x=>{
        if(x)
        {
          if (confirm("Are you sure you want to delete this User?") == true) {
            this.loading = true;
             this.userService.deleteUser(ID).subscribe({
              next : (lst) => {
                this.toastr.success("User has been successfully deleted!");
                this.User = this.User.filter(item => item.UserID !== ID);
                this.sharedDataService.updateUsers$();
              },
              error: (err)=> {
                this.toastr.error(err.error);
              },
            });
          }
          this.loading = false;
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
    let filterList = this.User;
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
      this.saveAsExcelFile(excelBuffer, "users");
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
        (doc as any).autoTable(this.exportColumns, this.User);

        doc.save('users.pdf');

      });
    });
  }

  handleChildData(data: any) {

    if(data.type == 'added')
    {
        this.User.push(data.value);
        this.UserVisibility = false;
    }
    else
    {
        this.UserVisibility = false;
    }
  }

  AddNewUser()
  {
    this.authService.checkPermission('UsersCreate').subscribe(x=>{
      if(x)
      {
        this.UserList = [];
        this.title= "User Registration";
        this.UserVisibility = true;
      }
      else{
        this.toastr.error("Unauthorized Access! You don't have permission to access.");
      }
    });

  }

}

