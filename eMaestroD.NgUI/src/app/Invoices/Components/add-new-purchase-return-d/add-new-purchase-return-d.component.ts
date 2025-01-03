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
import { ConfigSetting } from 'src/app/Shared/Models/config-setting';

@Component({
  selector: 'app-add-new-purchase-return-d',
  templateUrl: './add-new-purchase-return-d.component.html',
  styleUrls: ['./add-new-purchase-return-d.component.scss'],
  providers:[ConfirmationService,MessageService]
})

export class AddNewPurchaseReturnDComponent implements OnInit{
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
  isShowSideBar : boolean = false;

  totalGross: number;
  totalDiscount: number;
  totalNetPayable: number;
  totalRebate: number;
  totalTax: number;
  totalExtraTax: number;
  totalExtraDiscount: number;
  totalAdvanceExtraTax: number;

  returnTotalAmount: number = 0;

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
  txTypeID : any = GLTxTypes.PurchaseReturn;

  vatInclude : boolean = true;
  showPleaseWait: boolean = false;

  PONumber : any;
  invoiceID : number = 0;
  invoiceDetailID : number = 0;
  fiscalYear : number = 0;

  GRNInvoiceList : Invoice[] = [];

  selectedVoucherNo : any;
  showVendorProductsOnly: boolean = false;
  productsDuplicate: ProductViewModel[] = [];
  isDisabled : boolean = true;

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
      this.products = (products as { [key: string]: any })["enttityDataSource"];
      this.Filterproductlist = this.products;
      this.productsDuplicate = this.products;
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

    this.sharedDataService.getConfigSettings$().subscribe({
      next : (result:ConfigSetting[])=>{
        this.isShowSideBar = result.find(x=>x.key === "Show Side bar on Purchase Return")?.value ?? false;
        this.showVendorProductsOnly = result.find(x=>x.key === "Show Vendor Products Only")?.value ?? false;
        console.log(result);

      }
    })


    this.SelectedType[0] = { name: this.type[1].name };
    this.filterType = this.type;

