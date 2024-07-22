import { Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TaxesService } from 'src/app/services/taxes.service';
import { Taxes } from 'src/app/models/taxes';

@Component({
  selector: 'app-add-new-taxes',
  templateUrl: './add-new-taxes.component.html',
  styleUrls: ['./add-new-taxes.component.css']
})
export class AddNewTaxesComponent {
  constructor(
    private router: Router,
    private taxesService:TaxesService,
    private toastr: ToastrService,
  ) {}

  @Input() taxVisible : boolean;
  list: Taxes[];
  taxList: Taxes[];
  @ViewChildren('inputFieldTableCOA') inputFieldTableCOA: QueryList<any>;
  @ViewChild('savebtn') savebtn: ElementRef<HTMLElement>;
  @Output() dataEvent = new EventEmitter<any>();
  @Input() title : any;
  @Input() TAXDATA : any;

  sendDataToParent() {
    // this.clear();
    this.dataEvent.emit({type:'',value:false});
  }

  ngOnInit(): void {
    this.taxList = [{
      TaxName :"",
      taxValue :"",
      isDefault: false
    }];

  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.TAXDATA != undefined && this.TAXDATA.length != 0)
    {
       this.taxList[0] = this.TAXDATA;
    }
    else
    {
       this.clear();
    }
}

  clear()
  {
    this.taxList = [{
      TaxName :"",
      taxValue :"",
      isDefault: false
    }];
  }


  saveTax()
  {
    if(this.taxList[0].TaxName == undefined || this.taxList[0].TaxName == ""){
      this.toastr.error("Please write tax name");
      this.onEnterTableInputCst(-1);
    }
    else if( this.taxList[0].taxValue == undefined || this.taxList[0].taxValue == ""){
      this.toastr.error("Please write tax value");
      this.onEnterTableInputCst(0);
    }
    else{
        this.taxesService.saveTaxes(this.taxList[0]).subscribe({
          next: (data: any) => {
            if(this.title == "Add New Tax")
            {
              this.toastr.success("Tax has been successfully added!");
              this.dataEvent.emit({type:'added',value:data});
            }
            else
            {
              this.toastr.success("Tax has been successfully updated");
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

}
