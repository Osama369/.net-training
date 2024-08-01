import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'
import { InvoicesService } from 'src/app/Invoices/Services/invoices.service';
import { Products } from 'src/app/Manage/Models/products';
import { CustomersService } from 'src/app/Manage/Services/customers.service';
import { ProductsService } from 'src/app/Manage/Services/products.service';
import { GenericService } from 'src/app/Shared/Services/generic.service';
import { JournalVoucher } from '../../Models/journal-voucher';

@Component({
  selector: 'app-journal-voucher-detail-view',
  templateUrl: './journal-voucher-detail-view.component.html',
  styleUrls: ['./journal-voucher-detail-view.component.css']
})
export class JournalVoucherDetailViewComponent {
  constructor(
    private productService: ProductsService,
    private router: Router,
    private customersService:CustomersService,
    private invoicesService:InvoicesService,
    private route: ActivatedRoute,
    private genericService: GenericService,
    private location: Location
  ) { }

  heading:any = "Journal Voucher Detail";
  EditVoucherNo : any;
  productlist: Products[];
  voucherlist: JournalVoucher[];
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
    if(this.EditVoucherNo.split('-')[0] == "EXP")
    {
      this.heading = "Expense Voucher Detail";
    }
    this.invoicesService.getJournalVoucherDetail(this.EditVoucherNo).subscribe(invoices => {
      this.voucherlist = invoices;

      if(this.voucherlist.length > 0)
      {
        this.date = invoices[0].dtTx;
      }
      this.exportColumns.push(new Object({title: "Invoice No",dataKey: "voucherNo"}));
      this.exportColumns.push(new Object({title: "Account",dataKey: "parentAccountName"}));
      this.exportColumns.push(new Object({title: "Detail",dataKey: "ChildAccountName"}));
      this.exportColumns.push(new Object({title: "Debit",dataKey: "debit"}));
      this.exportColumns.push(new Object({title: "Credit",dataKey: "credit"}));

    });

    // this.genericService.getConfiguration().subscribe(conf =>{
    //   this.companyName = conf[0].companyName;
    //   this.companyVat = conf[0].productionType;
    // });
   }
  }

  showReportDialog() {
    //this.Reportvisible = true;
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
