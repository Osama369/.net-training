import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNewScreenComponent } from './Components/add-new-screen/add-new-screen.component';
import { AddNewUserComponent } from './Components/add-new-user/add-new-user.component';
import { ConfigurationComponent } from './Components/configuration/configuration.component';
import { RoleAuthorizationComponent } from './Components/role-authorization/role-authorization.component';
import { ScreenComponent } from './Components/screen/screen.component';
import { UsersComponent } from './Components/users/users.component';

import { SharedModule } from '../Shared/shared.module';
import { AdministrationRoutingModule } from './administration-routing.module';



@NgModule({
  declarations: [
    UsersComponent,
    ScreenComponent,
    RoleAuthorizationComponent,
    ConfigurationComponent,
    AddNewUserComponent,
    AddNewScreenComponent,
    ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    SharedModule,
  ],
})
export class AdministrationModule { }
