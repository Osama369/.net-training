import { SharedDataService } from './../../../Shared/Services/shared-data.service';
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
import { Taxes } from 'src/app/Administration/Models/taxes';
import { ProductViewModel } from 'src/app/Manage/Models/product-view-model';
import { Invoice } from '../../Models/invoice';
import { GLTxTypes } from '../../Enum/GLTxTypes.enum';


@Component({
  selector: 'app-add-new-sale-m',
  templateUrl: './add-new-sale-m.component.html',
  styleUrls: ['./add-new-sale-m.component.scss'],
  providers:[ConfirmationService,MessageService]
})
export class AddNewSaleMComponent implements OnInit{

  @ViewChildren('serialInput') serialInputs!: QueryList<ElementRef>;
  @ViewChildren('paymentInput') paymentInput!: QueryList<ElementRef>;

  invoice : Invoice;
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
  products: ProductViewModel[] = [];
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
  productlist: ProductViewModel[] = [{}];
  Filterproductlist: ProductViewModel[];
  clonedProduct: { [s: string]: ProductViewModel } = {};
  visible: boolean = false;
  Reportvisible: boolean = false;
  voucherNo: string = "";
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

  txTypeID : number = GLTxTypes.SaleInvoice;

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

  taxesList : Taxes[];
  private savePaymentSubject: Subject<void> = new Subject<void>();
  totalGross: number;
  totalDiscount: number;
  totalExtraDiscount: number;
  totalTax: number;
  totalExtraTax: number;
  totalAdvanceExtraTax: number;
  totalNetPayable: number;
  totalRebate: number;

