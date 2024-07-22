import { BankService } from './../../../services/bank.service';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Companies } from 'src/app/models/companies';
import { prodGroups } from 'src/app/models/prodGroups';
import { Products } from 'src/app/models/products';
import { ProductsService } from 'src/app/services/products.service';
import { AddPurchaseComponent } from '../../add-purchase/add-purchase.component';
import { QuotationInvoiceComponent } from '../../add-new-quotation/addNewQuotation.component';
import { NewInvoiceComponent } from '../../add-sale-invoice/addnewsale.component';
import { GenericService } from 'src/app/services/generic.service';
import { ProductCategoryService } from 'src/app/services/product-category.service';
import { COA } from 'src/app/models/COA';
import { CoaService } from 'src/app/services/coa.service';
import { Bank } from 'src/app/models/bank';

@Component({
  selector: 'app-add-new-bank',
  templateUrl: './add-new-bank.component.html',
  styleUrls: ['./add-new-bank.component.scss']
})
export class AddNewBankComponent {
  list: Bank[] = [];
  comName: any;
  @Output() dataEvent = new EventEmitter<any>();
  @Input() banklist : any;
  @Input() title : any;
  sendDataToParent() {
    this.dataEvent.emit({type:'closeGroup',value:false});
  }

  OpenAddGroupByParent(type:any,value:any) {
    this.dataEvent.emit({type: type, value: value});
  }

  @ViewChildren('inputFieldTableCst') inputFieldsTableCst: QueryList<any>;
  @ViewChild('savebtn') savebtn: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.list = [{
      bankID : 0,
      bankName : "",
      branchCode : "",
      accountNo : "",
      IBAN : "",
      country : "",
    }]
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.banklist != undefined && this.banklist.length != 0)
    {
      let ls = this.banklist;
      this.list[0] = ls;
    }
    else
    {
      this.clear();
    }
}
  constructor(
    private router: Router,
    private productService:ProductsService,
    private coaService:CoaService,
    private bankService:BankService,
    private toastr: ToastrService,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private productGroupService: ProductCategoryService
  ) {}

  clear()
  {
    this.list = [{
      bankID : 0,
      bankName : "",
      branchCode : "",
      accountNo : "",
      IBAN : "",
      country : "",
    }]
  }

  saveBank()
  {
     if(this.list[0].bankName != "" && this.list[0].bankName != undefined)
     {

      //this.list[0].parentCOAID = 79;
      //this.list[0].COAlevel = 4;
     //this.list[0].parentAcctType = "Assets";
     // this.list[0].parentAcctName = "Bank Accounts";
     // this.list[0].treeName = this.list[0].acctName;
     // this.list[0].path = "Assets\\Current Assets\\Cash And Banks\\Bank Accounts\\"+this.list[0].acctName+"\\";
     // this.list[0].active = 1;

      this.bankService.SaveBank(this.list[0]).subscribe({
        next: (prd:any) => {
          if(this.title == "Bank Registration")
          {
            this.toastr.success("Bank has been successfully added!");
            this.dataEvent.emit({type:'groupAdded',value:prd});
          }
          else
          {
            this.toastr.success("Bank has been successfully updated!");
            this.dataEvent.emit({type:'',value:prd});
          }
        },
        error: (response) => {
            this.toastr.show(response.error);
            this.onEnterTableInput(-1);
        },
      });
    }
    else
    {
      this.toastr.error("Please write bank name.");
      this.onEnterTableInput(-1);
    }
  }



  onEnterTableInput(index: number) {
    if (index < this.inputFieldsTableCst.length-1) {
      this.focusOnTableInput(index + 1);
    }
    else
    {
        let el: HTMLElement = this.savebtn.nativeElement;
        el.focus();
    }

  }
  private focusOnTableInput(index: number) {
    const inputFieldARRAY = this.inputFieldsTableCst.toArray();
    const inputField = inputFieldARRAY[index].nativeElement;
    inputField.focus();
    inputField.select();
  }
}
