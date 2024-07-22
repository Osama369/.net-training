import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
import { VendorService } from 'src/app/services/vendor.service';
import { Vendor } from 'src/app/models/vendor';
import { LocationService } from 'src/app/services/location.service';
import { ReportSettingService } from 'src/app/services/report-setting.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-purchase',
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.css'],
  providers:[ConfirmationService,MessageService]
})
export class AddPurchaseComponent implements OnInit{

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

    // if(event.ctrlKey && event.key === 'c')
    // {
    //   this.focusOnCancelButton();
    // }
  }
  abc()
  {console.log(123);}
  type :any[] = [ {
    name:'Cash'
  },
  {
    name:'Credit'
   }
  ];
    SelectedType : type[] = [];
  filterType :any[] = [];
  products: Products[] = [];
  Stock: Products[] = [];
  cities: Cities[] = [];
  customers: Vendor[] = [];
  customerList: Vendor[] = [];
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
  productlist: Products[];
  Filterproductlist: Products[];
  clonedProduct: { [s: string]: Products } = {};
  visible: boolean = false;
  Reportvisible: boolean = false;
  voucherNo: String = "";
  VendorVisible: boolean = false;
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
  reportSettingItemList :any[]=[];

  isProductCode: boolean = false;
  isArabic: boolean = false;
  txTypeID : any ;

  vatInclude : boolean = true;

  showPleaseWait: boolean = false;

  showDialog() {
      this.visible = true;
  }

