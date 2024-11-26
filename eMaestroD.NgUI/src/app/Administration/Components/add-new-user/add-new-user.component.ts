import { empty } from 'rxjs';
import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConnectedOverlayScrollHandler } from 'primeng/dom';
import { UserService } from '../../Services/user.service';
import { Users } from '../../Models/users';
import { GenericService } from 'src/app/Shared/Services/generic.service';
import { SharedDataService } from 'src/app/Shared/Services/shared-data.service';
import { Location } from '../../Models/location';

@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.scss']
})
export class AddNewUserComponent {
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private el: ElementRef,
    private userService : UserService,
    private genericService : GenericService,
    private sharedDataService: SharedDataService
    ) {}

  @Input() UserVisible : boolean;
  UserList: Users[];
  @Input() UsersList : Users[];
  @ViewChildren('inputFieldTable') inputFieldTable: QueryList<any>;
  @ViewChild('savebtn') savebtn: ElementRef<HTMLElement>;
  @Output() dataEvent = new EventEmitter<any>();
  @Input() UserData : any;
  @Input() title : any;
  isEdit: boolean = false;
  filterRole:any[]=[];
  roleList : any[] = [];
  SelectedRole :any;
  SelectedLocation :any = {};
  cols: any[] = [];
	_selectedColumns: any[];
  exportColumns : any[] =[];
  locations:Location[];

  sendDataToParent() {
    this.dataEvent.emit({type:'',value:false});
  }

  ngOnInit(): void {
    this.UserList = [{
      Companies : "",
      CompaniesID  : "",
      Email : "",
      FirstName : "",
      LastName : "",
      Mobile : "",
      RoleID : "",
      RoleName : "",
      UserID : "",
      locID: "",
      locations: ""
    }];

    this.genericService.getAllRoles().subscribe(lst=>{
      this.roleList = lst;
      this.filterRole = this.roleList;
    })

    this.genericService.getCompanylist().subscribe(lst=>{
      this.cols = lst;
    })

    this.sharedDataService.getLocations$().subscribe({
      next : (loc:any)=>{
        this.locations = loc.filter(x=>x.LocTypeId == 5);
      }
    })
  }


  ngOnChanges(changes: SimpleChanges) {


    if(this.UserData != undefined && this.UserData.length != 0)
    {
      this.isEdit = true;
      this.selectedColumns = [];
      this.UserList[0] = this.UserData;
      this.SelectedRole = {RoleID : this.UserList[0].RoleID,RoleName : this.UserList[0].RoleName};
      this.SelectedLocation = this.locations.find(x=>x.LocationId == this.UserList[0].locID);
      let comList = this.UserList[0].CompaniesID.split(',');
      comList.forEach((elem:any) => {
        this.selectedColumns = this.selectedColumns.concat(this.cols.filter(x => x.comID == elem));
      });
    }
    else
    {
      this.isEdit = false;
       this.clear();
    }
  }
  @Input() get selectedColumns(): any[] {
		return this._selectedColumns;
	}
	set selectedColumns(val: any[]) {
		this._selectedColumns =
			this.cols.filter((col) => val.includes(col));
      this.exportColumns.splice(0,this.exportColumns.length);
      this._selectedColumns.forEach(element => {
        this.exportColumns.push(new Object({title: element.header,dataKey: element.field}));
      });
	}

  clear()
  {
    this.UserList = [{
      Companies : "",
      CompaniesID  : "",
      Email : "",
      FirstName : "",
      LastName : "",
      Mobile : "",
      RoleID : "",
      RoleName : "",
      UserID : "",
      locID: "",
      locations: ""
    }];
    this.SelectedRole = [];
    this.SelectedLocation = [{}];
    this.selectedColumns = [];
  }
  saveUser()
  {

      if(this.UserList[0].FirstName == undefined || this.UserList[0].FirstName.trim() == "" ){
        this.toastr.error("Please write first name");
        this.onEnterTableInputCst(-1);
      }
      else if(this.UserList[0].LastName == undefined || this.UserList[0].LastName.trim() == "" ){
        this.toastr.error("Please write last name");
        this.onEnterTableInputCst(0);
      }
      else if(!this.validateEmail(this.UserList[0].Email)){
        this.toastr.error("Please write correct email address");
        this.onEnterTableInputCst(1);
      }
      else if(this.isEdit == false && (this.UserList[0].password == undefined || this.UserList[0].password.trim() == "" )){
        this.toastr.error("Please write password");
        this.onEnterTableInputCst(2);
      }
      else if(this.SelectedRole.RoleID == undefined || this.SelectedRole.RoleID == ""){
        this.toastr.error("Please select user role");
        this.onEnterTableInputCst(4);
      }
      else if(this.SelectedLocation.LocationId == undefined || this.SelectedRole.LocationId == ""){
        this.toastr.error("Please select user location");
        this.onEnterTableInputCst(5);
      }
      else if(this.UsersList.find(x=>x.locID == this.SelectedLocation.LocationId && x.RoleID == this.SelectedRole.RoleID)){
        this.toastr.error("This location already assign to some other users, Please select other location");
        this.onEnterTableInputCst(5);
      }
      else if(this.selectedColumns.length == 0)
      {
        this.toastr.error("Please atleast select one company");
      }
      else{
        this.UserList[0].Active = true;
        this.UserList[0].RoleID = this.SelectedRole.RoleID;
        this.UserList[0].RoleName = this.SelectedRole.RoleName;
        this.UserList[0].locID = this.SelectedLocation.LocationId;
        this.UserList[0].locations = this.SelectedLocation.LocationName;

        this.userService.saveUserInMaster(this.UserList[0]).subscribe({
          next: (user) => {
                  let i = -1;
                  this.selectedColumns.forEach(element => {
                    i++;
                    this.UserList[i].comID =  element.comID;
                    if(i == 0)
                    {
                      this.UserList[0].Companies = element.companyName;
                    }
                    else
                    {
                      this.UserList[0].Companies = this.UserList[0].Companies+","+element.companyName;
                    }
                    this.UserList.push({comID:undefined});
                  });
                this.UserList.splice(this.UserList.length-1,1);
                this.userService.saveUser(this.UserList).subscribe(us=>{
                        if(this.title == "User Registration")
                        {
                          this.toastr.success("User has been successfully added!");
                          this.dataEvent.emit({type:'added',value:us});
                        }
                        else{ this.dataEvent.emit({type:'',value:us});
                        this.toastr.success("User has been successfully updated!");
                      }
                  });
              },
              error: (response) => {
                this.toastr.error(response.error);
                this.onEnterTableInputCst(-1);
              },
        });
        }
  }

  validateEmail(email :any){
    let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(pattern)) {
      return true;
    }
    return false;
  }

  onEnterTableInputCst(index: number) {
    if (index < this.inputFieldTable.length-1) {
      this.focusOnTableInputCst(index + 1);
    }
    else
    {
        let el: HTMLElement = this.savebtn.nativeElement;
        el.focus();
    }

  }

  private focusOnTableInputCst(index: number) {
    const inputFieldARRAY = this.inputFieldTable.toArray();
    const inputField = inputFieldARRAY[index].nativeElement;
    inputField.focus();
    inputField.select();
  }

  filtersRole(event:any)
  {
      let filtered: any[] = [];
      let query = event.query;
      for (let i = 0; i < this.roleList.length; i++) {
        let type = this.roleList[i];
        if (type.RoleName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(type);
        }
      }
      this.filterRole = filtered;
  }

}

