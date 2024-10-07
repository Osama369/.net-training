import { SharedDataService } from './../../../Shared/Services/shared-data.service';
import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService,MessageService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { Dialog } from 'primeng/dialog';
import { Location } from './../../../Administration/Models/location';
import { LocationService } from 'src/app/Administration/Services/location.service';
import { Cities } from 'src/app/Manage/Models/cities';
import { Products } from 'src/app/Manage/Models/products';
import { VendorService } from 'src/app/Manage/Services/vendor.service';
import { ReportSettingService } from 'src/app/Reports/Services/report-setting.service';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { type, Gl } from '../../Models/gl';
import { InvoicesService } from '../../Services/invoices.service';
import { InvoiceView } from '../../Models/invoice-view';
import { Vendor } from 'src/app/Manage/Models/vendor';
import { Invoice, InvoiceProduct, InvoiceProductTax } from '../../Models/invoice';
import { lastValueFrom } from 'rxjs';
import { ProductViewModel } from 'src/app/Manage/Models/product-view-model';
import { Taxes } from 'src/app/Administration/Models/taxes';
import { GLTxTypes } from '../../Enum/GLTxTypes.enum';

@Component({
  selector: 'app-add-new-purchase-m',
  templateUrl: './add-new-purchase-m.component.html',
  styleUrls: ['./add-new-purchase-m.component.scss'],
  providers:[ConfirmationService,MessageService]
})

export class AddNewPurchaseMComponent implements OnInit{
  constructor(
    private router: Router,
    private vendorService:VendorService,
    private invoicesService:InvoicesService,
    private toastr: ToastrService,
    private el: ElementRef,
    private confirmationService :ConfirmationService,
    private messageService :MessageService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private reportSettingService : ReportSettingService,
    private authService : AuthService,
    private sharedDataService : SharedDataService
  ) { }

  isShowDetails : boolean = false;

  totalGross: number;
  totalDiscount: number;
  totalNetPayable: number;
  totalRebate: number;
  totalTax: number;
  totalExtraTax: number;
  totalExtraDiscount: number;
  totalAdvanceExtraTax: number;

  type :any[] = [ {
    name:'Cash'
  },
  {
    name:'Credit'
   }
  ];

  invoice : Invoice;
  SelectedType : type[] = [];
  filterType :any[] = [];
  products: ProductViewModel[] = [];
  customers: Vendor[] = [];
  customerList: Vendor[] = [];

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
  Reportvisible: boolean = false;
  voucherNo: string = "";
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

  taxesList : Taxes[];
  maxDate : any = new Date();
  disable: boolean = false;
  reportSettingItemList :any[]=[];

  isProductCode: boolean = false;
  isArabic: boolean = false;
  txTypeID : any = GLTxTypes.PurchaseInvoice;

  vatInclude : boolean = true;
  showPleaseWait: boolean = false;

  PONumber : any;

  GRNInvoiceList : Invoice[] = [];

  selectedVoucherNo : any;

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


