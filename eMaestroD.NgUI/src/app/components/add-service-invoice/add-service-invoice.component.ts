import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { Subscription, empty } from 'rxjs';
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
import { GenericService } from 'src/app/services/generic.service';
import { LocationService } from 'src/app/services/location.service';
import { JournalVoucher } from 'src/app/models/journal-voucher';
import { ReportSettingService } from 'src/app/services/report-setting.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-add-service-invoice',
  templateUrl: './add-service-invoice.component.html',
  styleUrls: ['./add-service-invoice.component.css'],
  providers:[ConfirmationService,MessageService]
})
export class AddServiceInvoiceComponent implements OnInit{

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
  printtype:any = "A4";
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
  isBankInfo: boolean = false;
  bankDetail: boolean = false;

  CoaAccountListForChild:any;
  FilterCoaAccountListForChild:any;

  voucherList:JournalVoucher[]=[];
  reportSettingItemList :any[]=[];
  isProductCode: boolean = false;
  isArabic: boolean = false;
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

  get displayName(): string {
    // Concatenate the desired fields here
    return this.selectedCustomerName ? this.selectedCustomerName.cstName + ' - ' + this.selectedCustomerName.cstCode : '';
  }

  @ViewChildren('inputField') inputFields: QueryList<any>;
  @ViewChildren('inputField1') inputFields1: QueryList<any>;
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
    private locationService:LocationService,
    private genericService:GenericService,
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
      this.reportSettingItemList = rpt.filter(x=>x.screenName.toLowerCase() == 	"service");
    })

   this.voucherList = [this.CreateNewRow()];
    const today = new Date();
    this.selectedDate = today;

    this.genericService.GetAllCoaofLevel3().subscribe({
        next: (CoaAccountListChild) => {
          this.CoaAccountListForChild = CoaAccountListChild.filter(x=>x.parentAcctType == 'Expense');
          this.FilterCoaAccountListForChild = this.CoaAccountListForChild;
        }
      });

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
      },
    });

    this.locationService.getAllLoc().subscribe({
      next : (loc:any)=>{
        this.locations = loc;
        this.selectedLocation = {locID : this.locations[0].locID, locName : this.locations[0].locName}
        this.LocationList = this.selectedLocation;
      }
    });

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

    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = (products as { [key: string]: any })["enttityDataSource"];
        if(this.products.length >0)
        {
          this.genericService.getServiceTax().subscribe({
            next: (tax) => {
              let taxlist = tax;
              this.TaxName = taxlist[0].TaxName;
              this.TaxValue = taxlist[0].taxValue;

              if(this.EditVoucherNo != undefined)
              {
                this.showPleaseWait = true;
                this.invoicesService.getOneInvoiceDetail(this.EditVoucherNo).subscribe(invoices => {
                  let i = -1;
                  let j = -1;
                  let k = -1;
                  let locName = this.locations.find(x=>x.locID == invoices[0].locID)?.locName;
                  this.selectedLocation = {locID : invoices[0].locID, locName: locName };
                  this.selectedCustomerName ={cstID: invoices[0].cstID, cstName: invoices[0].cstName};
                  invoices.forEach((elem,index) => {
                    if(elem.COAID == 40 )
                    {
                      this.SelectedType[0] = {name:"Credit"};
                    }
                    else if(elem.COAID == 141 && elem.txTypeID == 11)
                    {
                      i++;
                      this.productlist[i].GLID  =elem.GLID;
                      this.productlist[i].TxID  =elem.txID;
                      this.productlist[i].prodID  =elem.prodID;
                      this.productlist[i].prodCode  =elem.prodCode;
                      this.productlist[i].prodName ={prodName:elem.prodName};
                      this.productlist[i].sellRate  =elem.unitPrice;
                      this.productlist[i].qty  =elem.qty;
                      this.productlist[i].amount  =elem.creditSum;
                      this.productlist[i].crtDate = elem.crtDate;
                      this.SubTotal += elem.creditSum;
                      //this.TotalDiscount += elem.discountSum;

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
          });
          this.products = this.products.filter(x=>x.descr == "Service");
          this.Filterproductlist = this.products;
        }
      },
      error: (response) => {
      },
    });



  }

  ngAfterViewInit() {
  }


  onEnterComplex(index: number) {
    if (index < this.inputFields.length - 1) {
      this.focusOnComplexInput(index + 1);
    }
  }

  OnEnterForExpense(index: number, rownumber:number) {
    index = index + (rownumber*3);
    if (index < this.inputFields1.length - 1) {
      this.focusOnExpenseInput(index + 1);
    }
  }
  focusOnExpenseInput(index: number) {
    const inputFieldARRAY = this.inputFields1.toArray();
    const inputField = inputFieldARRAY[index].el.nativeElement.querySelector('input');
    inputField.focus();
    inputField.select();
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

    this.invoicesService.getInvoiceDetailByCustomer(this.selectedCustomerName.cstID,this.productlist[0].prodID).subscribe({
      next: (invoice) => {
        if(invoice != null)
        {
          this.invoicelist[0] = invoice;
          let date = this.invoicelist[0].dtTx.split('T');
          this.invoicelist[0].dtTx = date[0];
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
          this.onEnterComplexInternal(this.inputFields.length-2);
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
          this.productlist[index].sellRate += this.selectedProductList[0].sellRate;
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

            this.productlist[i].discount = 0;
            this.Itemcalculation(i);
              // let el: HTMLElement = this.newRowButton.nativeElement;
              // el.click();
              // this.cdr.detectChanges();
              // this.onEnterComplexInternal(this.inputFields.length-2);
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
      } else{
        this.productlist[i].prodID = ""
        this.productlist[i].prodName = ""
        this.productlist[i].prodCode = "";
        this.productlist[i].unitQty = "";
        this.productlist[i].qty = "";
        this.productlist[i].qtyBal = "";
        this.productlist[i].sellRate = "";
        this.productlist[i].discount = "";
      }

    }
  };


  Itemcalculation(i: any) {

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
      this.router.navigateByUrl('/ServiceInvoices')
    }
    else
    {
      // this.selectedCustomerName = undefined;
      this.TotalDiscount = 0;
      let today = new Date();
      this.selectedDate = today;
      this.rowNmb = 0;
      this.comment = "";
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
    }

  }
  onCodeChange(newObj:any, i:number)
  {
    //if(this.ProductOnChange(i))
    if(newObj.length > 0)
    {
      if(newObj != '' && newObj != undefined && typeof(newObj) != 'string')
      {
        this.rowNmb = i;
        this.selectedProductList = this.products.filter(f => f.prodCode == newObj);
        this.filteredProduct = this.productlist.filter(f => f.prodCode == newObj);
        if(this.filteredProduct.length > 1)
        {
          this.productlist[i].prodName = "";
          this.productlist[i].prodCode = "";
          let index = this.productlist.findIndex(f => f.prodCode == newObj);
          this.productlist[index].qty = parseFloat(this.productlist[index].qty)+1;;
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
            this.productlist[i].prodName = {prodName:this.selectedProductList[0].prodName};
            this.productlist[i].prodCode = this.selectedProductList[0].prodCode;
            this.productlist[i].unitQty = this.selectedProductList[0].unitQty;
            this.productlist[i].qty = 1;
            this.productlist[i].sellRate = this.selectedProductList[0].sellRate;
            this.productlist[i].discount = 0;
            this.Itemcalculation(i);
            let el: HTMLElement = this.newRowButton.nativeElement;
              el.click();
              this.cdr.detectChanges();
              this.onEnterComplexInternal(this.inputFields.length-2);
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

  addNewRow(list:any,ri:any)
  {
    this.Filterproductlist = this.products;
    if(list.prodID != '' && list.prodID != undefined){
      let el: HTMLElement = this.newRowButton.nativeElement;
      el.click();
      this.cdr.detectChanges();
    }
    else{
      this.onEnterTableInput(0,ri);
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
        if(this.productlist[i].sellRate == 0)
        {
          this.savebtnDisable = false;
          this.toastr.error("Amount must be greater than 0");
          return;
        }
        this.gl.push(this.createNewGLList());
        this.gl[i].GLID = this.productlist[i].GLID;
        this.gl[i].txID = this.productlist[i].TxID;
        this.gl[i].txTypeID = 11;
        this.gl[i].voucherNo = this.EditVoucherNo;
        this.gl[i].type = this.SelectedType[0].name;
        this.gl[i].COAID = 141;
        this.gl[i].cstID = this.selectedCustomerName.cstID;
        this.gl[i].isDeposited = false;
        this.gl[i].isVoided = false;
        this.gl[i].isCleared = false;
        this.gl[i].isPaid = false;
        this.gl[i].creditSum =  parseFloat(this.SubTotal);
        this.gl[i].discountSum = parseFloat(this.TotalDiscount);
        this.gl[i].taxSum = parseFloat(this.TotalTax);
        this.gl[i].paidSum = 0;
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
        this.gl[i].purchRate = 0;
        this.gl[i].taxName = this.TaxName;
        this.gl[i].locID = this.selectedLocation.locID;
        this.gl[i].comID = localStorage.getItem('comID');
      }
        this.invoicesService.saveServiceInvoice(this.gl).subscribe({
          next: (Gl) => {
            if(this.EditVoucherNo != undefined)
            {
            this.toastr.success("Service has been successfully updated!");
              if(this.RemoveItemGLID2.length > 0)
              {
                this.invoicesService.deleteInvoiceRow(this.RemoveItemGLID2).subscribe({
                  next: (invoices) => {
                    this.router.navigateByUrl('/ServiceInvoices')
                  }
                });
              }
              else
              {
                this.router.navigateByUrl('/ServiceInvoices')
              }

            }
            else
            {
            this.toastr.success("Service has been successfully created!");
              this.invoiceNo = Gl[0].voucherNo;
              this.onPrinterClick();
            }
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


  onRowDeleteInit1(product: Products, index: number) {
    if(this.voucherList.length ==1) {
      this.toastr.error("Can't delete the row when there is only one row", 'Warning');
        return false;
    } else {
        this.rowNmb = index-1;
        this.voucherList.splice(index, 1);
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
    this.router.navigateByUrl('/ServiceInvoices');
  }
  focusing()
  {
    this.cdr.detectChanges();
    this.onEnterComplexInternal(this.inputFields.length-2);
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
    this.customersService.getAllCustomers().subscribe({
      next: (customers) => {
        let count = (customers as { [key: string]: any })["enttityDataSource"]
        if(this.customers.length != count.length)
        {
          this.customers = (customers as { [key: string]: any })["enttityDataSource"];
          this.selectedCustomerId = this.customers[this.customers.length-1].cstID;
          this.selectedCustomerName = this.customers[this.customers.length-1].cstName;
          this.selectedCustomerName = {cstID:this.selectedCustomerId,cstName:this.selectedCustomerName};
        }
        },
      error: (response) => {
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
        count = count.filter((x:any)=>x.descr == "Service");
        if(this.products.length != count.length)
        {
          this.products = (products as { [key: string]: any })["enttityDataSource"];
          this.products = this.products.filter(x=>x.descr == "Service");
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
      let cst = this.customers[i];
      if (cst.cstName.toLowerCase().indexOf(query.trim().toLowerCase()) == 0) {
        filtered.push(cst);
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
  filterLocation(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.locations.length; i++) {
      let loc = this.locations[i];
      if (loc.locName.toLowerCase().indexOf(query.trim().toLowerCase()) == 0) {
        filtered.push(loc);
      }
    }
    this.LocationList = filtered;
  }

  ProductOnChange(index:number)
  {
    if(!this.ProductsVisible)
    {
      if(this.productlist[index].prodName == undefined)
      {
        // this.toastr.error("Please Select Product.");
        this.cdr.detectChanges();
        return true;
      }
      else
      {
        if (!this.productlist[index].prodName.prodName) {
          // this.toastr.error("Please Select Product.");
          this.cdr.detectChanges();
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
      if(this.SelectedType[0].name == "Cash")
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

  }

  customerOnChange()
  {
    if(this.SelectedType[0].name != "Cash"){
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

  addRow(row:any)
  {
    if(this.voucherList.length == 1 && this.voucherList[this.voucherList.length-1].childlist == undefined)
    {
      this.OnEnterForExpense(-1,row);
    }
    // this.CalcaluteTotal(row);
    if(this.voucherList[this.voucherList.length-1].childlist != undefined)
    {
      this.voucherList.push(this.CreateNewRow());
      this.cdr.detectChanges();
      row = row + 1;
      this.OnEnterForExpense(-1,row)
    }

  }

  CreateNewRow(){
    return {
      voucherNo:undefined,
      dtTx:undefined,
      debit:0,
      credit:0,
      COAID : undefined,
      parentCOAID : undefined,
      glComments:undefined,
      parentlist:undefined,
      childlist:undefined,
    };
  }

  filterCoaAccountForChild(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.CoaAccountListForChild.length; i++) {
      let account = this.CoaAccountListForChild[i];
      if (account.acctName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(account);
      }
    }
    this.FilterCoaAccountListForChild = filtered;
  }

}

