import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddLocationComponent } from './Components/add-location/add-location.component';
import { AddNewFiscalYearComponent } from './Components/add-new-fiscal-year/add-new-fiscal-year.component';
import { AddNewScreenComponent } from './Components/add-new-screen/add-new-screen.component';
import { AddNewTaxesComponent } from './Components/add-new-taxes/add-new-taxes.component';
import { AddNewUserComponent } from './Components/add-new-user/add-new-user.component';
import { ConfigurationComponent } from './Components/configuration/configuration.component';
import { EndFiscalYearComponent } from './Components/end-fiscal-year/end-fiscal-year.component';
import { FiscalYearComponent } from './Components/fiscal-year/fiscal-year.component';
import { LocationsComponent } from './Components/locations/locations.component';
import { AddNotificaitonAlertComponent } from './Components/notification-alert/add-notificaiton-alert/add-notificaiton-alert.component';
import { NotificationAlertComponent } from './Components/notification-alert/notification-alert.component';
import { RoleAuthorizationComponent } from './Components/role-authorization/role-authorization.component';
import { ScreenComponent } from './Components/screen/screen.component';
import { TaxesComponent } from './Components/taxes/taxes.component';
import { UsersComponent } from './Components/users/users.component';
import { AddCoaComponent } from './Components/add-coa/add-coa.component';
import { COAComponent } from './Components/coa/coa.component';
import { NotificationComponent } from './Components/notification/notification.component';
import { SharedModule } from '../Shared/shared.module';
import { AdministrationRoutingModule } from './administration-routing.module';


@NgModule({
  declarations: [
    AddCoaComponent,
    AddLocationComponent,
    AddNewFiscalYearComponent,
    AddNewScreenComponent,
    AddNewTaxesComponent,
    AddNewUserComponent,
    COAComponent,
    ConfigurationComponent,
    EndFiscalYearComponent,
    FiscalYearComponent,
    NotificationComponent,
    NotificationAlertComponent,
    AddNotificaitonAlertComponent,
    ScreenComponent,
    TaxesComponent,
    UsersComponent,
    LocationsComponent,
    RoleAuthorizationComponent,
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    SharedModule,
  ]
})
export class AdministrationModule { }
