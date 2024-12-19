import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { InvoicesComponent } from '../Shared/Components/invoices/invoices.component';
import { AddNewPurchaseOrderComponent } from './Components/add-new-purchase-order/add-new-purchase-order.component';
import { QuotationInvoiceComponent } from './Components/add-new-quotation/addNewQuotation.component';
import { AddNewStockShortageComponent } from './Components/add-new-stock-shortage/add-new-stock-shortage.component';
import { AddOrderToPurchaseComponent } from './Components/add-order-to-purchase/add-order-to-purchase.component';
import { AddPurchaseReturnComponent } from './Components/add-purchase-return/add-purchase-return.component';
import { AddPurchaseReturn2Component } from './Components/add-purchase-return2/add-purchase-return2.component';
import { AddPurchaseComponent } from './Components/add-purchase/add-purchase.component';
import { AddQuotationToSaleComponent } from './Components/add-quotation-to-sale/add-quotation-to-sale.component';
import { NewInvoiceComponent } from './Components/add-sale-invoice/addnewsale.component';
import { AddSaleReturnComponent } from './Components/add-sale-return/add-sale-return.component';
import { AddSaleReturn2Component } from './Components/add-sale-return2/add-sale-return2.component';
import { AddServiceInvoiceComponent } from './Components/add-service-invoice/add-service-invoice.component';
import { InvoiceDetailViewComponent } from './Components/invoice-detail-view/invoice-detail-view.component';
import { PurchaseOrderComponent } from './Components/purchase-order/purchase-order.component';
import { PurchaseReturnComponent } from './Components/purchase-return/purchase-return.component';
import { PurchaseReturn2Component } from './Components/purchase-return2/purchase-return2.component';
import { PurchaseComponent } from './Components/purchase/purchase.component';
import { QuotationComponent } from './Components/quotation/quotation.component';
import { SaleInvoiceComponent } from './Components/sale-invoice/sale-invoice.component';
import { SaleReturnComponent } from './Components/sale-return/sale-return.component';
import { SaleReturn2Component } from './Components/sale-return2/sale-return2.component';
import { ServiceInvoiceComponent } from './Components/service-invoice/service-invoice.component';
import { StockShortageComponent } from './Components/stock-shortage/stock-shortage.component';
import { VoucherDetailViewComponent } from './Components/voucher-detail-view/voucher-detail-view.component';
import { GRNComponent } from './Components/grn/grn.component';
import { AddNewGrnComponent } from './Components/add-new-grn/add-new-grn.component';
import { AddNewPurchaseMComponent } from './Components/add-new-purchase-m/add-new-purchase-m.component';
import { PurchaseMComponent } from './Components/purchase-m/purchase-m.component';
import { AddNewSaleMComponent } from './Components/add-new-sale-m/add-new-sale-m.component';
import { AddNewPurchaseReturnMComponent } from './Components/add-new-purchase-return-m/add-new-purchase-return-m.component';
import { InvoicePostingComponent } from './Components/invoice-posting/invoice-posting.component';
import { PurchaseReturnMComponent } from './Components/purchase-return-m/purchase-return-m.component';
import { AddNewSaleOrderComponent } from './Components/add-new-sale-order/add-new-sale-order.component';
import { SaleOrderComponent } from './Components/sale-order/sale-order.component';
import { AddNewSaleDComponent } from './Components/add-new-sale-d/add-new-sale-d.component';
import { AddNewPurchaseDComponent } from './Components/add-new-purchase-d/add-new-purchase-d.component';
import { AddNewGrnDComponent } from './Components/add-new-grn-d/add-new-grn-d.component';
import { AddNewPurchaseOrderDComponent } from './Components/add-new-purchase-order-d/add-new-purchase-order-d.component';
import { AddNewPurchaseReturnDComponent } from './Components/add-new-purchase-return-d/add-new-purchase-return-d.component';
import { AddNewSaleReturnDComponent } from './Components/add-new-sale-return-d/add-new-sale-return-d.component';

function getDynamicComponent(componentForPos: any, componentForDistribution: any): any {
  const isPos = localStorage.getItem('isPos') === 'true';
  return isPos ? componentForPos : componentForDistribution;
}


