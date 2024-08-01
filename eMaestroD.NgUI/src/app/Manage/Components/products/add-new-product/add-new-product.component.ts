import { filter } from 'rxjs';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Products } from 'src/app/Manage/Models/products';
import { ProductCategoryService } from 'src/app/Manage/Services/product-category.service';
import { ProductsService } from 'src/app/Manage/Services/products.service';
import { VendorService } from 'src/app/Manage/Services/vendor.service';
import { prodGroups } from 'src/app/Manage/Models/prodGroups';
import { Vendor } from 'src/app/Manage/Models/vendor';

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.css']
})
export class AddNewProductComponent {

  productlist: Products[];
  productGrouplist: prodGroups[];
  FilterProductGrouplist: prodGroups[];
  SelectedproductGrouplist: any;
  Supplierlist: Vendor[];
  SelectedSupplier: any = null;
  comName: any;
  @Output() dataEvent = new EventEmitter<any>();
  @Input() prodData : any;
  @Input() title : any;
  @Input() prodGroupData : any;
  @Input() showGroupBtn : boolean = true;
  selectedType : any;
  filterType : any;
  hiddenField : boolean = true;
  type :any[] = [ 'Goods','Service'];

  constructor(
    private router: Router,
    private productService:ProductsService,
    private toastr: ToastrService,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private productCategoryService: ProductCategoryService,
    private vendorService : VendorService
  ) {}


  sendDataToParent() {
    this.dataEvent.emit({type:'',value:false});
  }

  OpenAddGroupByParent(type:any,value:any) {
    this.dataEvent.emit({type: type, value: value});
  }

  @ViewChildren('inputFieldTableCst') inputFieldsTableCst: QueryList<any>;
  @ViewChild('savebtn') savebtn: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.selectedType = this.type[0];

    this.productlist = [
      {
        prodID : undefined,
        prodGrpID : undefined,
        comID : undefined,
        comName : undefined,
        prodGrpName : undefined,
        prodCode : undefined,
        shortName : undefined,
        prodName : undefined,
        descr : undefined,
        prodUnit : "pcs",
        unitQty : undefined,
        qty:undefined,
        tax:undefined,
        discount:undefined,
        purchRate : 0,
        amount:undefined,
        sellRate : 0,
        batch:undefined,
        retailprice : undefined,
        bonusQty:undefined,
        tP : undefined,
        isDiscount : false,
        isTaxable : false,
        isStore : false,
        isRaw : false,
        isBonus : false,
        minQty : undefined,
        maxQty : undefined,
        mega : true,
        active : true,
        crtBy : undefined,
        crtDate : undefined,
        modby : undefined,
        modDate : undefined,
        expirydate : undefined,
        qtyBal:undefined,
        GLID:undefined,
        TxID:undefined,
        unitPrice:undefined,
        vendID:undefined,
        productBarCodes: [

        ]
      },
    ];

    this.filterType = this.type;
    this.productCategoryService.getAllGroups().subscribe({
      next: (comp) => {
        this.productGrouplist =(comp as { [key: string]: any })["enttityDataSource"];;
        //this.productGrouplist.currentIndex(1);
        this.SelectedproductGrouplist = {prodGrpID:this.productGrouplist[0].prodGrpID,prodGrpName:this.productGrouplist[0].prodGrpName};
        this.FilterProductGrouplist = this.productGrouplist;
      },
      error: (response) => {
      },
    });

    this.vendorService.getAllVendor().subscribe({
      next: (data) => {
        this.Supplierlist =(data as { [key: string]: any })["enttityDataSource"];;
      },
      error: (response) => {
      },
    });

    console.log('SelectedSupplier on init:', this.SelectedSupplier);
    this.cdr.detectChanges();
  }

  hideFields()
  {
    if(this.selectedType == "Service")
    {
      this.hiddenField = false;
    }
    else
    {
      this.hiddenField = true;
    }
  }
  ngOnChanges(changes: SimpleChanges) {

    if(this.prodGroupData != undefined)
    {
      this.productGrouplist.push(this.prodGroupData);
      this.SelectedproductGrouplist = {prodGrpID:this.prodGroupData.prodGrpID,prodGrpName:this.prodGroupData.prodGrpName};
    }

    if(this.prodData != undefined && this.prodData.length != 0)
    {
      this.productlist[0] = this.prodData;
      this.selectedType = this.prodData.descr;
      this.hideFields();
      this.SelectedSupplier = this.Supplierlist.find(x=>x.vendID == this.productlist[0].vendID);
      this.SelectedproductGrouplist = {prodGrpID:this.productlist[0].prodGrpID,prodGrpName:this.productGrouplist.find(x=>x.prodGrpID==this.productlist[0].prodGrpID)?.prodGrpName};
    }
    else
    {
      this.clear();
    }
}


selectedProducts: any;

addNewRow() {
  if(this.productlist[0].productBarCodes?.find(x=>x.BarCode == "" && x.Qty == 0 )){
    this.toastr.info("Please Fill Empty row first to add new row!");
  }else{
    this.productlist[0].productBarCodes?.push({ prodID: this.productlist[0].prodID, BarCode: '', Unit: '', Qty: 0 })
    // this.productlist.push({ prodID: this.productlist.length + 1, barcode: '', prodUnit: '', baseQty: 0 });
  }
}

onRowEditSave(product:any) {
  // Save logic here
}

onRowEditCancel(product:any, editing:any) {
  // Cancel logic here
}


  filterProduct(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.productGrouplist.length; i++) {
      let product = this.productGrouplist[i];
      if (product.prodGrpName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(product);
      }
    }
    this.FilterProductGrouplist = filtered;
  }

  filtersType(event:any) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.type.length; i++) {
      let type = this.type[i];
      if (type.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(type);
      }
    }
    this.filterType = filtered;
  }

  clear()
  {
    this.productlist = [
      {
        prodID : undefined,
        prodGrpID : undefined,
        comID : undefined,
        comName : undefined,
        prodGrpName : undefined,
        prodCode : undefined,
        shortName : undefined,
        prodName : undefined,
        descr : undefined,
        prodUnit : "pcs",
        unitQty : undefined,
        qty:undefined,
        tax:undefined,
        discount:undefined,
        purchRate : undefined,
        amount:undefined,
        sellRate : undefined,
        batch:undefined,
        retailprice : undefined,
        bonusQty:undefined,
        tP : undefined,
        isDiscount : false,
        isTaxable : false,
        isStore : false,
        isRaw : false,
        isBonus : false,
        minQty : undefined,
        maxQty : undefined,
        mega : true,
        active : true,
        crtBy : undefined,
        crtDate : undefined,
        modby : undefined,
        modDate : undefined,
        expirydate : undefined,
        qtyBal:undefined,
        GLID:undefined,
        TxID:undefined,
        unitPrice:undefined,
        vendID:undefined,
        productBarCodes: []
      },
    ];
  }

  saveProduct()
  {
    if(this.SelectedSupplier == null || this.SelectedSupplier == undefined)
    {
      this.toastr.error("Please Select Supplier.");
      this.count++;
      this.onEnterTableInput(0);
    }
    else if(this.productlist[0].prodCode == "" || this.productlist[0].prodCode == undefined)
    {
      this.toastr.error("Please write product code.");
      this.count++;
      this.onEnterTableInput(0);
    }
    else if(this.productlist[0].prodName == "" || this.productlist[0].prodName == undefined)
    {
      this.toastr.error("Please write product name.");
      this.count++;
      this.onEnterTableInput(1);
    }
    else if(this.SelectedproductGrouplist.prodGrpID == "" || this.SelectedproductGrouplist.prodGrpID == undefined)
    {
      this.toastr.error("Please select product category.");
    }
    else
    {
      if(this.productlist[0].purchRate == null) {this.productlist[0].purchRate = 0}
      if(this.productlist[0].sellRate == null) {this.productlist[0].sellRate = 0}
      if(this.productlist[0].minQty == null) {this.productlist[0].minQty = 0}
      if(this.productlist[0].maxQty == null) {this.productlist[0].maxQty = 0}
      this.productlist[0].comID = localStorage.getItem('comID');
      this.productlist[0].prodGrpID = this.SelectedproductGrouplist.prodGrpID;
      this.productlist[0].descr = this.selectedType;
      this.productlist[0].isTaxable = true;
      this.productlist[0].isRaw = false;
      this.productlist[0].minQty = parseFloat(this.productlist[0].minQty);
      this.productlist[0].maxQty = parseFloat(this.productlist[0].maxQty);
      this.productlist[0].mega = true;
      this.productlist[0].active = true;
      this.productlist[0].purchRate = parseFloat(this.productlist[0].purchRate);
      this.productlist[0].sellRate = parseFloat(this.productlist[0].sellRate);
      if(this.productlist[0].qty==undefined || this.productlist[0].qty=='')
      {
        this.productlist[0].qty = 0;
      }
      this.productlist[0].qty = parseFloat(this.productlist[0].qty);
      this.productlist[0].vendID = this.SelectedSupplier.vendID;
      this.productlist[0].vendName = this.SelectedSupplier.vendName;
      this.productService.saveProduct(this.productlist[0]).subscribe({
        next: (prd:any) => {
          if(this.title == "Product Registration")
          {
            this.toastr.success("Product has been successfully added!");
            prd.prodGrpName = this.SelectedproductGrouplist.prodGrpName;
            this.dataEvent.emit({type:'added',value:prd});
            this.clear();
          }
          else
          {
            this.toastr.success("Product has been successfully updated!");
            prd.prodGrpName = this.SelectedproductGrouplist.prodGrpName;
            this.dataEvent.emit({type:'',value:prd});
          }
        },
        error: (response) => {
          this.toastr.error(response.error);
          this.onEnterTableInput(0);
        },
      });
    }
  }

  count = 0;

  increaseFocusIndexForProducts()
  {
    this.count++;
  }

  onEnterTableInput(index: number) {
      if(index == -1 && this.count==0)
      {
        this.count++;
        return;
      }
      else
      {
        this.count = 0;
      }
    if (index < this.inputFieldsTableCst.length-1) {
      this.focusOnTableInput(index + 1);
    }
    else
    {
      if(this.productlist[0].prodName != "" && this.productlist[0].prodName != undefined
      )
      {
        let el: HTMLElement = this.savebtn.nativeElement;
        el.focus();
      }
      else
      {
        this.toastr.error("Please Write Product Name");
        this.count++;
        this.onEnterTableInput(0);
      }
    }

  }

  OnSaveFocus(){
    console.log("pressed");
    let el: HTMLElement = this.savebtn.nativeElement;
    el.focus();
  }

  private focusOnTableInput(index: number) {
    const inputFieldARRAY = this.inputFieldsTableCst.toArray();
    const inputField = inputFieldARRAY[index].nativeElement;
    inputField.focus();
    inputField.select();
  }

  close()
  {
    // this.productCom.ProductVisible = false;
    // this.purchaseCom.ProductsVisible = false;
    // this.saleCom.ProductsVisible = false;
    // this.quotationCom.ProductsVisible = false;
  }
}
