import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem,ConfirmationService,MessageService, ConfirmEventType } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { Dropdown } from 'primeng/dropdown';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { PrimeNGConfig  } from "primeng/api";
import { interval } from 'rxjs';
import { AutoComplete } from 'primeng/autocomplete';
import { getCurrencySymbol } from '@angular/common';
import { COA } from 'src/app/Administration/Models/COA';
import { type, Gl } from 'src/app/Invoices/Models/gl';
import { InvoicesService } from 'src/app/Invoices/Services/invoices.service';
import { InvoiceView } from 'src/app/Invoices/Models/invoice-view';
import { Cities } from 'src/app/Manage/Models/cities';
import { Products } from 'src/app/Manage/Models/products';
import { CitiesService } from 'src/app/Manage/Services/cities.service';
import { CustomersService } from 'src/app/Manage/Services/customers.service';
import { ProductsService } from 'src/app/Manage/Services/products.service';
import { Customer } from 'src/app/Manage/Models/customer';
import { GenericService } from 'src/app/Shared/Services/generic.service';
import { JournalVoucher } from '../../Models/journal-voucher';

@Component({
  selector: 'app-add-new-journal-voucher',
  templateUrl: './add-new-journal-voucher.component.html',
  styleUrls: ['./add-new-journal-voucher.component.css']
})
export class AddNewJournalVoucherComponent implements OnInit{

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
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
  }
  type :any[] = [ {
    name:'Cash'
  },
  {
    name:'Bank'
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
  customers: Customer[] = [];
  customerList: Customer[] = [];
  gl: Gl[] = [];
  gl1: Gl[] = [];
  SelectedProduct:any;
  SelectedBank:any;
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
  voucherList : JournalVoucher[] = [];
  TotalBalance =0;
  TotalPaid =0;
  TotalRemaining =0;
  glComments :any;
  CurrencyCode : any;
  CoaAccountList : COA[] = [];
  CoaAccountListDetail : COA[] = [];
  FilterCoaAccountList : COA[] = [];
  CoaAccountListForChild : COA[] = [];
  FilterCoaAccountListForChild : COA[] = [];
  savebtnDisable : boolean = true;
  isEdit:boolean = false;
  maxDate : any = new Date();
  vouchertype :any[] = ['Journal Voucher','Expense Voucher'];
  selectedVoucherType : any;
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

  ngOnInit(): void {


    this.route.params.subscribe(params1 => {
      this.EditVoucherNo = params1['id'];

    });

    this.genericService.GetAllCoaofLevel2().subscribe({
      next: (CoaAccountList) => {
        this.CoaAccountList = CoaAccountList;
        this.FilterCoaAccountList = this.CoaAccountList;
      }
    });

    this.genericService.getAllBanks().subscribe({
      next: (BankList) => {
        this.BankList = (BankList as { [key: string]: any })["enttityDataSource"];
      }
    });

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
        //this.selectedCustomerId = this.customers.find(x=>x.cstName == "WALK IN")?.cstID;
        //this.selectedCustomerName = this.customers.find(x=>x.cstName == "WALK IN")?.cstName;
        //this.selectedCustomerName = {cstID:this.selectedCustomerId,cstName:this.selectedCustomerName};
      },
      error: (response) => {
        // console.log(response);
      },
    });
    this.voucherList = [this.CreateNewRow()];

    this.SelectedType[0] = { name: this.type[0].name };

    this.primengConfig.ripple = true;
      if(this.EditVoucherNo != undefined)
      {
        this.showPleaseWait = true;
        this.isEdit = true;
          this.invoicesService.getJournalVoucherDetail(this.EditVoucherNo).subscribe(invoices => {
          let i = -1;
          this.voucherList = invoices;
          this.voucherList.push(this.CreateNewRow());
          this.cdr.detectChanges();
            this.voucherList.forEach(element => {
              i++;
              element.parentlist = {COAID: element.parentCOAID, acctName : element.parentAccountName}
              element.childlist = {COAID: element.COAID, acctName : element.ChildAccountName}
              this.CalcaluteTotal(i);
            });
            this.glComments = invoices[0].glComments;
            const formattedDate=new Date(invoices[0].dtTx);
            this.selectedDate =formattedDate;
            this.activeAllModule(this.voucherList.length);
            // this.addRow(this.voucherList.length-1);
            this.cdr.detectChanges();
            this.showPleaseWait = false;
            // this.selectedCustomerName ={cstID: invoices[0].cstID, cstName: invoices[0].cstName};
          // const formattedDate=new Date(invoices[0].dtTx);
          // this.selectedDate =formattedDate;
          // this.glComments = invoices[0].glComments;
          // if(invoices[0].relCOAID == 80)
          // {
          //   this.SelectedType[0] = {name:"Cash"};
          // }
          // else{
          //   this.SelectedType[0] = {name:"Bank"};
          //   this.BankVisible = true;
          //   this.genericService.getAllBanks().subscribe({
          //     next: (BankList) => {
          //       this.BankList = BankList;
          //       this.SelectedBank = {COAID : invoices[0].relCOAID, acctName: this.BankList.find(x=>x.COAID == invoices[0].relCOAID)?.acctName }
          //     }
          //   });
          // }
          //   this.Amount = 0;
          //   this.TotalBalance =0;
          //   this.TotalPaid =0;
          //   this.TotalRemaining =0;
          //   this.voucherList.forEach(element => {
          //       this.TotalBalance += element.amount;
          //   });

          //   this.ValidateAmount(0);
        });
      }
  }
  getCoaChildList(parentlist:any,rownumber:any)
  {
    if(parentlist != undefined)
    {
      this.rowNmb = rownumber;
      this.voucherList[rownumber].parentCOAID = "";
      this.voucherList[rownumber].childlist = "";
      this.voucherList[rownumber].debit = 0;
      this.voucherList[rownumber].credit = 0;
      this.genericService.GetAllCoaByParentCOAID(parentlist.COAID).subscribe({
        next: (CoaAccountListChild) => {
          this.CoaAccountListForChild = CoaAccountListChild;
          this.FilterCoaAccountListForChild = this.CoaAccountListForChild;
        }
      });
    }
  }

  addRow(row:any)
  {
    this.CalcaluteTotal(row);
    if(this.voucherList[this.voucherList.length-1].parentlist != undefined)
    {
      this.voucherList.push(this.CreateNewRow());
    }
    if(this.voucherList.length == 1)
    {
      this.onEnterTableInput(0,row);
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
      if(index==4)
      {
        this.addRow(rownumber);
        this.cdr.detectChanges();
      }
      index = index + (rownumber*4);
      if (index < this.inputFields.length-1) {
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
    const inputFieldARRAY = this.inputFields.toArray();
    const inputField = inputFieldARRAY[index].el.nativeElement.querySelector('input');
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

  CancelInvoice()
  {
        this.savebtnDisable = true;
        this.selectedCustomerName = undefined;
        this.SelectedType[0] = {name:"Cash"};
        this.SelectedBank = undefined;
        this.TotalBalance = 0;
        this.TotalRemaining = 0;
        this.TotalPaid = 0;
        this.glComments = "";
        this.BankVisible = false;
        let today = new Date();
        this.selectedDate = today;
        this.rowNmb = 0;
        if(this.voucherList != undefined)
        {
          this.voucherList.splice(1,this.voucherList.length);
        }
        this.voucherList[0].childlist = "";
        this.voucherList[0].parentlist = "";
        this.voucherList[0].COAID = "";
        this.voucherList[0].parentCOAID = "";
        this.voucherList[0].credit = 0;
        this.voucherList[0].debit = 0;
        this.onEnterComplex(0);
  }

  onFocus(autoComplete:AutoComplete,event:any) {
    autoComplete.show();
  }

  // Close the autocomplete dropdown when the input is blurred
  onBlur(autoComplete:AutoComplete) {
    autoComplete.hide();
  }


  saveInvoice()
  {
    if(this.voucherList.length < 1 ||  this.TotalRemaining != 0) {
      this.toastr.error("Please fill the empty blanks!");
      this.onEnterComplex(0);
    }
    else
    {
      this.voucherList = this.voucherList.filter(x => x.parentlist !== undefined && x.parentlist.COAID != undefined);

      this.voucherList.forEach(element => {
        element.COAID = element.childlist.COAID;
        element.parentCOAID = element.parentlist.COAID;
        element.parentAccountName = "";
        element.ChildAccountName = "";
      });
        this.voucherList[0].dtTx = this.selectedDate.toLocaleString();
        this.voucherList[0].glComments = this.glComments;
        this.voucherList[0].comID = localStorage.getItem('comID');
        this.savebtnDisable = true;
        this.invoicesService.saveJournalVoucher(this.voucherList).subscribe({
          next: (Gl) => {
            this.toastr.success("Journal voucher has been successfully created!");
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
    if(this.voucherList.length ==1) {
      this.toastr.error("Can't delete the row when there is only one row", 'Warning');
        return false;
    } else {
      // if(this.EditVoucherNo != undefined)
      // {
      //   this.RemoveItemGLID1 = [
      //     {voucherNo:this.productlist[index].GLID,
      //     dtTx:undefined,
      //     cstName:undefined,
      //     amount:undefined,
      //     prodID: this.productlist[index].prodID,
      //     enterAmount : undefined,
      //     cstID: undefined,
      //     COAID : undefined,
      //     glComments : undefined
      //     }
      //   ]
      //   this.RemoveItemGLID2.push(this.RemoveItemGLID1[0]);
      // }
      this.rowNmb = index-1;
      this.voucherList.splice(index, 1);
      this.CalcaluteTotal(index);
        this.toastr.warning('Row deleted successfully', 'Delete row');
        this.focusOnSaveButton();
        return true;
    }
  }

  close()
  {
    this.router.navigateByUrl('/Journal');
  }
  setTime()
  {
    let time = new Date();
    this.selectedDate.setHours(time.getHours());
    this.selectedDate.setMinutes(time.getMinutes())
    this.selectedDate.setSeconds(time.getSeconds())
  }
  focusing()
  {
    // if(this.productlist[this.productlist.length-2].prodName != undefined &&
    //   this.productlist[this.productlist.length-2].qty != undefined &&
    //   this.productlist[this.productlist.length-2].qty != 0
    //   )
    // {
    //     this.cdr.detectChanges();
    //     this.onEnterComplexInternal(this.inputFields.length-3);
    // }
    // else
    // {
    //   this.cdr.detectChanges();
    //   this.onEnterComplexInternal(this.inputFields.length-3);
    // }


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

  filterCoaAccount(event:any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.CoaAccountList.length; i++) {
      let account = this.CoaAccountList[i];
      if (account.acctName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(account);
      }
    }
    this.FilterCoaAccountList = filtered;
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

  typeOnChange()
  {
    if(this.SelectedType[0].name == "Bank")
    {
      this.BankVisible = true;
    }
    else
    {
      this.BankVisible = false;
    }
  }
  CalcaluteTotal(rowNmb:any)
  {
    if(this.voucherList[rowNmb] != undefined)
    {
      if(parseFloat(this.voucherList[rowNmb].debit)>0){
        this.voucherList[rowNmb].credit = 0;
      }
      else if(parseFloat(this.voucherList[rowNmb].credit)>0){
        this.voucherList[rowNmb].debit = 0;
      }
    }

    this.TotalBalance =0;
    this.TotalPaid =0;
    this.TotalRemaining =0;
    this.voucherList.forEach(element => {
      if(element.debit != undefined)
      {
        this.TotalBalance += parseFloat(element.debit);
      }
      if(element.credit != undefined)
      {
        this.TotalPaid +=  parseFloat(element.credit);
      }
    });
    this.TotalRemaining = parseFloat(this.TotalBalance.toString()) - parseFloat(this.TotalPaid.toString());
    if(this.TotalRemaining == 0 && this.TotalBalance > 0 && this.TotalPaid > 0)
    {
      this.savebtnDisable = false;
    }
    else
    {
      this.savebtnDisable = true;
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
    // if(this.voucherList[rownumber].enterAmount > this.voucherList[rownumber].amount  )
    // {
    //   this.toastr.show("Enter Amount Must Be Less than or Equal to Balance Amount");
    //   this.voucherList[rownumber].enterAmount = 0;
    // }
    // this.TotalPaid =0;
    // this.voucherList.forEach(element => {
    //   this.TotalPaid += parseInt(element.enterAmount);
    // });
    // this.TotalRemaining = this.TotalBalance - this.TotalPaid;
  }

  SetAmountToEnterAmount()
  {

    // if(this.Amount > 0)
    // {
    //   let sum =0;
    //   let unusedSum =this.Amount;
    //   this.voucherList.forEach(element => {
    //     sum += element.credit;
    //   });
    //   if(this.Amount > sum  )
    //   {
    //     this.toastr.error("Please Write Amount Must Be Less than or Equal to Sum of Balance Amount");
    //     this.Amount = 0;
    //   }
    //   else
    //   {
    //     this.onEnterTableInput(-1,this.voucherList.length)
    //     this.TotalPaid = unusedSum;
    //     this.TotalRemaining = this.TotalBalance - this.TotalPaid;
    //     this.voucherList.forEach(elem => {
    //       if(elem.credit >= unusedSum)
    //       {
    //         elem.enterAmount = unusedSum;
    //         unusedSum = 0;
    //       }
    //       else
    //       {
    //         elem.enterAmount = elem.amount;
    //         unusedSum = unusedSum - elem.amount;
    //       }
    //     });
    //     this.Amount = 0;
    //   }
    // }
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

}


