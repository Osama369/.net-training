import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNewBulkStockUpdateComponent } from './Components/add-new-bulk-stock-update/add-new-bulk-stock-update.component';
import { AddNewBankComponent } from './Components/bank/add-new-bank/add-new-bank.component';
import { BulkStockUpdateComponent } from './Components/bulk-stock-update/bulk-stock-update.component';
import { CreditCardComponent } from './Components/credit-card/credit-card.component';
import { AddNewCreditCardComponent } from './Components/credit-card/add-new-credit-card/add-new-credit-card.component';
import { CustomersComponent } from './Components/customers/customers.component';
import { AddNewCustomerComponent } from './Components/customers/add-new-customer/add-new-customer.component';
import { AddNewCustomerForInvoiceComponent } from './Components/customers/add-new-customer-for-invoice/add-new-customer-for-invoice.component';
import { FileUploadComponent } from './Components/file-upload/file-upload.component';
import { LowStockComponent } from './Components/low-stock/low-stock.component';
import { ProductBarcodeComponent } from './Components/product-barcode/product-barcode.component';
import { ProductGroupsComponent } from './Components/product-groups/product-groups.component';
import { ProductsComponent } from './Components/products/products.component';
import { VendorsComponent } from './Components/vendors/vendors.component';
import { AddNewVendorComponent } from './Components/vendors/add-new-vendor/add-new-vendor.component';
import { AddNewProdGroupComponent } from './Components/products/add-new-prod-group/add-new-prod-group.component';
import { AddNewProductComponent } from './Components/products/add-new-product/add-new-product.component';
import { ConfirmCategoryComponent } from './Components/products/confirm-category/confirm-category.component';
import { BankComponent } from './Components/bank/bank.component';
import { SharedModule } from '../Shared/shared.module';
import { ManageRoutingModule } from './manage-routing.module';
import { CategoryComponent } from './Components/category/category.component';
import { DepartmentComponent } from './Components/department/department.component';
import { AddNewDepartmentComponent } from './Components/department/add-new-department/add-new-department.component';
import { AddNewCategoryComponent } from './Components/category/add-new-category/add-new-category.component';
import { ProdManufactureComponent } from './Components/prod-manufacture/prod-manufacture.component';
import { AddNewProdManufactureComponent } from './Components/prod-manufacture/add-new-prod-manufacture/add-new-prod-manufacture.component';
import { OfferComponent } from './Components/offer/offer.component';
import { AddNewOfferComponent } from './Components/offer/add-new-offer/add-new-offer.component';
import { SchemesComponent } from './Components/schemes/schemes.component';
import { AddNewSchemesComponent } from './Components/schemes/add-new-schemes/add-new-schemes.component';
import { AddNewProductDComponent } from './Components/products/add-new-product-d/add-new-product-d.component';


@NgModule({
  declarations: [
    AddNewBulkStockUpdateComponent,
    BankComponent,
    AddNewBankComponent,
    BulkStockUpdateComponent,
    CreditCardComponent,
    AddNewCreditCardComponent,
    CustomersComponent,
    AddNewCustomerComponent,
    AddNewCustomerForInvoiceComponent,
    FileUploadComponent,
    LowStockComponent,
    ProductBarcodeComponent,
    ProductGroupsComponent,
    ProductsComponent,
    VendorsComponent,
    AddNewVendorComponent,
    AddNewProdGroupComponent,
    AddNewProductComponent,
    ConfirmCategoryComponent,
    CategoryComponent,
    DepartmentComponent,
    AddNewDepartmentComponent,
    AddNewCategoryComponent,
    ProdManufactureComponent,
    AddNewProdManufactureComponent,
    OfferComponent,
    AddNewOfferComponent,
    SchemesComponent,
    AddNewSchemesComponent,
    AddNewProductDComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ManageRoutingModule,
    // InvoicesModule
  ],
  exports:[
    AddNewProductComponent,
    AddNewCustomerComponent,
    AddNewVendorComponent,
    AddNewCustomerForInvoiceComponent
  ],
  providers: [
    // NewInvoiceComponent,
    // QuotationInvoiceComponent,
      ProductsComponent,
      CustomersComponent,
      VendorsComponent,
  ],
})
export class ManageModule { }