    this.route.params.subscribe(params1 => {
      this.EditVoucherNo = params1['id'];
      if(this.EditVoucherNo != undefined)
      {
        console.log(this.EditVoucherNo.split("-")[0]);
        this.RenderEditItem();
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
      if(this.productlist[rownumber].prodName == undefined)
      {
        let el: HTMLElement = this.savebtn.nativeElement;
        el.focus();
      }

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
  async onChange(newObj: any, i: number, autComplete: any) {
    autComplete.hide();

    if (!this.ProductOnChange(i)) {
      return;
    }

    if (!newObj || newObj === '' || typeof newObj === 'string') {
      console.log("Invalid object selected", newObj);
      if(this.productlist.length>1){
        this.focusOnSaveButton();
      }
      return;
    }

    this.rowNmb = i;

    try {
      this.selectedProductList = this.products.filter(f => f.prodBCID === newObj.prodBCID);

      if (this.selectedProductList.length === 0) {
        // this.toastr.error("Invalid product selection");
        return;
      }

      const selectedProduct = this.selectedProductList[0];

      const result = await lastValueFrom(
        this.invoicesService.GetProductBatchByProdBCID(selectedProduct.prodID, 0, this.selectedLocation.LocationId)
      );

      if (result.length === 0) {
        this.toastr.error("No stock available for the selected product");
        Object.keys(this.productlist[i]).forEach(key => {
          this.productlist[i][key] = null;
        });

        this.onEnterComplexInternal(this.inputFields.length - 3);
        return;
      }

      for (const batch of result) {
        const existingIndex = this.productlist.findIndex(
          f => f.prodBCID === newObj.prodBCID && f.batchNo === batch.batchNo
        );

        if (existingIndex >= 0) {
          if (this.productlist[existingIndex].qty < (batch.unitQty/this.productlist[existingIndex].unit.unitValue)) {
            this.productlist[existingIndex].qty = parseInt(this.productlist[existingIndex].qty.toString(), 10) + 1;
            if(existingIndex != i)
            {
              Object.keys(this.productlist[i]).forEach(key => {
                this.productlist[i][key] = null;
              });
            }
            this.Itemcalculation(existingIndex);
            return; // Exit the loop once the quantity is updated
          } else {
            continue;
          }
        } else {
          console.log(batch);
          this.addNewEntry(i, selectedProduct, batch);
          this.onEnterComplexInternal(this.inputFields.length - 2);
          return;
        }
      }
      this.toastr.error("No more stock available for this product");
      this.onEnterComplexInternal(this.inputFields.length - 4);
    } catch (error) {
      console.error("Error fetching product or stock details", error);
      this.toastr.error("Error fetching product or stock details");
    }
  }

  Itemcalculation(rowIndex: number) {
    let rowData = this.productlist[rowIndex];
    const fieldName = (event.target as HTMLInputElement).name;
    console.log(fieldName);
    rowData.qty = rowData.qty || 0;
    rowData.bonusQty = rowData.bonusQty || 0;
    rowData.purchRate = rowData.purchRate || 0;
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
    rowData.grossValue = parseFloat((rowData.qty * rowData.purchRate).toFixed(2));

    // Determine if discount is based on percentage or amount
    rowData.discountAmount = parseFloat(((rowData.grossValue * rowData.discount) / 100).toFixed(2)) || 0;
    // if (fieldName == "discount") {
    // } else {
    //   rowData.discount = parseFloat(((rowData.discountAmount / rowData.grossValue) * 100).toFixed(2)) || 0;
    // }

    // Calculate discounted gross value
    rowData.discountedGross = parseFloat((rowData.grossValue - rowData.discountAmount).toFixed(2)) || 0;

    // Determine if tax is based on percentage or amount
    rowData.taxAmount = parseFloat(((rowData.discountedGross * rowData.taxPercent) / 100).toFixed(2)) || 0;
    // if (fieldName == "tax") {
    // } else {
    //   rowData.taxPercent = parseFloat(((rowData.taxAmount / rowData.discountedGross) * 100).toFixed(2)) || 0;
    // }

    // Determine if extra discount is based on percentage or amount
    rowData.extraDiscountAmount = parseFloat(((rowData.discountedGross * rowData.extraDiscountPercent) / 100).toFixed(2)) || 0;
    // if (fieldName == "extraDiscount") {
    // } else {
    //   rowData.extraDiscountPercent = parseFloat(((rowData.extraDiscountAmount / rowData.discountedGross) * 100).toFixed(2)) || 0;
    // }

    // Calculate advance tax amount
    rowData.advanceTaxAmount = parseFloat(((rowData.discountedGross * rowData.advanceTaxPercent) / 100).toFixed(2)) || 0;
    // if (fieldName == "advanceTax") {
    // } else {
    //   rowData.advanceTaxPercent = parseFloat(((rowData.advanceTaxAmount / rowData.discountedGross) * 100).toFixed(2)) || 0;
    // }

    // Calculate extra advance tax amount
    rowData.extraAdvanceTaxAmount = parseFloat(((rowData.discountedGross * rowData.extraAdvanceTaxPercent) / 100).toFixed(2)) || 0;
    // if (fieldName == "extraTax") {
    // } else {
    //   rowData.extraAdvanceTaxPercent = parseFloat(((rowData.extraAdvanceTaxAmount / rowData.discountedGross) * 100).toFixed(2)) || 0;
    // }

    // Calculate net amount before rebate
    rowData.netAmountBeforeRebate = parseFloat(
      (
        parseFloat(Number(rowData.discountedGross || 0).toFixed(2)) +
        parseFloat(Number(rowData.taxAmount || 0).toFixed(2)) -
        parseFloat(Number(rowData.extraDiscountAmount || 0).toFixed(2)) +
        parseFloat(Number(rowData.advanceTaxAmount || 0).toFixed(2)) +
        parseFloat(Number(rowData.extraAdvanceTaxAmount || 0).toFixed(2))
      ).toFixed(2)
    );

    // Determine if rebate is based on percentage or amount
    rowData.rebateAmount = parseFloat(((rowData.netAmountBeforeRebate * rowData.rebatePercent) / 100).toFixed(2)) || 0;
    // if (fieldName == "rebate") {
    // } else {
    //   rowData.rebatePercent = parseFloat(((rowData.rebateAmount / rowData.netAmountBeforeRebate) * 100).toFixed(2)) || 0;
    // }

    // Calculate net amount after rebate
    rowData.netAmount = parseFloat((rowData.netAmountBeforeRebate - rowData.rebateAmount).toFixed(2)) || 0;

    // Calculate net rate (net amount divided by total quantity)
    let totalQty = rowData.qty;
    rowData.netRate = totalQty ? parseFloat((rowData.netAmount / totalQty).toFixed(2)) : 0;

    rowData.diff = rowData.lastCost == 0 ? 0 :  parseFloat((rowData.lastCost - rowData.netRate).toFixed(2)) || 0;

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
      this.router.navigateByUrl('/Invoices/PurchaseReturn')
    }
    else
    {
      // this.selectedCustomerName = undefined;
      this.TotalDiscount = 0;
      let today = new Date();
      this.selectedDate = today;
      this.rowNmb = 0;
      this.productlist = [{}];
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
    if(this.validateFields())
    {
      this.savebtnDisable = true;
      try {
          this.invoice = this.invoicesService.createInvoice(
            this.invoiceID,
            this.invoiceDetailID,
            this.fiscalYear,
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
          this.toastr.success("Purchase Return has been successfully Created!");
          this.router.navigateByUrl('/Invoices/PurchaseReturn')
        } catch (result) {
          this.toastr.error(result.error);
          this.savebtnDisable = false;

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
    this.router.navigateByUrl('/Invoices/PurchaseReturn');
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
    this.Filterproductlist = this.productsDuplicate
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


  async onCodeChange(newObj: any, i: number, event: any) {
    if (!newObj || !newObj.barCode) {
      // Reset the product entry for the current row if barcode is invalid
      this.Itemcalculation(i);

      if (event.key === "Enter" || event.key === "Tab") {
        this.onEnterComplexInternal(this.inputFields.length - 3);
      }
      return;
    }

    try {
      // Fetch the selected product details by barcode
      this.selectedProductList = this.products.filter(f => f.barCode === newObj.barCode);
      if (this.selectedProductList.length === 0) {
        this.toastr.error("Invalid product code");
        return;
      }

      // Fetch stock information for the selected product using API
      const result = await lastValueFrom(
        this.invoicesService.GetProductBatchByProdBCID(
          this.selectedProductList[0].prodID,
          0,
          this.selectedLocation.LocationId
        )
      );

      if (!result || result.length === 0) {
        this.toastr.error("No stock available for the selected product");
        this.productlist[i].barCode = "";
        return;
      }

      // Iterate over all batches to handle stock and avoid duplication
      for (const batch of result) {
        const existingIndex = this.productlist.findIndex(
          f => f.barCode === newObj.barCode && f.batchNo === batch.batchNo
        );

        if (existingIndex >= 0) {
          // If batch exists, update the quantity if within stock limits
          if (this.productlist[existingIndex].qty < (batch.unitQty/this.productlist[existingIndex].unit.unitValue) ) {
            this.productlist[existingIndex].qty = parseInt(this.productlist[existingIndex].qty.toString(), 10) + 1;
            if(existingIndex != i)
            {
              Object.keys(this.productlist[i]).forEach(key => {
                this.productlist[i][key] = null;
              });
            }
            this.addNewRow();
            this.Itemcalculation(existingIndex);
            return; // Exit as the update is complete
          } else {
            continue; // Skip to the next batch if stock limit is reached
          }
        }
      }

      // Add a new batch if none of the existing batches can accommodate the quantity
      const nextBatch = result.find(
        r => !this.productlist.some(f => f.barCode === newObj.barCode && f.batchNo === r.batchNo)
      );

      if (nextBatch) {
        this.addNewProductEntry(i, this.selectedProductList[0], nextBatch);
        this.addNewRow();
      } else {
        this.toastr.error("No more stock available for this product");
        this.onEnterComplexInternal(this.inputFields.length - 4);
      }
    } catch (error) {
      console.error("Error fetching product or stock details", error);
      this.toastr.error("Error fetching product or stock details");
    }
  }


  addNewEntry(i: number, product: any, batch: any){
    this.productlist[i].barCode = product.barCode;
    this.productlist[i].prodID = product.prodID;
    this.productlist[i].prodBCID = product.prodBCID;
    this.productlist[i].prodName = { prodName: product.prodName };
    this.productlist[i].prodCode = product.prodCode;
    this.productlist[i].unitQty = batch.unitQty;
    this.productlist[i].qty = 1;
    this.productlist[i].taxPercent = this.taxesList[0].taxValue;
    this.productlist[i].lastCost = product.lastCost;
    this.productlist[i].currentStock = product.currentStock;
    this.productlist[i].categoryName = product.categoryName;
    this.productlist[i].depName = product.depName;
    this.productlist[i].prodManuName = product.prodManuName;
    this.productlist[i].prodGrpName = product.prodGrpName;
    this.productlist[i].discount = product.sharePercentage;
    this.productlist[i].isTaxable = product.isTaxable;
    this.productlist[i].units =product.units;
    this.productlist[i].unit =product.units.find(x=>x.unitValue == 1) || product.units[0];
    this.productlist[i].batchNo = batch.batchNo;
    this.productlist[i].purchPrice = batch.purchRate;
    this.productlist[i].sellPrice = batch.sellRate;
    this.productlist[i].sellRate = (batch.sellRate*this.productlist[i].unit.unitValue);
    this.productlist[i].qtyBal = (batch.unitQty/this.productlist[i].unit.unitValue);
    this.productlist[i].purchRate = (batch.purchRate*this.productlist[i].unit.unitValue),
    this.productlist[i].expiryDate = batch.expiry ? this.formatDate(new Date(batch.expiry)) : null;
    this.productlist[i].discount = batch.discountPercent;
    this.productlist[i].extraDiscountPercent = batch.extraDiscountPercent;
    this.productlist[i].rebatePercent = batch.rebatePercent;

    this.productlist[i].taxPercent= batch.ProductTaxes[0].taxPercent || 0;
    this.productlist[i].taxAmount= batch.ProductTaxes[0].taxAmount || 0;
    this.productlist[i].advanceTaxPercent= batch.ProductTaxes[1].taxPercent || 0;
    this.productlist[i].advanceTaxAmount= batch.ProductTaxes[1].taxAmount || 0;
    this.productlist[i].extraAdvanceTaxPercent= batch.ProductTaxes[2].taxPercent || 0;
    this.productlist[i].extraAdvanceTaxAmount= batch.ProductTaxes[2].taxAmount || 0;

    this.Itemcalculation(i);
  }

  addNewProductEntry(i: number, product: any, batch: any) {
    let TempUnit = product.units.find(x=>x.unitValue == 1) || product.units[0];
    this.productlist[i] = {
      barCode: product.barCode,
      prodID: product.prodID,
      prodBCID: product.prodBCID,
      prodName: {prodName:product.prodName},
      prodCode: product.prodCode,
      unitQty: batch.unitQty,
      qty: 1,
      units : product.units,
      unit : TempUnit,
      purchPrice : batch.purchRate,
      sellPrice : batch.sellRate,
      sellRate: (batch.sellRate*TempUnit.unitValue),
      lastCost: product.lastCost,
      currentStock: product.currentStock,
      categoryName: product.categoryName,
      depName: product.depName,
      prodManuName: product.prodManuName,
      prodGrpName: product.prodGrpName,
      isTaxable: product.isTaxable,
      batchNo: batch.batchNo,
      qtyBal: (batch.unitQty/TempUnit.unitValue),
      purchRate : (batch.purchRate*TempUnit.unitValue),
      expiryDate: this.formatDate(new Date(batch.expiry)) || null,
      discount : batch.discountPercent,
      extraDiscountPercent : batch.extraDiscountPercent,
      rebatePercent : batch.rebatePercent,
      taxPercent: batch.ProductTaxes[0].taxPercent || 0,
      taxAmount: batch.ProductTaxes[0].taxAmount || 0,
      advanceTaxPercent: batch.ProductTaxes[1].taxPercent || 0,
      advanceTaxAmount: batch.ProductTaxes[1].taxAmount || 0,
      extraAdvanceTaxPercent: batch.ProductTaxes[2].taxPercent || 0,
      extraAdvanceTaxAmount: batch.ProductTaxes[2].taxAmount || 0,
    };

    this.Itemcalculation(i);

  }

  addNewBatchEntry(i: number, product: any, batch: any) {
    this.productlist.push({
      ...product,
      prodName: {prodName:product.prodName},
      unitQty: batch.unitQty,
      qty: 1,
      purchPrice : batch.purchRate,
      sellPrice : batch.sellRate,
      sellRate: (batch.sellRate*product.baseQty),
      batchNo: batch.batchNo,
      qtyBal: (batch.unitQty/product.baseQty),

      purchRate : (batch.purchRate*product.baseQty),
      expiryDate: new Date(batch.expiry) || null,
    });
    this.Itemcalculation(this.productlist.length - 1);
  }


  addNewRow() {
    let el: HTMLElement = this.newRowButton.nativeElement;
    el.click();
    this.cdr.detectChanges();
    this.onEnterComplexInternal(this.inputFields.length - 4);
  }


  onChangePrint(e:any) {
    this.printtype= e.target.value;
 }

 updateQtyBal(data: any, index: any) {
  data.qty = Number(data.qty);

  if (data.qty > data.qtyBal) {

    this.toastr.error("Return Quantity is less than input quantity.");
    Object.assign(this.productlist[index], {
      qty: data.qtyBal,
    });
  }

  this.Itemcalculation(index);
}

 handleChildData() {
  this.ProductsVisible = false;
  this.VendorVisible = false;
}

clear()
{
  this.returnTotalAmount = 0;
  this.productlist = [{}];
  this.rowNmb = 0;
}

  VendorOnChange()
  {
    this.clear();
    this.showOnlyVendorProduct();
    if(this.selectedCustomerName == undefined){
      this.toastr.error("Please select supplier!");
      this.onEnterComplex(0);
    }
    else{
      // this.invoicesService.GetInvoices(GLTxTypes.PurchaseInvoice,this.selectedCustomerName.vendID).subscribe({
      //   next:(result)=>{
      //     console.log(result);
      //     this.GRNInvoiceList = result.filter(x=> x.isPaymented == false);
      //     if(this.GRNInvoiceList.length > 0){
      //       this.GRNInvoiceList.unshift({ invoiceVoucherNo : "Select Invoice No"});
      //     }else{
      //       this.GRNInvoiceList.unshift({ invoiceVoucherNo : "No GRN Available"});
      //     }
      //   },
      //   error:(responce)=>{
      //     this.GRNInvoiceList = [];
      //   }
      // })
    }
  }


  showOnlyVendorProduct(){
    if(this.showVendorProductsOnly){
      this.productlist = [{}];
      this.productsDuplicate = this.products.filter(x=>x.vendID == this.selectedCustomerName.vendID);
      this.Filterproductlist = this.productsDuplicate ;
    }else{
      this.productsDuplicate = this.products;
      this.Filterproductlist = this.productsDuplicate ;
    }
  }

  async InvoiceOnChange()
  {
    this.clear();
    if(this.selectedVoucherNo == undefined || this.selectedVoucherNo == "Select Invoice No") {
      this.toastr.error("Please select Invoice!");
      this.onEnterComplex(2);
      return;
    }

    try {
      const totalRemainingPayment = await lastValueFrom(this.invoicesService.GetInvoiceRemainingAmount(this.selectedVoucherNo));
      this.returnTotalAmount = totalRemainingPayment;
    } catch (result) {
      this.toastr.error(result.error);
    }
  }

  async RenderEditItem()
  {
    const invoiceData = await lastValueFrom(this.invoicesService.GetInvoice(this.EditVoucherNo));

    this.invoiceID = invoiceData.invoiceID;
    this.invoiceDetailID = invoiceData.invoiceDetailID;
    this.fiscalYear = invoiceData.fiscalYear;
    this.voucherNo = invoiceData.invoiceVoucherNo;
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
    for (let i = 0; i < this.productlist.length; i++) {
      this.selectedProductList = this.products.filter(f => f.prodID == this.productlist[i].prodID);

      this.productlist[i].prodName = {prodName:this.selectedProductList[0].prodName};
      this.productlist[i].prodCode = this.selectedProductList[0].prodCode;
      this.productlist[i].barCode = this.selectedProductList[0].barCode;

      this.productlist[i].categoryName =this.selectedProductList[0].categoryName;
      this.productlist[i].depName =this.selectedProductList[0].depName;
      this.productlist[i].prodManuName =this.selectedProductList[0].prodManuName;
      this.productlist[i].prodGrpName =this.selectedProductList[0].prodGrpName;
      this.productlist[i].units =this.selectedProductList[0].units;
      let unit = this.selectedProductList[0].units.find(x=>x.unitType  == this.productlist[i].unit);
      this.productlist[i].unit = unit;

      this.productlist[i].purchPrice = this.productlist[i].purchRate;
      this.productlist[i].sellPrice = this.productlist[i].sellRate;
      this.productlist[i].qty = this.productlist[i].qty*-1;
      this.productlist[i].unitQty = this.productlist[i].qty;
      this.productlist[i].qtyBal = this.productlist[i].qty;

      const result = await lastValueFrom(
        this.invoicesService.GetProductBatchByProdBCID(this.productlist[i].prodID, 0, invoiceData.locID)
      );
      if(result){
        var data = result.find(x=>x.batchNo == this.productlist[i].batchNo);
        if(data){
          this.productlist[i].unitQty += (data.unitQty/unit.unitValue);
          this.productlist[i].qtyBal += (data.unitQty/unit.unitValue);
        }
      }



      if(invoiceData.Products[i].expiry)
      {
        this.productlist[i].expiryDate = this.formatDate(new Date(invoiceData.Products[i].expiry));
      }
      this.productlist[i].taxPercent= invoiceData.Products[i].ProductTaxes[0].taxPercent || 0;
      this.productlist[i].taxAmount= invoiceData.Products[i].ProductTaxes[0].taxAmount || 0;
      this.productlist[i].advanceTaxPercent= invoiceData.Products[i].ProductTaxes[1].taxPercent || 0;
      this.productlist[i].advanceTaxAmount= invoiceData.Products[i].ProductTaxes[1].taxAmount || 0;
      this.productlist[i].extraAdvanceTaxPercent= invoiceData.Products[i].ProductTaxes[2].taxPercent || 0;
      this.productlist[i].extraAdvanceTaxAmount= invoiceData.Products[i].ProductTaxes[2].taxAmount || 0;
      this.productlist[i].prodInvoiceID= invoiceData.Products[i].prodInvoiceID || 0;
      this.Itemcalculation(i)
    }
  }

  sumField(field: string): number {
    return parseFloat(this.productlist.reduce((acc, curr) => acc + (Number(curr[field]) || 0), 0).toFixed(2));
  }

  filterUnitSuggestions(rowData: any) {
    rowData.units = rowData?.units || []; // Populate units for the selected product
    console.log(rowData.units);
    rowData.unit = rowData.units[0]?.unitType || ''; // Auto-select the first unit
  }

  onUnitSelect(event: any, rowData: any, rowIndex: number) {
    if (rowData.unitQty < event.unitValue) {
        this.toastr.error(
          "Cannot select this unit because the available quantity is less than the base quantity of this unit."
        );


        rowData.unit = { ...rowData.units[0] };
        rowData.qtyBal = rowData.unitQty / rowData.unit.unitValue;
        rowData.purchRate = rowData.purchPrice * rowData.unit.unitValue;
        rowData.sellRate = rowData.sellPrice*rowData.unit.unitValue;

        if(rowData.qty > rowData.qtyBal){
          rowData.qty = rowData.qtyBal;
        }

        this.Itemcalculation(rowIndex);

        return;
      }

      rowData.qtyBal = rowData.unitQty / event.unitValue;
      rowData.purchRate = rowData.purchPrice * event.unitValue;
      rowData.sellRate = rowData.sellPrice * event.unitValue;
      if(rowData.qty > rowData.qtyBal){
        rowData.qty = rowData.qtyBal;
      }
      this.Itemcalculation(rowIndex);
    }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2-digit day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
}

