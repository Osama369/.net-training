import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { COAComponent } from './Components/coa/coa.component';
import { FiscalYearComponent } from './Components/fiscal-year/fiscal-year.component';
import { LocationsComponent } from './Components/locations/locations.component';
import { NotificationAlertComponent } from './Components/notification-alert/notification-alert.component';
import { NotificationComponent } from './Components/notification/notification.component';
import { RoleAuthorizationComponent } from './Components/role-authorization/role-authorization.component';
import { ScreenComponent } from './Components/screen/screen.component';
import { TaxesComponent } from './Components/taxes/taxes.component';
import { UsersComponent } from './Components/users/users.component';
import { ConfigurationComponent } from './Components/configuration/configuration.component';

const routes: Routes = [
      { path: 'COA', component: COAComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'ChartOfAccounts' }  },
      { path: 'Location', component: LocationsComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Location' }  },
      { path: 'Taxes', component: TaxesComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Taxes' }  },
      { path: 'Users', component: UsersComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Users' }  },
      { path: 'Screens', component: ScreenComponent, canActivate:[AuthGuard], data: { requiredPermission: 'Screen' }  },
      { path: 'PermissionScreen', component: RoleAuthorizationComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Authorization' }  },
      { path: 'PermissionScreen/:id', component: RoleAuthorizationComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Authorization' }  },
      { path: 'NotificationAlert', component: NotificationAlertComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'NotificationAlert' }  },
      { path: 'Notification', component: NotificationComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'Notification' }  },
      { path: 'FiscalYear', component: FiscalYearComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'FiscalYear' }  },
      { path: 'Configuration', component: ConfigurationComponent, canActivate:[AuthGuard, PermissionGuard], data: { requiredPermission: 'CompanySetting' }  },
    ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdministrationRoutingModule { }
