import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { Subscription, empty, lastValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Products } from 'src/app/models/products';
import { ProductsService } from 'src/app/services/products.service';
import { CitiesService } from 'src/app/services/cities.service';
import { CustomersService } from 'src/app/services/customers.service';
import { InvoicesService } from 'src/app/services/invoices.service';
import { Cities } from 'src/app/models/cities';
import { Customer } from 'src/app/models/customer';
import { Gl, type } from 'src/app/models/gl';
import { SelectItem,ConfirmationService,MessageService, ConfirmEventType } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { Dropdown } from 'primeng/dropdown';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { PrimeNGConfig } from "primeng/api";
import { interval } from 'rxjs';
import { InvoiceView } from 'src/app/models/invoice-view';
import { Location } from 'src/app/models/location';
import { LocationService } from 'src/app/services/location.service';
import { ReportSettingService } from 'src/app/services/report-setting.service';
import { AuthService } from 'src/app/services/auth.service';
import { GenericService } from 'src/app/services/generic.service';
import { COA } from 'src/app/models/COA';
import { ProductCategoryService } from 'src/app/services/product-category.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-add-new-bulk-stock-update',
  templateUrl: './add-new-bulk-stock-update.component.html',
  styleUrls: ['./add-new-bulk-stock-update.component.scss'],
  providers:[ConfirmationService,MessageService]
})
export class AddNewBulkStockUpdateComponent implements OnInit{

  constructor(
    private productService: ProductsService,
    private productCategoryService: ProductCategoryService,
    private router: Router,
    private citiesService:CitiesService,
    private customersService:CustomersService,
    private genericService:GenericService,
    private invoicesService:InvoicesService,
    private locationService:LocationService,
    private toastr: ToastrService,
    private el: ElementRef,
    private confirmationService :ConfirmationService,
    private messageService :MessageService,
    private cdr: ChangeDetectorRef,
    private primengConfig: PrimeNGConfig,
    private route: ActivatedRoute,
    private reportSettingService : ReportSettingService,
    private reportService : ReportService,
    private authService : AuthService
  ) { }

  @ViewChildren('inputField') inputFields: QueryList<any>;
  @ViewChildren('inputFieldTable') inputFieldsTable: QueryList<any>;
  @ViewChild('newRowButton') newRowButton: ElementRef<HTMLElement>;
  @ViewChild('savebtn') savebtn: ElementRef<HTMLElement>;
  @ViewChild('savePaymentBtn') savePaymentBtn: ElementRef<HTMLElement>;
  @ViewChild('saveSerialbtn') saveSerialbtn: ElementRef<HTMLElement>;
  @ViewChild('cancelbtn') cancelbtn: ElementRef<HTMLElement>;
  @ViewChild('focusDiscountInput') focusDiscountInput: ElementRef<HTMLElement>;
  @ViewChild('cstDailog ') cstDailog : Dialog;
  @ViewChild('qtyField') qtyField: ElementRef;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode == 113) {
      const inputField = this.focusDiscountInput.nativeElement;
      inputField.focus();
    }

    if (event.keyCode == 115) {
      this.onEnterComplex(0);
    }

    if(event.altKey && event.key.toLowerCase() === 's')
    {
      this.focusOnSaveButton();
    }
  }


  url : any;
  type :any[] = [ {
    name:'Cash'
  },
  {
    name:'Credit'
   },
  ];
  SelectedType : type[] = [];
  filterType :any[] = [];
  products: Products[] = [];
  Stock: Products[] = [];
  invoicelist: Gl[] = [];
  cities: Cities[] = [];
  customers: Customer[] = [];
  customerList: Customer[] = [];
  gl: Gl[] = [];
  gl1: Gl[] = [];
  SelectedProduct:any;
  selectedProductList:any;
  selectedCustomerId:any;
  selectedCustomerName:any;
  selectedCity:any;
  selectedDate:Date;
  filteredProduct:any;
  printtype:any = "thermal";
  PrintringVisible: boolean = false;
  prdID:any;Batch:any;Unit:any;Qty:any;
  bonusQty:any;Price:any;expiryDate:any;Tax:any;Discount:any;Amount:any;
  SubTotal:any=0;TotalDiscount:any=0;TotalTax:any=0;Total:any=0;
  TaxValue:any=0;
  TaxName:any;
  invoiceNo:any;
  invoiceNo1:any;
  productlist: any[];
  clonedProduct: { [s: string]: Products } = {};
  visible: boolean = false;
  Reportvisible: boolean = false;
  voucherNo: String = "";
  CustomersVisible: boolean = false;
  ProductsVisible: boolean = false;
  rowNmb : any=0;
  eyeOpen : any= false;
  eyeOpenforSoldPrice: any= false;
  ProductDetailShow: any= true;
  CustomerDetailShow: any= true;
  invoiceDetailShow: any= true;
  txid: any;
  serviceUrl : string = "";
  ssrsFilePath : string = "";
  comment : string = "";
  EditVoucherNo : any;
  RemoveItemGLID1 :InvoiceView[]  = [];
  RemoveItemGLID2 :InvoiceView[]  = [];
  savebtnDisable : boolean = false;

  selectedLocation:any;
  LocationList : Location[];
  locations : Location[];
  maxDate : any = new Date();
  disable: boolean = false;
  bankDetail: boolean = false;
  isBankInfo: boolean = false;

  reportSettingItemList :any[]=[];
  isProductCode: boolean = false;
  isArabic: boolean = false;
  vatInclude : boolean = true;
  showPleaseWait: boolean = false;
  typeDisabled: boolean = false;

  //NEW PROPERITIES
  selectedCategory : any;
  categoryList : any[];
  stockList : any;
  totalRecords : any = 0;

  showReportDialog() {
    if(this.reportSettingItemList.find(x=>x.key == "A4" && x.value == true) != undefined){
      this.printtype = "A4"
    }
    else{
      this.printtype = "Thermal"
    }
    if(this.reportSettingItemList.find(x=>x.key == "Include Bank Detail") != undefined){
      this.isBankInfo = this.reportSettingItemList.find(x=>x.key == "Include Bank Detail").value;
    }else{
      this.isBankInfo = false;
    }
    this.isProductCode = this.reportSettingItemList.find(x=>x.key=="Add Product Code").value.toLocaleString();
    if(this.reportSettingItemList.find(x=>x.key == "English Only" && x.value == true) != undefined){
      this.isArabic = true;
    }
    else{
      this.isArabic = false;
    }
    this.Reportvisible = true;
  }

  async ngOnInit(): Promise<void> {
    const today = new Date();
    this.selectedDate = today;

    this.route.params.subscribe(params1 => {
      this.EditVoucherNo = params1['id'];
     });

   this.reportSettingService.GetInvoiceReportSettings().subscribe(rpt=>{
    this.reportSettingItemList = rpt.filter(x=>x.screenName.toLowerCase() == 	"sale");
    })

    this.productCategoryService.getAllGroups().subscribe({
      next: (result) => {
        this.categoryList =(result as { [key: string]: any })["enttityDataSource"];
        this.categoryList.unshift({
          prodGrpID:0,
          prodGrpName:"---ALL---"
        })
        this.selectedCategory = {prodGrpID:0,prodGrpName:"---ALL---"};
      },
      error: (response) => {
        console.log(response);
      },
    });



    const loc = await lastValueFrom(this.locationService.getAllLoc());
    this.locations = loc;
    if (this.locations && this.locations.length > 0) {
      this.selectedLocation = {
        locID: this.locations[0].locID,
        locName: this.locations[0].locName,
      };
    }

    this.invoicelist = [
      this.createNewGLList()
    ];

    this.SelectedType[0] = { name: this.type[0].name };
    this.filterType = this.type;
    this.primengConfig.ripple = true;


    this.showPleaseWait = true;
    const reportData = await lastValueFrom(
      this.reportService.runReportWith1Para("StockList", 0, 0, 0)
    );
    this.stockList = (reportData as { [key: string]: any })["enttityDataSource"];
    if (this.selectedLocation && this.stockList) {
      this.productlist = this.stockList.filter(
        (x: any) => x.locID === this.selectedLocation.locID
        );
        this.totalRecords = this.productlist.length;
      this.showPleaseWait = false;
    }
    else{
      this.showPleaseWait = false;
    }

  }

  ChangeProductList(){
    if(this.stockList)
    {
      if(this.selectedCategory.prodGrpID == 0)
      {
        this.productlist = this.stockList.filter((x:any)=>x.locID == this.selectedLocation.locID);
      }else{
        this.productlist = this.stockList.filter((x:any)=>x.prodGrpID == this.selectedCategory.prodGrpID && x.locID == this.selectedLocation.locID);
      }
      this.totalRecords = this.productlist.length;
    }
  }

  onEnterComplex(index: number) {
    if (index < this.inputFields.length - 1) {
      this.focusOnComplexInput(index + 1);
    }
  }
  increaseFocusIndex()
  {
    this.enterKeyPressCount++;
  }

  increaseFocusIndexForProducts()
  {
    this.count++;
  }

  enterKeyPressCount = 0;
  private focusOnComplexInput(index: number) {
    const inputFieldARRAY = this.inputFields.toArray();
    const check = inputFieldARRAY[index-1].el.nativeElement.tagName;
    const inputField = inputFieldARRAY[index].el.nativeElement.querySelector('input');
    if( check == "P-DROPDOWN")
    {
      this.enterKeyPressCount++;

        if (this.enterKeyPressCount === 2) {
          if(this.selectedCustomerId != undefined)
          {
            inputField.focus();
            this.enterKeyPressCount = 0;
          }
          else{
            this.toastr.error("Please Select Customer Name");
            this.enterKeyPressCount = 1;
            let drop =inputFieldARRAY[index-1].el.nativeElement.querySelector('input');
            drop.focus();
            //drop.close();
          }
        }
    }
    else
    {
      inputField.focus();
      inputField.select();
    }
  }

  onEnterComplexInternal(index: number) {
    if (index < this.inputFields.length - 1) {
      this.focusOnComplexInputInternal(index + 1);
    }
  }
  private focusOnComplexInputInternal(index: number) {
    const inputFieldARRAY = this.inputFields.toArray();
    const inputField = inputFieldARRAY[index].el.nativeElement.querySelector('input');
    inputField.focus();
  }

  count = 0;
  onEnterTableInput(index: number, rownumber:number) {
      index = index + (rownumber);
      if (index < this.inputFieldsTable.length-1) {
        this.focusOnTableInput(index + 1);
      }
      else
      {
        this.focusOnSaveButton();
      }
}
  focusOnSaveButton()
  {
    let el: HTMLElement = this.savebtn.nativeElement;
    el.focus();
  }

  focusOnCancelButton()
  {
    let el: HTMLElement = this.cancelbtn.nativeElement;
    el.focus();
  }


  enterKeyPressCount1 = 0;
  private focusOnTableInput(index: number) {
    const inputFieldARRAY = this.inputFieldsTable.toArray();
    const inputField = inputFieldARRAY[index].nativeElement;
    inputField.focus();
    inputField.select();
  }



  activeAllModule(i:number)
  {
    this.rowNmb = i;
  }


  Itemcalculation(i: any) {

    if((this.productlist[i].sellRate-((this.productlist[i].sellRate/100)*this.productlist[i].discount)) < this.productlist[i].purchRate){
      const productName = this.productlist[i].prodName;
      const message = `Warning: You are selling ${productName} at a price lower than its purchase price.`;
      this.toastr.error(message);
    }
    var amt = 0;
    if(this.productlist[i].prodID != undefined && this.productlist[i].prodID != ''){

      amt = this.productlist[i].sellRate * this.productlist[i].qty;
      this.Amount = amt;
      this.productlist[i].amount = this.Amount.toFixed(2);
    }else if(
      (this.productlist[i].prodID == undefined || this.productlist[i].prodID == '')
      && this.productlist[i].sellRate > 0 && this.productlist[i].qty > 0
    ){
      this.toastr.error("Please select item first");
      this.productlist[i].sellRate =0 ;this.productlist[i].qty = 0;
    }
      // if(this.productlist[i].tax > 0)
      // {
      //   this.Amount = (this.Amount + (amt/100)*this.productlist[i].tax);
      //   this.productlist[i].amount = this.Amount.toFixed(2);
      // }


      if(this.productlist[i].discount > 0)
      {
        this.Amount = (this.Amount - (amt/100)*this.productlist[i].discount);
        this.productlist[i].amount = this.Amount.toFixed(2);
      }

      this.calculateTotalAmount();


  }

  onDiscountChange(event: any,i:any) {
    if (event.target.value > 100) {
        event.target.value = 100;
        this.productlist[i].discount = 100;
    }
}

  CancelInvoice()
  {
    if(this.EditVoucherNo != undefined)
    {
      this.router.navigateByUrl('/SaleInvoices')
    }
    else
    {
      // this.selectedCustomerName = undefined;
      this.TotalDiscount = 0;
      this.SelectedType[0] = {name:"Cash"};
      // this.SelectedBank = undefined;
      let today = new Date();
      this.selectedDate = today;
      this.rowNmb = 0;
      this.invoicelist = [this.createNewGLList()];
      this.productlist = [];
      this.calculateTotalAmount();
      this.onEnterComplex(0);
      this.savebtnDisable = false;
    }

  }


  saveInvoice()
  {
    if(this.selectedDate == undefined) {
      this.toastr.error("Please select date!");
      this.onEnterComplex(0);
    }
    else if(this.selectedLocation.locID == undefined) {
      this.toastr.error("Please select location!");
      this.onEnterComplex(1);
    }
    else if(this.productlist[0].prodName == undefined)
    {
      this.toastr.error("please add alteast one item!");
      this.onEnterComplex(3);
    }
    else
    {
        this.savebtnDisable = true;
        let index = this.productlist.findIndex(f => f.prodID == undefined || f.prodID == "");
        if(index != -1)
        {
          this.productlist.splice(index,1);
          this.rowNmb = this.productlist.length-1;
        }

      this.gl.splice(0,this.gl.length);
      var zeroQtyBalance = 0;
      var j = 0;
      for (let i = 0; i < this.productlist.length; i++) {
        if(this.productlist[i].OrderedQty == 0)
        {
          zeroQtyBalance++;
        }
        else
        {
          this.gl.push(this.createNewGLList());
          // this.gl[j].GLID = this.productlist[i].GLID;
          // this.gl[j].txID = this.productlist[i].TxID;
          this.gl[j].txTypeID = 43;
          this.gl[j].voucherNo = this.EditVoucherNo;
          this.gl[j].type = this.SelectedType[0].name;
          this.gl[j].COAID = 98;
          this.gl[j].cstID = 0;
          this.gl[j].isDeposited = false;
          this.gl[j].isVoided = false;
          this.gl[j].isCleared = false;
          this.gl[j].isPaid = false;
          this.gl[j].discountSum = 0;
          this.gl[j].taxSum = 0;
          this.gl[j].paidSum = 0;
          this.gl[j].checkNo = 0;
          this.gl[j].dtTx = this.selectedDate.toLocaleString();
          this.gl[j].dtDue = this.selectedDate.toLocaleString();
          this.gl[j].empID = 0;
          this.gl[j].glComments = this.comment;
          this.gl[j].crtBy = "";
          this.gl[j].prodID = this.productlist[i].prodID;
          this.gl[j].batchNo = "";
          this.gl[j].expiry = "";
          this.gl[j].qty = parseFloat(this.productlist[i].OrderedQty) - parseFloat(this.productlist[i].AvailableQty) ;
          this.gl[j].bonusQty = parseFloat(this.productlist[i].AvailableQty);
          this.gl[j].unitPrice = parseFloat(this.productlist[i].unitPrice);
          this.gl[j].creditSum = parseFloat(this.gl[j].qty) * parseFloat(this.gl[j].unitPrice);
          this.gl[j].active = true;
          this.gl[j].checkName = "";
          this.gl[j].modBy = "";
          this.gl[j].depositID = 2018;
          this.gl[j].purchRate = 0;
          this.gl[j].taxName = this.TaxName;
          this.gl[j].locID = this.selectedLocation.locID;
          this.gl[j].comID = localStorage.getItem('comID');
          j++;
        }
      }
      if(this.productlist.length == zeroQtyBalance)
      {
        this.savebtnDisable = false;
        this.toastr.error("Please write qty greater than zero on alteast one item.");
        return;
      }
        this.SaveData('/bulkStockUpdate');
    }

  }

  SaveData(url :any){
    this.invoicesService.SaveStockAdjustment(this.gl).subscribe({
      next: (Gl) => {
        this.toastr.success("Bulk Stock has been successfully updated!");
        this.router.navigateByUrl(url);
      },
      error: (response) => {
        this.toastr.error(response.error);
        this.savebtnDisable = false;
      },
    });
  }

  confirmDailog(element:any)
  {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to '+element+'?',
      header: ' ',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if(element == "cancel")
        {
          this.CancelInvoice();
        }
        else
        {
          this.close();
        }
      }
    });
  }

  filterLocation(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.locations.length; i++) {
      let loc = this.locations[i];
      if (loc.locName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(loc);
      }
    }
    this.LocationList = filtered;
  }

  onPrinterClick()
  {
    this.PrintringVisible = false;
    this.showReportDialog();
    this.CancelInvoice();
    this.onEnterComplex(0);
  }

  onRowEditInit(product: Products) {
    this.clonedProduct[product.prodID] = { ...product };
  }

  onRowEditSave(product: Products) {
    delete this.clonedProduct[product.prodID];
  }

  onRowEditCancel(product: Products, index: number) {
    this.products[index] = this.clonedProduct[product.prodID];
    delete this.clonedProduct[product.prodID];
  }
  onRowDeleteInit(product: Products, index: number) {
    if(this.productlist.length ==1) {
      this.toastr.error("Can't delete the row when there is only one row", 'Warning');
        return false;
    } else {
        if(this.EditVoucherNo != undefined && this.productlist[index].GLID != undefined)
        {
          this.RemoveItemGLID1 = [
            {voucherNo:this.productlist[index].GLID,
            dtTx:undefined,
            cstName:undefined,
            amount:undefined,
            prodID: this.productlist[index].prodID,
            enterAmount : undefined,
            cstID: undefined,
            COAID : undefined,
             glComments : undefined
            }
          ]
          this.RemoveItemGLID2.push(this.RemoveItemGLID1[0]);
        }
        this.rowNmb = index-1;
        this.productlist.splice(index, 1);
        this.calculateTotalAmount();
        this.toastr.warning('Row deleted successfully', 'Delete row');
        this.focusOnSaveButton();
        return true;
    }
  }


  closePrintingOption()
  {
    this.PrintringVisible = false;
    this.CancelInvoice();
    this.onEnterComplex(0);
  }

  close()
  {
    this.router.navigateByUrl('/SaleInvoices');
  }
  focusing()
  {
    this.cdr.detectChanges();
    this.onEnterComplexInternal(this.inputFields.length-3);
  }
  newRow() {
    return {};
  }

  calculateTotalAmount()
  {
    this.SubTotal= 0;
    this.TotalTax= 0;
    this.Total= 0;
    if(this.productlist[0].prodID != undefined)
    {
      for (let i = 0; i < this.productlist.length; i++) {
        if(this.productlist[i].prodID != undefined && this.productlist[i].prodID != '')
        {
          let stotal = this.productlist[i].sellRate * this.productlist[i].qty;
          stotal =  (stotal - (stotal/100)*this.productlist[i].discount);
          let tTax = 0
          if(this.vatInclude)
          {
            tTax = parseFloat(((stotal/100)*this.TaxValue).toFixed(2).toString());
          }
          let tDiscount = 0;
          let tTotal = parseFloat((stotal+tTax-tDiscount).toFixed(2).toString());
          this.SubTotal +=  stotal;
          this.TotalTax += tTax;
          //this.TotalDiscount += tDiscount;
          this.Total += tTotal;
        }
      }

      if(this.TotalDiscount == ""){
        this.TotalDiscount = 0;
      }
      let tDiscount = parseFloat(this.TotalDiscount);
      if(this.SubTotal+this.TotalTax < tDiscount)
      {
        this.TotalDiscount = 0;
        tDiscount = parseFloat(this.TotalDiscount);
      }
      else
      {
        this.Total -= tDiscount;
      }

      this.Total = this.Total.toFixed(2);
    }


  }

  customerVisible(event:KeyboardEvent)
  {
    if (event.altKey && event.key.toLowerCase() === 'c') {
      this.authService.checkPermission('CustomersCreate').subscribe(x=>{
        if(x)
        {
          this.CustomersVisible = true;
        }
        else{
          this.toastr.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }
  }
  customerVisible1()
  {
    this.authService.checkPermission('CustomersCreate').subscribe(x=>{
      if(x)
      {
        this.CustomersVisible = true;
      }
      else{
        this.toastr.error("Unauthorized Access! You don't have permission to access.");
      }
    });
  }





  createNewInvoice()
 {
  return { GLID:undefined,txTypeID:undefined, cstID:undefined,isDeposited:undefined,dtDue:undefined,expiry:undefined,
    prodName : undefined,
    cstName : undefined,
    isVoided : undefined,
    isCleared : undefined,
    isPaid : undefined,
    voucherNo : undefined,
    creditSum : undefined,
    discountSum : undefined,
    taxSum : undefined,
    paidSum : undefined,
    dtTx : undefined,
    empID : undefined,
    glComments : undefined,
    crtBy : undefined,
    prodID : undefined,
    batchNo : undefined,
    qty:undefined,
    bonusQty:undefined,
    unitPrice:undefined,
    depositID: undefined,
    modBy:undefined,
    checkName:undefined,
    active:undefined,
    COAID:undefined,
    coaid:undefined,
    type:undefined,
    purchRate:undefined,
    txID:undefined,
    crtDate : undefined,
    relCOAID : undefined,
    vendID : undefined
  }
 }



  createNewGLList()
  {
    return{
      GLID:undefined,txTypeID:undefined, cstID:undefined,isDeposited:undefined,dtDue:undefined,expiry:undefined,
      prodName : undefined,
      cstName : undefined,
      isVoided : undefined,
      isCleared : undefined,
      isPaid : undefined,
      voucherNo : undefined,
      creditSum : undefined,
      discountSum : undefined,
      taxSum : undefined,
      paidSum : undefined,
      dtTx : undefined,
      empID : undefined,
      glComments : undefined,
      crtBy : undefined,
      prodID : undefined,
      batchNo : undefined,
      qty:undefined,
      bonusQty:undefined,
      unitPrice:undefined,
      depositID : undefined,
      modBy:undefined,
      checkName:undefined,
      active:undefined,
      COAID:undefined,
      coaid:undefined,
      type:undefined,
      purchRate:undefined,
      txID:undefined,
      crtDate : undefined,
      relCOAID : undefined,
      vendID : undefined,
      prodCode:undefined,
      debitSum:undefined
    }
  }
}

