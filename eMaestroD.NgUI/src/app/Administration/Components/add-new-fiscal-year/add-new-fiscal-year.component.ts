import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FiscalYear } from '../../Models/FiscalYear';
import { FiscalyearService } from '../../Services/fiscalyear.service';

@Component({
  selector: 'app-add-new-fiscal-year',
  templateUrl: './add-new-fiscal-year.component.html',
  styleUrls: ['./add-new-fiscal-year.component.scss']
})
export class AddNewFiscalYearComponent {
  constructor(
    private router: Router,
    private fiscalyearService:FiscalyearService,
    private toastr: ToastrService,
  ) {}

  @Input() FYVisible : boolean;
  list: FiscalYear[];
  FYList: FiscalYear[];
  @ViewChildren('inputFieldTableCOA') inputFieldTableCOA: QueryList<any>;
  @ViewChild('savebtn') savebtn: ElementRef<HTMLElement>;
  @Output() dataEvent = new EventEmitter<any>();
  @Input() title : any;
  @Input() FYDATA : any;
  startDate : any;
  endDate : any;

  sendDataToParent() {
    // this.clear();
    this.dataEvent.emit({type:'',value:false});
  }

  ngOnInit(): void {
    this.FYList = [{
      period :"",
      dtStart :"",
      dtEnd: "",
      active : true
    }];

    let today = new Date();
    this.startDate = today;
    var endDate = new Date(today); // Create a copy of today's date
    endDate.setFullYear(today.getFullYear() + 1); // Add one year
    endDate.setDate(endDate.getDate() - 1); // Subtract one day
    this.endDate = endDate;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.FYDATA != undefined && this.FYDATA.length != 0)
    {
       this.FYList[0] = this.FYDATA;
       this.startDate = new Date(this.FYList[0].dtStart);
       this.endDate = new Date(this.FYList[0].dtEnd);
    }
    else
    {
       this.clear();
    }
}

  clear()
  {
    this.FYList = [{
      period :"",
      dtStart :"",
      dtEnd: "",
      active : true
    }];
  }


  saveFY()
  {

    if(this.FYList[0].period == undefined || this.FYList[0].period == ""){
      this.toastr.error("Please write fiscal year");
      this.onEnterTableInputCst(-1);
    }
    else if( this.startDate == undefined || this.startDate == ""){
      this.toastr.error("Please select start date");
      this.onEnterTableInputCst(0);
    }
    else{
        this.FYList[0].dtStart = this.startDate.toLocaleString();
        this.ChangeEndDate();
        this.FYList[0].dtEnd = this.endDate.toLocaleString();
        this.FYList[0].comID = localStorage.getItem('comID');
        this.fiscalyearService.SaveFiscalYear(this.FYList[0]).subscribe({
          next: (data: any) => {
            if(this.title == "Add New Fiscal Year")
            {
              this.toastr.success("Fiscal Year has been successfully added!");
              this.dataEvent.emit({type:'added',value:data});
            }
            else
            {
              this.toastr.success("Fiscal Year has been successfully Updated");
              this.dataEvent.emit({type:'',value:data});
            }

            },
            error: (response) => {
              this.toastr.error(response.error);
              this.onEnterTableInputCst(-1);
            },
          })
    }

  }

  onEnterTableInputCst(index: number) {
    if (index < this.inputFieldTableCOA.length-1) {
      this.focusOnTableInputCst(index + 1);
    }
    else
    {
        let el: HTMLElement = this.savebtn.nativeElement;
        el.focus();
    }

  }

  private focusOnTableInputCst(index: number) {
    const inputFieldARRAY = this.inputFieldTableCOA.toArray();
    const inputField = inputFieldARRAY[index].nativeElement;
    inputField.focus();
    inputField.select();
  }

  ChangeEndDate()
  {
    var endDate = new Date(this.startDate); // Create a copy of today's date
    endDate.setFullYear(this.startDate.getFullYear() + 1); // Add one year
    endDate.setDate(endDate.getDate() - 1); // Subtract one day
    endDate.setHours(23); // Set hours to 23 (11 PM)
    endDate.setMinutes(59); // Set minutes to 59
    endDate.setSeconds(59); // Set seconds to 59
    this.endDate = endDate;
  }

}

