import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { Subscription, empty } from 'rxjs';
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
import { Customer } from 'src/app/Manage/Models/customer';

@Component({
  selector: 'app-add-sale-return',
  templateUrl: './add-sale-return.component.html',
  styleUrls: ['./add-sale-return.component.css'],
  providers:[ConfirmationService,MessageService]
})
export class AddSaleReturnComponent implements OnInit{

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    // if (event.altKey && event.key.toLowerCase() === 's') {
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
    private locationService:LocationService,
    private toastr: ToastrService,
    private el: ElementRef,
    private confirmationService :ConfirmationService,
    private messageService :MessageService,
    private cdr: ChangeDetectorRef,
    private primengConfig: PrimeNGConfig,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params1 => {
      this.EditVoucherNo = params1['id'];
   });


    const today = new Date();
    this.selectedDate = today;


    // this.citiesService.getAllCities().subscribe({
    //   next: (cities) => {
    //     this.cities = cities;
    //   },
    //   error: (response) => {
    //     // console.log(response);
    //   },
    // });

    this.customersService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customers = (customers as { [key: string]: any })["enttityDataSource"];
        this.customers = this.customers.sort((a, b) =>  a.cstName.localeCompare(b.cstName));
        this.selectedCustomerId = this.customers.find(x=>x.cstName == "WALK IN")?.cstID;
        this.selectedCustomerName = this.customers.find(x=>x.cstName == "WALK IN")?.cstName;
        this.selectedCustomerName = {cstID:this.selectedCustomerId,cstName:this.selectedCustomerName};
      },
      error: (response) => {
        // console.log(response);
      },
    });

    this.locationService.getAllLoc().subscribe({
      next : (loc:any)=>{
        this.locations = loc;
        this.selectedLocation = {locID : this.locations[0].locID, locName : this.locations[0].locName}
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

    this.primengConfig.ripple = true;

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
                else if(elem.COAID == 137 && elem.txTypeID == 5)
                {
                  i++;
                  this.productlist[i].GLID  =elem.GLID;
                  this.productlist[i].TxID  =elem.txID;
                  this.productlist[i].prodID  =elem.prodID;
                  this.productlist[i].prodCode  =elem.prodCode;
                  this.productlist[i].prodName ={prodName:elem.prodName};
                  this.productlist[i].sellRate  =elem.unitPrice;
                  this.productlist[i].qty  =elem.qty;
                  this.productlist[i].amount  =elem.debitSum;
                  this.productlist[i].crtDate = elem.crtDate;
                  this.productService.getProductStock(this.productlist[i].prodID).subscribe({
                    next: (products) => {
                      this.Stock = products;
                      j++;
                      if(this.Stock.length > 0)
                      {
                        this.productlist[j].qtyBal = this.Stock[0].qty - elem.qty;
                        this.productlist[j].purchRate = this.Stock[0].unitPrice;
                    }
                    else
                    {
                      this.productlist[j].qtyBal = 0 - elem.qty;
                      this.productlist[j].purchRate = 0;
                    }
                    },
                  });
                  this.SubTotal += elem.debitSum;
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
                  this.TotalTax = elem.debitSum;
                }
                });

                this.productlist.splice(this.productlist.length-1,1);
                this.TotalDiscount = invoices.find(x=>x.txID == 0)?.discountSum;
                this.Total = this.SubTotal + this.TotalTax - this.TotalDiscount;
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

  ngAfterViewInit() {

    //this.focusOnInput(0);
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
      index = index + (rownumber*2);
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
          this.onEnterComplexInternal(this.inputFields.length-2);

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
      if(newObj != undefined && newObj != '')
      {
        this.rowNmb = i;
        this.selectedProductList = this.products.filter(f => f.prodName == newObj.prodName);
        this.filteredProduct = this.productlist.filter(f => f.prodName.prodName == newObj.prodName);
        if(this.filteredProduct.length > 1)
        {
          this.productlist[i].prodName = "";
          let index = this.productlist.findIndex(f => f.prodName.prodName == newObj.prodName);
          this.productlist[index].qty = parseFloat(this.productlist[index].qty)+1;;
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
                  this.invoicelist.push(this.createNewGLList());
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
            //this.onEnterTableInput(-1,i)
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
      this.router.navigateByUrl('/Invoices/CreditNote')
    }
    else
    {
      // this.selectedCustomerName = undefined;
      this.TotalDiscount = 0;
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
      this.calculateTotalAmount();
      this.onEnterComplex(0);
      this.savebtnDisable = false;
    }

  }
  onCodeChange(newObj:any, i:number)
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
                  this.invoicelist.push(this.createNewGLList());
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
        this.gl[i].txTypeID = 5;
        this.gl[i].voucherNo = this.EditVoucherNo;
        this.gl[i].type = this.SelectedType[0].name;
        this.gl[i].COAID = 137;
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
        this.gl[i].purchRate = parseFloat(this.productlist[i].purchRate);
        this.gl[i].taxName = this.TaxName;
        this.gl[i].locID = this.selectedLocation.locID;
        this.gl[i].comID = localStorage.getItem('comID');
      }
        this.invoicesService.saveSaleReturn(this.gl).subscribe({
          next: (Gl) => {
            if(this.EditVoucherNo != undefined)
            {
            this.toastr.success("Sale return has been successfully updated!");
              if(this.RemoveItemGLID2.length > 0)
              {
                this.invoicesService.deleteInvoiceRow(this.RemoveItemGLID2).subscribe({
                  next: (invoices) => {
                    this.router.navigateByUrl('/Invoices/CreditNote')
                  }
                });
              }
              else
              {
                this.router.navigateByUrl('/Invoices/CreditNote')
              }

            }
            else
            {
            this.toastr.success("Sale return has been successfully created!");
              //this.serviceUrl = 'https://localhost:44395/reports/saleDelivery1?voucherNo=';
              //this.ssrsFilePath = this.gl[0].voucherNo;
              this.invoiceNo = Gl[0].voucherNo;
              this.PrintringVisible = true;
            }
          },
          error: (response) => {
            this.toastr.error(response.error);
            this.savebtnDisable = false;
            // console.log(response);
          },
        });
    }

  }

  addNewRow(list:any)
  {
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


  closePrintingOption()
  {
    this.PrintringVisible = false;
    this.CancelInvoice();
    this.onEnterComplex(0);
  }

  close()
  {
    this.router.navigateByUrl('/Invoices/CreditNote');
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
        if(this.productlist[i].prodID != undefined)
        {
          let stotal = this.productlist[i].sellRate * this.productlist[i].qty;
          let tTax = parseFloat(((stotal/100)*this.TaxValue).toFixed(2).toString());
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
      this.CustomersVisible = true;
    }

  }

  customerVisible1()
  {
    this.CustomersVisible = true;
  }

  productVisible(event:KeyboardEvent)
  {
    if (event.altKey && event.key.toLowerCase() === 'c') {
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
          this.productlist[this.productlist.length-1].prodCode = this.products[this.products.length-1].prodCode;
          this.productlist[this.productlist.length-1].prodName = this.products[this.products.length-1].prodName;
          this.productlist[this.productlist.length-1].purchRate = this.products[this.products.length-1].purchRate;
          this.productlist[this.productlist.length-1].qty = 1;
          this.productlist[this.productlist.length-1].sellRate = this.products[this.products.length-1].sellRate;
          this.productlist[this.productlist.length-1].prodName = {prodName : this.productlist[this.productlist.length-1].prodName, prodID : this.productlist[this.productlist.length-1].prodID};
          this.productlist[0].taxName = this.products[this.products.length-1].taxName;
          this.productlist[0].tax = this.products[this.products.length-1].tax;
        }
      },
      error: (response) => {
      },
    });
    this.onEnterComplex(this.productlist.length+3);
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

  ProductOnChange(index:number)
  {
    if(!this.ProductsVisible)
    {
      if(this.productlist[index].prodName == undefined)
      {
        // this.toastr.error("Please Select Product.");
        this.cdr.detectChanges();
        // this.onEnterComplex(index+3);
        return false;
      }
      else
      {
        if (!this.productlist[index].prodName.prodName) {
          // this.toastr.error("Please Select Product.");
          this.cdr.detectChanges();
          // this.onEnterComplex(index+3);
            return false;
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


 handleChildData() {
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
}

