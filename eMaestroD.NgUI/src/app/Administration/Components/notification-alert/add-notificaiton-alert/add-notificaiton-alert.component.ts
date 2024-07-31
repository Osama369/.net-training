import { empty } from 'rxjs';
import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NotificationService } from 'src/app/Administration/Services/notification.service';
import { ScreenService } from 'src/app/Administration/Services/screen.service';
import { NotificationAlert } from 'src/app/Administration/Models/notification-alert';
import { GenericService } from 'src/app/Shared/Services/generic.service';

@Component({
  selector: 'app-add-notificaiton-alert',
  templateUrl: './add-notificaiton-alert.component.html',
  styleUrls: ['./add-notificaiton-alert.component.scss']
})
export class AddNotificaitonAlertComponent {
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private el: ElementRef,
    private notificationService : NotificationService,
    private screenService : ScreenService,
    private genericService : GenericService,
    ) {}

  alertList: NotificationAlert[] = [];
  @ViewChildren('inputFieldTable') inputFieldTable: QueryList<any>;
  @ViewChild('savebtn') savebtn: ElementRef<HTMLElement>;
  @Output() dataEvent = new EventEmitter<any>();
  @Input() alertData : any;
  @Input() title : any;
  isEdit: boolean = false;

  filterRole:any[]=[];
  roleList : any[] = [];
  selectedRole :any;

  filterScreen:any[]=[];
  screenList : any[] = [];
  selectedScreen :any;
  dropdownlist : any = ["true","false"];
  selectedSave : any = true;
  selectedEdit : any = true;
  selectedDelete : any = true;
  selectedActive : any = true;

  sendDataToParent() {
    this.clear();
    this.dataEvent.emit({type:'',value:false});
  }

  ngOnInit(): void {
    this.alertList = [{
      screenID : 0,
      screenName : "",
      roleID : 0,
      roleName : "",
      onSave : false,
      onEdit : false,
      onDelete : false,
      active : false
    }]

    this.genericService.getAllRoles().subscribe(lst=>{
      this.roleList = lst;
    })

    this.screenService.getAllScreen().subscribe(lst=>{
      this.screenList = lst;
      this.screenList = this.screenList.filter(x=>x.screenGrpID != 0 && x.screenGrpID != 1 && x.screenGrpID != 5);
    })
  }

  ngOnChanges(changes: SimpleChanges) {

    if(this.alertData != undefined && this.alertData.length != 0)
    {
      this.isEdit = true;
       this.alertList[0] = this.alertData;
       this.selectedRole = {RoleID : this.alertList[0].roleID,RoleName : this.alertList[0].roleName};
       this.selectedScreen = {screenID : this.alertList[0].screenID,screenName : this.alertList[0].screenName};
       this.selectedSave = String(this.alertList[0].onSave);
       this.selectedEdit = String(this.alertList[0].onEdit);
       this.selectedDelete = String(this.alertList[0].onDelete);
       this.selectedActive = String(this.alertList[0].active);
    }
    else
    {
      this.isEdit = false;
       this.clear();
    }
  }
  clear()
  {
    this.alertList = [{
      screenID : 0,
      screenName : "",
      roleID : 0,
      roleName : "",
      onSave : false,
      onEdit : false,
      onDelete : false,
      active : false
    }]

    this.selectedRole = [];
    this.selectedScreen = [];
    this.selectedSave = true;
    this.selectedEdit = true;
    this.selectedDelete = true;
    this.selectedActive = true;
  }
  saveLoc()
  {
    if(this.selectedScreen.screenID != undefined && this.selectedRole.RoleID != undefined)
    {
      this.alertList[0].comID= localStorage.getItem('comID');
      this.alertList[0].roleID = this.selectedRole.RoleID;
      this.alertList[0].roleName = this.selectedRole.RoleName;
      this.alertList[0].screenID = this.selectedScreen.screenID;
      this.alertList[0].screenName = this.selectedScreen.screenName;
      this.alertList[0].onSave = this.selectedSave;
      this.alertList[0].onEdit = this.selectedEdit;
      this.alertList[0].onDelete = this.selectedDelete;
      this.alertList[0].active = this.selectedActive;
      this.notificationService.SaveNotificationAlert(this.alertList[0]).subscribe({
        next: (list) => {
          if(this.title == "Notification Alert Registration")
          {
            this.toastr.success("Notification alert has been successfully added!");
            this.dataEvent.emit({type:'added',value:list});
          }
          else
          {
            this.toastr.success("Notification alert has been successfully updated!");
            this.dataEvent.emit({type:'',value:list});
          }

        },
        error: (response) => {
          this.toastr.error(response.error);
          //this.onEnterTableInputCst(-1);
        },
      });
    }
    else
    {
      this.toastr.error("Please Select User Role & Screen Name");
      //this.onEnterTableInputCst(-1);
    }
  }

  onEnterTableInputCst(index: number) {
    if (index < this.inputFieldTable.length-1) {
      this.focusOnTableInputCst(index + 1);
    }
    else
    {
      if(this.alertList[0].roleID != 0 && this.alertList[0].screenID != 0)
      {
        let el: HTMLElement = this.savebtn.nativeElement;
        el.focus();
      }
      else
      {
        this.toastr.error("Please Select User Role & Screen Name");
        this.onEnterTableInputCst(-1);
      }
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

  FilterScreen(event:any)
  {
      let filtered: any[] = [];
      let query = event.query;
      for (let i = 0; i < this.screenList.length; i++) {
        let type = this.screenList[i];
        if (type.screenName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(type);
        }
      }
      this.filterScreen = filtered;
  }
}