  async ngOnInit(): Promise<void> {
    const today = new Date();
    this.selectedDate = today;



    this.sharedDataService.getProducts$().subscribe(products => {
      this.products = products;
      this.Filterproductlist = this.products;
    });


   this.sharedDataService.getReportSettings$().subscribe(rpt=>{
    this.reportSettingItemList = rpt.filter(x=>x.screenName.toLowerCase() == 	"purchase");
    })

    this.sharedDataService.getVendors$().subscribe({
      next: (customers) => {
        this.customers = (customers as { [key: string]: any })["enttityDataSource"];
        this.customers = this.customers.sort((a, b) =>  a.vendName.localeCompare(b.vendName));
        this.customerList = this.customers;
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



    this.SelectedType[0] = { name: this.type[0].name };
    this.filterType = this.type;

    this.route.params.subscribe(params1 => {
      this.EditVoucherNo = params1['id'];
      if(this.EditVoucherNo != undefined)
      {
        this.selectedVoucherNo = this.EditVoucherNo;
        this.GRNInvoiceList.unshift({ invoiceVoucherNo : this.selectedVoucherNo});
        this.InvoiceOnChange();
      }
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

      index = index + (rownumber*27);
      if (index < this.inputFieldsTable.length-1) {
        this.focusOnTableInput(index + 1);
      }
      else
      {
        if(this.productlist[rownumber].prodName != undefined &&
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
  showInvoiceDetails()
  {
    this.invoiceDetailShow = !this.invoiceDetailShow;
  }
  ChangeIsShowDetail(){
    this.isShowDetails = !this.isShowDetails;
  }
  activeAllModule(i:number)
  {
    this.rowNmb = i;
  }
  onChange(newObj:any, i:number, autComplete:any)
  {
    autComplete.hide();
    console.log(newObj)
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
          // this.productlist[index].qtyBal = parseFloat(this.productlist[index].qtyBal)+1;
          this.Itemcalculation(index);
          this.onEnterComplexInternal(this.inputFields.length-3);
        }
        else
        {
            if(this.selectedProductList.length >0)
            {
              console.log(this.selectedProductList);
            this.productlist[i].prodID = this.selectedProductList[0].prodID;
            this.productlist[i].prodBCID = this.selectedProductList[0].prodBCID;
            this.productlist[i].prodCode = this.selectedProductList[0].prodCode;
            this.productlist[i].barCode = this.selectedProductList[0].barCode;
            this.productlist[i].unitQty = this.selectedProductList[0].unitQty;
            this.productlist[i].qty = 1;
            this.productlist[i].qtyBal = 1;
            this.productlist[i].purchRate = this.selectedProductList[0].costPrice;
            this.productlist[i].discount = 0;

            this.productlist[i].categoryName =this.selectedProductList[0].categoryName;
            this.productlist[i].depName =this.selectedProductList[0].depName;
            this.productlist[i].prodManuName =this.selectedProductList[0].prodManuName;
            this.productlist[i].prodGrpName =this.selectedProductList[0].prodGrpName;
            this.productlist[i].taxPercent =this.taxesList[0].taxValue;

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
      }
    }
  };

  Itemcalculation(rowIndex: number) {
    let rowData = this.productlist[rowIndex];

    console.log(rowData);

    // Ensure values are not null, assign default value (0) if null
    rowData.qty = rowData.qty || 0;
    rowData.bonusQty = rowData.bonusQty || 0;
    rowData.purchRate = rowData.purchRate || 0;
    rowData.discount = rowData.discount || 0;
    rowData.discountAmount = rowData.discountAmount || 0;
    rowData.extraDiscountPercent = rowData.extraDiscountPercent || 0;
    rowData.extraDiscountAmount = rowData.extraDiscountAmount || 0;
    rowData.taxPercent = rowData.taxPercent || 0;
    rowData.taxAmount = rowData.taxAmount || 0;
    rowData.advanceTaxPercent = rowData.advanceTaxPercent || 0;
    rowData.advanceTaxAmount = rowData.advanceTaxAmount || 0;
    rowData.extraAdvanceTaxAmount = rowData.extraAdvanceTaxAmount || 0;
    rowData.extraAdvanceTaxPercent = rowData.extraAdvanceTaxPercent || 0;
    rowData.rebatePercent = rowData.rebatePercent || 0;
    rowData.rebateAmount = rowData.rebateAmount || 0;

    // Calculate gross value based on quantity and purchase rate
    rowData.grossValue = rowData.qty * rowData.purchRate;

    console.log(rowData.grossValue);
    // Determine if discount is based on percentage or amount
    if (rowData.discount > 0) {
      // Calculate discount percentage from amount
      rowData.discountAmount = (rowData.grossValue * rowData.discount) / 100;
      } else {
        // Calculate discount amount from percentage
      rowData.discount = (rowData.discountAmount / rowData.grossValue) * 100;
    }

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
    console.log(rowData.netRate);
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



  CancelInvoice()
  {
    if(this.EditVoucherNo != undefined)
    {
      this.router.navigateByUrl('/Invoices/Purchase')
    }
    else
    {
      // this.selectedCustomerName = undefined;
      this.TotalDiscount = 0;
      let today = new Date();
      this.selectedDate = today;
      this.rowNmb = 0;
      this.productlist = [];
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


  validateFields()
  {
    if(this.selectedDate == undefined) {
      this.toastr.error("Please select date!");
    }
    else if(!this.SelectedType[0].name) {
      this.toastr.error("Please select type!");
    }
    else if(this.selectedCustomerName == undefined) {
      this.toastr.error("Please select supplier!");
    }
    else if(this.selectedCustomerName.vendID == undefined) {
      this.toastr.error("Please select supplier!");
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

  async saveInvoice()
  {
    console.log(this.productlist);
    if(this.validateFields())
    {
      try {
          this.invoice = this.invoicesService.createInvoice(
            this.voucherNo,
            this.SelectedType,
            this.txTypeID,
            this.selectedCustomerName.vendID,
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
            this.selectedVoucherNo
          );
          console.log(this.invoice);
          const result = await lastValueFrom(this.invoicesService.SaveInvoice(this.invoice));
          console.log(result);
          this.toastr.success("Purchase has been successfully Created!");
          this.router.navigateByUrl('/Invoices/Purchase')
        } catch (result) {
          this.toastr.error(result.error);
      }
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

  onRowDeleteInit(product: Products, index: number) {
    if(this.productlist.length ==1) {
      this.toastr.error("Can't delete the row when there is only one row", 'Warning');
        return false;
    } else {
        if(this.EditVoucherNo != undefined && this.txTypeID != 3 )
        {
          if(this.productlist[index].prodBCID != undefined)
          {
            if(product.qty != product.qtyBal)
            {
              this.toastr.error("Can't delete the row Because Sale already Created Against this Item.", 'Warning');
              return false;
            }
              this.RemoveItemGLID1 = [
                {voucherNo:this.productlist[index].prodCode,
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
      if (loc.LocationName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(loc);
      }
    }
    this.LocationList = filtered;
  }

  close()
  {
    this.router.navigateByUrl('/Invoices/Purchase');
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
        if(this.productlist[i].prodID != undefined && this.productlist[i].prodID != 0)
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
    // this.productService.getAllProducts().subscribe({
    //   next: (products) => {
    //     let count = (products as { [key: string]: any })["enttityDataSource"];
    //     count = count.filter((x:any)=>x.descr == "Goods");
    //     if(this.products.length != count.length)
    //     {
    //       this.products = (products as { [key: string]: any })["enttityDataSource"];
    //       this.products = this.products.filter((x:any)=>x.descr == "Goods");
    //       this.Filterproductlist = this.products;
    //       this.productlist[this.productlist.length-1].prodID = this.products[this.products.length-1].prodID;
    //       this.productlist[this.productlist.length-1].prodCode = this.products[this.products.length-1].prodCode;
    //       this.productlist[this.productlist.length-1].prodName = this.products[this.products.length-1].prodName;
    //       this.productlist[this.productlist.length-1].purchRate = this.products[this.products.length-1].purchRate;
    //       this.productlist[this.productlist.length-1].qty = 1;
    //       this.productlist[this.productlist.length-1].sellRate = this.products[this.products.length-1].sellRate;
    //       this.productlist[this.productlist.length-1].prodName = {prodName : this.productlist[this.productlist.length-1].prodName, prodID : this.productlist[this.productlist.length-1].prodID};
    //     }
    //     this.onEnterComplexInternal(this.inputFields.length-3);
    //   },
    //   error: (response) => {
    //     this.onEnterComplexInternal(this.inputFields.length-3);
    //   },
    // });
  }

  filterCustomer(event:any) {
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
    const query = event.query.toLowerCase().trim();
    this.Filterproductlist = this.products
        .filter(product => product.prodName.toLowerCase().includes(query))
        .slice(0, 20);
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

  ProductOnChange(index:number)
  {
    if(!this.ProductsVisible)
    {
      if(this.productlist[index].prodName == undefined)
      {
        this.cdr.detectChanges();
        this.productlist[index].qty = 0;
        return true;
      }
      else
      {
        if (!this.productlist[index].prodName) {
          this.cdr.detectChanges();
          this.productlist[index].qty = 0;
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
  }


  onCodeChange(newObj:any, i:number, event:any)
  {
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
        this.productlist[index].qtyBal = this.productlist[index].qtyBal+1;
        this.Itemcalculation(index);
        this.onEnterComplexInternal(this.inputFields.length-3);
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
          this.productlist[i].qtyBal = 1;
          this.productlist[i].purchRate = this.selectedProductList[0].costPrice;
          this.productlist[i].discount = 0;
          this.productlist[i].taxPercent =this.taxesList[0].taxValue;

          this.productlist[i].categoryName =this.selectedProductList[0].categoryName;
          this.productlist[i].depName =this.selectedProductList[0].depName;
          this.productlist[i].prodManuName =this.selectedProductList[0].prodManuName;
          this.productlist[i].prodGrpName =this.selectedProductList[0].prodGrpName;

          this.Itemcalculation(i);
          let el: HTMLElement = this.newRowButton.nativeElement;
          el.click();
          this.cdr.detectChanges();
          this.onEnterComplexInternal(this.inputFields.length-3);
          }
          else
          {
            // this.productlist[i].prodID = "";
            // this.productlist[i].prodName = "";
            // this.productlist[i].unitQty = "";
            // this.productlist[i].qty = "";
            // this.productlist[i].qtyBal = "";
            // this.productlist[i].sellRate = "";
            // this.productlist[i].purchRate = "";
            // this.productlist[i].discount = "";
            // this.productlist[i].amount = "";
            this.Itemcalculation(i);

          }

        }
      }
      else
      {
        // this.productlist[i].prodID = "";
        // this.productlist[i].prodName = "";
        // this.productlist[i].unitQty = "";
        // this.productlist[i].qty = 1;
        // this.productlist[i].qtyBal = "";
        // this.productlist[i].sellRate = "";
        // this.productlist[i].purchRate = "";
        // this.productlist[i].discount = "";
        // this.productlist[i].amount = "";
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

 handleChildData() {
  this.ProductsVisible = false;
  this.VendorVisible = false;
}


  VendorOnChange()
  {
    if(this.selectedCustomerName == undefined){
      this.toastr.error("Please select supplier!");
      this.onEnterComplex(0);
    }
    else{
      this.invoicesService.GetInvoices(GLTxTypes.GoodsReceivedNote,this.selectedCustomerName.vendID).subscribe({
        next:(result)=>{
          this.GRNInvoiceList = result.filter(x=>x.convertedInvoiceNo == null);
          console.log(this.GRNInvoiceList);
          this.GRNInvoiceList.unshift({ invoiceVoucherNo : "Select Invoice No"});
        },
        error:(responce)=>{
          this.GRNInvoiceList = [];
        }
      })
    }
  }

  async InvoiceOnChange()
  {
    if(this.selectedVoucherNo == undefined || this.selectedVoucherNo == "Select Invoice No") {
      this.toastr.error("Please select Invoice!");
      this.onEnterComplex(2);
      this.productlist = [];
      return;
    }

    try {
      const invoiceData = await lastValueFrom(this.invoicesService.GetInvoice(this.selectedVoucherNo));

      this.productlist = invoiceData.Products;
      this.selectedCustomerName = {vendID:invoiceData.CustomerOrVendorID,vendName:invoiceData.customerOrVendorName};
      this.totalGross = invoiceData.grossTotal;
      this.totalDiscount = invoiceData.totalDiscount;
      this.totalTax = invoiceData.totalTax;
      this.totalRebate = invoiceData.totalRebate;
      this.totalExtraTax = invoiceData.totalExtraTax;
      this.totalAdvanceExtraTax = invoiceData.totalAdvanceExtraTax;
      this.totalExtraDiscount = invoiceData.totalExtraDiscount;
      this.totalNetPayable = invoiceData.netTotal;
      // this.taxesList = invoiceData.taxesList;

      for (let i = 0; i < this.productlist.length; i++) {
        this.selectedProductList = this.products.filter(f => f.prodBCID == this.productlist[i].prodBCID);

        this.productlist[i].prodName = {prodName:this.selectedProductList[0].prodName};
        this.productlist[i].prodCode = this.selectedProductList[0].prodCode;
        this.productlist[i].barCode = this.selectedProductList[0].barCode;

        this.productlist[i].categoryName =this.selectedProductList[0].categoryName;
        this.productlist[i].depName =this.selectedProductList[0].depName;
        this.productlist[i].prodManuName =this.selectedProductList[0].prodManuName;
        this.productlist[i].prodGrpName =this.selectedProductList[0].prodGrpName;
        this.Itemcalculation(i)
      }
    } catch (result) {
      this.toastr.error(result);
    }
  }
}