  invoiceID : number = 0;
  invoiceDetailID : number = 0;
  fiscalYear : number = 0;

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
    private authService : AuthService,
    private sharedDataService : SharedDataService
  ) {
    this.savePaymentSubject.pipe(
      debounceTime(500) // Adjust the debounce time as needed
    ).subscribe(() => this.executeSavePayment());
  }

  async ngOnInit(): Promise<void> {

  this.sharedDataService.getProducts$().subscribe(products => {
    this.products = (products as { [key: string]: any })["enttityDataSource"];
    this.Filterproductlist = this.products;
  });

  this.sharedDataService.getReportSettings$().subscribe(rpt=>{
    this.reportSettingItemList = rpt.filter(x=>x.screenName.toLowerCase() == 	"sale");
  })

  this.genericService.getConfiguration().subscribe(result => {
      this.isMultiPayment = result[0].isMultiPayment;
    });

    const today = new Date();
    this.selectedDate = today;

    this.sharedDataService.getCustomers$().subscribe({
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


    this.sharedDataService.getLocations$().subscribe({
      next : (loc:any)=>{
        this.locations = loc.filter(x=>x.LocTypeId == 5);
        this.selectedLocation = {LocationId : this.locations[0].LocationId, LocationName : this.locations[0].LocationName};
        this.LocationList = this.locations;
      }
    })

    this.sharedDataService.getTaxes$().subscribe({
      next : (result:any)=>{
        this.taxesList = result;
      }
    })

    this.invoicelist = [
      this.createNewGLList()
    ];


    this.SelectedType[0] = { name: this.type[0].name };
    this.filterType = this.type;

    await this.GetBankListAsync();

    this.route.params.subscribe(params1 => {
      this.EditVoucherNo = params1['id'];
      if(this.EditVoucherNo != undefined)
      {
        this.RenderEditItem();
      }
   });

  }

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

    this.invoicesService.getInvoiceDetailByCustomer(this.selectedCustomerName.cstID,this.productlist[0].prodBCID).subscribe({
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
    console.log(rownumber);
    console.log(this.productlist[rownumber].prodName);
    console.log(this.inputFieldsTable.length);
    if(this.productlist[rownumber].prodName == undefined || this.productlist[rownumber].prodName == "")
    {
      let el: HTMLElement = this.savebtn.nativeElement;
      el.focus();
    }

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
        this.selectedProductList = this.products.filter(f => f.prodBCID == newObj.prodBCID);
        this.filteredProduct = this.productlist.filter(f => f.prodBCID == newObj.prodBCID);
        if(this.filteredProduct.length > 1)
        {
          this.productlist[i].prodName = "";
          let index = this.productlist.findIndex(f => f.prodBCID == newObj.prodBCID);
          this.productlist[index].qty = this.productlist[index].qty+1;
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
            this.productlist[i].prodBCID = this.selectedProductList[0].prodBCID;
            this.productlist[i].barCode = this.selectedProductList[0].barCode;
            this.productlist[i].prodCode = this.selectedProductList[0].prodCode;
            this.productlist[i].unitQty = this.selectedProductList[0].unitQty;
            this.productlist[i].qty = 1;
            this.productlist[i].sellRate = this.selectedProductList[0].sellPrice;
            this.productlist[i].isStore = this.selectedProductList[0].isStore;

            this.productlist[i].qtyBal = this.selectedProductList[0].currentStock;
            this.productlist[i].purchRate = this.selectedProductList[0].lastCost;

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
        this.productlist[i].prodID = 0
        this.productlist[i].prodName = ""
        this.productlist[i].prodCode = "";
        this.productlist[i].unitQty = 0;
        this.productlist[i].qty = 0;
        this.productlist[i].qtyBal = 0;
        this.productlist[i].sellRate = 0;
        this.productlist[i].discount = 0;
        this.productlist[i].isStore = false;
      }
    }

  };

  Itemcalculation(rowIndex: number) {
    let rowData = this.productlist[rowIndex];

    if((rowData.sellRate-((rowData.sellRate/100)*rowData.discount)) < rowData.purchRate){
      const productName = rowData.prodName.prodName;
      const message = `Warning: You are selling ${productName} at a price lower than its purchase price.`;
      this.toastr.error(message);
    }

    // Ensure values are not null, assign default value (0) if null
    rowData.qty = rowData.qty || 0;
    rowData.bonusQty = rowData.bonusQty || 0;
    rowData.sellRate = rowData.sellRate || 0;
    rowData.discount = rowData.discount || 0;
    rowData.discountAmount = rowData.discountAmount || 0;
    rowData.taxPercent = rowData.taxPercent || 0;
    rowData.taxAmount = rowData.taxAmount || 0;
    rowData.extraDiscountPercent = rowData.extraDiscountPercent || 0;
    rowData.extraDiscountAmount = rowData.extraDiscountAmount || 0;
    rowData.advanceTaxPercent = rowData.advanceTaxPercent || 0;
    rowData.advanceTaxAmount = rowData.advanceTaxAmount || 0;
    rowData.extraAdvanceTaxAmount = rowData.extraAdvanceTaxAmount || 0;
    rowData.extraAdvanceTaxPercent = rowData.extraAdvanceTaxPercent || 0;
    rowData.rebatePercent = rowData.rebatePercent || 0;
    rowData.rebateAmount = rowData.rebateAmount || 0;

    // Calculate gross value based on quantity and purchase rate
    rowData.grossValue = rowData.qty * rowData.sellRate;

    console.log(rowData.grossValue);
    // Determine if discount is based on percentage or amount
    if (rowData.discount > 0) {
      // Calculate discount percentage from amount
      rowData.discountAmount = (rowData.grossValue * rowData.discount) / 100;
    }
      //   } else {
    //     // Calculate discount amount from percentage
    //   rowData.discount = (rowData.discountAmount / rowData.grossValue) * 100;
    // }

    // Calculate discounted gross value
    rowData.discountedGross = rowData.grossValue - rowData.discountAmount;

    // Determine if tax is based on percentage or amount
    if (rowData.taxPercent > 0) {
        // Calculate tax percentage from amount
        rowData.taxAmount = (rowData.discountedGross * rowData.taxPercent) / 100;
      } else {
        // Calculate tax amount from percentage
        rowData.taxPercent = (rowData.taxAmount / rowData.discountedGross) * 100;
    }

    // Determine if extra discount is based on percentage or amount
    if (rowData.extraDiscountPercent > 0) {
        // Calculate extra discount percentage from amount
        rowData.extraDiscountAmount = (rowData.discountedGross * rowData.extraDiscountPercent) / 100;
      } else {
        // Calculate extra discount amount from percentage
        rowData.extraDiscountPercent = (rowData.extraDiscountAmount / rowData.discountedGross) * 100;
    }

    // Calculate advance tax amount
    if (rowData.advanceTaxPercent > 0) {
      rowData.advanceTaxAmount = (rowData.discountedGross * rowData.advanceTaxPercent) / 100;
    } else {
      rowData.advanceTaxPercent = (rowData.advanceTaxAmount / rowData.discountedGross) * 100;
    }

     // Calculate extra advance tax amount
     if (rowData.extraAdvanceTaxPercent > 0) {
      rowData.extraAdvanceTaxAmount = (rowData.discountedGross * rowData.extraAdvanceTaxPercent) / 100;
    } else {
      rowData.extraAdvanceTaxPercent = (rowData.extraAdvanceTaxAmount / rowData.discountedGross) * 100;
    }

    // Calculate net amount before rebate
    rowData.netAmountBeforeRebate = rowData.discountedGross + rowData.taxAmount - rowData.extraDiscountAmount + rowData.advanceTaxAmount +rowData.extraAdvanceTaxAmount;

    // Determine if rebate is based on percentage or amount
    if (rowData.rebatePercent > 0) {
      // Calculate rebate amount from percentage
      rowData.rebateAmount = (rowData.netAmountBeforeRebate * rowData.rebatePercent) / 100;
    } else {
      // Calculate rebate percentage from amount
      rowData.rebatePercent = (rowData.rebateAmount / rowData.netAmountBeforeRebate) * 100;
    }

    // Calculate net amount after rebate
    rowData.netAmount = rowData.netAmountBeforeRebate - rowData.rebateAmount;

    // Calculate net rate (net amount divided by total quantity)
    let totalQty = rowData.qty;
    rowData.netRate = totalQty ? parseFloat((rowData.netAmount / totalQty).toFixed(2)) : 0;
    // Update the UI values with recalculated data
    this.productlist[rowIndex] = rowData;

    this.calculateTotalSummary();
  }

  calculateTotalSummary() {
    let totalGross = 0;
    let totalDiscount = 0;
    let totalExtraDiscount = 0;
    let totalTax = 0;
    let totalExtraTax = 0;
    let totalAdvanceExtraTax = 0;
    let totalNetPayable = 0;
    let totalrebate = 0;

    this.productlist.forEach(product => {
        totalGross += product.grossValue || 0;
        totalDiscount += product.discountAmount || 0;
        totalExtraDiscount += product.extraDiscountAmount || 0;
        totalTax += product.taxAmount || 0;
        totalExtraTax += product.extraAdvanceTaxAmount || 0;
        totalAdvanceExtraTax += product.advanceTaxAmount || 0;
        totalNetPayable += product.netAmount || 0;
        totalrebate += product.rebateAmount || 0;
    });

    // Assign the calculated totals to properties that bind to the template
    this.totalGross = totalGross;
    this.totalDiscount = totalDiscount;
    this.totalExtraDiscount = totalExtraDiscount;
    this.totalTax = totalTax;
    this.totalExtraTax = totalExtraTax;
    this.totalAdvanceExtraTax = totalAdvanceExtraTax;
    this.totalNetPayable = totalNetPayable;
    this.totalRebate = totalrebate;
}

  // Itemcalculation(i: any) {


  //   var amt = 0;
  //   if(this.productlist[i].prodID != undefined && this.productlist[i].prodID != 0){

  //     amt = this.productlist[i].sellRate * this.productlist[i].qty;
  //     this.Amount = amt;
  //     this.productlist[i].amount = this.Amount.toFixed(2);
  //   }else if(
  //     (this.productlist[i].prodID == undefined || this.productlist[i].prodID == 0)
  //     && this.productlist[i].sellRate > 0 && this.productlist[i].qty > 0
  //   ){
  //     this.toastr.error("Please select item first");
  //     this.productlist[i].sellRate =0 ;this.productlist[i].qty = 0;
  //   }

  //     if(this.productlist[i].discount > 0)
  //     {
  //       this.productlist[i].discountAmount = (amt/100)*this.productlist[i].discount;
  //       this.Amount = (this.Amount - (amt/100)*this.productlist[i].discount);
  //       this.productlist[i].amount = this.Amount.toFixed(2);
  //     }

  //     this.calculateTotalAmount();

  // }

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
      this.productlist = [{}];
      this.Filterproductlist = this.products;
      // this.calculateTotalAmount();
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
        this.selectedProductList = this.products.filter(f => f.barCode == newObj);
        this.filteredProduct = this.productlist.filter(f => f.barCode == newObj);
        if(this.filteredProduct.length > 1)
        {
          this.productlist[i].prodName = "";
          this.productlist[i].barCode = "";
          let index = this.productlist.findIndex(f => f.barCode == newObj);
          this.productlist[index].qty = this.productlist[index].qty+1;
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
            this.productlist[i].prodBCID = this.selectedProductList[0].prodBCID;
            this.productlist[i].prodName = {prodName:this.selectedProductList[0].prodName};
            this.productlist[i].prodCode = this.selectedProductList[0].prodCode;
            this.productlist[i].unitQty = this.selectedProductList[0].unitQty;
            this.productlist[i].qty = 1;
            this.productlist[i].sellRate = this.selectedProductList[0].sellPrice;
            this.productlist[i].isStore = this.selectedProductList[0].isStore;

            this.productlist[i].qtyBal = this.selectedProductList[0].currentStock;
            this.productlist[i].purchRate = this.selectedProductList[0].lastCost;

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
              this.productlist[i].prodID = 0;
              this.productlist[i].prodName = "";
              this.productlist[i].unitQty = 0;
              this.productlist[i].qty = 1;
              this.productlist[i].sellRate = 0;
              this.productlist[i].purchRate = 0;
              this.productlist[i].discount = 0;
              this.productlist[i].amount = "";
              this.productlist[i].isStore = false;
              this.Itemcalculation(i);
            }

        }
      }
      else
      {
        this.productlist[i].prodID = 0;
        this.productlist[i].prodName = "";
        this.productlist[i].unitQty = 0;
        this.productlist[i].qty = 1;
        this.productlist[i].sellRate = 0;
        this.productlist[i].purchRate = 0;
        this.productlist[i].discount = 0;
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




  validateFields()
  {
    if(this.selectedDate == undefined) {
      this.toastr.error("Please select date!");
    }
    else if(!this.SelectedType[0].name) {
      this.toastr.error("Please select type!");
    }
    else if(this.selectedCustomerName == undefined) {
      this.toastr.error("Please select Customer!");
    }
    else if(this.selectedCustomerName.cstID == undefined) {
      this.toastr.error("Please select Customer!");
    }
    else if(this.selectedLocation.LocationId == undefined) {
      this.toastr.error("Please select location!");
    }else if(this.productlist.filter(p => p.prodID > 0).length == 0)
    {
      this.toastr.error("please add alteast one item!");
    }else{
      return true;
    }
    return false;
  }

  saveInvoice()
  {
    if(this.validateFields())
    {
      if(this.SelectedType[0].name == "Cash" && this.isMultiPayment){
        this.url ="/Invoices/SaleInvoices";
        this.paymentMethodVisiblity = true;
      }else{
        this.SaveData('/Invoices/SaleInvoices');
      }
    }
  }

  saveInvoiceAndCreateService()
  {
    if(this.validateFields())
      {
      if(this.SelectedType[0].name == "Cash" && this.isMultiPayment){
        this.url ="/Invoices/AddNewServiceInvoice";
        this.paymentMethodVisiblity = true;
      }else{
        this.SaveData('/Invoices/AddNewServiceInvoice');
      }
    }
  }



  async SaveData(url :any){
    try {
      console.log(this.productlist);
      this.invoice = this.invoicesService.createInvoice(
        this.invoiceID,
        this.invoiceDetailID,
        this.fiscalYear,
        this.voucherNo,
        this.SelectedType,
        this.txTypeID,
        this.selectedCustomerName.cstID,
        this.selectedLocation,
        this.productlist,
        this.totalGross,
        this.totalDiscount,
        this.totalTax,
        this.totalRebate,
        this.totalExtraTax,
        this.totalAdvanceExtraTax,
        this.totalExtraDiscount,
        this.totalNetPayable,
        this.taxesList,
        null
      );
      console.log(this.invoice);
      const result = await lastValueFrom(this.invoicesService.SaveInvoice(this.invoice));
      console.log(result);
      this.toastr.success("Sale has been successfully Created!");
      this.router.navigateByUrl(url);
    } catch (result) {
      this.toastr.error(result.error);
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
        if(this.EditVoucherNo != undefined && this.productlist[index].prodBCID != undefined)
        {
          this.RemoveItemGLID1 = [
            {voucherNo:this.productlist[index].prodBCID,
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
        // this.calculateTotalAmount();
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
          this.gl[index].acctNo = this.SelectedCreditCard.acctNo;
          this.gl[index].relCOAID = 141;
          this.gl[index].creditSum =  parseFloat(this.creditCardAmount==null?0:this.creditCardAmount);
        }
        if(this.SelectedBank != undefined)
        {
          this.gl.push(this.createNewGLList());
          index = this.gl.length-1;
          this.gl[index].COAID = this.SelectedBank.COAID;
          this.gl[index].acctNo = this.SelectedBank.acctNo;
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

  async RenderEditItem()
  {
    const invoiceData = await lastValueFrom(this.invoicesService.GetInvoice(this.EditVoucherNo));

    this.invoiceID = invoiceData.invoiceID;
    this.invoiceDetailID = invoiceData.invoiceDetailID;
    this.fiscalYear = invoiceData.fiscalYear;
    this.voucherNo = invoiceData.invoiceVoucherNo;
    this.selectedCustomerName = {cstID:invoiceData.CustomerOrVendorID,cstName:invoiceData.customerOrVendorName};
    this.totalGross = invoiceData.grossTotal;
    this.totalDiscount = invoiceData.totalDiscount;
    this.totalTax = invoiceData.totalTax;
    this.totalRebate = invoiceData.totalRebate;
    this.totalExtraTax = invoiceData.totalExtraTax;
    this.totalAdvanceExtraTax = invoiceData.totalAdvanceExtraTax;
    this.totalExtraDiscount = invoiceData.totalExtraDiscount;
    this.totalNetPayable = invoiceData.netTotal;

    const seenProdBCIDs = new Set<number>();

    this.productlist = await new Promise(resolve => {
      const filteredProducts = invoiceData.Products.filter(product => {
          if (!seenProdBCIDs.has(product.prodBCID)) {
              seenProdBCIDs.add(product.prodBCID);
              return true;
          }
          return false;
      });
      resolve(filteredProducts);
    });

    console.log(this.productlist);

    for (let i = 0; i < this.productlist.length; i++) {
      this.selectedProductList = this.products.filter(f => f.prodBCID == this.productlist[i].prodBCID);

      this.productlist[i].prodName = {prodName:this.selectedProductList[0].prodName};
      this.productlist[i].prodCode = this.selectedProductList[0].prodCode;
      this.productlist[i].barCode = this.selectedProductList[0].barCode;
      this.productlist[i].purchRate =this.selectedProductList[0].purchRate;
      this.productlist[i].categoryName =this.selectedProductList[0].categoryName;
      this.productlist[i].depName =this.selectedProductList[0].depName;
      this.productlist[i].prodManuName =this.selectedProductList[0].prodManuName;
      this.productlist[i].prodGrpName =this.selectedProductList[0].prodGrpName;

      if(invoiceData.Products[i].expiry)
      {
        this.productlist[i].expiryDate = new Date(invoiceData.Products[i].expiry);
      }
      if(invoiceData.Products[i].ProductTaxes.length > 0){
        this.productlist[i].taxID= invoiceData.Products[i].ProductTaxes[0].taxDetailID || 0,
        this.productlist[i].taxPercent= invoiceData.Products[i].ProductTaxes[0].taxPercent || 0,
        this.productlist[i].taxAmount= invoiceData.Products[i].ProductTaxes[0].taxAmount || 0,
        this.productlist[i].advanceTaxID= invoiceData.Products[i].ProductTaxes[1].taxDetailID || 0,
        this.productlist[i].advanceTaxPercent= invoiceData.Products[i].ProductTaxes[1].taxPercent || 0,
        this.productlist[i].advanceTaxAmount= invoiceData.Products[i].ProductTaxes[1].taxAmount || 0,
        this.productlist[i].extraAdvanceTaxID= invoiceData.Products[i].ProductTaxes[2].taxDetailID || 0,
        this.productlist[i].extraAdvanceTaxPercent= invoiceData.Products[i].ProductTaxes[2].taxPercent || 0,
        this.productlist[i].extraAdvanceTaxAmount= invoiceData.Products[i].ProductTaxes[2].taxAmount || 0
      }
      this.Itemcalculation(i)
    }
  }
}