const routes: Routes = [
  // { path: 'AddNewSale', component: NewInvoiceComponent , canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'SaleInvoicesCreate' }  },
  // { path: 'AddNewSale/:id', component: NewInvoiceComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'SaleInvoicesEdit' }  },
  { path: 'AddNewSale', component: getDynamicComponent(AddNewSaleMComponent, AddNewSaleDComponent), canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'SaleInvoicesCreate' }  },
  { path: 'AddNewSale/:id', component: getDynamicComponent(AddNewSaleMComponent, AddNewSaleDComponent), canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'SaleInvoicesEdit' }  },

  { path: 'AddNewSales/:id', component: AddQuotationToSaleComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'SaleInvoicesCreate' }  },
  { path: 'AddNewQuotation', component: getDynamicComponent(QuotationInvoiceComponent, AddNewSaleOrderComponent), canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'QuotationsCreate' }  },
  { path: 'AddNewQuotation/:id', component: getDynamicComponent(QuotationInvoiceComponent, AddNewSaleOrderComponent), canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'QuotationsEdit' }  },
  { path: 'Quotations', component: getDynamicComponent(QuotationComponent, SaleOrderComponent), canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Quotations' }  },


  { path: 'inoviceDetail/:voucher', component: InvoicesComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'InvoiceDetail' }  },
  { path: 'SaleInvoices', component: SaleInvoiceComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'SaleInvoices' }  },
  // { path: 'Purchase', component: PurchaseComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Purchase' }  },
  // { path: 'AddNewPurchase', component: AddPurchaseComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'PurchaseCreate' }  },
  { path: 'Purchase', component: PurchaseMComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Purchase' }  },
  { path: 'AddNewPurchase', component: getDynamicComponent(AddNewPurchaseMComponent, AddNewPurchaseDComponent), canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'PurchaseCreate' }  },
  { path: 'AddNewPurchase/:id', component: getDynamicComponent(AddNewPurchaseMComponent, AddNewPurchaseDComponent), canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'PurchaseEdit' }  },
  { path: 'AddNewPurchases/:id', component: AddOrderToPurchaseComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'PurchaseCreate' }  },
  { path: 'AddNewPurchaseOrder', component: getDynamicComponent(AddNewPurchaseOrderComponent, AddNewPurchaseOrderDComponent), canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'PurchaseOrderCreate' }  },
  { path: 'AddNewPurchaseOrder/:id', component: getDynamicComponent(AddNewPurchaseOrderComponent, AddNewPurchaseOrderDComponent), canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'PurchaseOrderEdit' }  },
  { path: 'PurchaseOrder', component: PurchaseOrderComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'PurchaseOrder' }  },
  { path: 'Detail/:id', component: InvoiceDetailViewComponent, canActivate:[AuthGuard], data: { requiredPermission: 'InvoiceDetailView' }  },
  { path: 'VoucherDetail/:id', component: VoucherDetailViewComponent, canActivate:[AuthGuard], data: { requiredPermission: 'VoucherDetail' }  },
  { path: 'ServiceInvoices', component: ServiceInvoiceComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ServiceInvoices' }  },
  { path: 'AddNewServiceInvoice', component: AddServiceInvoiceComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ServiceInvoicesCreate' }  },
  { path: 'AddNewServiceInvoice/:id', component: AddServiceInvoiceComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ServiceInvoicesEdit' }  },
  { path: 'DebitNote', component: PurchaseReturnComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'DebitNote' }  },
  { path: 'PurchaseReturn', component: PurchaseReturnMComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'DebitNote' }  },
  { path: 'AddNewDebitNote', component: AddPurchaseReturnComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'DebitNoteCreate' }  },
  { path: 'AddNewDebitNote/:id', component: AddPurchaseReturnComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'DebitNoteEdit' }  },
  // { path: 'AddNewPurchaseReturn', component: AddPurchaseReturn2Component, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'DebitNoteCreate' }  },
  // { path: 'AddNewPurchaseReturn/:id', component: AddPurchaseReturn2Component, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'DebitNoteCreate' }  },
  { path: 'AddNewPurchaseReturn', component: getDynamicComponent(AddNewPurchaseReturnMComponent,AddNewPurchaseReturnDComponent), canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'DebitNoteCreate' }  },
  { path: 'AddNewPurchaseReturn/:id', component: getDynamicComponent(AddNewPurchaseReturnMComponent,AddNewPurchaseReturnDComponent), canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'DebitNoteCreate' }  },
  { path: 'CreditNote', component: SaleReturnComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'CreditNote' }  },
  { path: 'SaleReturn', component: SaleReturn2Component, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'CreditNote' }  },
  { path: 'AddNewCreditNote', component: AddSaleReturnComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'CreditNoteCreate' }  },
  { path: 'AddNewCreditNote/:id', component: AddSaleReturnComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'CreditNoteEdit' }  },
  { path: 'AddNewSaleReturn', component: getDynamicComponent(AddSaleReturn2Component,AddNewSaleReturnDComponent), canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'CreditNoteCreate' }  },
  { path: 'AddNewSaleReturn/:id', component: getDynamicComponent(AddSaleReturn2Component,AddNewSaleReturnDComponent), canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'CreditNoteEdit' }  },
  { path: 'StockShortage', component: StockShortageComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'StockShortage' }  },
  { path: 'AddNewStockShortage', component: AddNewStockShortageComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'StockShortageCreate' }  },
  { path: 'AddNewStockShortage/:id', component: AddNewStockShortageComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'StockShortageEdit' }  },
  { path: 'GRN', component: GRNComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'GRN' }  },
  { path: 'AddNewGRN', component: getDynamicComponent(AddNewGrnComponent, AddNewGrnDComponent), canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'GRNCreate' }  },
  { path: 'AddNewGRN/:id', component: getDynamicComponent(AddNewGrnComponent, AddNewGrnDComponent), canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'GRNEdit' }  },
  { path: 'invoicePosting', component: InvoicePostingComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'InvoicePosting' }  },

];


@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})

export class InvoicesRoutingModule { }
