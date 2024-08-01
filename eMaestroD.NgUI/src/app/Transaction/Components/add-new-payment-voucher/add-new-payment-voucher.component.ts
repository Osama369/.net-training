import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { Subscription, lastValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem,ConfirmationService,MessageService, ConfirmEventType } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { Dropdown } from 'primeng/dropdown';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { PrimeNGConfig } from "primeng/api";
import { interval } from 'rxjs';
import { getCurrencySymbol } from '@angular/common';
import { COA } from 'src/app/Administration/Models/COA';
import { type, Gl } from 'src/app/Invoices/Models/gl';
import { InvoicesService } from 'src/app/Invoices/Services/invoices.service';
import { InvoiceView } from 'src/app/Invoices/Models/invoice-view';
import { Cities } from 'src/app/Manage/Models/cities';
import { Products } from 'src/app/Manage/Models/products';
import { CitiesService } from 'src/app/Manage/Services/cities.service';
import { ProductsService } from 'src/app/Manage/Services/products.service';
import { GenericService } from 'src/app/Shared/Services/generic.service';
import { Vendor } from 'src/app/Manage/Models/vendor';
import { VendorService } from 'src/app/Manage/Services/vendor.service';

@Component({
  selector: 'app-add-new-payment-voucher',
  templateUrl: './add-new-payment-voucher.component.html',
  styleUrls: ['./add-new-payment-voucher.component.css']
})
export class AddNewPaymentVoucherComponent implements OnInit{

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    // if (event.altKey && event.key === 's') {
    //   for (let i = 0; i < this.productlist.length; i++) {
    //         this.invoicesService.getInvoiceDetailByVendor(this.selectedVendorId,this.productlist[i].prodID).subscribe({
    //           next: (invoice) => {
    //             if(invoice != null)
    //             {

    //               this.invoicelist[i] = invoice;
    //               this.invoicelist[i].prodName = this.productlist.find(x=>x.prodID == this.invoicelist[i].prodID)?.prodName.toString();
    //               this.invoicelist[i].cstName = this.Vendors.find(x=>x.cstID == this.invoicelist[i].cstID)?.cstName.toString();
    //             }
    //           },
    //         });
    //       }

    //   this.showDialog();
    // }

    if (event.keyCode == 113) {
      const inputField = this.focusDiscountInput.nativeElement;
      inputField.focus();
    }

    if (event.keyCode == 115) {
      this.onEnterComplex(0);
    }

    if(event.altKey && event.key === 's')
    {
      this.focusOnSaveButton();
    }

    // if(event.ctrlKey && event.key === 'c')
    // {
    //   this.focusOnCancelButton();
    // }


  }
  // @HostListener('keydown.enter', ['$event'])
  // onKeyDown(event: KeyboardEvent) {
  //   event.preventDefault();
  //   const focusableElements = Array.from(
  //     document.querySelectorAll<HTMLElement>(
  //       'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  //     )
  //   );
  //   const currentIndex = focusableElements.indexOf(this.el.nativeElement);
  //   const nextIndex = (currentIndex + 1) % focusableElements.length;
  //   focusableElements[nextIndex].focus();
  // }

  type :any[] = [ {
    name:'Cash'
  },
  {
    name:'Bank'
    },
    {
      name:"Credit Card"
    }
  ];
  BankVisible : boolean = false;
  SelectedType : type[] = [];
  filterType :any[] = [];
  products: Products[] = [];
  BankList: COA[] = [];
  Stock: Products[] = [];
  invoicelist: Gl[] = [];
  cities: Cities[] = [];
  Vendors: Vendor[] = [];
  VendorList: Vendor[] = [];
  gl: Gl[] = [];
  gl1: Gl[] = [];
  SelectedProduct:any;
  SelectedBank:any;
  selectedProductList:any;
  selectedVendorId:any;
  selectedVendorName:any;
  selectedCity:any;
  selectedDate:Date;
  filteredProduct:any;
  prdID:any;Batch:any;Unit:any;Qty:any;
  bonusQty:any;Price:any;expiryDate:any;Tax:any;Discount:any;Amount:any;
  SubTotal:any=0;TotalDiscount:any=0;TotalTax:any=0;Total:any=0;
  TaxValue:any=0;
  invoiceNo:any;
  printtype:any = "thermal";
  invoiceNo1:any;
  productlist: Products[];
  Filterproductlist: Products[];
  FilterBanklist: Products[];
  clonedProduct: { [s: string]: Products } = {};
  visible: boolean = false;
  Reportvisible: boolean = false;
  voucherNo: String = "";
  VendorsVisible: boolean = false;
  ProductsVisible: boolean = false;
  PrintringVisible: boolean = false;
  rowNmb : any=0;
  eyeOpen : any= false;
  eyeOpenforSoldPrice: any= false;
  ProductDetailShow: any= true;
  VendorDetailShow: any= true;
  invoiceDetailShow: any= true;
  txid: any;
  serviceUrl : string = "";
  ssrsFilePath : string = "";
  EditVoucherNo : any;
  RemoveItemGLID1 :InvoiceView[]  = [];
  RemoveItemGLID2 :InvoiceView[]  = [];
  voucherList : InvoiceView[] = [];
  TotalBalance =0;
  TotalPaid =0;
  TotalRemaining =0;
  glComments :any;
  CurrencyCode : any;
  savebtnDisable : boolean = false;
  isEdit : boolean = false;
  maxDate : any = new Date();
  showPleaseWait: boolean = false;

  CreditCardVisible : boolean = false;
  CreditCardList: COA[] = [];
