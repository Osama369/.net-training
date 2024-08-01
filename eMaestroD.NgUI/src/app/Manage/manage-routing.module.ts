import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { BankComponent } from './Components/bank/bank.component';
import { CustomersComponent } from './Components/customers/customers.component';
import { ProductBarcodeComponent } from './Components/product-barcode/product-barcode.component';
import { ProductGroupsComponent } from './Components/product-groups/product-groups.component';
import { ProductsComponent } from './Components/products/products.component';
import { LowStockComponent } from './Components/low-stock/low-stock.component';
import { AddNewBulkStockUpdateComponent } from './Components/add-new-bulk-stock-update/add-new-bulk-stock-update.component';
import { BulkStockUpdateComponent } from './Components/bulk-stock-update/bulk-stock-update.component';
import { CreditCardComponent } from './Components/credit-card/credit-card.component';
import { VendorsComponent } from './Components/vendors/vendors.component';


const routes: Routes = [
  { path: 'Customers', component: CustomersComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Customers' }  },
  { path: 'Products', component: ProductsComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Products' }  },
  { path: 'ProductBarcode', component: ProductBarcodeComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ProductBarcode' }  },
  { path: 'ProductCategory', component: ProductGroupsComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ProductCategory' }  },
  { path: 'Bank', component: BankComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Bank' }  },
  { path: 'ReOrder', component: LowStockComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ReOrderProducts' }  },
  { path: 'CreditCard', component: CreditCardComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'CreditCard' }  },
  { path: 'bulkStockUpdate', component: BulkStockUpdateComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'bulkStockUpdate' }  },
  { path: 'AddNewBulkStockUpdate', component: AddNewBulkStockUpdateComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'bulkStockUpdateCreate' }  },
  { path: 'Suppliers', component: VendorsComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Suppliers' }  },
];


@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})

export class ManageRoutingModule { }
