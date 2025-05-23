import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { PermissionGuard } from '../guards/permission.guard';
// import { RoleAuthorizationComponent } from './Components/role-authorization/role-authorization.component';
// import { ScreenComponent } from './Components/screen/screen.component';
// import { UsersComponent } from './Components/users/users.component';
// import { ConfigurationComponent } from './Components/configuration/configuration.component';
import { initialConfig } from 'ngx-mask';
import { SuppliersComponent } from './Components/suppliers/suppliers.component';
import { ProductComponent } from './Components/product/product.component';
import { AddProductComponent } from './Components/Product/add-product/add-product.component';
import { FileUploadComponent } from './Components/file-upload/file-upload.component';
import { RenderInvoiceComponent } from './Components/render-invoice/render-invoice.component';


const routes: Routes = [
      // { path: 'Suppliers', component:SuppliersComponent , canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Users' }  },
      // { path: 'Add-Supplier', component:AddSuppliersComponent, canActivate:[AuthGuard], data: { requiredPermission: 'Screen' }  },
      { path: 'Suppliers', component:SuppliersComponent  },
      { path: 'Products', component: ProductComponent  },
      { path: 'AddProducts', component: AddProductComponent  },
      { path: 'AddProducts/:id', component: AddProductComponent  },
      { path:'Files',component: FileUploadComponent },
      { path:'Invoice',component: RenderInvoiceComponent}


    ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ManageRoutingModule { }