SelectedCreditCard:any;
FilterCreditCardlist: any[];

  showDialog() {
      this.visible = true;
  }

  showReportDialog() {
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
    private vendorService:VendorService,
    private invoicesService:InvoicesService,
    private genericService:GenericService,
    private toastr: ToastrService,
    private el: ElementRef,
    private confirmationService :ConfirmationService,
    private messageService :MessageService,
    private cdr: ChangeDetectorRef,
    private primengConfig: PrimeNGConfig,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {

    // this.genericService.getCurrency().subscribe(c =>{
    //   this.CurrencyCode = c[0].CurrencyCode;
    //   this.CurrencyCode = getCurrencySymbol(this.CurrencyCode,'narrow');
    // })

    this.route.params.subscribe(params1 => {
      this.EditVoucherNo = params1['id'];

    });

    await this.loadBankData();

    let today = new Date();
    this.selectedDate = today;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = (products as { [key: string]: any })["enttityDataSource"];
        if(this.products.length >0)
        {
          this.TaxValue = this.products[0].tax;
        }
      },
    });

    this.vendorService.getAllVendor().subscribe({
      next: (Vendors) => {
        this.Vendors = (Vendors as { [key: string]: any })["enttityDataSource"];
        this.Vendors = this.Vendors.sort((a, b) =>  a.vendName.localeCompare(b.vendName));
        this.VendorList = this.Vendors;
        //this.selectedVendorId = this.Vendors.find(x=>x.cstName == "WALK IN")?.cstID;
        //this.selectedVendorName = this.Vendors.find(x=>x.cstName == "WALK IN")?.cstName;
        //this.selectedVendorName = {cstID:this.selectedVendorId,cstName:this.selectedVendorName};
      },
      error: (response) => {
        // console.log(response);
      },
    });
    this.invoicelist = [
      { GLID:undefined,txTypeID:undefined, cstID:undefined,isDeposited:undefined,dtDue:undefined,expiry:undefined,
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
        prodCode:undefined
      }
    ];

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
        unitPrice:undefined
      },
    ];

    this.SelectedType[0] = { name: this.type[0].name };

    this.primengConfig.ripple = true;

    if(this.EditVoucherNo != undefined)
    {
      this.showPleaseWait = true;
      this.isEdit = true;
      this.invoicesService.getOneVoucherDetail(this.EditVoucherNo).subscribe(invoices => {
        let i = -1;

        this.selectedVendorName ={vendID: invoices[0].cstID, vendName: invoices[0].cstName};
        const formattedDate=new Date(invoices[0].invoiceDate);
        this.selectedDate =formattedDate;
        this.voucherList = invoices;
        this.glComments = invoices[0].glComments;
        if(invoices[0].relCOAID == 80)
        {
          this.SelectedType[0] = {name:"Cash"};
        }
        else{
          if(this.CreditCardList.find(x=>x.COAID == invoices[0].relCOAID)){
            this.CreditCardVisible = true;
            this.SelectedType[0] = {name:"Credit Card"};
            this.SelectedCreditCard = {COAID : invoices[0].relCOAID, acctName: this.CreditCardList.find(x=>x.COAID == invoices[0].relCOAID)?.acctName }
          }
           else if(this.BankList.find(x=>x.COAID == invoices[0].relCOAID)){
              this.BankVisible = true;
              this.SelectedType[0] = {name:"Bank"};
              this.SelectedBank = {COAID : invoices[0].relCOAID, acctName: this.BankList.find(x=>x.COAID == invoices[0].relCOAID)?.acctName }
            }
        }
          this.Amount = 0;
          this.TotalBalance =0;
          this.TotalPaid =0;
          this.TotalRemaining =0;
          this.voucherList.forEach(element => {
              this.TotalBalance += element.amount;
          });

          this.ValidateAmount(0);
          this.showPleaseWait = false;
      });
    }

  }

  ngAfterViewInit() {

    //this.focusOnInput(0);
  }

  async loadBankData() {
    try {
      const bankData = await lastValueFrom(this.genericService.getAllBanks());
      const bankEntityDataSource =(bankData as { [key: string]: any })["enttityDataSource"];
      this.BankList = bankEntityDataSource;
      this.FilterBanklist = bankEntityDataSource;

      const defaultBank = bankEntityDataSource.find((x: { isSys: boolean; }) => x.isSys === true);
      this.SelectedBank = {
        COAID: defaultBank?.COAID,
        acctName: defaultBank?.acctName,
      };

      const creditCardData = await lastValueFrom(this.genericService.GetAllCreditCards());
      const creditCardEntityDataSource =(creditCardData as { [key: string]: any })["enttityDataSource"];
      this.CreditCardList = creditCardEntityDataSource;
      this.FilterCreditCardlist = creditCardEntityDataSource;

      const defaultCreditCard = creditCardEntityDataSource.find((x: { isSys: boolean; }) => x.isSys === true);
      this.SelectedCreditCard = {
        COAID: defaultCreditCard?.COAID,
        acctName: defaultCreditCard?.acctName,
      };
    } catch (error) {
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

  filterCreditCard(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.CreditCardList.length; i++) {
      let bank = this.CreditCardList[i];
      if (bank.acctName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(bank);
      }
    }
    this.FilterCreditCardlist = filtered;
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
          if(this.selectedVendorId != undefined)
          {
            inputField.focus();
            this.enterKeyPressCount = 0;
          }
          else{
            this.toastr.error("Please Select Vendor Name");
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
      index = index + rownumber;
      if (index < this.inputFieldsTable.length-1) {
        this.focusOnTableInput(index + 1);
      }
      else
      {
        let el: HTMLElement = this.savebtn.nativeElement;
        el.focus();
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

  // onEnter(element: any) {
  //   const index = this.dropdowns.toArray().indexOf(element);
  //   if (index !== -1) {
  //     this.focusOnElement(this.dropdowns.toArray()[index + 1] || this.inputNumbers.toArray()[0]);
  //   } else {
  //     // Handle other cases
  //   }
  // }

  // private focusOnElement(element: any) {
  //   if (element) {
  //     element.focus();
  //   }

  showProductDetails()
  {
    this.ProductDetailShow = !this.ProductDetailShow;
  }
  showVendorDetails()
  {
    this.VendorDetailShow = !this.VendorDetailShow;
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


  Itemcalculation(i: any) {

      var amt = this.productlist[i].sellRate * this.productlist[i].qty;
      this.Amount = amt;
      this.productlist[i].amount = this.Amount.toFixed(2);


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

  CancelInvoice()
  {
    if(this.EditVoucherNo != undefined)
    {
      //this.router.navigateByUrl('/Quotations')
    }
    else
    {

    this.SelectedCreditCard = undefined;
    this.CreditCardVisible = false;
    this.selectedVendorName = undefined;
    this.SelectedType[0] = {name:"Cash"};
    this.SelectedBank = undefined;
    this.BankVisible = false;
    this.TotalBalance = 0;
    this.TotalRemaining = 0;
    this.TotalPaid = 0;
    this.glComments = "";
    let today = new Date();
    this.selectedDate = today;
    this.rowNmb = 0;
    if(this.voucherList != undefined)
    {
      this.voucherList.splice(0,this.voucherList.length);
    }
    this.onEnterComplex(0);
    this.savebtnDisable = false;
    }
  }

  saveInvoice()
  {
    if(this.selectedDate == undefined) {
      this.toastr.error("Please select date!");
      this.onEnterComplex(-1);
    }
    else if(this.selectedVendorName == undefined) {
      this.toastr.error("Please Select Supplier!");
      this.onEnterComplex(0);
    }
    else if(!this.SelectedType[0].name) {
      this.toastr.error("Please select type!");
      this.onEnterComplex(1);
    }
    else if(this.BankVisible && this.SelectedBank == undefined)
    {
        this.toastr.error("Please select bank!");
        this.onEnterComplex(2);
    }
    else if(this.CreditCardVisible && this.SelectedCreditCard == undefined)
    {
        this.toastr.error("Please select Credit Card Bank!");
        this.onEnterComplex(2);
    }
    else if(this.voucherList == null){ this.toastr.error("No Pending Invoice Left!"); }
    else if(this.TotalPaid == 0){ this.toastr.error("Please Write Amount!"); }
    else
    {
        this.savebtnDisable = true;
        if(this.BankVisible)
        {
          this.voucherList[0].COAID = this.SelectedBank.COAID;
        }
        else if(this.CreditCardVisible)
        {
          this.voucherList[0].COAID = this.SelectedCreditCard.COAID;
        }
        else
        {
          this.voucherList[0].COAID = 80;
        }
        this.voucherList[0].cstID = this.selectedVendorName.vendID;
        this.voucherList[0].dtTx = this.selectedDate.toLocaleString();
        this.voucherList[0].glComments = this.glComments;
        this.voucherList[0].comID = localStorage.getItem('comID');
        this.invoicesService.savePaymentVoucher(this.voucherList).subscribe({
          next: (Gl) => {
            this.toastr.success("Payment voucher has been successfully created!");
            this.CancelInvoice();
            this.close();
          },
          error: (response) => {
            this.toastr.error(response.error);
            this.savebtnDisable = false;
          },
        });
    }

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
      if(this.EditVoucherNo != undefined)
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
    this.router.navigateByUrl('/Payment');
  }
  focusing()
  {
    if(this.productlist[this.productlist.length-2].prodName != undefined &&
      this.productlist[this.productlist.length-2].qty != undefined &&
      this.productlist[this.productlist.length-2].qty != 0
      )
    {
        this.cdr.detectChanges();
        this.onEnterComplexInternal(this.inputFields.length-3);
    }
    else
    {
      this.cdr.detectChanges();
      this.onEnterComplexInternal(this.inputFields.length-3);
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
    if(this.productlist[0].prodID != undefined)
    {
      for (let i = 0; i < this.productlist.length; i++) {
        if(this.productlist[i].prodID != undefined)
        {
          let stotal = this.productlist[i].sellRate * this.productlist[i].qty;
          let tTax = parseFloat(((stotal/100)*this.TaxValue).toFixed(2).toString());
          let tDiscount = parseFloat(((stotal/100)*this.TotalDiscount).toFixed(2).toString());
          let tTotal = parseFloat((stotal+tTax-tDiscount).toFixed(2).toString());
          this.SubTotal +=  stotal;
          this.TotalTax += tTax;
          //this.TotalDiscount += tDiscount;
          this.Total += tTotal;
        }
      }
    }
  }

  VendorVisible(event:KeyboardEvent)
  {
    if (event.altKey && event.key === 'c') {
      this.VendorsVisible = true;
    }
  }

  VendorVisible1()
  {
    this.VendorsVisible = true;
  }

  productVisible(event:KeyboardEvent)
  {
    if (event.altKey && event.key === 'c') {
      this.ProductsVisible = true;
    }
  }

  productVisible1()
  {
    this.ProductsVisible = true;
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
        if(this.products.length != count.length)
        {
          this.products = (products as { [key: string]: any })["enttityDataSource"];
          this.productlist[this.productlist.length-1].prodID = this.products[this.products.length-1].prodID;
          this.productlist[this.productlist.length-1].prodName = this.products[this.products.length-1].prodName;
          this.productlist[this.productlist.length-1].purchRate = this.products[this.products.length-1].purchRate;
          this.productlist[this.productlist.length-1].qtyBal = 0;
          this.productlist[this.productlist.length-1].sellRate = this.products[this.products.length-1].sellRate;
          this.productlist[this.productlist.length-1].prodName = {prodName : this.productlist[this.productlist.length-1].prodName, prodID : this.productlist[this.productlist.length-1].prodID};

        }
      },
      error: (response) => {
      },
    });
    this.onEnterComplex(this.productlist.length+1);
  }

  filterVendor(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.Vendors.length; i++) {
      let vnd = this.Vendors[i];
      if (vnd.vendName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(vnd);
      }
    }
    this.VendorList = filtered;
  }

  filterProduct(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.products.length; i++) {
      let product = this.products[i];
      if (product.prodName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
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
      if (type.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(type);
      }
    }
    this.filterType = filtered;
  }

  filterBank(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.BankList.length; i++) {
      let bank = this.BankList[i];
      if (bank.acctName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(bank);
      }
    }
    this.FilterBanklist = filtered;
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


  ProductOnChange(index:number)
  {
    if(!this.ProductsVisible)
    {
      if(this.productlist[index].prodName == undefined)
      {
        this.toastr.error("Please Select Product.");
        this.cdr.detectChanges();
        //this.onEnterComplex(index+3);
        return false;
      }
      else
      {
        if (!this.productlist[index].prodName.prodName) {
          this.toastr.error("Please Select Product.");
          this.cdr.detectChanges();
          //this.onEnterComplex(index+3);
            return false;
        }
      }
    }
    return true;
  }

  VendorOnChange()
  {
    this.invoicesService.getInvoicesListByCustomer(1,this.selectedVendorName.vendID).subscribe({
      next: invoices =>  {
      this.voucherList = invoices;
      this.Amount = 0;
      this.TotalBalance =0;
      this.TotalPaid =0;
      this.TotalRemaining =0;
      if(this.voucherList != null)
      {
        this.voucherList.forEach(element => {
          this.TotalBalance += element.amount;
        });
      }
      },
    })
  }

  typeOnChange()
  {
    if(this.SelectedType[0].name == "Bank")
    {
      this.BankVisible = true;
      this.CreditCardVisible = false;
    }
    else if(this.SelectedType[0].name == "Credit Card")
    {
      this.CreditCardVisible = true;
      this.BankVisible = false;
    }
    else
    {
      this.BankVisible = false;
      this.CreditCardVisible = false;
    }
  }

  onChangePrint(e:any) {
    this.printtype= e.target.value;
  }

  handleChildData() {
    this.ProductsVisible = false;
    this.VendorsVisible = false;
  }

  ValidateAmount(rownumber:any)
  {
    if(this.voucherList[rownumber].enterAmount > this.voucherList[rownumber].amount  )
    {
      this.toastr.error("Enter Amount Must Be Less than or Equal to Balance Amount");
      this.voucherList[rownumber].enterAmount = 0;
    }
    this.TotalPaid =0;
    this.voucherList.forEach(element => {
      this.TotalPaid += parseFloat(element.enterAmount);
    });
    this.TotalRemaining = this.TotalBalance - this.TotalPaid;
  }

  SetAmountToEnterAmount()
  {

    if(this.Amount > 0)
    {
      let sum =0;
      let unusedSum =this.Amount;
      this.voucherList.forEach(element => {
        sum += element.amount;
      });
      if(this.Amount > sum  )
      {
        this.toastr.error("Please write amount must be less than or equal to sum of balance amount");
        this.Amount = 0;
      }
      else
      {
        this.onEnterTableInput(-1,this.voucherList.length)
        this.TotalPaid = unusedSum;
        this.TotalRemaining = this.TotalBalance - this.TotalPaid;
        this.voucherList.forEach(elem => {
          if(elem.amount >= unusedSum)
          {
            elem.enterAmount = unusedSum;
            unusedSum = 0;
          }
          else
          {
            elem.enterAmount = elem.amount;
            unusedSum = unusedSum - elem.amount;
          }
        });
        this.Amount = 0;
      }
    }
  }
}


