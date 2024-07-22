import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TenantsComponent } from './components/tenants/tenants.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { AddNewComponent } from './components/tenants/add-new/add-new.component';
import { FormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastrModule } from 'ngx-toastr';
import { RenewalEmailComponent } from './components/renewal-email/renewal-email.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RoleAuthorizationComponent } from './components/role-authorization/role-authorization.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { LoginComponent } from './components/login/login.component';
@NgModule({
  declarations: [
    AppComponent,
    TenantsComponent,
    AddNewComponent,
    RenewalEmailComponent,
    DashboardComponent,
    RoleAuthorizationComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MessagesModule,
    AppRoutingModule,
    AppLayoutModule,
    TableModule,
    ButtonModule,
    InputSwitchModule,
    PanelModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    CalendarModule,
    ToastrModule.forRoot(),
    ConfirmDialogModule,
    AutoCompleteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
