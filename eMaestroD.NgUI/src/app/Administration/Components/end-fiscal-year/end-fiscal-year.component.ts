import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FiscalYear } from '../../Models/FiscalYear';
import { FiscalyearService } from '../../Services/fiscalyear.service';


@Component({
  selector: 'app-end-fiscal-year',
  templateUrl: './end-fiscal-year.component.html',
  styleUrls: ['./end-fiscal-year.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class EndFiscalYearComponent {
  constructor(
    private router: Router,
    private fiscalyearService:FiscalyearService,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
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
  disable : boolean = false;

  sendDataToParent() {
    this.dataEvent.emit({type:'',value:false});
  }

  ngOnInit(): void {
    this.FYList = [{
      period :"",
      dtStart :"",
      dtEnd: "",
      active : true
    }];
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.FYDATA != undefined && this.FYDATA.length != 0)
    {
       this.FYList[0] = this.FYDATA;
       this.endDate = new Date(this.FYDATA.dtEnd);
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


  saveFY(isCreateNew : any)
  {
    this.disable = true;
    this.toastr.info("Please Wait. Fiscal year is been closed.","", { timeOut: 1000000 });
    this.fiscalyearService.EndFiscalYear(isCreateNew).subscribe({
      next: (data: any) => {
        this.toastr.clear();
          this.toastr.success("Fiscal Year successfully ended!");
          this.dataEvent.emit({type:'added',value:data});
          this.disable = false;
        },
        error: (response) => {
        this.toastr.clear();
          this.toastr.error(response.error);
          if(response.error == "Please create the new fiscal year before proceeding to close the current one.")
          {
            this.confirm1();
          }
          this.disable = false;
        },
      })
  }

  confirm1() {
    this.confirmationService.confirm({
        message: 'Are you certain you wish to proceed with adding a new fiscal year and finalizing the end of the current fiscal year?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon:"none",
        rejectIcon:"none",
        rejectButtonStyleClass:"p-button-text",
        accept: () => {
          this.saveFY(true);
        },
        reject: () => {

        }
    });
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

