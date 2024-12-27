import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Companies } from 'src/app/Administration/Models/companies';
import { Products } from 'src/app/Manage/Models/products';
import { ProductCategoryService } from 'src/app/Manage/Services/product-category.service';
import { ProductsService } from 'src/app/Manage/Services/products.service';
import { prodGroups } from 'src/app/Manage/Models/prodGroups';


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
  isSaveDisable : boolean = false;

  isPos : boolean = localStorage.getItem("isPos") === 'true';
  label = 'Brand';

  sendDataToParent() {
    this.dataEvent.emit({type:'closeGroup',value:false});
  }

  OpenAddGroupByParent(type:any,value:any) {
    this.dataEvent.emit({type: type, value: value});
  }

  @ViewChildren('inputFieldTableCst') inputFieldsTableCst: QueryList<any>;
  @ViewChild('savebtn') savebtn: ElementRef<HTMLElement>;

  ngOnInit(): void {

    this.label = this.isPos ? "Brand" : "Category";
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
      this.isSaveDisable = true;
      this.productGroupService.saveProductGroup(this.productGrouplist[0]).subscribe({
        next: (prd) => {
          if(this.title == this.label+" Registration")
          {
            this.toastr.success( this.label+" has been successfully added!");
            this.dataEvent.emit({type:'groupAdded',value:prd});
          }
          else
          {
            this.toastr.success(this.label + " has been successfully updated!");
            this.dataEvent.emit({type:'',value:prd});
          }
          this.isSaveDisable = false;
        },
        error: (response) => {
            this.toastr.error(response.error);
            this.onEnterTableInput(-1);
            this.isSaveDisable = false;
        },
      });
    }
    else
    {
      this.toastr.error("Please Write "+this.label+" Name.");
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
        this.toastr.error("Please Write "+ this.label+" Name.");
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