showReportDialog() {
    if(this.reportSettingItemList.find(x=>x.key == "A4" && x.value == true) != undefined){
      this.printtype = "A4"
    }
    else{
      this.printtype = "Thermal"
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

  @ViewChildren('inputField') inputFields: QueryList<any>;
  @ViewChildren('inputFieldTable') inputFieldsTable: QueryList<any>;
  @ViewChild('newRowButton') newRowButton: ElementRef<HTMLElement>;
  @ViewChild('savebtn') savebtn: ElementRef<HTMLElement>;
  @ViewChild('cancelbtn') cancelbtn: ElementRef<HTMLElement>;
  @ViewChild('focusDiscountInput') focusDiscountInput: ElementRef<HTMLElement>;
  @ViewChild('cstDailog ') cstDailog : Dialog;

  constructor(
    private productService: ProductsService,
    private router: Router,
    private citiesService:CitiesService,
    private customersService:CustomersService,
    private vendorService:VendorService,
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
    private authService : AuthService
  ) { }

  ngOnInit(): void {


    this.route.params.subscribe(params1 => {
      this.EditVoucherNo = params1['id'];

   });

   this.reportSettingService.GetInvoiceReportSettings().subscribe(rpt=>{
    this.reportSettingItemList = rpt.filter(x=>x.screenName.toLowerCase() == 	"purchase");
  })

    const today = new Date();
    this.selectedDate = today;


    this.vendorService.getAllVendor().subscribe({
      next: (customers) => {
        this.customers = (customers as { [key: string]: any })["enttityDataSource"];
        this.customers = this.customers.sort((a, b) =>  a.vendName.localeCompare(b.vendName));
        this.customerList = this.customers;
      },
    });

    this.locationService.getAllLoc().subscribe({
      next : (loc:any)=>{
        this.locations = loc;
        this.selectedLocation = {locID : this.locations[0].locID, locName : this.locations[0].locName};
        this.LocationList = this.locations;
      }
    })


    this.productlist = [this.createNewProduct()];

    this.SelectedType[0] = { name: this.type[0].name };
    this.filterType = this.type;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = (products as { [key: string]: any })["enttityDataSource"];
        if(this.products.length >0)
        {
          this.TaxValue = this.products[0].tax;
          this.TaxName = this.products[0].taxName;
          this.products = this.products.filter(x=>x.descr == "Goods");
          this.Filterproductlist = this.products;
          if(this.EditVoucherNo != undefined)
          {
            this.showPleaseWait = true;

            this.disable = true;
            this.invoicesService.getOneInvoiceDetail(this.EditVoucherNo).subscribe(invoices => {
              let i = -1;
              let j = -1;
              let k = -1;
              let locName = this.locations.find(x=>x.locID == invoices[0].locID)?.locName;
              this.selectedLocation = {locID : invoices[0].locID, locName: locName };
              invoices.forEach((elem,index) => {
                if(elem.relCOAID == 83 )
                {
                  this.SelectedType[0] = {name:"Credit"};
                }

                if(elem.COAID == 128 && elem.txTypeID == 3)
                {
                  this.txTypeID = 3;
                  i++;
                  this.comment = "Purchase Order";
                  this.selectedCustomerName = {vendID: elem.vendID, vendName: elem.cstName};
                  // this.productlist[i].GLID  =elem.GLID;
                  // this.productlist[i].TxID  =elem.txID;
                  this.productlist[i].prodID  =elem.prodID;
                  this.productlist[i].prodCode  =elem.prodCode;
                  this.productlist[i].prodName ={prodName:elem.prodName};
                  this.productlist[i].purchRate  =elem.unitPrice;
                  this.productlist[i].qty  =elem.qty;
                  this.productlist[i].qtyBal  =elem.qty;
                  this.productlist[i].amount  =elem.unitPrice*elem.qty;
                  this.productlist[i].crtDate = elem.crtDate;
                  this.SubTotal += this.productlist[i].amount;
                  //this.TotalDiscount += elem.discountSum;
                  this.Itemcalculation(i);
                  this.productlist.push(this.createNewProduct());
                  }
                else if(elem.COAID == 98 && elem.txTypeID == 1)
                {
                  i++;
                  this.selectedCustomerName = {vendID: elem.vendID, vendName: elem.cstName};
                  this.productlist[i].GLID  =elem.GLID;
                  this.productlist[i].TxID  =elem.txID;
                  this.productlist[i].prodID  =elem.prodID;
                  this.productlist[i].prodCode  =elem.prodCode;
                  this.productlist[i].prodName ={prodName:elem.prodName};
                  this.productlist[i].purchRate  =elem.unitPrice;
                  this.productlist[i].qty  =elem.qty;
                  this.productlist[i].qtyBal  =elem.qtyBal;
                  this.productlist[i].amount  =elem.creditSum - elem.discountSum;
                  this.productlist[i].crtDate = elem.crtDate;
                  this.productlist[i].discount = elem.checkNo;
                  this.SubTotal += elem.creditSum - elem.discountSum;
                  //this.TotalDiscount += elem.discountSum;
                  this.Itemcalculation(i);
                  this.productlist.push(this.createNewProduct());
                  }
                else if(elem.checkName == "tax")
                {
                  this.TotalTax = elem.creditSum+elem.debitSum;
                  if(this.TotalTax == 0)
                  {
                    this.vatInclude = false;
                  }
                }
                });

                this.productlist.splice(this.productlist.length-1,1);
                this.calculateTotalAmount();
                this.TotalDiscount = invoices.find(x=>x.txID == 0)?.discountSum;
                this.Total = this.SubTotal + this.TotalTax - this.TotalDiscount;

                this.showPleaseWait = false;
          });
          }
        }
      },
    });

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

      // if(index == -1 && this.count==0)
      // {
      //   this.count++;
      //   return;
      // }
      // else
      // {
      //   this.count = 0;
      // }
      index = index + (rownumber*3);
      if (index < this.inputFieldsTable.length-1) {
        this.focusOnTableInput(index + 1);
      }
      else
      {
        if(this.productlist[rownumber].prodName.prodName != undefined &&
          this.productlist[rownumber].qty != undefined &&
          this.productlist[rownumber].qty != 0
          )
        {
          const response = confirm("Are you want to add new row?");

          if (response) {
              let el: HTMLElement = this.newRowButton.nativeElement;
              el.click();
              this.cdr.detectChanges();
              this.onEnterComplexInternal(this.inputFields.length-3);
            } else {
              let el: HTMLElement = this.savebtn.nativeElement;
              el.focus();
            }
        }
        else
        {
          this.onEnterComplexInternal(this.inputFields.length-3);

        }
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
  showProductDetails()
  {
    this.ProductDetailShow = !this.ProductDetailShow;
  }
  showCustomerDetails()
  {
    this.CustomerDetailShow = !this.CustomerDetailShow;
  }
  showInvoiceDetails()
  {
    this.invoiceDetailShow = !this.invoiceDetailShow;
  }
  showPurchasePrice()
  {
    this.eyeOpen = !this.eyeOpen;
  }
  showLastSoldPrice()
  {
    this.eyeOpenforSoldPrice = !this.eyeOpenforSoldPrice;
  }
  activeAllModule(i:number)
  {
    this.rowNmb = i;
  }
  onChange(newObj:any, i:number, autComplete:any)
  {
    autComplete.hide();
    if(this.ProductOnChange(i))
    {
      if(newObj != undefined && newObj != '' && typeof(newObj) != 'string')
      {
        this.rowNmb = i;
        this.selectedProductList = this.products.filter(f => f.prodName == newObj.prodName);
        this.filteredProduct = this.productlist.filter(f => f.prodName.prodName == newObj.prodName);
        if(this.filteredProduct.length > 1)
        {
          this.productlist[i].prodName = "";
          let index = this.productlist.findIndex(f => f.prodName.prodName == newObj.prodName);
          this.productlist[index].qty = parseFloat(this.productlist[index].qty)+1;
          // this.productlist[index].qtyBal = parseFloat(this.productlist[index].qtyBal)+1;
          this.Itemcalculation(index);
          this.onEnterComplexInternal(this.inputFields.length-3);
        }
        else
        {
            if(this.selectedProductList.length >0)
            {
            this.productlist[i].prodID = this.selectedProductList[0].prodID;
            this.productlist[i].prodCode = this.selectedProductList[0].prodCode;
            this.productlist[i].unitQty = this.selectedProductList[0].unitQty;
            this.productlist[i].qty = 1;
            this.productlist[i].qtyBal = 1;
            this.productlist[i].purchRate = this.selectedProductList[0].purchRate;
            this.productlist[i].discount = 0;
            this.Itemcalculation(i);
            // let el: HTMLElement = this.newRowButton.nativeElement;
            // el.click();
            // this.cdr.detectChanges();
            // this.onEnterComplexInternal(this.inputFields.length-3);
          }
            else
            {
              this.productlist[i].unitQty = 0;
              this.productlist[i].qty = 0;
              this.productlist[i].qtyBal = 0;
              this.productlist[i].sellRate = 0;
              this.productlist[i].purchRate = 0;
              this.productlist[i].discount = 0;
            }

        }
      }
      else{
        console.log(newObj);
        this.productlist[i].prodID = ""
        this.productlist[i].prodName = ""
        this.productlist[i].prodCode = "";
        this.productlist[i].unitQty = "";
        this.productlist[i].qty = "";
        this.productlist[i].qtyBal = "";
        this.productlist[i].purchRate = "";
        this.productlist[i].sellRate = "";
        this.productlist[i].discount = "";
      }
    }
  };
  Itemcalculation(i: any) {

    var amt = 0;
    if(this.productlist[i].prodID != undefined && this.productlist[i].prodID != ''){

      amt = this.productlist[i].purchRate * this.productlist[i].qty;
      this.Amount = amt;
      this.productlist[i].amount = this.Amount.toFixed(2);
    }else if(
      (this.productlist[i].prodID == undefined || this.productlist[i].prodID == '')
      && this.productlist[i].purchRate > 0 && this.productlist[i].qty > 0
    ){
      this.toastr.error("Please select item first");
      this.productlist[i].purchRate =0 ;this.productlist[i].qty = 0;
    }


      if(this.productlist[i].discount > 0)
      {
        this.Amount = (this.Amount - (amt/100)*this.productlist[i].discount);
        this.productlist[i].amount = this.Amount.toFixed(2);
      }
      this.calculateTotalAmount();

  }

  CancelInvoice()
  {
    if(this.EditVoucherNo != undefined)
    {
      this.router.navigateByUrl('/Purchase')
    }
    else
    {
      // this.selectedCustomerName = undefined;
      this.TotalDiscount = 0;
      let today = new Date();
      this.selectedDate = today;
      this.rowNmb = 0;
      this.productlist = [this.createNewProduct()];
      this.Filterproductlist = this.products;
      this.calculateTotalAmount();
      this.onEnterComplex(0);
      this.savebtnDisable = false;
    }

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


  saveInvoice()
  {
    if(this.selectedDate == undefined) {
      this.toastr.error("Please select date!");
      this.onEnterComplex(0);
    }
    else if(!this.SelectedType[0].name) {
      this.toastr.error("Please select type!");
      this.onEnterComplex(0);
    }
    else if(this.selectedCustomerName == undefined) {
      this.toastr.error("Please select supplier!");
      this.onEnterComplex(1);
    }
    else if(this.selectedCustomerName.vendID == undefined) {
      this.toastr.error("Please select supplier!");
      this.onEnterComplex(1);
    }
    else if(this.selectedLocation.locID == undefined) {
      this.toastr.error("Please select location!");
      this.onEnterComplex(2);
    }
    else if(this.productlist[0].prodName == undefined || this.productlist[0].prodName.prodName == undefined)
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

      for (let i = 0; i < this.productlist.length; i++) {
        if(this.productlist[i].qty == 0)
        {
          this.savebtnDisable = false;
          this.toastr.error("Quantity must be greater than 0");
          return;
        }
        if(this.productlist[i].purchRate == 0)
        {
          this.savebtnDisable = false;
          this.toastr.error("Unit Price must be greater than 0");
          return;
        }
        this.gl.push(this.createNewGLList());
        this.gl[i].GLID = this.productlist[i].GLID;
        this.gl[i].txID = this.productlist[i].TxID;
        this.gl[i].txTypeID = 1;
        this.gl[i].voucherNo = this.EditVoucherNo;
        this.gl[i].type = this.SelectedType[0].name;
        this.gl[i].locID = this.selectedLocation.locID;
        this.gl[i].COAID = 98;
        this.gl[i].relCOAID = 83;
        this.gl[i].vendID = this.selectedCustomerName.vendID;
        this.gl[i].isDeposited = false;
        this.gl[i].isVoided = false;
        this.gl[i].isCleared = false;
        this.gl[i].isPaid = false;
        this.gl[i].creditSum =  parseFloat(this.SubTotal);
        this.gl[i].discountSum = parseFloat(this.TotalDiscount);
        this.gl[i].taxSum = parseFloat(this.TotalTax);
        this.gl[i].dtTx = this.selectedDate.toLocaleString();
        this.gl[i].dtDue = this.selectedDate.toLocaleString();
        this.gl[i].empID = 0;
        this.gl[i].glComments = this.comment;
        this.gl[i].crtBy = "";
        this.gl[i].prodID = this.productlist[i].prodID;
        this.gl[i].batchNo = this.productlist[i].batch;
        this.gl[i].expiry = this.productlist[i].expirydate;
        this.gl[i].qty = parseFloat(this.productlist[i].qty);
        this.gl[i].bonusQty = this.productlist[i].bonusQty;
        this.gl[i].unitPrice = parseFloat(this.productlist[i].purchRate);
        this.gl[i].active = true;
        this.gl[i].checkName = "";
        this.gl[i].crtDate = this.productlist[i].crtDate;
        this.gl[i].modBy = "";
        this.gl[i].depositID = 2018;
        this.gl[i].taxName = this.TaxName;
        this.gl[i].comID = localStorage.getItem('comID');
        this.gl[i].paidSum = (this.productlist[i].purchRate/100*this.productlist[i].discount)*this.productlist[i].qty;
        this.gl[i].checkNo = this.productlist[i].discount;
      }
        this.invoicesService.savePurchaseInvoice(this.gl).subscribe({
          next: (Gl) => {
            if(this.EditVoucherNo != undefined)
            {
              this.toastr.success("Purchase has been successfully updated!");
              if(this.RemoveItemGLID2.length > 0)
              {
                this.invoicesService.deleteInvoiceRow(this.RemoveItemGLID2).subscribe(inv=>{
                    this.router.navigateByUrl('/Purchase')
                });
              }
              else
              {
                this.router.navigateByUrl('/Purchase')
              }
            }
            else
            {
              this.toastr.success("Purchase has been successfully created!");
              this.invoiceNo = Gl[0].voucherNo;
              this.onPrinterClick();
            }

          },
          error: (response)=>{
            this.toastr.error(response.error);
            this.savebtnDisable = false;
          }
        });
    }

  }

  addNewRow(list:any)
  {
    this.Filterproductlist = this.products;
    if(list.prodID != ''){
      let el: HTMLElement = this.newRowButton.nativeElement;
      el.click();
      this.cdr.detectChanges();
    }
    else{
      let el: HTMLElement = this.savebtn.nativeElement;
      el.focus();
    }
  }

  closePrintingOption()
  {
    this.PrintringVisible = false;
    this.CancelInvoice();
    this.onEnterComplex(0);
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
        if(this.EditVoucherNo != undefined && this.txTypeID != 3 )
        {
          if(this.productlist[index].GLID != undefined)
          {
            if(product.qty != product.qtyBal)
            {
              this.toastr.error("Can't delete the row Because Sale already Created Against this Item.", 'Warning');
              return false;
            }
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
        }
        this.rowNmb = index-1;
        this.productlist.splice(index, 1);
        this.calculateTotalAmount();
        this.toastr.warning('Row deleted successfully', 'Delete row');
        this.focusOnSaveButton();
        return true;
    }
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

  close()
  {
    this.router.navigateByUrl('/Purchase');
  }
  focusing(){
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
          let stotal = this.productlist[i].purchRate * this.productlist[i].qty;
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
    }


  }

  VendorsVisible(event:KeyboardEvent)
  {
    if (event.altKey && event.key.toLowerCase() === 'c') {
      this.authService.checkPermission('SuppliersCreate').subscribe(x=>{
        if(x)
        {
          this.VendorVisible = true;
        }
        else{
          this.toastr.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }
  }

  productVisible(event:KeyboardEvent)
  {
    if (event.altKey && event.key.toLowerCase() === 'c') {
      this.authService.checkPermission('ProductsCreate').subscribe(x=>{
        if(x)
        {
          this.ProductsVisible = true;
        }
        else{
          this.toastr.error("Unauthorized Access! You don't have permission to access.");
        }
      });
    }
  }

  closeVendorRegistration()
  {
    this.vendorService.getAllVendor().subscribe({
      next: (vendors) => {
        let count = (vendors as { [key: string]: any })["enttityDataSource"];
        if(this.customers.length != count.length)
        {
          this.customers = (vendors as { [key: string]: any })["enttityDataSource"];
          this.selectedCustomerId = this.customers[this.customers.length-1].vendID;
          this.selectedCustomerName = this.customers[this.customers.length-1].vendName;
          this.selectedCustomerName = {vendID:this.selectedCustomerId,vendName:this.selectedCustomerName};
        }
        },
      error: (response) => {
        // console.log(response);
      },
    });
    this.onEnterComplex(1);
  }

  closeReportRegistration()
  {
    this.onEnterComplex(0);
  }

  closeProductsRegistration()
  {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        let count = (products as { [key: string]: any })["enttityDataSource"];
        count = count.filter((x:any)=>x.descr == "Goods");
        if(this.products.length != count.length)
        {
          this.products = (products as { [key: string]: any })["enttityDataSource"];
          this.products = this.products.filter((x:any)=>x.descr == "Goods");
          this.Filterproductlist = this.products;
          this.productlist[this.productlist.length-1].prodID = this.products[this.products.length-1].prodID;
          this.productlist[this.productlist.length-1].prodCode = this.products[this.products.length-1].prodCode;
          this.productlist[this.productlist.length-1].prodName = this.products[this.products.length-1].prodName;
          this.productlist[this.productlist.length-1].purchRate = this.products[this.products.length-1].purchRate;
          this.productlist[this.productlist.length-1].qty = 1;
          this.productlist[this.productlist.length-1].sellRate = this.products[this.products.length-1].sellRate;
          this.productlist[this.productlist.length-1].prodName = {prodName : this.productlist[this.productlist.length-1].prodName, prodID : this.productlist[this.productlist.length-1].prodID};
          this.productlist[0].taxName = this.products[this.products.length-1].taxName;
          this.productlist[0].tax = this.products[this.products.length-1].tax;
        }
        this.onEnterComplexInternal(this.inputFields.length-3);
      },
      error: (response) => {
        this.onEnterComplexInternal(this.inputFields.length-3);
      },
    });
  }

  filterCustomer(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.customers.length; i++) {
      let country = this.customers[i];
      if (country.vendName.toLowerCase().indexOf(query.trim().toLowerCase()) == 0) {
        filtered.push(country);
      }
    }
    this.customerList = filtered;
  }

  filterProduct(event: any) {
    // In a real application, make a request to a remote URL with the query and return filtered results. For demo, we filter at the client-side.
    const filtered: any[] = [];
    const query = event.query.toLowerCase().trim();
    for (const product of this.products) {
      if (product.prodName.toLowerCase().includes(query)) {
        filtered.push(product);
      }
    }
    this.Filterproductlist = filtered;
  }

  filtersType(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.type.length; i++) {
      let type = this.type[i];
      if (type.name.toLowerCase().indexOf(query.trim().toLowerCase()) == 0) {
        filtered.push(type);
      }
    }
    this.filterType = filtered;
  }

  ProductOnChange(index:number)
  {
    if(!this.ProductsVisible)
    {
      if(this.productlist[index].prodName == undefined)
      {
        // this.toastr.error("Please Select Product.");
        this.cdr.detectChanges();
        this.productlist[index].qty = "";
        //this.onEnterComplex(index+3);
        return true;
      }
      else
      {
        if (!this.productlist[index].prodName.prodName) {
          // this.toastr.error("Please Select Product.");
          this.cdr.detectChanges();
          this.productlist[index].qty = "";
          //this.onEnterComplex(index+3);
            return true;
        }
      }
    }
    return true;
  }

  CustomerOnChange()
  {
    if(!this.VendorVisible)
    {
      if (!this.selectedCustomerName.cstID) {
        this.toastr.error("Please Select Customer.");
        this.onEnterComplex(1);
      }
    }
  }

  typeOnChange()
  {
    if (!this.SelectedType[0].name) {
      this.toastr.error("Please Select Type.");
      this.onEnterComplex(0);
    }

    // if(this.SelectedType[0].name == "Cash")
    // {
    //   this.selectedCustomerId = this.customers.find(x=>x.cstName == "WALK IN")?.cstID;
    //   this.selectedCustomerName = this.customers.find(x=>x.cstName == "WALK IN")?.cstName;
    //   this.selectedCustomerName = {cstID:this.selectedCustomerId,cstName:this.selectedCustomerName};

    // }

  }


  onCodeChange(newObj:any, i:number, event:any)
  {
    if(newObj != '' && newObj != undefined)
    {
      this.rowNmb = i;
      this.selectedProductList = this.products.filter(f => f.prodCode == newObj);
      this.filteredProduct = this.productlist.filter(f => f.prodCode == newObj);
      if(this.filteredProduct.length > 1)
      {
        this.productlist[i].prodName = "";
        this.productlist[i].prodCode = "";
        let index = this.productlist.findIndex(f => f.prodCode == newObj);
        this.productlist[index].qty = parseFloat(this.productlist[index].qty)+1;
        this.productlist[index].qtyBal = parseFloat(this.productlist[index].qtyBal)+1;
        this.Itemcalculation(index);
        this.onEnterComplexInternal(this.inputFields.length-3);
      }
      else
      {
          if(this.selectedProductList.length >0)
          {
          this.productlist[i].prodID = this.selectedProductList[0].prodID;
          this.productlist[i].prodName = {prodName:this.selectedProductList[0].prodName};
          this.productlist[i].prodCode = this.selectedProductList[0].prodCode;
          this.productlist[i].unitQty = this.selectedProductList[0].unitQty;
          this.productlist[i].qty = 1;
          this.productlist[i].qtyBal = 1;
          this.productlist[i].purchRate = this.selectedProductList[0].purchRate;
          this.productlist[i].discount = 0;
          this.Itemcalculation(i);
          let el: HTMLElement = this.newRowButton.nativeElement;
          el.click();
          this.cdr.detectChanges();
          this.onEnterComplexInternal(this.inputFields.length-3);
          }
          else
          {
            this.productlist[i].prodID = "";
            this.productlist[i].prodName = "";
            this.productlist[i].unitQty = "";
            this.productlist[i].qty = "";
            this.productlist[i].qtyBal = "";
            this.productlist[i].sellRate = "";
            this.productlist[i].purchRate = "";
            this.productlist[i].discount = "";
            this.productlist[i].amount = "";
            this.Itemcalculation(i);

          }

        }
      }
      else
      {
        this.productlist[i].prodID = "";
        this.productlist[i].prodName = "";
        this.productlist[i].unitQty = "";
        this.productlist[i].qty = 1;
        this.productlist[i].qtyBal = "";
        this.productlist[i].sellRate = "";
        this.productlist[i].purchRate = "";
        this.productlist[i].discount = "";
        this.productlist[i].amount = "";
        this.Itemcalculation(i);
        if (event.key === "Enter" || event.key === "Tab") {
          this.onEnterComplexInternal(this.inputFields.length-2);
        }
      }

    }


  onChangePrint(e:any) {
    this.printtype= e.target.value;
 }

 updateQtyBal(data:Products,index:any)
 {
  data.qtyBal = data.qty;
  this.Itemcalculation(index);
 }

 createNewGLList()
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
    vendID : undefined,
    prodCode:undefined,
    debitSum:undefined
  }
 }

 createNewProduct()
 {
  return {
    prodID : undefined,
    prodGrpID : undefined,
    comID : undefined,
    comName : undefined,
    prodGrpName : undefined,
    prodCode : undefined,
    shortName : undefined,
    prodName : undefined,
    descr : undefined,
    prodUnit : undefined,
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
    unitPrice: undefined
  }
 }

 handleChildData() {
  this.ProductsVisible = false;
  this.VendorVisible = false;
}

onDiscountChange(event: any,i:any) {
  if (event.target.value > 100) {
      event.target.value = 100;
      this.productlist[i].discount = 100;
  }
}

}

