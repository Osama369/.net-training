import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { Subject, Subscription, debounceTime, empty, lastValueFrom } from 'rxjs';
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
import { COA } from 'src/app/Administration/Models/COA';
import { Customer } from 'src/app/Manage/Models/customer';
import { ReportSettingService } from 'src/app/Reports/Services/report-setting.service';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { GenericService } from 'src/app/Shared/Services/generic.service';

@Component({
  selector: 'app-add-quotation-to-sale',
  templateUrl: './add-quotation-to-sale.component.html',
  styleUrls: ['./add-quotation-to-sale.component.scss'],
  providers:[ConfirmationService,MessageService]
})
export class AddQuotationToSaleComponent implements OnInit{

  @ViewChildren('serialInput') serialInputs!: QueryList<ElementRef>;
  @ViewChildren('paymentInput') paymentInput!: QueryList<ElementRef>;
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    // if (event.altKey && event.key === 's') {
    //   for (let i = 0; i < this.productlist.length; i++) {
    //         this.invoicesService.getInvoiceDetailByCustomer(this.selectedCustomerId,this.productlist[i].prodID).subscribe({
    //           next: (invoice) => {
    //             if(invoice != null)
    //             {

    //               this.invoicelist[i] = invoice;
    //               this.invoicelist[i].prodName = this.productlist.find(x=>x.prodID == this.invoicelist[i].prodID)?.prodName.toString();
    //               this.invoicelist[i].cstName = this.customers.find(x=>x.cstID == this.invoicelist[i].cstID)?.cstName.toString();
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

    if(event.altKey && event.key.toLowerCase() === 's')
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

