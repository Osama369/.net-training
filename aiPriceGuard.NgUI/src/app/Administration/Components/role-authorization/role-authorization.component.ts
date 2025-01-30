import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { GenericService } from 'src/app/Shared/Services/generic.service';
import { RoleAuthorizationService } from '../../Services/role-authorization.service';
import { UserService } from '../../Services/user.service';
import { Users } from '../../Models/users';

@Component({
  selector: 'app-role-authorization',
  templateUrl: './role-authorization.component.html',
  styleUrls: ['./role-authorization.component.scss']
})
export class RoleAuthorizationComponent implements OnInit {
  constructor(
    private roleAuthorizationService : RoleAuthorizationService,
    private userService : UserService,
    private genericService : GenericService,
    private toaster : ToastrService,
    private authService : AuthService,
    public bookmarkService: BookmarkService,
    public route : ActivatedRoute
    ){}

  SelectAll : Boolean = false;
  bookmark : boolean = false;
  heading : any = "Authorization";
  SelectedUser:any;
  FilteredUserList:any;
  userList : Users[];
  SelectedRoles:any;
  FilteredRolesList:any;
  rolesList : any[]=[];
  datalist :any;
  userData : any;
  ngOnInit(): void {
    this.route.params.subscribe(params1 => {
      this.userData = params1['id'];

   });



    this.genericService.getAllRoles().subscribe(lst=>{
      this.rolesList = lst;
      if(this.userData != undefined)
      {
        this.roleAuthorizationService.getAuthorizeScreen(this.userData.split(',')[1]).subscribe(x=>{
          this.datalist = x;
        });

        this.SelectedRoles = {RoleID : this.userData.split(',')[0], RoleName : this.rolesList.find(x=>x.RoleID == this.userData.split(',')[0]).RoleName}
        this.roleOnChange(this.userData.split(',')[0]);
      }
    })

    this.authService.GetBookmarkScreen(this.route.snapshot?.data['requiredPermission']).subscribe(x=>{
      this.bookmark = x;
  });

  }

  roleOnChange(roleID : any)
  {
    this.datalist = undefined;
    this.SelectedUser = [];
    this.userService.getAllUsers().subscribe((us:any)=>{
      this.userList = us;
      this.userList = this.userList.filter(x=>x.RoleID == roleID);
      if(this.userData != undefined)
      {
        this.SelectedUser = {UserID : this.userData.split(',')[1], userName : this.userList.find(x=>x.UserID == this.userData.split(',')[1])?.UserName};
      }
    })
  }

  UpdateBookmark(value:any){
    this.bookmarkService.Updatebookmark(this.route.snapshot.data['requiredPermission'],value).subscribe({
      next: (result: any) => {
        this.bookmark = value;
      },
    });;
  }



  filterUserlist(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.userList.length; i++) {
      let p = this.userList[i];
      if (p.UserName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(p);
      }
    }
    this.FilteredUserList = filtered;
  }

  filtersRole(event:any)
  {
      let filtered: any[] = [];
      let query = event.query;
      for (let i = 0; i < this.rolesList.length; i++) {
        let type = this.rolesList[i];
        if (type.RoleName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(type);
        }
      }
      this.FilteredRolesList = filtered;
  }

  isAllAddChecked(group:any): boolean {
    return group.every((item:any) => item.Add === true);
  }
  isAllEditChecked(group:any): boolean {
    return group.every((item:any) => item.Edit === true);
  }
  isAllDeleteChecked(group:any): boolean {
    return group.every((item:any) => item.Delete === true);
  }
  isAllViewChecked(group:any): boolean {
    return group.every((item:any) => item.isShow === true);
  }

  groupedRecords: any;
  submit()
  {
    this.roleAuthorizationService.getAuthorizeScreen(this.SelectedUser.UserID).subscribe(x=>{
      this.datalist = x;
    });
  }
  save()
  {
    this.authService.checkPermission('AuthorizationEdit').subscribe(x=>{
      if(x)
      {
        const mergedArrayDynamic = [].concat(...this.datalist.map((arr:any) => [...arr]));
        this.roleAuthorizationService.saveAuthorizaScreen(mergedArrayDynamic).subscribe(x=>{
          this.toaster.success("Succesfully Updated!");
          this.datalist = undefined;
          this.SelectAll = false;
        })
      }
      else{
        this.toaster.error("Unauthorized Access! You don't have permission to access.");
      }
    });

  }

  selectAllOnChange()
  {
    this.datalist.forEach((element:any) => {
       element.forEach((elem:any) => {
        elem.Add = this.SelectAll;
        elem.Edit = this.SelectAll;
        elem.Delete = this.SelectAll;
        elem.Print = this.SelectAll;
        elem.isShow = this.SelectAll;
       });
    });
  }

  SelectAddColumn(group:any, value:any){
      group.forEach((elem:any) => {
       elem.Add = value.checked;
    });
  }

  SelectEditColumn(group:any, value:any){
    group.forEach((elem:any) => {
      elem.Edit = value.checked;
   });
  }

  SelectDeleteColumn(group:any, value:any){
    group.forEach((elem:any) => {
      elem.Delete = value.checked;
   });
  }

  SelectViewColumn(group:any, value:any){
    group.forEach((elem:any) => {
      elem.isShow = value.checked;
   });
  }

}
