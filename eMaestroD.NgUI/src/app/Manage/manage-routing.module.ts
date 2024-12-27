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
import { DepartmentComponent } from './Components/department/department.component';
import { CategoryComponent } from './Components/category/category.component';
import { ProdManufactureComponent } from './Components/prod-manufacture/prod-manufacture.component';
import { AddNewProductComponent } from './Components/products/add-new-product/add-new-product.component';
import { OfferComponent } from './Components/offer/offer.component';
import { SchemesComponent } from './Components/schemes/schemes.component';
import { AddNewSchemesComponent } from './Components/schemes/add-new-schemes/add-new-schemes.component';
import { AddNewProductDComponent } from './Components/products/add-new-product-d/add-new-product-d.component';
import { CompanyMseComponent } from './Components/company-mse/company-mse.component';

function getDynamicComponent(componentForPos: any, componentForDistribution: any): any {
  const isPos = localStorage.getItem('isPos') === 'true';
  return isPos ? componentForPos : componentForDistribution;
}

const routes: Routes = [
  { path: 'Customers', component: CustomersComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Customers' }  },
  { path: 'CompanyCSE', component: CompanyMseComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'CompanyCSE' }  },
  { path: 'Products', component: ProductsComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Products' }  },
  { path: 'AddProduct', component: getDynamicComponent(AddNewProductComponent, AddNewProductDComponent), canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ProductsCreate' }  },
  { path: 'AddProduct/:id', component: getDynamicComponent(AddNewProductComponent, AddNewProductDComponent), canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ProductsEdit' }  },
  { path: 'ProductBarcode', component: ProductBarcodeComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ProductBarcode' }  },
  { path: 'Department', component: DepartmentComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Department' }  },
  { path: 'Manufacture', component: ProdManufactureComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Manufacture' }  },
  { path: 'Brand', component: ProductGroupsComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ProductCategory' }  },
  { path: 'Category', component: CategoryComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Category' }  },
  { path: 'Offer', component: OfferComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Offer' }  },
  { path: 'Schemes', component: SchemesComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Schemes' }  },
  { path: 'AddSchemes', component: AddNewSchemesComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'SchemesCreate' }  },
  { path: 'AddSchemes/:id', component: AddNewSchemesComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'SchemesEdit' }  },
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
