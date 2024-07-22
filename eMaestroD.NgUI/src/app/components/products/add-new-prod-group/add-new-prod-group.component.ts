import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Companies } from 'src/app/models/companies';
import { prodGroups } from 'src/app/models/prodGroups';
import { Products } from 'src/app/models/products';
import { ProductsService } from 'src/app/services/products.service';
import { ProductsComponent } from '../products.component';
import { AddPurchaseComponent } from '../../add-purchase/add-purchase.component';
import { QuotationInvoiceComponent } from '../../add-new-quotation/addNewQuotation.component';
import { NewInvoiceComponent } from '../../add-sale-invoice/addnewsale.component';
import { GenericService } from 'src/app/services/generic.service';
import { ProductCategoryService } from 'src/app/services/product-category.service';

@Component({
  selector: 'app-add-new-prod-group',
  templateUrl: './add-new-prod-group.component.html',
  styleUrls: ['./add-new-prod-group.component.css']
})
export class AddNewProdGroupComponent {
  productlist: Products[];
  productGrouplist: prodGroups[];
  FilterProductGrouplist: prodGroups[];
  SelectedproductGrouplist: any;
  companylist: Companies[];
  comName: any;
  @Output() dataEvent = new EventEmitter<any>();
  @Input() prodData : any;
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


    this.productGrouplist = [
      {
        prodGrpID : undefined,
        prodGrpName : undefined
      },
    ];

  }

  ngOnChanges(changes: SimpleChanges) {



    if(this.prodData != undefined && this.prodData.length != 0)
    {
      this.productGrouplist[0] = this.prodData;
    }
    else
    {
      this.clear();
    }
    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values

}
  constructor(
    private router: Router,
    private productService:ProductsService,
    private toastr: ToastrService,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private productGroupService: ProductCategoryService
  ) {}

  clear()
  {
    this.productGrouplist = [
      {
        prodGrpID : undefined,
        prodGrpName : undefined
      },
    ];
  }

  saveProduct()
  {
     if(this.productGrouplist[0].prodGrpName != "" && this.productGrouplist[0].prodGrpName != undefined)
     {

      this.productGroupService.saveProductGroup(this.productGrouplist[0]).subscribe({
        next: (prd) => {
          if(this.title == "Product Category Registration")
          {
            this.toastr.success("Product category has been successfully added!");
            this.dataEvent.emit({type:'groupAdded',value:prd});
          }
          else
          {
            this.toastr.success("Product category has been successfully updated!");
            this.dataEvent.emit({type:'',value:prd});
          }
        },
        error: (response) => {
            this.toastr.error(response.error);
            this.onEnterTableInput(-1);
        },
      });
    }
    else
    {
      this.toastr.error("Please Write Product Category Name.");
      this.onEnterTableInput(-1);
    }
  }



  onEnterTableInput(index: number) {
    if (index < this.inputFieldsTableCst.length-1) {
      this.focusOnTableInput(index + 1);
    }
    else
    {
      if(this.productGrouplist[0].prodGrpName != "" && this.productGrouplist[0].prodGrpName != undefined)
      {
        let el: HTMLElement = this.savebtn.nativeElement;
        el.focus();
      }
      else
      {
        this.toastr.error("Please Write Product Category Name.");
        this.onEnterTableInput(-1);
      }
    }

  }
  private focusOnTableInput(index: number) {
    const inputFieldARRAY = this.inputFieldsTableCst.toArray();
    const inputField = inputFieldARRAY[index].nativeElement;
    inputField.focus();
    inputField.select();
  }
}
