import { empty } from 'rxjs';
import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Location } from '../..//Models/location';
import { LocationService } from '../../Services/location.service';
import { SharedDataService } from 'src/app/Shared/Services/shared-data.service';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.css']
})

export class AddLocationComponent {
  @Input() locationVisible : boolean;
  locationList: Location[] = [];
  @ViewChildren('inputFieldTable') inputFieldTable: QueryList<any>;
  @ViewChild('savebtn') savebtn: ElementRef<HTMLElement>;
  @Output() dataEvent = new EventEmitter<any>();
  @Input() LocData : any;
  @Input() title : any;
  @Input() isEdit: boolean = false;
  parentLocationName : any;

  newtitle : any;

  sendDataToParent() {
    this.clear();
    this.dataEvent.emit({type:'',value:false});
  }

  ngOnInit(): void {
    this.newtitle = this.title;
    this.locationList = [{
    }]
  }
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private el: ElementRef,
    private locaitonService : LocationService,
    private sharedDataService : SharedDataService,
    ) {}

  ngOnChanges(changes: SimpleChanges) {
    this.newtitle = this.title;
    if(this.LocData != undefined && this.LocData.length != 0)
    {

      if(this.isEdit)
      {

       this.locationList[0].LocationId = this.LocData.id;
       this.locationList[0].LocationName = this.LocData.name;
       this.locationList[0].ParentLocationId = this.LocData.parentlocID;
       this.locationList[0].LocTypeId = this.LocData.level;
       this.parentLocationName = this.LocData.parentName;

      }else{

       this.locationList[0].ParentLocationId = this.LocData.id;
       this.locationList[0].LocTypeId = this.LocData.level + 1;
       this.parentLocationName = this.LocData.name;
       this.locationList[0].LocationName = "";
      }
    }
    else
    {
      this.clear();
    }
}
  clear()
  {
    this.locationList = [{
      LocationName : ""
    }]
  }
  saveLoc()
  {
    if(this.locationList[0].LocationName == "" || this.locationList[0].LocationName == undefined)
    {
      this.toastr.error("Please write location name");
      this.onEnterTableInputCst(0);
    }
    else
    {
      this.locationList[0].comID= localStorage.getItem('comID');
      this.locationList[0].active = true;
      this.locaitonService.saveLoc(this.locationList[0]).subscribe({
        next: (loc) => {
          this.sharedDataService.updateLocations$(loc);
          if(this.title == "Location Registration")
          {
            this.toastr.success("Location has been successfully added");
            this.dataEvent.emit({type:'added',value:loc});
          }
          else
          {
            this.toastr.success("Location has been successfully updated");
            this.dataEvent.emit({type:'added',value:loc});
          }

        },
        error: (response) => {
          this.toastr.error(response.error);
          this.onEnterTableInputCst(-1);
        },
      });
    }

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

}
