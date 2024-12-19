import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNewPurchaseOrderComponent } from './Components/add-new-purchase-order/add-new-purchase-order.component';
import { QuotationInvoiceComponent } from './Components/add-new-quotation/addNewQuotation.component';
import { AddNewStockShortageComponent } from './Components/add-new-stock-shortage/add-new-stock-shortage.component';
import { AddOrderToPurchaseComponent } from './Components/add-order-to-purchase/add-order-to-purchase.component';
import { AddPurchaseComponent } from './Components/add-purchase/add-purchase.component';
import { AddPurchaseReturnComponent } from './Components/add-purchase-return/add-purchase-return.component';
import { AddPurchaseReturn2Component } from './Components/add-purchase-return2/add-purchase-return2.component';
import { AddQuotationToSaleComponent } from './Components/add-quotation-to-sale/add-quotation-to-sale.component';
import { NewInvoiceComponent } from './Components/add-sale-invoice/addnewsale.component';
import { AddSaleReturnComponent } from './Components/add-sale-return/add-sale-return.component';
import { AddSaleReturn2Component } from './Components/add-sale-return2/add-sale-return2.component';
import { AddServiceInvoiceComponent } from './Components/add-service-invoice/add-service-invoice.component';
import { InvoiceDetailViewComponent } from './Components/invoice-detail-view/invoice-detail-view.component';
import { InvoiceReportSettingsComponent } from './Components/invoice-report-settings/invoice-report-settings.component';
import { PurchaseComponent } from './Components/purchase/purchase.component';
import { PurchaseOrderComponent } from './Components/purchase-order/purchase-order.component';
import { PurchaseReturnComponent } from './Components/purchase-return/purchase-return.component';
import { PurchaseReturn2Component } from './Components/purchase-return2/purchase-return2.component';
import { QuotationComponent } from './Components/quotation/quotation.component';
import { SaleInvoiceComponent } from './Components/sale-invoice/sale-invoice.component';
import { SaleReturn2Component } from './Components/sale-return2/sale-return2.component';
import { SaleReturnComponent } from './Components/sale-return/sale-return.component';
import { ServiceInvoiceComponent } from './Components/service-invoice/service-invoice.component';
import { StockShortageComponent } from './Components/stock-shortage/stock-shortage.component';
import { VoucherDetailViewComponent } from './Components/voucher-detail-view/voucher-detail-view.component';
import { SharedModule } from '../Shared/shared.module';
import { ManageModule } from '../Manage/manage.module';
import { InvoicesRoutingModule } from './invoices-routing.module';
import { GRNComponent } from './Components/grn/grn.component';
import { AddNewGrnComponent } from './Components/add-new-grn/add-new-grn.component';
import { AddNewPurchaseMComponent } from './Components/add-new-purchase-m/add-new-purchase-m.component';
import { PurchaseMComponent } from './Components/purchase-m/purchase-m.component';
import { AddNewSaleMComponent } from './Components/add-new-sale-m/add-new-sale-m.component';
import { AddNewPurchaseReturnMComponent } from './Components/add-new-purchase-return-m/add-new-purchase-return-m.component';
import { InvoicePostingComponent } from './Components/invoice-posting/invoice-posting.component';
import { PurchaseReturnMComponent } from './Components/purchase-return-m/purchase-return-m.component';
import { SaleOrderComponent } from './Components/sale-order/sale-order.component';
import { AddNewSaleOrderComponent } from './Components/add-new-sale-order/add-new-sale-order.component';
import { AddNewSaleDComponent } from './Components/add-new-sale-d/add-new-sale-d.component';
import { AddNewPurchaseDComponent } from './Components/add-new-purchase-d/add-new-purchase-d.component';
import { AddNewGrnDComponent } from './Components/add-new-grn-d/add-new-grn-d.component';
import { AddNewPurchaseOrderDComponent } from './Components/add-new-purchase-order-d/add-new-purchase-order-d.component';
import { AddNewPurchaseReturnDComponent } from './Components/add-new-purchase-return-d/add-new-purchase-return-d.component';
import { AddNewSaleReturnDComponent } from './Components/add-new-sale-return-d/add-new-sale-return-d.component';




@NgModule({
  declarations: [
    AddNewPurchaseOrderComponent,
    QuotationInvoiceComponent,
    AddNewStockShortageComponent,
    AddOrderToPurchaseComponent,
    AddPurchaseComponent,
    AddPurchaseReturnComponent,
    AddPurchaseReturn2Component,
    AddQuotationToSaleComponent,
    NewInvoiceComponent,
    AddSaleReturnComponent,
    AddSaleReturn2Component,
    AddServiceInvoiceComponent,
    InvoiceDetailViewComponent,
    InvoiceReportSettingsComponent,
    PurchaseComponent,
    PurchaseOrderComponent,
    PurchaseReturnComponent,
    PurchaseReturn2Component,
    QuotationComponent,
    SaleInvoiceComponent,
    SaleReturnComponent,
    SaleReturn2Component,
    ServiceInvoiceComponent,
    StockShortageComponent,
    VoucherDetailViewComponent,
    GRNComponent,
    AddNewGrnComponent,
    AddNewPurchaseMComponent,
    PurchaseMComponent,
    AddNewSaleMComponent,
    AddNewPurchaseReturnMComponent,
    InvoicePostingComponent,
    PurchaseReturnMComponent,
    SaleOrderComponent,
    AddNewSaleOrderComponent,
    AddNewSaleDComponent,
    AddNewPurchaseDComponent,
    AddNewGrnDComponent,
    AddNewPurchaseOrderDComponent,
    AddNewPurchaseReturnDComponent,
    AddNewSaleReturnDComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InvoicesRoutingModule,
    ManageModule
  ],
  exports:[
    AddNewPurchaseOrderComponent
  ],
  providers: [
    AddPurchaseComponent,
    NewInvoiceComponent,
    QuotationInvoiceComponent,
  ],
})
export class InvoicesModule { }
