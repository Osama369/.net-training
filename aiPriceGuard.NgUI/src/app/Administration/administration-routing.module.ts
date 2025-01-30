import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { RoleAuthorizationComponent } from './Components/role-authorization/role-authorization.component';
import { ScreenComponent } from './Components/screen/screen.component';
import { UsersComponent } from './Components/users/users.component';
import { ConfigurationComponent } from './Components/configuration/configuration.component';
import { initialConfig } from 'ngx-mask';
;

const routes: Routes = [
      { path: 'Users', component: UsersComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Users' }  },
      { path: 'Screens', component: ScreenComponent, canActivate:[AuthGuard], data: { requiredPermission: 'Screen' }  },
      { path: 'PermissionScreen', component: RoleAuthorizationComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Authorization' }  },
      { path: 'PermissionScreen/:id', component: RoleAuthorizationComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Authorization' }  },
      { path: 'Configuration', component: ConfigurationComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'CompanySetting' }  },
     
    ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdministrationRoutingModule { }
