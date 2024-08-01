import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseVoucherComponent } from './Components/expense-voucher/expense-voucher.component';
import { AddNewExpenseVoucherComponent } from './Components/add-new-expense-voucher/add-new-expense-voucher.component';
import { AddNewPaymentVoucherComponent } from './Components/add-new-payment-voucher/add-new-payment-voucher.component';
import { PaymentVoucherComponent } from './Components/payment-voucher/payment-voucher.component';
import { DaybookComponent } from './Components/daybook/daybook.component';
import { ReceiptVoucherComponent } from './Components/receipt-voucher/receipt-voucher.component';
import { AddNewRecieptVoucherComponent } from './Components/add-new-reciept-voucher/add-new-reciept-voucher.component';
import { JournalVoucherComponent } from './Components/journal-voucher/journal-voucher.component';
import { AddNewJournalVoucherComponent } from './Components/add-new-journal-voucher/add-new-journal-voucher.component';
import { JournalVoucherDetailViewComponent } from './Components/journal-voucher-detail-view/journal-voucher-detail-view.component';
import { SharedModule } from '../Shared/shared.module';
import { TransactionRoutingModule } from './transaction-routing.module';

@NgModule({
  declarations: [
    AddNewExpenseVoucherComponent,
    AddNewPaymentVoucherComponent,
    AddNewJournalVoucherComponent,
    AddNewRecieptVoucherComponent,
    DaybookComponent,
    ExpenseVoucherComponent,
    JournalVoucherDetailViewComponent,
    PaymentVoucherComponent,
    ReceiptVoucherComponent,
    JournalVoucherComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TransactionRoutingModule
  ],
  exports: [

  ]
})
export class TransactionModule { }
