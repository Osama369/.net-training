import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'
import { Products } from 'src/app/Manage/Models/products';
import { CustomersService } from 'src/app/Manage/Services/customers.service';
import { ProductsService } from 'src/app/Manage/Services/products.service';
import { ReportSettingService } from 'src/app/Reports/Services/report-setting.service';
import { GenericService } from 'src/app/Shared/Services/generic.service';
import { InvoicesService } from '../../Services/invoices.service';
import { InvoiceView } from '../../Models/invoice-view';
import { lastValueFrom } from 'rxjs';
import { ProductViewModel } from 'src/app/Manage/Models/product-view-model';

@Component({
  selector: 'app-detail-view',
  templateUrl: './invoice-detail-view.component.html',
  styleUrls: ['./invoice-detail-view.component.css']
})
export class InvoiceDetailViewComponent {
  constructor(
    private productService: ProductsService,
    private router: Router,
    private customersService:CustomersService,
    private invoicesService:InvoicesService,
    private route: ActivatedRoute,
    private genericService: GenericService,
    private location: Location,
    private reportSettingService : ReportSettingService
  ) { }

  heading:any = "Invoice Detail";
  EditVoucherNo : any;
  productlist: ProductViewModel[] = [{}];
  returnList: Products[];
  voucherlist: InvoiceView[];
  Name : any;
  type : any;
  date : any;
  SubTotal : any=0;
  TotalDiscount : any=0;
  TotalTax : any=0;
  returnSubTotal : any=0;
  returnTotalDiscount : any=0;
  returnTotalTax : any=0;
  TaxName : any=0;
  Total:any=0;
  returnTotal:any=0;
  PaymentTotal:any=0;
  companyName : any;
  companyVat : any;
  Reportvisible: boolean = false;
  isBankInfo: boolean = false;
  printType : any;
  reportSettingItemList :any[]=[];
  isProductCode: boolean = false;
  showPleaseWait : boolean = false;
  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(params1 => {
      this.EditVoucherNo = params1['id'];
   });

   this.reportSettingService.GetInvoiceReportSettings().subscribe(rpt=>{
    this.reportSettingItemList = rpt;
  })

   this.returnList = [this.CreateNewList()];
   if(this.EditVoucherNo != undefined)
   {
    this.showPleaseWait = true;
    try{

      const invoice = await lastValueFrom(this.invoicesService.GetInvoice(this.EditVoucherNo));
      console.log(invoice);
       this.date = invoice.invoiceDate;
       this.type = invoice.invoiceType;
       this.Name = invoice.customerOrVendorName;
       const seenProdBCIDs = new Set<number>();

       this.productlist = invoice.Products.filter(product => {
           if (!seenProdBCIDs.has(product.prodBCID)) {
               seenProdBCIDs.add(product.prodBCID);
               return true;
           }
           return false;
       });
        this.SubTotal = invoice.grossTotal
        this.TotalTax = invoice.totalTax
        this.TotalDiscount = invoice.totalDiscount;
        this.Total = this.SubTotal + this.TotalTax - this.TotalDiscount;
    }
    catch(error){

    }

      this.invoicesService.GetReturnDetail(this.EditVoucherNo).subscribe(invoices => {
      if(invoices != null)
      {
        let i = -1;
        let j = -1;
        let k = -1;
          invoices.forEach((elem,index) => {
            if(elem.prodID != 0 && elem.prodName != null)
            {
              i++;
              this.returnList[i].prodGrpName = elem.voucherNo;
              this.returnList[i].prodCode  =elem.prodCode;
              this.returnList[i].prodID  =elem.prodID;
              this.returnList[i].prodName =elem.prodName;
              this.returnList[i].sellRate  =elem.unitPrice;
              this.returnList[i].discount  =elem.checkNo;
              this.returnList[i].qty  =elem.qty;
              if(elem.txTypeID==2)
              {
                this.returnList[i].qty  = -elem.qty;
              }
              this.returnList[i].amount  =this.returnList[i].qty*elem.unitPrice - elem.discountSum;
              this.returnList[i].crtDate = elem.crtDate;
              this.returnSubTotal += this.returnList[i].amount ;
              this.returnList.push(this.CreateNewList());
          }
          else if(elem.prodID == 0) {
            this.returnTotalTax += elem.taxSum;
          }
        });
        this.returnList.splice(this.returnList.length-1,1);
        this.returnTotalDiscount = invoices.find(x=>x.txID == 0)?.discountSum;
        this.returnTotal = this.returnSubTotal + this.returnTotalTax - this.returnTotalDiscount;
      }
      else{
        this.returnList.splice(this.returnList.length-1,1);
      }
    });

        this.showPleaseWait = false;




    this.genericService.getConfiguration().subscribe(conf =>{
      this.companyName = conf[0].companyName;
      this.companyVat = conf[0].productionType;
    });


   }
  }

  showReportDialog() {
    if(this.reportSettingItemList.find(x=>x.key == "A4" && x.value == true) != undefined){
      this.printType = "A4"
    }
    else{
      this.printType = "Thermal"
    }
    if(this.reportSettingItemList.find(x=>x.key == "Include Bank Detail") != undefined){
      this.isBankInfo = this.reportSettingItemList.find(x=>x.key == "Include Bank Detail").value;
    }else{
      this.isBankInfo = false;
    }
    this.isProductCode = this.reportSettingItemList.find(x=>x.key=="Add Product Code").value.toLocaleString();
    this.Reportvisible = true;
  }

  CreateNewList() {
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
      };
  }

  back()
  {
    this.location.back();
  }
}