  url : any;
  type :any[] = [ {
    name:'Cash'
  },
  {
    name:'Credit'
   },
  //  {
  //   name:'Bank'
  //  }
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
  productlist: Products[];
  Filterproductlist: Products[];
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

  SelectedBank:any;
  BankList: COA[] = [];

  CreditCardList: COA[] = [];
  SelectedCreditCard:any;


  serials: any[] = [];
  displaySerialNoDialog = false;
  serialRowNumber : any;
  previousFocusedElement: HTMLElement | null = null;


  paymentMethodVisiblity= false;

  isMultiPayment = false;
  cashAmount:any=0;
  bankAmount:any=0;
  creditCardAmount:any=0;
  sumPaymentTotal:any = 0;

  isSaving = false;

    // Generate array of serials with a specified quantity
    generateRows(qty: number) {
      this.serials = Array.from({ length: qty }, () => ''); // Initialize with empty strings
    }
    trackByIndex(index: number): number {
      return index;
    }
      // Ensure numeric input only
  validateNumber(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {  // Accept only 0-9
      event.preventDefault();  // Block non-numeric input
    }
  }

  // Handle keydown events for Enter key focus shift
  handleKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter') {  // Shift focus to the next input only on Enter key
      this.focusNext(index);
    }
  }

  // Save button state - checks if all serials are filled
  canSave(): boolean {
    return this.serials.every(serial => serial.trim().length > 0);  // Ensure no empty values
  }

  // Save operation - outputs serials as comma-separated string
  save() {
    if (this.canSave()) {
      const commaSeparatedSerials = this.serials.join(', ');  // Convert array to string
      this.displaySerialNoDialog = false;
      this.productlist[this.serialRowNumber].shortName = commaSeparatedSerials;
    }
  }

  onSerialDialogClose() {
    this.onEnterTableInput(0,this.serialRowNumber);
  }


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

  private savePaymentSubject: Subject<void> = new Subject<void>();

  constructor(
    private productService: ProductsService,
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
    private authService : AuthService
  ) {
    this.savePaymentSubject.pipe(
      debounceTime(500) // Adjust the debounce time as needed
    ).subscribe(() => this.executeSavePayment());
  }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(params1 => {
      this.EditVoucherNo = params1['id'];
   });

   this.reportSettingService.GetInvoiceReportSettings().subscribe(rpt=>{
    this.reportSettingItemList = rpt.filter(x=>x.screenName.toLowerCase() == 	"sale");
  })

  this.genericService.getConfiguration().subscribe(result => {
      this.isMultiPayment = result[0].isMultiPayment;
    });

    const today = new Date();
    this.selectedDate = today;

    this.customersService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customers = (customers as { [key: string]: any })["enttityDataSource"];
        this.customers = this.customers.sort((a, b) =>  a.cstName.localeCompare(b.cstName));
        this.selectedCustomerId = this.customers.find(x=>x.cstName == "WALK IN")?.cstID;
        this.selectedCustomerName = this.customers.find(x=>x.cstName == "WALK IN")?.cstName;
        this.selectedCustomerName = {cstID:this.selectedCustomerId,cstName:this.selectedCustomerName};
        this.customerList = this.customers;
      },
      error: (response) => {
        // console.log(response);
      },
    });

    this.locationService.getAllLoc().subscribe({
      next : (loc:any)=>{
        this.locations = loc.filter(x=>x.LocTypeId == 5);
        this.selectedLocation = {LocationId : this.locations[0].LocationId, LocationName : this.locations[0].LocationName};
        this.LocationList = this.locations;
      }
    })

    this.invoicelist = [
      this.createNewGLList()
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
        unitPrice: undefined
      },
    ];

    this.SelectedType[0] = { name: this.type[0].name };
    this.filterType = this.type;
    this.primengConfig.ripple = true;

    await this.GetBankListAsync();

    this.productService.getAllProducts().subscribe({
      next: async (products) => {
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
            this.invoicesService.getOneInvoiceDetail(this.EditVoucherNo).subscribe(async invoices => {
              let i = -1;
              let j = -1;
              let k = -1;
              let locName = this.locations.find(x=>x.LocationId == invoices[0].locID)?.LocationName;
              this.selectedLocation = {LocationId : invoices[0].locID, LocationName : locName };
              this.selectedCustomerName ={cstID: invoices[0].cstID, cstName: invoices[0].cstName};
              if(this.selectedCustomerName.cstName.toLowerCase() == "walk in"){
                this.typeDisabled = true;
              }
              invoices.forEach((elem,index) => {
                if(elem.COAID == 40)
                {
                  this.SelectedType[0] = {name:"Credit"};
                }
                else if(elem.relCOAID == 40 && elem.txTypeID == 16)
                {
                  this.SelectedType[0] = {name:"Credit"};
                }
                else if(elem.COAID == 93 && elem.txTypeID == 16)
                {
                  this.comment = "Quotation";
                  i++;
                  this.productlist[i].prodCode  =elem.prodCode;
                  this.productlist[i].prodID  =elem.prodID;
                  this.productlist[i].prodName ={prodName:elem.prodName};
                  this.productlist[i].sellRate  =elem.unitPrice;
                  this.productlist[i].qty  =elem.qty;
                  this.productlist[i].amount  =elem.creditSum;
                  this.productlist[i].crtDate = elem.crtDate;
                  this.productlist[i].discount = elem.discountSum;
                  this.productService.getProductStock(this.productlist[i].prodID).subscribe({
                    next: (products) => {
                      this.Stock = products;
                      j++;
                      if(this.Stock.length > 0)
                      {
                          this.productlist[j].qtyBal = this.Stock[0].qty;
                          this.productlist[j].purchRate = this.Stock[0].unitPrice;

                      }
                      else
                      {
                        this.productlist[j].qtyBal = 0;
                        this.productlist[j].purchRate = 0;
                      }
                    },
                  });
                  this.SubTotal += elem.creditSum;
                  //this.TotalDiscount += elem.discountSum;

                  this.invoicesService.getInvoiceDetailByCustomer(elem.cstID,elem.prodID).subscribe({
                    next: (invoice) => {
                      k++;
                      if(invoice != null)
                      {
                        this.invoicelist.push(this.createNewGLList());
                        this.invoicelist[k] = invoice;
                          let date = this.invoicelist[k].dtTx.split('T');
                          this.invoicelist[k].dtTx = date[0];
                        //this.invoicelist[i].prodName = this.productlist.find(x=>x.prodID == this.invoicelist[i].prodID)?.prodName.toString();
                        //this.invoicelist[i].cstName = this.customers.find(x=>x.cstID == this.invoicelist[i].cstID)?.cstName.toString();
                      }

                    },
                    error :() => {
                      this.invoicelist.push(this.createNewGLList());
                        this.invoicelist[k].dtTx = "";
                        this.invoicelist[k].unitPrice = "";
                    },

                  });
                  this.productlist.push(
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
                      unitPrice: undefined
                    },
                  );
                  }
                else if(elem.COAID == 141 && elem.txTypeID == 4)
                {
                  i++;
                  this.productlist[i].GLID  =elem.GLID;
                  this.productlist[i].TxID  =elem.txID;
                  this.productlist[i].prodID  =elem.prodID;
                  this.productlist[i].prodCode  =elem.prodCode;
                  this.productlist[i].prodName ={prodName:elem.prodName};
                  this.productlist[i].sellRate  =elem.unitPrice;
                  this.productlist[i].qty  =elem.qty;
                  this.productlist[i].amount  =elem.creditSum - elem.discountSum;
                  this.productlist[i].crtDate = elem.crtDate;
                  this.productlist[i].isRaw = true;
                  if(elem.checkAdd != null){
                    this.productlist[i].isStore = true;
                    this.productlist[i].shortName = elem.checkAdd;
                  }
                  this.productlist[i].discount = elem.checkNo;
                  this.productService.getProductStock(this.productlist[i].prodID).subscribe({
                    next: (products) => {
                      this.Stock = products;
                      j++;
                      if(this.Stock.length > 0)
                      {
                        this.productlist[j].qtyBal = this.Stock[0].qty + elem.qty;
                        this.productlist[j].purchRate = this.Stock[0].unitPrice;
                    }
                    else
                    {
                      this.productlist[j].qtyBal = 0 + elem.qty;
                      this.productlist[j].purchRate = 0;
                    }
                    },
                  });
                  this.SubTotal += elem.creditSum - elem.discountSum;
                  //this.TotalDiscount += elem.discountSum;

                  this.invoicesService.getInvoiceDetailByCustomer(elem.cstID,elem.prodID).subscribe({
                    next: (invoice) => {
                      k++;
                      if(invoice != null)
                      {
                        this.invoicelist.push(this.createNewGLList());
                        this.invoicelist[k] = invoice;
                          let date = this.invoicelist[k].dtTx.split('T');
                          this.invoicelist[k].dtTx = date[0];
                        //this.invoicelist[i].prodName = this.productlist.find(x=>x.prodID == this.invoicelist[i].prodID)?.prodName.toString();
                        //this.invoicelist[i].cstName = this.customers.find(x=>x.cstID == this.invoicelist[i].cstID)?.cstName.toString();
                      }

                    },
                    error :() => {
                      this.invoicelist.push(this.createNewGLList());
                        this.invoicelist[k].dtTx = "";
                        this.invoicelist[k].unitPrice = "";
                    },

                  });
                  this.productlist.push(
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
                      unitPrice: undefined
                    },
                  );
                  }
                else if(elem.checkName == "tax")
                {
                  this.TotalTax = elem.creditSum;
                  if(this.TotalTax == 0)
                  {
                    this.vatInclude = false;
                  }
                }
                else if(elem.relCOAID == 141){
                  if(elem.COAID == 80){
                    this.cashAmount = elem.debitSum - invoices.find(x=>x.txID == 0)?.discountSum;
                  }
                  else if(this.BankList.find(x=>x.COAID == elem.COAID)){
                    this.SelectedBank = this.BankList.find(x=>x.COAID == elem.COAID);
                    this.bankAmount = elem.debitSum;
                  }
                  else if(this.CreditCardList.find(x=>x.COAID == elem.COAID)){
                    this.SelectedCreditCard = this.CreditCardList.find(x=>x.COAID == elem.COAID);
                    this.creditCardAmount = elem.debitSum;
                  }
                }
                });

                this.productlist.splice(this.productlist.length-1,1);
                this.TotalDiscount = invoices.find(x=>x.txID == 0)?.discountSum;
                this.Total = this.SubTotal + this.TotalTax - this.TotalDiscount;

                this.showPleaseWait = false;
                // if(this.TotalDiscount > 0)
                // {
                //   this.TotalDiscount = (this.TotalDiscount/this.SubTotal)*100;
                // }
          });
          }
        }
      },
      error: (response) => {
        // console.log(response);
      },
    });
  }

  async GetBankListAsync() {
    // Get the list of all banks and await the result
    const bankListObservable = this.genericService.getAllBanks();
    const bankResult = await lastValueFrom(bankListObservable);

    // Extract and assign bank list
    this.BankList = (bankResult as { [key: string]: any })["enttityDataSource"];
    this.cdr.detectChanges();

    // Find the bank with isSys set to true
    const foundBank = this.BankList.find((c) => c.isSys === true);
    if (foundBank) {
      this.SelectedBank = foundBank;
    }

    // Get the list of all credit cards and await the result
    const creditCardListObservable = this.genericService.GetAllCreditCards();
    const creditCardResult = await lastValueFrom(creditCardListObservable);

    // Extract and assign credit card list
    this.CreditCardList = (creditCardResult as { [key: string]: any })["enttityDataSource"];
    this.cdr.detectChanges();

    // Find the credit card with isSys set to true
    const foundCreditCard = this.CreditCardList.find((c) => c.isSys === true);
    if (foundCreditCard) {
      this.SelectedCreditCard = foundCreditCard;
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

  getSelectedCustomerName()
  {
    //this.selectedCustomerName = this.customers.find(x=>x.cstID == this.selectedCustomerId)?.cstName.toString();

    this.invoicesService.getInvoiceDetailByCustomer(this.selectedCustomerName.cstID,this.productlist[0].prodID).subscribe({
      next: (invoice) => {
        if(invoice != null)
        {
          this.invoicelist[0] = invoice;
          let date = this.invoicelist[0].dtTx.split('T');
          this.invoicelist[0].dtTx = date[0];
          //this.invoicelist[0].prodName = this.productlist.find(x=>x.prodID == this.invoicelist[0].prodID)?.prodName.toString();
          //this.invoicelist[0].cstName = this.customers.find(x=>x.cstID == this.invoicelist[0].cstID)?.cstName.toString();
        }

      },
      error :() => {
        this.invoicelist[0].dtTx = "";
        this.invoicelist[0].unitPrice = "";
      },

    });
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
      index = index + (rownumber*3);
      if (index < this.inputFieldsTable.length-1) {
        this.focusOnTableInput(index + 1);
      }
      else
      {
        this.onEnterComplexInternal(this.inputFields.length-3);
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
        this.filteredProduct = this.productlist.filter(f => f.prodName != "" && f.prodName.prodName == newObj.prodName);
        if(this.filteredProduct.length > 1)
        {
          this.productlist[i].prodName = "";
          let index = this.productlist.findIndex(f => f.prodName.prodName == newObj.prodName);
          this.productlist[index].qty = parseFloat(this.productlist[index].qty)+1;
          this.Itemcalculation(index);
          this.onEnterComplexInternal(this.inputFields.length-2);
           this.invoicelist.push(this.createNewGLList());
            this.invoicelist[i].dtTx = "";
            this.invoicelist[i].unitPrice = "";
        }
        else
        {
            if(this.selectedProductList.length >0)
            {
            this.productlist[i].prodID = this.selectedProductList[0].prodID;
            this.productlist[i].prodCode = this.selectedProductList[0].prodCode;
            this.productlist[i].unitQty = this.selectedProductList[0].unitQty;
            this.productlist[i].qty = 1;
            this.productlist[i].sellRate = this.selectedProductList[0].sellRate;
            this.productlist[i].isStore = this.selectedProductList[0].isStore;
            this.productService.getProductStock(this.productlist[i].prodID).subscribe({
              next: (products) => {
                this.Stock = products;
                if(this.Stock.length > 0)
                {
                  this.productlist[i].qtyBal = this.Stock[0].qty;
                  this.productlist[i].purchRate = this.Stock[0].unitPrice;
              }
              else
              {
                this.productlist[i].qtyBal = 0;
                this.productlist[i].purchRate = 0;
              }
              },
            });
            this.productlist[i].discount = 0;
            this.Itemcalculation(i);
            this.invoicesService.getInvoiceDetailByCustomer(this.selectedCustomerName.cstID,this.productlist[i].prodID).subscribe({
              next: (invoice) => {
                this.invoicelist.push(this.createNewGLList());
                  this.invoicelist[i] = invoice;
                    let date = this.invoicelist[i].dtTx.split('T');
                    this.invoicelist[i].dtTx = date[0];
                  //this.invoicelist[i].prodName = this.productlist.find(x=>x.prodID == this.invoicelist[i].prodID)?.prodName.toString();
                  //this.invoicelist[i].cstName = this.customers.find(x=>x.cstID == this.invoicelist[i].cstID)?.cstName.toString();
              },
              error :() => {
                this.invoicelist.push(this.createNewGLList());
                  this.invoicelist[i].dtTx = "";
                  this.invoicelist[i].unitPrice = "";
              },

            });
            this.cdr.detectChanges();
             this.onEnterTableInput(-1,i)

              // let el: HTMLElement = this.newRowButton.nativeElement;
              // el.click();
              // this.cdr.detectChanges();
              // this.onEnterComplexInternal(this.inputFields.length-3);
              // this.cdr.detectChanges();
              // this.qtyField.nativeElement.focus();
              // Select the value in the input field
              //this.qtyField.nativeElement.focus();
              //this.qtyField.nativeElement.select();
            }
            else
            {
              this.productlist[i].unitQty = 0;
              this.productlist[i].qty = 0;
              this.productlist[i].sellRate = 0;
              this.productlist[i].purchRate = 0;
              this.productlist[i].discount = 0;
              this.invoicelist.push(this.createNewGLList());
              this.invoicelist[i].dtTx = "";
              this.invoicelist[i].unitPrice = "";
              this.productlist[i].isStore = false;

            }

        }
      }
      else{
        this.productlist[i].prodID = ""
        this.productlist[i].prodName = ""
        this.productlist[i].prodCode = "";
        this.productlist[i].unitQty = "";
        this.productlist[i].qty = "";
        this.productlist[i].qtyBal = "";
        this.productlist[i].sellRate = "";
        this.productlist[i].discount = "";
        this.productlist[i].isStore = false;
      }
    }

  };

  Itemcalculation(i: any) {

    if((this.productlist[i].sellRate-((this.productlist[i].sellRate/100)*this.productlist[i].discount)) < this.productlist[i].purchRate){
      const productName = this.productlist[i].prodName.prodName;
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
      this.router.navigateByUrl('/Invoices/SaleInvoices')
    }
    else
    {
      // this.selectedCustomerName = undefined;
      this.TotalDiscount = 0;
      this.SelectedType[0] = {name:"Cash"};
      // this.SelectedBank = undefined;
      this.typeOnChange();
      let today = new Date();
      this.selectedDate = today;
      this.rowNmb = 0;
      this.invoicelist = [this.createNewGLList()];
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
          unitPrice: undefined
        },
      ];
      this.Filterproductlist = this.products;
      this.calculateTotalAmount();
      this.onEnterComplex(0);
      this.savebtnDisable = false;
      this.paymentMethodVisiblity = false;
      this.cashAmount = 0;
      this.creditCardAmount = 0;
      this.bankAmount = 0;
    }

  }
  onCodeChange(newObj:any, i:number, event: any)
  {
    //if(this.ProductOnChange(i))
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
          this.Itemcalculation(index);
          this.onEnterComplexInternal(this.inputFields.length-3);
           this.invoicelist.push(this.createNewGLList());
            this.invoicelist[i].dtTx = "";
            this.invoicelist[i].unitPrice = "";
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
            this.productlist[i].sellRate = this.selectedProductList[0].sellRate;
            this.productlist[i].isStore = this.selectedProductList[0].isStore;
            this.productService.getProductStock(this.productlist[i].prodID).subscribe({
              next: (products) => {
                this.Stock = products;
                if(this.Stock.length > 0)
                {
                  this.productlist[i].qtyBal = this.Stock[0].qty;
                  this.productlist[i].purchRate = this.Stock[0].unitPrice;
              }
              else
              {
                this.productlist[i].qtyBal = 0;
                this.productlist[i].purchRate = 0;
              }
              },
            });
            this.productlist[i].discount = 0;
            this.Itemcalculation(i);
            this.invoicesService.getInvoiceDetailByCustomer(this.selectedCustomerName.cstID,this.productlist[i].prodID).subscribe({
              next: (invoice) => {
                this.invoicelist.push(this.createNewGLList());
                  this.invoicelist[i] = invoice;
                    let date = this.invoicelist[i].dtTx.split('T');
                    this.invoicelist[i].dtTx = date[0];
              },
              error :() => {
                this.invoicelist.push(this.createNewGLList());
                  this.invoicelist[i].dtTx = "";
                  this.invoicelist[i].unitPrice = "";
              },

            });
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
              this.productlist[i].qty = 1;
              this.productlist[i].sellRate = "";
              this.productlist[i].purchRate = "";
              this.productlist[i].discount = "";
              this.productlist[i].amount = "";
              this.productlist[i].isStore = false;
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
        this.productlist[i].sellRate = "";
        this.productlist[i].purchRate = "";
        this.productlist[i].discount = "";
        this.productlist[i].amount = "";
        this.invoicelist.push(this.createNewGLList());
        this.invoicelist[i].dtTx = "";
        this.invoicelist[i].unitPrice = "";
        this.productlist[i].isStore = false;
        this.Itemcalculation(i);
        if (event.key === "Enter" || event.key === "Tab") {
          this.onEnterComplexInternal(this.inputFields.length-2);
        }
      }

  }


  saveInvoiceAndCreateService()
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
      this.toastr.error("Please select customer!");
      this.onEnterComplex(1);
    }
    else if(this.selectedCustomerName.cstID == undefined) {
      this.toastr.error("Please select customer!");
      this.onEnterComplex(1);
    }
    else if(this.selectedLocation.LocationId == undefined) {
      this.toastr.error("Please select location!");
      this.onEnterComplex(2);
    }
    // else if(this.BankVisible && this.SelectedBank == undefined)
    // {
    //     this.toastr.error("Please select bank!");
    //     this.onEnterComplex(3);
    // }
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
        // this.gl[0].txTypeID = 4;
        // this.gl[0].depositID = 2018;
        // this.gl[0].cstID = this.selectedCustomerId;
        // this.gl[0].voucherNo = "SVN-"+this.invoiceNo;
        // this.gl[0].dtTx = this.selectedDate;
        // this.gl[0].dtDue = this.selectedDate;
        // this.gl[0].isDeposited = true;
        // this.gl[0].empID = 1;
        // this.gl[0].checkName = "Retail";
        // this.gl[0].crtBy = "Admin";
        // this.gl[0].modBy = "Admin";
        // this.gl[0].active = true;
        // this.invoicesService.saveInvoice(this.gl[0]).subscribe({
        //   next: (gl) => {
        //   },
        // });
      this.gl.splice(0,this.gl.length);

      for (let i = 0; i < this.productlist.length; i++) {
        if(this.productlist[i].qty == 0)
        {
          this.savebtnDisable = false;
          this.toastr.error("Quantity must be greater than 0");
          return;
        }
        if(this.productlist[i].sellRate == 0)
        {
          this.savebtnDisable = false;
          this.toastr.error("Unit Price must be greater than 0");
          return;
        }
        this.gl.push(this.createNewGLList());
        this.gl[i].GLID = this.productlist[i].GLID;
        this.gl[i].txID = this.productlist[i].TxID;
        this.gl[i].txTypeID = 4;
        this.gl[i].voucherNo = this.EditVoucherNo;
        this.gl[i].type = this.SelectedType[0].name;
        // if(this.BankVisible && this.SelectedBank != undefined)
        // {
        //   this.gl[i].relCOAID = this.SelectedBank.COAID;
        // }
        this.gl[i].COAID = 141;
        this.gl[i].cstID = this.selectedCustomerName.cstID;
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
        this.gl[i].unitPrice = parseFloat(this.productlist[i].sellRate);
        this.gl[i].active = true;
        this.gl[i].checkName = "";
        this.gl[i].crtDate = this.productlist[i].crtDate;
        this.gl[i].modBy = "";
        this.gl[i].depositID = 2018;
        this.gl[i].purchRate = parseFloat(this.productlist[i].purchRate);
        this.gl[i].taxName = this.TaxName;
        this.gl[i].locID = this.selectedLocation.LocationId;
        this.gl[i].comID = localStorage.getItem('comID');
        this.gl[i].paidSum = (this.productlist[i].sellRate/100*this.productlist[i].discount)*this.productlist[i].qty;
        this.gl[i].checkNo = this.productlist[i].discount;
        this.gl[i].checkAdd =  this.productlist[i].shortName;
      }


      if(this.SelectedType[0].name == "Cash" && this.isMultiPayment){
        this.url ="/Invoices/AddNewServiceInvoice";
        this.paymentMethodVisiblity = true;
      }else{
        this.SaveData('/Invoices/AddNewServiceInvoice');
      }
    }
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
      this.toastr.error("Please select customer!");
      this.onEnterComplex(1);
    }
    else if(this.selectedCustomerName.cstID == undefined) {
      this.toastr.error("Please select customer!");
      this.onEnterComplex(1);
    }
    else if(this.selectedLocation.LocationId == undefined) {
      this.toastr.error("Please select location!");
      this.onEnterComplex(2);
    }
    // else if(this.BankVisible && this.SelectedBank == undefined)
    // {
    //     this.toastr.error("Please select bank!");
    //     this.onEnterComplex(3);
    // }
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
          if(this.productlist[i].sellRate == 0)
          {
            this.savebtnDisable = false;
            this.toastr.error("Unit Price must be greater than 0");
            return;
          }
          this.gl.push(this.createNewGLList());
          this.gl[i].GLID = this.productlist[i].GLID;
          this.gl[i].txID = this.productlist[i].TxID;
          this.gl[i].txTypeID = 4;
          this.gl[i].voucherNo = this.EditVoucherNo;
          this.gl[i].type = this.SelectedType[0].name;
          // if(this.BankVisible && this.SelectedBank != undefined)
          // {
          //   this.gl[i].relCOAID = this.SelectedBank.COAID;
          // }
          this.gl[i].COAID = 141;
          this.gl[i].cstID = this.selectedCustomerName.cstID;
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
          this.gl[i].unitPrice = parseFloat(this.productlist[i].sellRate);
          this.gl[i].active = true;
          this.gl[i].checkName = "";
          this.gl[i].crtDate = this.productlist[i].crtDate;
          this.gl[i].modBy = "";
          this.gl[i].depositID = 2018;
          this.gl[i].purchRate = parseFloat(this.productlist[i].purchRate);
          this.gl[i].taxName = this.TaxName;
          this.gl[i].locID = this.selectedLocation.LocationId;
          this.gl[i].comID = localStorage.getItem('comID');
          this.gl[i].paidSum = (this.productlist[i].sellRate/100*this.productlist[i].discount)*this.productlist[i].qty;
          this.gl[i].checkNo = this.productlist[i].discount;
          this.gl[i].checkAdd =  this.productlist[i].shortName;
        }

        if(this.SelectedType[0].name == "Cash" && this.isMultiPayment){
          this.url ="/Invoices/SaleInvoices";
          this.paymentMethodVisiblity = true;
        }else{
          this.SaveData('/Invoices/SaleInvoices');
        }
    }

  }

  SaveData(url :any){
    this.invoicesService.saveSaleInvoice(this.gl).subscribe({
      next: (Gl) => {
        this.isSaving = false;
        if(this.EditVoucherNo != undefined)
        {
          this.toastr.success("Sale has been successfully updated!");
          if(this.RemoveItemGLID2.length > 0)
          {
            this.invoicesService.deleteInvoiceRow(this.RemoveItemGLID2).subscribe({
              next: (invoices) => {
                this.router.navigateByUrl(url)
              }
            });
          }
          else
          {
            this.router.navigateByUrl(url)
          }

        }
        else
        {
          this.toastr.success("Sale has been successfully created!");
          if(url == "/SaleInvoices"){
            this.invoiceNo = Gl[0].voucherNo;
            this.onPrinterClick();
          }else{
            this.router.navigateByUrl(url);
          }
        }
      },
      error: (response) => {
        this.toastr.error(response.error);
        this.isSaving = false;
        this.savebtnDisable = false;
      },
    });
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
      this.focusOnSaveButton();
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
    this.router.navigateByUrl('/Invoices/SaleInvoices');
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
  closeCustomerRegistration()
  {
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
      if (country.cstName.toLowerCase().indexOf(query.trim().toLowerCase()) == 0) {
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
        // this.onEnterComplex(index+3);
        return true;
      }
      else
      {
        if (!this.productlist[index].prodName.prodName) {
          // this.toastr.error("Please Select Product.");
          this.cdr.detectChanges();
          // this.onEnterComplex(index+3);
            return true;
        }
      }
    }
    return true;
  }

  CustomerOnChange()
  {
    if(!this.CustomersVisible)
    {
      if (!this.selectedCustomerName.cstID) {
        this.toastr.error("Please Select Customer.");
        this.onEnterComplex(1);
      }
    }
  }

  typeOnChange()
  {
    if(this.EditVoucherNo == undefined)
    {
      if(this.SelectedType[0].name == "Cash" || this.SelectedType[0].name == "Bank")
      {
        this.selectedCustomerId = this.customers.find(x=>x.cstName == "WALK IN")?.cstID;
        this.selectedCustomerName = this.customers.find(x=>x.cstName == "WALK IN")?.cstName;
        this.selectedCustomerName = {cstID:this.selectedCustomerId,cstName:this.selectedCustomerName};
      }
      else
      {
        this.selectedCustomerId = "";
        this.selectedCustomerName = "";
      }
    }

    // if(this.SelectedType[0].name == "Bank")
    // {
    //   this.BankVisible = true;
    // }
    // else
    // {
    //   this.BankVisible = false;
    // }

  }

  customerOnChange()
  {
    if(this.SelectedType[0].name == "Credit"){
      if(this.selectedCustomerName.cstName == "WALK IN")
      {
        this.selectedCustomerName = {cstID:"",cstName:""};
        this.toastr.error("You don't create credit invoice on WALK IN.")
      }
    }
  }

  onChangePrint(e:any) {
    this.printtype= e.target.value;
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


 handleChildData(data: any) {
    if(data.type == 'addedWalkin')
    {
      this.selectedCustomerId = data.value.cstID;
      this.selectedCustomerName = data.value.cstName;
      this.selectedCustomerName = {cstID:this.selectedCustomerId,cstName:this.selectedCustomerName};
    }else if(data.type == 'added')
    {
      this.customers.push(data.value);
      this.selectedCustomerId = data.value.cstID;
      this.selectedCustomerName = data.value.cstName;
      this.selectedCustomerName = {cstID:this.selectedCustomerId,cstName:this.selectedCustomerName};
    }
    this.ProductsVisible = false;
    this.CustomersVisible = false;
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


  // filterBank(event:any) {
  //   //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
  //   let filtered: any[] = [];
  //   let query = event.query;
  //   for (let i = 0; i < this.BankList.length; i++) {
  //     let bank = this.BankList[i];
  //     if (bank.acctName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
  //       filtered.push(bank);
  //     }
  //   }
  //   this.FilterBanklist = filtered;
  // }

  ShowSerialNoDailog(product: Products, qty: any, ri :any){
    if(product.isStore)
    {
      this.serialRowNumber = ri;
      this.generateRows(qty);
      if(product.shortName != undefined)
      {
        let array =  product.shortName.split(/\s*,\s*/);
        this.serials = [...array]; // Create a copy from array

        // Fill with empty strings if length is less than targetLength
        while (this.serials.length < qty) {
          this.serials.push(''); // Add empty strings
        }

        // Truncate if length is more than targetLength
        if (this.serials.length > qty) {
          this.serials = this.serials.slice(0, qty); // Truncate
        }
      }
      this.displaySerialNoDialog = true;
    }
  }


  focusNext(index: number) {
    if (index < this.serials.length - 1) {
      this.serialInputs.toArray()[index + 1].nativeElement.focus();
      this.serialInputs.toArray()[index + 1].nativeElement.select();
    }
    else{
      if(this.serials.every((s) => s.trim() !== '')){
        let el: HTMLElement = this.saveSerialbtn.nativeElement;
        el.focus();
      }
    }
  }
  savePayment() {
    this.isSaving = true;
    this.savePaymentSubject.next();
  }


   private executeSavePayment(){
    if (this.canSavePayment()) {

        if(this.bankAmount > 0)
        {
          if(this.SelectedBank == undefined){
            this.toastr.error("Please add at least one bank to continue.");
            this.isSaving = false;
            return;
          }
        }
        if(this.creditCardAmount > 0)
        {
          if(this.SelectedCreditCard == undefined)
          {
            this.toastr.error("Please add at least one credit card to continue.");
            this.isSaving = false;
            return;
          }
        }

        this.gl.push(this.createNewGLList());
        let index = this.gl.length-1;
        this.gl[index].COAID = 80;
        this.gl[index].relCOAID = 141;
        this.gl[index].creditSum =  parseFloat(this.cashAmount==null?0:this.cashAmount);

        if(this.SelectedCreditCard != undefined)
        {
          this.gl.push(this.createNewGLList());
          index = this.gl.length-1;
          this.gl[index].COAID = this.SelectedCreditCard.COAID;
          this.gl[index].relCOAID = 141;
          this.gl[index].creditSum =  parseFloat(this.creditCardAmount==null?0:this.creditCardAmount);
        }
        if(this.SelectedBank != undefined)
        {
          this.gl.push(this.createNewGLList());
          index = this.gl.length-1;
          this.gl[index].COAID = this.SelectedBank.COAID;
          this.gl[index].relCOAID = 141;
          this.gl[index].creditSum =  parseFloat(this.bankAmount==null?0:this.bankAmount);
        }

        if(parseFloat(this.TotalDiscount) > 0){
          this.gl[0].discountSum = parseFloat(this.TotalDiscount);
        }
        this.SaveData(this.url);
      }
  }

  canSavePayment(): boolean {
    if(parseFloat(this.Total)==0){
      return false;
    }
    this.sumPaymentTotal = this.cashAmount +this.creditCardAmount + this.bankAmount;
    if(parseFloat(this.Total) === this.sumPaymentTotal){
      return true;
    }
    return false;
  }

  public focusOnPaymentMethodInput(index: any) {
    if(index < 4){
      const inputFieldARRAY = this.paymentInput.toArray();
      const inputField = inputFieldARRAY[index].nativeElement;
      inputField.focus();
      inputField.select();
    }else{
      let el: HTMLElement = this.savePaymentBtn.nativeElement;
      el.focus();
    }
  }

  onPaymentDailogClose(){
    this.savebtnDisable = false;
  }
}

