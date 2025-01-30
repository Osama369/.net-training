import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../Shared/shared.module';
import { ManageRoutingModule } from './manage-routing.module';
import { SuppliersComponent } from './Components/suppliers/suppliers.component';
import { AddSuppliersComponent } from './Components/suppliers/add-suppliers/add-suppliers.component';
import { ProductComponent } from './Components/product/product.component';
import { AddProductComponent } from './Components/Product/add-product/add-product.component';
import { FileUploadComponent } from './Components/file-upload/file-upload.component';
// import { AddFilesComponent } from './Components/FileUpload/add-files/add-files.component';
import { AddFileComponent } from './Components/file-upload/add-file/add-file.component';

@NgModule({
  declarations: 
  [
    SuppliersComponent,
    AddSuppliersComponent,
    ProductComponent,
    AddProductComponent,
    FileUploadComponent,
    AddFileComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ManageRoutingModule
  ]
})
export class ManageModule { }
