import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem,ConfirmationService,MessageService, ConfirmEventType } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { Dropdown } from 'primeng/dropdown';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { PrimeNGConfig } from "primeng/api";
import { interval } from 'rxjs';

import { LocationService } from 'src/app/Administration/Services/location.service';
import { Cities } from 'src/app/Manage/Models/cities';
import { Products } from 'src/app/Manage/Models/products';
import { CitiesService } from 'src/app/Manage/Services/cities.service';
import { CustomersService } from 'src/app/Manage/Services/customers.service';
import { ProductsService } from 'src/app/Manage/Services/products.service';
import { VendorService } from 'src/app/Manage/Services/vendor.service';
import { Vendor } from 'src/app/Manage/Models/vendor';
import { type, Gl } from '../../Models/gl';
import { InvoicesService } from '../../Services/invoices.service';
import { InvoiceView } from '../../Models/invoice-view';
import { Location } from './../../../Administration/Models/location';
import { ReportSettingService } from 'src/app/Reports/Services/report-setting.service';


@Component({
  selector: 'app-add-purchase-return2',
  templateUrl: './add-purchase-return2.component.html',
  styleUrls: ['./add-purchase-return2.component.scss'],
  providers:[ConfirmationService,MessageService]
})
export class AddPurchaseReturn2Component implements OnInit{
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
  invoicelist: Gl[] = [];
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

  disable : boolean = false;
  editDisable : boolean = false;
  invoiceListForReturn : Gl[] = [];
  itemList : Gl[] = [];
  selectedVoucherNo: Gl = this.invoiceListForReturn[0];

