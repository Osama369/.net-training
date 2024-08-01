import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { AddNewExpenseVoucherComponent } from './Components/add-new-expense-voucher/add-new-expense-voucher.component';
import { AddNewJournalVoucherComponent } from './Components/add-new-journal-voucher/add-new-journal-voucher.component';
import { AddNewPaymentVoucherComponent } from './Components/add-new-payment-voucher/add-new-payment-voucher.component';
import { DaybookComponent } from './Components/daybook/daybook.component';
import { ExpenseVoucherComponent } from './Components/expense-voucher/expense-voucher.component';
import { JournalVoucherDetailViewComponent } from './Components/journal-voucher-detail-view/journal-voucher-detail-view.component';
import { JournalVoucherComponent } from './Components/journal-voucher/journal-voucher.component';
import { PaymentVoucherComponent } from './Components/payment-voucher/payment-voucher.component';
import { ReceiptVoucherComponent } from './Components/receipt-voucher/receipt-voucher.component';
import { AddNewRecieptVoucherComponent } from './Components/add-new-reciept-voucher/add-new-reciept-voucher.component';

const routes: Routes = [
  { path: 'Receipt', component: ReceiptVoucherComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ReceiptVoucher' }  },
  { path: 'AddNewReceipt', component: AddNewRecieptVoucherComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ReceiptVoucherCreate' }  },
  { path: 'AddNewReceipt/:id', component: AddNewRecieptVoucherComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ReceiptVoucherEdit' }  },

  { path: 'Payment', component: PaymentVoucherComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'PaymentVoucher' }  },
  { path: 'AddNewPayment', component: AddNewPaymentVoucherComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'PaymentVoucherCreate' }  },
  { path: 'AddNewPayment/:id', component: AddNewPaymentVoucherComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'PaymentVoucherEdit' }  },

  { path: 'Journal', component: JournalVoucherComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'JournalVoucher' }  },
  { path: 'AddNewJournal', component: AddNewJournalVoucherComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'JournalVoucherCreate' }  },
  { path: 'AddNewJournal/:id', component: AddNewJournalVoucherComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'JournalVoucherEdit' }  },

  { path: 'Expense', component: ExpenseVoucherComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ExpenseVoucher' }  },
  { path: 'AddNewExpense', component: AddNewExpenseVoucherComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ExpenseVoucherCreate' }  },
  { path: 'AddNewExpense/:id', component: AddNewExpenseVoucherComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ExpenseVoucherEdit' }  },

  { path: 'DayBook', component: DaybookComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'DayBook' }  },
  
  { path: 'JournalVoucherDetail/:id', component: JournalVoucherDetailViewComponent, canActivate:[AuthGuard], data: { requiredPermission: 'JournalVoucherDetail' }  },
];


@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})

export class TransactionRoutingModule { }
