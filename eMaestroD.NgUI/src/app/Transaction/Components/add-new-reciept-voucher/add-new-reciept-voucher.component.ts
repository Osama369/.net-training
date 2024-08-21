
import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { Subscription, count, lastValueFrom } from 'rxjs';
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
import { AutoComplete } from 'primeng/autocomplete';
import { COA } from 'src/app/Administration/Models/COA';
import { type, Gl } from 'src/app/Invoices/Models/gl';
import { InvoicesService } from 'src/app/Invoices/Services/invoices.service';
import { Cities } from 'src/app/Manage/Models/cities';
import { Products } from 'src/app/Manage/Models/products';
import { CitiesService } from 'src/app/Manage/Services/cities.service';
import { ProductsService } from 'src/app/Manage/Services/products.service';
import { GenericService } from 'src/app/Shared/Services/generic.service';
import { Customer } from 'src/app/Manage/Models/customer';
import { CustomersService } from 'src/app/Manage/Services/customers.service';
import { InvoiceView } from 'src/app/Invoices/Models/invoice-view';


@Component({
  selector: 'app-reciept-voucher',
  templateUrl: './add-new-reciept-voucher.component.html',
  styleUrls: ['./add-new-reciept-voucher.component.css']
})
export class AddNewRecieptVoucherComponent implements OnInit{

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
    name:'Credit Card'
    }
  ];
  BankVisible : boolean = false;
  CreditCardVisible : boolean = false;
  SelectedType : type[] = [];
  filterType :any[] = [];
  products: Products[] = [];
  BankList: COA[] = [];
  CreditCardList: COA[] = [];
  Stock: Products[] = [];
  invoicelist: Gl[] = [];
  cities: Cities[] = [];
  customers: Customer[] = [];
  customerList: Customer[] = [];
  gl: Gl[] = [];
  gl1: Gl[] = [];
  SelectedProduct:any;
  SelectedBank:any;
  SelectedCreditCard:any;
  selectedProductList:any;
  selectedCustomerId:any;
  selectedCustomerName:any;
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
  FilterCreditCardlist: any[];
  clonedProduct: { [s: string]: Products } = {};
  visible: boolean = false;
  Reportvisible: boolean = false;
  voucherNo: String = "";
  CustomersVisible: boolean = false;
  ProductsVisible: boolean = false;
  PrintringVisible: boolean = false;
  rowNmb : any=0;
  eyeOpen : any= false;
  eyeOpenforSoldPrice: any= false;
  ProductDetailShow: any= true;
  CustomerDetailShow: any= true;
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
    private customersService:CustomersService,
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
      error: (response) => {

      },
    });

    this.customersService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customers = (customers as { [key: string]: any })["enttityDataSource"];
        this.customers = this.customers.sort((a:any, b:any) =>  a.cstName.localeCompare(b.cstName));
        this.customerList = this.customers;
        //this.selectedCustomerId = this.customers.find(x=>x.cstName == "WALK IN")?.cstID;
        //this.selectedCustomerName = this.customers.find(x=>x.cstName == "WALK IN")?.cstName;
        //this.selectedCustomerName = {cstID:this.selectedCustomerId,cstName:this.selectedCustomerName};
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
    this.filterType = this.type;

    this.primengConfig.ripple = true;

    console.log(this.BankList);
    console.log(this.CreditCardList);

    if(this.EditVoucherNo != undefined)
    {
      this.showPleaseWait = true;
      this.isEdit = true;
      this.invoicesService.getOneVoucherDetail(this.EditVoucherNo).subscribe(invoices => {
        let i = -1;

        this.selectedCustomerName ={cstID: invoices[0].cstID, cstName: invoices[0].cstName};
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
            this.SelectedCreditCard = {COAID : invoices[0].relCOAID, acctName: this.CreditCardList.find(x=>x.COAID == invoices[0].relCOAID)?.acctName,  acctNo: this.CreditCardList.find(x=>x.COAID == invoices[0].relCOAID)?.acctNo }
          }
           else if(this.BankList.find(x=>x.COAID == invoices[0].relCOAID)){
              this.BankVisible = true;
              this.SelectedType[0] = {name:"Bank"};
              this.SelectedBank = {COAID : invoices[0].relCOAID, acctName: this.BankList.find(x=>x.COAID == invoices[0].relCOAID)?.acctName,  acctNo: this.BankList.find(x=>x.COAID == invoices[0].relCOAID)?.acctNo }
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
        acctNo : defaultBank?.acctNo
      };

      const creditCardData = await lastValueFrom(this.genericService.GetAllCreditCards());
      const creditCardEntityDataSource =(creditCardData as { [key: string]: any })["enttityDataSource"];
      this.CreditCardList = creditCardEntityDataSource;
      this.FilterCreditCardlist = creditCardEntityDataSource;

      const defaultCreditCard = creditCardEntityDataSource.find((x: { isSys: boolean; }) => x.isSys === true);
      this.SelectedCreditCard = {
        COAID: defaultCreditCard?.COAID,
        acctName: defaultCreditCard?.acctName,
        acctNo: defaultCreditCard?.acctNo
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

  getSelectedCustomerName()
  {
    this.selectedCustomerName = this.customers.find(x=>x.cstID == this.selectedCustomerId)?.cstName.toString();

    this.invoicesService.getInvoiceDetailByCustomer(this.selectedCustomerId,this.productlist[0].prodID).subscribe({
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
        this.invoicelist[0].dtTx = undefined;
        this.invoicelist[0].unitPrice = undefined;
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
      if(newObj != undefined)
      {
        this.rowNmb = i;
        this.selectedProductList = this.products.filter(f => f.prodName == newObj.prodName);
        this.filteredProduct = this.productlist.filter(f => f.prodName.prodName == newObj.prodName);
        if(this.filteredProduct.length > 1)
        {
          this.productlist[i].prodName = "";
          let index = this.productlist.findIndex(f => f.prodName.prodName == newObj.prodName);
          this.productlist[index].qty = this.productlist[index].qty+1;
          this.Itemcalculation(index);
          this.onEnterComplexInternal(this.inputFields.length-2);
          this.invoicelist.push(
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
              prodCode:undefined
            });
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
                if(invoice != null)
                {
                  this.invoicelist[i] = invoice;
                    let date = this.invoicelist[i].dtTx.split('T');
                    this.invoicelist[i].dtTx = date[0];
                  //this.invoicelist[i].prodName = this.productlist.find(x=>x.prodID == this.invoicelist[i].prodID)?.prodName.toString();
                  //this.invoicelist[i].cstName = this.customers.find(x=>x.cstID == this.invoicelist[i].cstID)?.cstName.toString();
                }

              },
              error :() => {
                this.invoicelist.push(
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
                    prodCode:undefined

                  });
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
              this.productlist[i].unitQty = 0;
              this.productlist[i].qty = 0;
              this.productlist[i].sellRate = 0;
              this.productlist[i].purchRate = 0;
              this.productlist[i].discount = 0;
            }

        }
      }
    }
  };


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
      this.router.navigateByUrl('/Transactions/Receipt')
    }
    else
    {

    this.selectedCustomerName = undefined;
    this.SelectedType[0] = {name:"Cash"};
    this.SelectedBank = undefined;
    this.SelectedCreditCard = undefined;
    this.TotalBalance = 0;
    this.TotalRemaining = 0;
    this.TotalPaid = 0;
    this.glComments = "";
    this.BankVisible = false;
    this.CreditCardVisible = false;
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

  onCodeChange(newObj:any, i:number)
  {
    //if(this.ProductOnChange(i))
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
            console.log(this.selectedProductList[0].prodName);
            this.productlist[i].prodName = {prodName:this.selectedProductList[0].prodName};
            this.productlist[i].prodCode = this.selectedProductList[0].prodCode;
            this.productlist[i].unitQty = this.selectedProductList[0].unitQty;
            this.productlist[i].qty = 1;
            this.productlist[i].sellRate = this.selectedProductList[0].sellRate;
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
                if(invoice != null)
                {
                  this.invoicelist[i] = invoice;
                    let date = this.invoicelist[i].dtTx.split('T');
                    this.invoicelist[i].dtTx = date[0];
                  //this.invoicelist[i].prodName = this.productlist.find(x=>x.prodID == this.invoicelist[i].prodID)?.prodName.toString();
                  //this.invoicelist[i].cstName = this.customers.find(x=>x.cstID == this.invoicelist[i].cstID)?.cstName.toString();
                }

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
  }

  saveInvoice()
  {

    if(this.selectedDate == undefined) {
      this.toastr.error("Please select date!");
      this.onEnterComplex(-1);
    }
    else if(this.selectedCustomerName == undefined) {
      this.toastr.error("Please Select Customer!");
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
          this.voucherList[0].acctNo = this.SelectedBank.acctNo;
        }
        else if(this.CreditCardVisible)
        {
          this.voucherList[0].COAID = this.SelectedCreditCard.COAID;
          this.voucherList[0].acctNo = this.SelectedCreditCard.acctNo;
        }
        else
        {
          this.voucherList[0].COAID = 80;
        }
        this.voucherList[0].cstID = this.selectedCustomerName.cstID;
        this.voucherList[0].dtTx = this.selectedDate.toLocaleString();
        this.voucherList[0].glComments = this.glComments;
        this.voucherList[0].comID = localStorage.getItem('comID');
        this.invoicesService.saveReceiptVoucher(this.voucherList).subscribe({
          next: (Gl) => {
            this.toastr.success("Receipt voucher has been successfully created!");
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
    this.router.navigateByUrl('/Transactions/Receipt');
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

  customerVisible(event:KeyboardEvent)
  {
    if (event.altKey && event.key === 'c') {
      this.CustomersVisible = true;
    }
  }

  customerVisible1()
  {
    this.CustomersVisible = true;
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
  closeCustomerRegistration()
  {
    this.customersService.getAllCustomers().subscribe({
      next: (customers) => {
        let count = (customers as { [key: string]: any })["enttityDataSource"];
        if(this.customers.length != count.length)
        {
          this.customers = (customers as { [key: string]: any })["enttityDataSource"];
          this.selectedCustomerId = this.customers[this.customers.length-1].cstID;
          this.selectedCustomerName = this.customers[this.customers.length-1].cstName;
          this.selectedCustomerName = {cstID:this.selectedCustomerId,cstName:this.selectedCustomerName};
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

  filterCustomer(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.customers.length; i++) {
      let country = this.customers[i];
      if (country.cstName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
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

  CustomerOnChange()
  {
    this.invoicesService.getInvoicesListByCustomer(0,this.selectedCustomerName.cstID).subscribe({
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
    this.CustomersVisible = false;
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
        this.toastr.error("Please Write Amount Must Be Less than or Equal to Sum of Balance Amount");
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
}