  vatInclude : boolean = true;
  showPleaseWait: boolean = false;
  Applieddiscount : any = 0;
  reportSettingItemList :any[]=[];
  isProductCode: boolean = false;
  isArabic: boolean = false;
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
    private locationService:LocationService,
    private invoicesService:InvoicesService,
    private toastr: ToastrService,
    private el: ElementRef,
    private confirmationService :ConfirmationService,
    private messageService :MessageService,
    private cdr: ChangeDetectorRef,
    private primengConfig: PrimeNGConfig,
    private route: ActivatedRoute,
    private reportSettingService : ReportSettingService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params1 => {
      this.EditVoucherNo = params1['id'];
   });

   this.reportSettingService.GetInvoiceReportSettings().subscribe(rpt=>{
    this.reportSettingItemList = rpt.filter(x=>x.screenName.toLowerCase() == 	"purchase return");
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
        this.locations = loc.filter(x=>x.LocTypeId == 5);
        this.selectedLocation = {locID : this.locations[0].LocationId, locName : this.locations[0].LocationName}
      }
    })

    this.invoicelist = [this.createNewGLList()];

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

          if(this.EditVoucherNo != undefined)
          {
            this.showPleaseWait = true;
            this.invoicesService.getOneInvoiceDetail(this.EditVoucherNo).subscribe(invoices => {
              let i = -1;
              let j = -1;
              let k = -1;
              let locName = this.locations.find(x=>x.LocationId == invoices[0].locID)?.LocationName;
              this.selectedLocation = {LocationId : invoices[0].locID, LocationName : locName };
              let totalQty = 0;
              invoices.forEach((elem,index) => {
                if(elem.relCOAID == 83 )
                {
                  this.SelectedType[0] = {name:"Credit"};
                }

                if(elem.COAID == 98 && elem.txTypeID == 2)
                {
                  i++;
                  this.selectedCustomerName = {vendID: elem.vendID, vendName: elem.cstName};
                  this.productlist[i].GLID  =elem.GLID;
                  this.productlist[i].TxID  =elem.txID;
                  this.productlist[i].prodID  =elem.prodID;
                  this.productlist[i].prodCode  =elem.prodCode;
                  this.productlist[i].prodName ={prodName:elem.prodName};
                  this.productlist[i].purchRate  =elem.unitPrice;
                  this.productlist[i].qty  =-elem.qty;
                  this.productlist[i].amount  =elem.creditSum - elem.discountSum;
                  this.productlist[i].discount  = elem.checkNo;
                  this.productlist[i].crtDate = elem.crtDate;
                  this.SubTotal += elem.creditSum - elem.discountSum;
                  totalQty = -elem.qty;
                  //this.TotalDiscount += elem.discountSum;
                  this.Itemcalculation(i);
                  this.productlist.push(this.createNewProduct());
                  }
                else if(elem.checkName == "tax" && elem.txTypeID == 2)
                {
                  this.TotalTax = elem.creditSum+elem.debitSum;
                  if(this.TotalTax == 0)
                  {
                    this.vatInclude = false;
                  }
                }
                });

                this.productlist.splice(this.productlist.length-1,1);
                this.TotalDiscount = invoices.find(x=>x.txID == 0)?.discountSum;
                this.Applieddiscount = this.TotalDiscount / totalQty;
                this.Total = this.SubTotal + this.TotalTax - this.TotalDiscount;
                // if(this.TotalDiscount > 0)
                // {
                //   this.TotalDiscount = (this.TotalDiscount/this.SubTotal)*100;
                // }

                this.invoicesService.GetInvoicesListByID(1,this.selectedCustomerName.vendID).subscribe({
                  next:(result)=>{
                    this.invoiceListForReturn = result.filter(x=>x.txID == 0);
                    this.itemList = result.filter(x=>x.COAID == 98);
                    this.invoiceListForReturn.unshift({ voucherNo : "Select Invoice No"});
                    this.productlist.forEach(element => {
                      element.qtyBal = this.itemList.find(x=>x.prodID == element.prodID)?.qtyBal + element.qty;
                    });
                  }
                  });

                  this.selectedVoucherNo =invoices[0].checkName;
                  this.editDisable = true;
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
      inputField.focus();
      inputField.select();
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
      index = index + (rownumber*1);
      if (index < this.inputFieldsTable.length-1) {
        this.focusOnTableInput(index + 1);
      }
      else{
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
  onChange(newObj:any, i:number)
  {

    if(this.ProductOnChange(i))
    {
      if(newObj != undefined && newObj != '')
      {
        if(this.selectedCustomerName == undefined) {
          this.productlist[i].prodName = "";
          this.toastr.error("Please select supplier!");
          this.onEnterComplex(1);
          return;
        }

              this.rowNmb = i;
              this.selectedProductList = this.products.filter(f => f.prodName == newObj.prodName);
              this.filteredProduct = this.productlist.filter(f => f.prodName.prodName == newObj.prodName);
              if(this.filteredProduct.length > 1)
              {
                this.productlist[i].prodName = "";
                let index = this.productlist.findIndex(f => f.prodName.prodName == newObj.prodName);
                this.productlist[index].qty = parseFloat(this.productlist[index].qty)+1;;
                this.CheckQtyIsAvail(this.productlist[index].qty,index);
                // this.Itemcalculation(index);
                this.onEnterComplexInternal(this.inputFields.length-2);
                this.invoicelist.push(this.createNewGLList());
                this.invoicelist[i].dtTx = "";
                this.invoicelist[i].unitPrice = "";
              }
              else
              {
                this.invoicesService.CheckIFInvoiceExist(this.selectedCustomerName.vendID,newObj.prodID).subscribe({
                  next : (result:any)=>{
                        if(this.selectedProductList.length >0)
                        {
                        this.productlist[i].prodID = this.selectedProductList[0].prodID;
                        this.productlist[i].prodCode = this.selectedProductList[0].prodCode;
                        this.productlist[i].unitQty = this.selectedProductList[0].unitQty;
                        this.productlist[i].qty = 1;
                        this.productlist[i].purchRate = this.selectedProductList[0].purchRate;
                        this.productlist[i].discount = 0;
                        this.productlist[i].qtyBal = result.AvailableQty;
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
                          this.productlist[i].sellRate = 0;
                          this.productlist[i].purchRate = 0;
                          this.productlist[i].discount = 0;
                        }

                        this.disable = true;
                    },
                    error : (responce)=>{
                      this.productlist[i].prodName = "";
                      this.toastr.error("No purchase available of this item");
                      return;
                    }
                  });
                }
              }
    }
  };

  CheckQtyIsAvail(qty:any, i:any)
  {
    if(qty <= this.productlist[i].qtyBal)
    {
    }
    else{
      this.productlist[i].qty = this.productlist[i].qtyBal;
      this.toastr.error("Available qty to return : " +this.productlist[i].qtyBal);
    }
    this.Itemcalculation(i);
  }

  Itemcalculation(i: any) {

      var amt = this.productlist[i].purchRate * this.productlist[i].qty;
      this.Amount = amt;
      this.productlist[i].amount = this.Amount.toFixed(2);

      if(this.productlist[i].discount > 0)
      {
        this.Amount = (this.Amount - (amt/100)*this.productlist[i].discount);
        this.productlist[i].amount = this.Amount.toFixed(2);
      }
      this.calculateTotalAmount();

  }

  filterLocation(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.locations.length; i++) {
      let loc = this.locations[i];
      if (loc.LocationName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(loc);
      }
    }
    this.LocationList = filtered;
  }

  CancelInvoice()
  {
    if(this.EditVoucherNo != undefined)
    {
      this.router.navigateByUrl('/Invoices/PurchaseReturn')
    }
    else
    {
      this.selectedCustomerName = undefined;
      this.TotalDiscount = 0;
      let today = new Date();
      this.selectedDate = today;
      this.rowNmb = 0;
      this.invoicelist = [this.createNewGLList()];
      this.productlist = [this.createNewProduct()];
      this.calculateTotalAmount();
      this.onEnterComplex(0);
      this.savebtnDisable = false;
      this.disable = false;
      this.invoiceListForReturn = [];
      this.selectedVoucherNo = this.invoiceListForReturn[0];
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
      this.toastr.error("Please select customer!");
      this.onEnterComplex(1);
    }
    else if(this.selectedVoucherNo == undefined || this.selectedVoucherNo.voucherNo == "Select Invoice No") {
      this.toastr.error("Please select Invoice!");
      this.onEnterComplex(2);
    }
    else if(this.productlist[0].prodName == undefined || this.productlist[0].prodName.prodName == undefined)
    {
      this.toastr.error("please add alteast one item!");
      this.onEnterComplex(3);
    }
    else
    {
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
        if(this.productlist[i].qty == 0)
        {
          zeroQtyBalance++;
        }
        else
        {
          this.gl.push(this.createNewGLList());
          this.gl[j].GLID = this.productlist[i].GLID;
          this.gl[j].txID = this.productlist[i].TxID;
          this.gl[j].txTypeID = 2;
          this.gl[j].voucherNo = this.EditVoucherNo;
          this.gl[j].type = this.SelectedType[0].name;
          this.gl[j].COAID = 98;
          this.gl[j].relCOAID = 83;
          this.gl[j].vendID = this.selectedCustomerName.vendID;
          this.gl[j].isDeposited = false;
          this.gl[j].isVoided = false;
          this.gl[j].isCleared = false;
          this.gl[j].isPaid = false;
          this.gl[j].creditSum =  parseFloat(this.SubTotal);
          this.gl[j].discountSum = parseFloat(this.TotalDiscount);
          this.gl[j].taxSum = parseFloat(this.TotalTax);
          this.gl[j].paidSum = (this.productlist[i].purchRate/100*this.productlist[i].discount)*this.productlist[i].qty;
          this.gl[j].checkNo = this.productlist[i].discount;
          this.gl[j].dtTx = this.selectedDate.toLocaleString();
          this.gl[j].dtDue = this.selectedDate.toLocaleString();
          this.gl[j].empID = 0;
          this.gl[j].glComments = this.comment;
          this.gl[j].crtBy = "";
          this.gl[j].prodID = this.productlist[i].prodID;
          this.gl[j].batchNo = this.productlist[i].batch;
          this.gl[j].expiry = this.productlist[i].expirydate;
          this.gl[j].qty = parseFloat(this.productlist[i].qty);
          this.gl[j].bonusQty = this.productlist[i].bonusQty;
          this.gl[j].unitPrice = parseFloat(this.productlist[i].purchRate);
          this.gl[j].active = true;
          this.gl[j].checkName = this.selectedVoucherNo;
          this.gl[j].crtDate = this.productlist[i].crtDate;
          this.gl[j].modBy = "";
          this.gl[j].taxName = this.TaxName
          this.gl[j].locID = this.selectedLocation.LocationId;
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
      this.savebtnDisable = true;
        this.invoicesService.savePurchaseReturn(this.gl).subscribe({
          next: (Gl) => {
            if(this.EditVoucherNo != undefined)
            {
              this.toastr.success("Purchase Return has been successfully updated!");
              if(this.RemoveItemGLID2.length > 0)
              {
                this.invoicesService.deleteInvoiceRow(this.RemoveItemGLID2).subscribe({
                  next: (invoices) => {
                    this.router.navigateByUrl('/Invoices/PurchaseReturn')
                  }
                });
              }
              else
              {
                this.router.navigateByUrl('/Invoices/PurchaseReturn')
              }
            }
            else
            {
              this.toastr.success("Purchase Return has been successfully created!");
              this.invoiceNo = Gl[0].voucherNo;
              this.showReportDialog();
              this.CancelInvoice();
              this.onEnterComplex(0);
              //this.PrintringVisible = true;
            }

          },
          error:(response)=>{
            this.toastr.error(response.error);
            this.savebtnDisable = false;
          }
        });
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

  close()
  {
    this.router.navigateByUrl('/Invoices/PurchaseReturn');
  }
  focusing()
  {
    this.cdr.detectChanges();
    this.onEnterComplexInternal(this.inputFields.length-3);
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

  newRow() {
    return {};
  }

  calculateTotalAmount()
  {
    this.SubTotal= 0;
    this.TotalTax= 0;
    this.Total= 0;
    this.TotalDiscount = 0;
    if(this.productlist[0].prodID != undefined)
    {
      for (let i = 0; i < this.productlist.length; i++) {
        if(this.productlist[i].prodID != undefined)
        {
          this.TotalDiscount  += (this.Applieddiscount * this.productlist[i].qty);
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

  customerVisible(event:KeyboardEvent)
  {
    if (event.altKey && event.key.toLowerCase() === 'c') {
    //  this.VendorVisible = true;
    }

  }

  customerVisible1()
  {
    //this.VendorVisible = true;
  }

  productVisible(event:KeyboardEvent)
  {
    if (event.altKey && event.key.toLowerCase() === 'c') {
      //this.ProductsVisible = true;
    }
  }

  productVisible1()
  {
   // this.ProductsVisible = true;
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
        this.onEnterComplexInternal(this.inputFields.length-2);
      },
      error: (response) => {
        this.onEnterComplexInternal(this.inputFields.length-2);
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
        //this.onEnterComplex(index+3);
        return true;
      }
      else
      {
        if (!this.productlist[index].prodName.prodName) {
          // this.toastr.error("Please Select Product.");
          this.cdr.detectChanges();
          //this.onEnterComplex(index+3);
            return true;
        }
      }
    }
    return true;
  }

  CustomerOnChange()
  {
    if(this.selectedCustomerName == undefined){
      this.toastr.error("Please select supplier!");
      this.onEnterComplex(0);
    }
    else{
      this.invoicesService.GetInvoicesListByID(1,this.selectedCustomerName.vendID).subscribe({
        next:(result)=>{
          this.productlist = [this.createNewProduct()];
          this.invoiceListForReturn = result.filter(x=>x.txID == 0);
          this.itemList = result.filter(x=>x.COAID == 98);
          this.invoiceListForReturn.unshift({ voucherNo : "Select Invoice No"});
        },
        error:(responce)=>{
          this.invoiceListForReturn = [];
          this.productlist = [this.createNewProduct()];
          this.toastr.error("No purchase invoice avalaible for this supplier");
        }
      })
    }
  }

  InvoiceOnChange(){
    let list = this.itemList.filter(x=>x.voucherNo == this.selectedVoucherNo && x.qtyBal > 0);
    this.productlist = [this.createNewProduct()];
    if(list.length > 0)
    {
      this.selectedLocation.LocationId = list[0].locID;
      this.TotalDiscount = 0;
      let i=0;
      list.forEach(elem => {
        this.productlist[i].prodID = elem.prodID;
        this.productlist[i].prodName = {prodName:this.products.find(x=>x.prodID == elem.prodID)?.prodName};
        this.productlist[i].prodCode = this.products.find(x=>x.prodID == elem.prodID)?.prodCode;
        this.productlist[i].qtyBal = elem.qtyBal;
        this.productlist[i].qty = 0;
        this.productlist[i].purchRate = elem.unitPrice;
        this.productlist[i].discount = elem.checkNo;
        i++;
        if(list.length != i)
        {
          this.productlist.push(this.createNewProduct());
        }
      });
      const itemsWithSelectedVoucher = this.itemList.filter(item => item.voucherNo === this.selectedVoucherNo);
      const totalQty = itemsWithSelectedVoucher.reduce((total, item) => total + item.qty, 0);
      this.Applieddiscount = this.invoiceListForReturn.filter(x=>x.voucherNo == this.selectedVoucherNo && x.txID == 0)[0].discountSum;
      var balSum = this.invoiceListForReturn.filter(x=>x.voucherNo == this.selectedVoucherNo && x.txID == 0)[0].balSum;
      if(balSum > 0)
      {
        this.SelectedType[0] = {name:"Credit"};
      }
      else{
        this.SelectedType[0] = {name:"Cash"};
      }

      if(this.invoiceListForReturn.filter(x=>x.voucherNo == this.selectedVoucherNo && x.txID == 0)[0].taxSum == 0)
      {
        this.vatInclude = false;
      }
      else{
        this.vatInclude = true;
      }
      this.Applieddiscount = this.Applieddiscount / totalQty;
      this.calculateTotalAmount();
    }
    else{
      this.toastr.error("No item available to returned");
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

  onCodeChange(newObj:any, i:number)
  {
    if(newObj != '' && newObj != undefined)
    {
      if(this.selectedCustomerName == undefined) {
        this.productlist[i].prodCode = "";
        this.productlist[i].prodName = "";
        this.toastr.error("Please select supplier!");
        this.onEnterComplex(1);
        return;
      }
      this.rowNmb = i;
      this.selectedProductList = this.products.filter(f => f.prodCode == newObj);
      this.filteredProduct = this.productlist.filter(f => f.prodCode == newObj);
      if(this.filteredProduct.length > 1)
      {
        this.productlist[i].prodName = "";
        this.productlist[i].prodCode = "";
        let index = this.productlist.findIndex(f => f.prodCode == newObj);
        this.productlist[index].qty = parseFloat(this.productlist[index].qty)+1;
        this.CheckQtyIsAvail(this.productlist[index].qty,index);
        this.onEnterComplexInternal(this.inputFields.length-3);
        this.invoicelist.push(this.createNewGLList());
          this.invoicelist[i].dtTx = "";
          this.invoicelist[i].unitPrice = "";
      }
      else
      {
          if(this.selectedProductList.length >0)
          {
            this.invoicesService.CheckIFInvoiceExist(this.selectedCustomerName.vendID,this.selectedProductList[0].prodID).subscribe({
              next : (result:any)=>{

                  this.productlist[i].prodID = this.selectedProductList[0].prodID;
                  this.productlist[i].prodName = {prodName:this.selectedProductList[0].prodName};
                  this.productlist[i].prodCode = this.selectedProductList[0].prodCode;
                  this.productlist[i].unitQty = this.selectedProductList[0].unitQty;
                  this.productlist[i].qty = 1;
                  this.productlist[i].purchRate = this.selectedProductList[0].purchRate;
                  this.productlist[i].discount = 0;
                  this.productlist[i].qtyBal = result.AvailableQty;
                  this.CheckQtyIsAvail(this.productlist[i].qty,i);
                  let el: HTMLElement = this.newRowButton.nativeElement;
                  el.click();
                  this.cdr.detectChanges();
                  this.onEnterComplexInternal(this.inputFields.length-3);

                  this.disable = true;
                },
                error : (responce)=>{
                  this.productlist[i].prodCode = "";
                  this.productlist[i].prodID = "";
                  this.productlist[i].prodName = "";
                  this.productlist[i].unitQty = "";
                  this.productlist[i].qty = "";
                  this.productlist[i].sellRate = "";
                  this.productlist[i].purchRate = "";
                  this.productlist[i].discount = "";
                  this.productlist[i].amount = "";
                  this.Itemcalculation(i);

                  this.toastr.error("No purchase available for this item");
                  return;
                }
              });
          }
          else
          {
            this.productlist[i].prodID = "";
            this.productlist[i].prodName = "";
            this.productlist[i].unitQty = "";
            this.productlist[i].qty = "";
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
        this.productlist[i].qty = "";
        this.productlist[i].sellRate = "";
        this.productlist[i].purchRate = "";
        this.productlist[i].discount = "";
        this.productlist[i].amount = "";
        this.Itemcalculation(i);
        this.onEnterComplexInternal(this.inputFields.length-2);
      }

    }


  onChangePrint(e:any) {
    this.printtype= e.target.value;
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
}

