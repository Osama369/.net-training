import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'
import { ReportSettingService } from 'src/app/Reports/Services/report-setting.service';
import { AuthService } from 'src/app/Shared/Services/auth.service';
import { BookmarkService } from 'src/app/Shared/Services/bookmark.service';
import { GenericService } from 'src/app/Shared/Services/generic.service';
import { InvoicesService } from '../../Services/invoices.service';
import { InvoiceView } from '../../Models/invoice-view';
import { Products } from 'src/app/Manage/Models/products';
import { CustomersService } from 'src/app/Manage/Services/customers.service';
import { ProductsService } from 'src/app/Manage/Services/products.service';

@Component({
  selector: 'app-voucher-detail-view',
  templateUrl: './voucher-detail-view.component.html',
  styleUrls: ['./voucher-detail-view.component.css']
})
export class VoucherDetailViewComponent {
  constructor(
    private productService: ProductsService,
    private router: Router,
    private customersService:CustomersService,
    private invoicesService:InvoicesService,
    private route: ActivatedRoute,
    private genericService: GenericService,
    private location: Location
  ) { }

  heading:any = "Invoice Detail";
  EditVoucherNo : any;
  productlist: Products[];
  voucherlist: InvoiceView[];
  Name : any;
  date : any;
  columns : any[] = [];
  exportColumns : any[] =[];
  // companyName : any;
  // companyVat : any;
  //Reportvisible: boolean = false;

  ngOnInit(): void {
    this.route.params.subscribe(params1 => {
      this.EditVoucherNo = params1['id'];
   });

   this.productlist = [this.CreateNewList()];
   if(this.EditVoucherNo != undefined)
   {
     this.invoicesService.getOneInvoiceDetail(this.EditVoucherNo).subscribe(invoices => {
      if(invoices[0].txTypeID==6){this.heading="Receipt Voucher Detail"}
      else if(invoices[0].txTypeID==7){this.heading="Payment Voucher Detail"}
       this.date = invoices[0].dtTx;
       this.Name = invoices[0].cstName;
    });


    this.invoicesService.getVoucherDetail(this.EditVoucherNo).subscribe(invoices => {
      this.voucherlist = invoices;
      this.exportColumns.push(new Object({title: "Invoice No",dataKey: "voucherNo"}));
      this.exportColumns.push(new Object({title: "Date",dataKey: "dtTx"}));
      this.exportColumns.push(new Object({title: "Payment Method",dataKey: "cstName"}));
      this.exportColumns.push(new Object({title: "Total",dataKey: "amount"}));
    });

    // this.genericService.getConfiguration().subscribe(conf =>{
    //   this.companyName = conf[0].companyName;
    //   this.companyVat = conf[0].productionType;
    // });
   }
  }

  showReportDialog() {
    this.exportPdf();
  }

  exportPdf() {
    import("jspdf").then(jsPDF => {
        import("jspdf-autotable").then(x => {
          const doc = new jsPDF.default('p', 'px', 'a4');
            (doc as any).autoTable(this.exportColumns, this.voucherlist);
            doc.save(this.heading+'.pdf');
        })
    })
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
