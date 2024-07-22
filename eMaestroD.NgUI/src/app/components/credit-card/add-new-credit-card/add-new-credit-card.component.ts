
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
import { Creditcard } from 'src/app/models/creditcard';
import { CreditCardService } from 'src/app/services/credit-card.service';

@Component({
  selector: 'app-add-new-credit-card',
  templateUrl: './add-new-credit-card.component.html',
  styleUrls: ['./add-new-credit-card.component.scss']
})
export class AddNewCreditCardComponent {
  list: Creditcard[] = [];
  comName: any;
  @Output() dataEvent = new EventEmitter<any>();
  @Input() cardList : any;
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
      cardID : 0,
      bankName : "",
    }]
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.cardList != undefined && this.cardList.length != 0)
    {
      let ls = this.cardList;
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
    private creditCardService:CreditCardService,
    private toastr: ToastrService,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private productGroupService: ProductCategoryService
  ) {}

  clear()
  {
    this.list = [{
      cardID : 0,
      bankName : "",
    }]
  }

  SaveCreditCard()
  {
     if(this.list[0].bankName != "" && this.list[0].bankName != undefined)
     {
      this.creditCardService.SaveCreditCard(this.list[0]).subscribe({
        next: (prd:any) => {
          if(this.title == "Credit Card Registration")
          {
            this.toastr.success("Successfully Added");
            this.dataEvent.emit({type:'groupAdded',value:prd});
          }
          else
          {
            this.toastr.success("Successfully Updated");
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
