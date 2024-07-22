import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TaxesService } from 'src/app/services/taxes.service';
import { Taxes } from 'src/app/models/taxes';
import { Screen } from 'src/app/models/screen';
import { ScreenService } from 'src/app/services/screen.service';


@Component({
  selector: 'app-add-new-screen',
  templateUrl: './add-new-screen.component.html',
  styleUrls: ['./add-new-screen.component.scss']
})
export class AddNewScreenComponent {
  constructor(
    private router: Router,
    private screenService:ScreenService,
    private toastr: ToastrService,
  ) {}

  @Input() ScreenVisible : boolean;
  list: Screen[];
  ScreenList: Screen[];
  @ViewChildren('inputFieldTableCOA') inputFieldTableCOA: QueryList<any>;
  @ViewChild('savebtn') savebtn: ElementRef<HTMLElement>;
  @Output() dataEvent = new EventEmitter<any>();
  @Input() title : any;
  @Input() ScreenDATA : any;
  ParentscreenList : any;
  filterScreen : any;
  SelectedParent:any;

  sendDataToParent() {
    // this.clear();
    this.dataEvent.emit({type:'',value:false});
  }

  ngOnInit(): void {
    this.ScreenList = [{
      screenID :0,
      screenGrpID : 0,
      screenName:"",
      screenParentName:"",
      path:"",
      active:true
    }];

    this.screenService.getAllScreen().subscribe(x=>{
      this.ParentscreenList = x.filter(x=>x.screenGrpID == 0);
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.ScreenDATA != undefined && this.ScreenDATA.length != 0)
    {
       this.ScreenList[0] = this.ScreenDATA;
       this.screenService.getAllScreen().subscribe(x=>{
        this.ParentscreenList = x.filter(x=>x.screenGrpID == 0);
      })
    }
    else
    {
       this.clear();
    }
}

  clear()
  {
    this.ScreenList = [{
      screenID :0,
      screenGrpID : 0,
      screenName:"",
      screenParentName:"",
      path:"",
      active:true
    }];
    this.SelectedParent = [];
  }


  saveScreen()
  {
    console.log(this.SelectedParent.screenID);
    if(
      this.ScreenList[0].screenName != undefined && this.ScreenList[0].screenName != ""
    )
    {
        if(this.SelectedParent.screenID != undefined)
        {
          this.ScreenList[0].screenGrpID = this.SelectedParent.screenID;
          this.ScreenList[0].screenParentName = this.SelectedParent.screenName;
        }
        this.ScreenList[0].path = this.ScreenList[0].screenName;

        this.screenService.saveScreen(this.ScreenList[0]).subscribe({
          next: (data: any) => {
              this.toastr.success("Successfully Saved!");
              this.dataEvent.emit({type:'added',value:data});
            },
            error: (response) => {
              this.toastr.error(response.error);
              this.onEnterTableInputCst(-1);
            },
          })
    }
    else
    {
      this.toastr.error("Please Fill the Blanks");
      this.onEnterTableInputCst(-1);
    }
  }

  onEnterTableInputCst(index: number) {
    if (index < this.inputFieldTableCOA.length-1) {
      this.focusOnTableInputCst(index + 1);
    }
    else
    {
      if(this.ScreenList[0].screenName != ""  && this.ScreenList[0].screenName != undefined
      )
      {
        let el: HTMLElement = this.savebtn.nativeElement;
        el.focus();
      }
      else
      {
        this.toastr.error("Please Write Empty Blanks");
        this.onEnterTableInputCst(-1);
      }
    }

  }

  private focusOnTableInputCst(index: number) {
    const inputFieldARRAY = this.inputFieldTableCOA.toArray();
    const inputField = inputFieldARRAY[index].nativeElement;
    inputField.focus();
    inputField.select();
  }

  filtersScreen(event:any)
  {
      let filtered: any[] = [];
      let query = event.query;
      for (let i = 0; i < this.ParentscreenList.length; i++) {
        let type = this.ParentscreenList[i];
        if (type.screenName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(type);
        }
      }
      this.filterScreen = filtered;
  }
}

