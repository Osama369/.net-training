import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GenericServiceService } from 'src/app/services/generic-service.service';

@Component({
  selector: 'app-role-authorization',
  templateUrl: './role-authorization.component.html',
  styleUrls: ['./role-authorization.component.scss']
})
export class RoleAuthorizationComponent implements OnInit {
  constructor(
    private genericService : GenericServiceService,
    private toaster : ToastrService,
    ){}

    SelectAll : Boolean = false;

  heading : any = "Authorization Template";
  SelectedRoles:any;
  FilteredRolesList:any;
  rolesList : any[]=[];
  datalist :any;
  ngOnInit(): void {

    this.rolesList = [{roleID:1,roleName:"ADMIN"},
    {roleID:2,roleName:"Supervisor"},
    {roleID:3,roleName:"Accounts Officer"},
    {roleID:4,roleName:"DEO"}];
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

  filtersRole(event:any)
  {
      let filtered: any[] = [];
      let query = event.query;
      for (let i = 0; i < this.rolesList.length; i++) {
        let type = this.rolesList[i];
        if (type.roleName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(type);
        }
      }
      this.FilteredRolesList = filtered;
  }
  groupedRecords: any;
  submit()
  {
    this.genericService.GetAuthorizationTemplate(this.SelectedRoles.roleID).subscribe((x:any)=>{
      this.datalist = x;
    });
  }
  save()
  {
        const mergedArrayDynamic = [].concat(...this.datalist.map((arr:any) => [...arr]));
        this.genericService.SaveAuthorizationTemplate(mergedArrayDynamic).subscribe((x:any)=>{
          this.toaster.success("Succesfully Updated!");
          this.datalist = undefined;
          this.SelectAll = false;
        })
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
