import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { COA } from '../../Models/COA';
import { CoaService } from '../../Services/coa.service';
import { VendorService } from 'src/app/Manage/Services/vendor.service';

@Component({
  selector: 'app-add-coa',
  templateUrl: './add-coa.component.html',
  styleUrls: ['./add-coa.component.css']
})
export class AddCoaComponent {
  constructor(
    private router: Router,
    private coaService:CoaService,
    private vendorService:VendorService,
    private toastr: ToastrService,
    private el: ElementRef,
  ) {}

  @Input() COAVisible : boolean;
  list: COA[];
  COAList: COA[];
  @ViewChildren('inputFieldTableCOA') inputFieldTableCOA: QueryList<any>;
  @ViewChild('savebtn') savebtn: ElementRef<HTMLElement>;
  @Output() dataEvent = new EventEmitter<any>();
  @Input() parentID : any;
  @Input() HeadAccountList : COA[];
  @Input() FilterHeadAccountlist : COA[];
  SelectedHeadAccount : any;
  SelectedParentAccount : any;
  @Input() ParentAccountList : COA[];
  @Input() FilterParentAccountList : COA[];
  @Input() title : any;
  @Input() COADATA : COA[];
  @Input() isEdit: Boolean;
  enabled: boolean = true;

  sendDataToParent() {
    this.clear();
    this.dataEvent.emit({type:'',value:false});
  }




  ngOnInit(): void {
    this.COAList = [{
      acctNo :"",
      acctName :"",
      openBal:0
    }];

    this.coaService.getAllCOA().subscribe({
        next: (coa) => {
          this.list = coa;
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.coaService.getAllCOA().subscribe({
      next: (coa) => {
        this.list = coa;
      }
    });
    if(this.isEdit == true)
    {
      if(this.parentID != "")
      {
        let list = this.list.find(x=>x.COAID == this.parentID);
        if(list?.COAID != undefined)
        {
          this.COAList[0].COAID = list.COAID;
          this.COAList[0].parentCOAID = list.parentCOAID;
          this.SelectedParentAccount = this.list.find(x=>x.COAID == list?.parentCOAID);
          this.COAList[0].acctNo = list.acctNo;
          this.COAList[0].acctName = list.acctName;
          this.COAList[0].openBal = list.openBal;
          this.COAList[0].COAlevel = list.COAlevel;
          this.COAList[0].COANo = list.COANo;
          this.COAList[0].acctType = list.acctType;
          this.COAList[0].parentAcctType = list.parentAcctType;
          this.COAList[0].parentAcctName = list.parentAcctName;
          this.COAList[0].treeName = list.treeName;
          this.COAList[0].path = list.path;
          this.COAList[0].bal = list.bal;
          this.COAList[0].active = list.active;
        }
      }
    }
    else
    {
      if(this.parentID != "")
      {
        let lst = this.list.find(x=>x.COAID == this.parentID);
        if(lst?.COAlevel != 4)
        {
          this.clear();
          this.SelectedParentAccount = lst;
        }
      }
    }
}
  clear()
  {
    this.SelectedHeadAccount = "";
    this.SelectedParentAccount = "";
    this.COAList = [{
      acctNo :"",
      acctName :"",
      openBal:0
    }];
  }
  close()
  {
    //this.vendorCom.VendorVisible=false;
    //this.purchaseCom.VendorVisible=false;
  }
  saveCOA()
  {
    if(
     this.SelectedParentAccount == undefined || this.SelectedParentAccount == "")
    {
      this.toastr.error("Please select parent account");
      this.onEnterTableInputCst(0);
    }
    else if(this.COAList[0].acctName == undefined || this.COAList[0].acctName == "")
    {
      this.toastr.error("Please write account name");
      this.onEnterTableInputCst(1);
    }
    else
    {
      if(this.isEdit == false)
      {
        this.SelectedHeadAccount = this.list.find(x=>x.COAID == this.SelectedParentAccount.parentCOAID);
        this.COAList[0].parentCOAID = this.SelectedParentAccount.COAID;
        this.COAList[0].COAlevel = this.SelectedParentAccount.COAlevel+1;
        if(this.SelectedHeadAccount != undefined)
        {
          this.COAList[0].parentAcctType = this.SelectedHeadAccount.acctName;
        }
        else
        {
          this.COAList[0].parentAcctType = this.SelectedParentAccount.acctName;
        }
        this.COAList[0].parentAcctName = this.SelectedParentAccount.acctName;
        this.COAList[0].treeName = this.COAList[0].acctName;
        this.COAList[0].path = this.SelectedParentAccount.path+this.COAList[0].acctName+'\\';
        this.COAList[0].acctNo = this.SelectedParentAccount.acctNo;
      }

      this.coaService.saveCOA(this.COAList[0]).subscribe({
        next: (coa) => {
          this.clear();
          this.toastr.success("Chart Of Account has been Successfully added!");
          this.dataEvent.emit({type:'added',value:false});
        }
      })
    }

  }

  onEnterTableInputCst(index: number) {
    if (index < this.inputFieldTableCOA.length-1) {
      this.focusOnTableInputCst(index + 1);
    }
    else
    {
      if(this.COAList[0].acctName != ""  && this.COAList[0].acctName != undefined
      )
      {
        let el: HTMLElement = this.savebtn.nativeElement;
        el.focus();
      }
      else
      {
        this.toastr.error("Please fill empty blanks");
        this.onEnterTableInputCst(-1);
      }
    }

  }
  enableField()
  {
    // this.enabled = false;
    // this.SelectedParentAccount = "";
    // this.ParentAccountList = this.list.filter(x=>x.parentCOAID == this.SelectedHeadAccount.COAID);
  }
  private focusOnTableInputCst(index: number) {
    const inputFieldARRAY = this.inputFieldTableCOA.toArray();
    const inputField = inputFieldARRAY[index].nativeElement;
    inputField.focus();
    inputField.select();
  }

  filterHeadAccount(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.HeadAccountList.length; i++) {
      let product = this.HeadAccountList[i];
      if (product.acctName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(product);
      }
    }
    this.FilterHeadAccountlist = filtered;
  }

  filterParentAccount(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.ParentAccountList.length; i++) {
      let p = this.ParentAccountList[i];
      if (p.acctName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(p);
      }
    }
    this.FilterParentAccountList = filtered;
  }
}
