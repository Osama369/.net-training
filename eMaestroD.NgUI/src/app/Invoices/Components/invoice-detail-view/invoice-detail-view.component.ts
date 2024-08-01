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
  productlist: Products[];
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
  ngOnInit(): void {
    this.route.params.subscribe(params1 => {
      this.EditVoucherNo = params1['id'];
   });

   this.reportSettingService.GetInvoiceReportSettings().subscribe(rpt=>{
    this.reportSettingItemList = rpt;
  })

   this.productlist = [this.CreateNewList()];
   this.returnList = [this.CreateNewList()];
   if(this.EditVoucherNo != undefined)
   {
    this.showPleaseWait = true;
     this.invoicesService.getOneInvoiceDetail(this.EditVoucherNo).subscribe(invoices => {
      if(invoices[0].txTypeID==1){this.heading="Purchase Invoice Detail";this.reportSettingItemList = this.reportSettingItemList.filter(x=>x.screenName.toLowerCase() == 	"purchase")}
      else if(invoices[0].txTypeID==3){this.heading="Purchase Order Detail";this.reportSettingItemList = this.reportSettingItemList.filter(x=>x.screenName.toLowerCase() == 	"purchase order")}
      else if(invoices[0].txTypeID==4){this.heading="Sale Invoice Detail";this.reportSettingItemList = this.reportSettingItemList.filter(x=>x.screenName.toLowerCase() == 	"sale")}
      else if(invoices[0].txTypeID==11){this.heading="Service Invoice Detail";this.reportSettingItemList = this.reportSettingItemList.filter(x=>x.screenName.toLowerCase() == 	"service")}
      else if(invoices[0].txTypeID==16){this.heading="Quotation Detail";this.reportSettingItemList = this.reportSettingItemList.filter(x=>x.screenName.toLowerCase() == 	"quotation")}
      else if(invoices[0].txTypeID==5){this.heading="Sale Return Detail";this.reportSettingItemList = this.reportSettingItemList.filter(x=>x.screenName.toLowerCase() == 	"sale return")}
      else if(invoices[0].txTypeID==2){this.heading="Purchase Return Detail";this.reportSettingItemList = this.reportSettingItemList.filter(x=>x.screenName.toLowerCase() == 	"purchase return")}

      let i = -1;
       let j = -1;
       let k = -1;
       this.date = invoices[0].dtTx;
       this.type = "Cash";
       this.Name = invoices[0].cstName;
       this.TaxName = invoices[0].taxName;
       invoices.forEach((elem,index) => {
        if(elem.checkName == "tax")
         {
            if(elem.relCOAID == 40 || elem.relCOAID == 83)
            {
              this.type = "Credit";
              this.invoicesService.getPaymentDetail(this.EditVoucherNo).subscribe(invoices => {
                this.voucherlist = invoices;
                if(this.voucherlist != null)
                {
                    this.voucherlist.forEach(element => {
                    this.PaymentTotal += element.amount;
                  });
                }
              });
            }
            else if(elem.relCOAID == 80)
            {
              this.type = "Cash";

              this.invoicesService.getCashPaymentDetail(this.EditVoucherNo).subscribe(invoices => {
                this.voucherlist = invoices;
                if(this.voucherlist != null)
                {
                    this.voucherlist.forEach(element => {
                    this.PaymentTotal += element.amount;
                  });
                }
              });

            }
           this.TotalTax = elem.creditSum+elem.debitSum;
         }
         else if(elem.prodID != 0 && elem.prodName != null)
         {
            i++;
            this.productlist[i].prodCode  =elem.prodCode;
            this.productlist[i].prodID  =elem.prodID;
            this.productlist[i].prodName =elem.prodName;
            this.productlist[i].sellRate  =elem.unitPrice;
            this.productlist[i].discount  =elem.checkNo;
            this.productlist[i].qty  =elem.qty;
            if(elem.txTypeID==2)
            {
              this.productlist[i].qty  = -elem.qty;
            }
            this.productlist[i].amount  =this.productlist[i].qty*elem.unitPrice - elem.discountSum;
            this.productlist[i].crtDate = elem.crtDate;
            this.SubTotal += this.productlist[i].amount ;
             this.productlist.push(this.CreateNewList());
         }
         });

         this.productlist.splice(this.productlist.length-1,1);
         this.TotalDiscount = invoices.find(x=>x.txID == 0)?.discountSum;
         this.Total = this.SubTotal + this.TotalTax - this.TotalDiscount;

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
    });




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
