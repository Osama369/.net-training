import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AppLayoutComponent } from './layout/app.layout.component';
import { NotAuthorizeComponent } from './Shared/Components/not-authorize/not-authorize.component';
import { NotFoundComponent } from './Shared/Components/not-found/not-found.component';
import { loginGuard } from './guards/login.guard';
import { AppTopBarComponent } from './layout/app.topbar.component';
import { ConfirmVerificationComponent } from './Shared/Components/confirm-verification/confirm-verification.component';
import { LoginComponent } from './Auth/Components/login/login.component';
import { RegisterComponent } from './Auth/Components/register/register.component';
import { SelectCompanyComponent } from './Shared/Components/select-company/select-company.component';
import { SignUpComponent } from './Auth/Components/sign-up/sign-up.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '', component: AppLayoutComponent, children: [
    { path: 'login', component: LoginComponent },
    { path: 'SignUp', component: SignUpComponent },
    { path: 'Register', component: RegisterComponent },
    { path: 'topbar', component: AppTopBarComponent },
    { path: 'Confirmation', component: ConfirmVerificationComponent },
    { path: '404', component: NotFoundComponent },
    { path: 'not-authorized', component: NotAuthorizeComponent },
    { path: 'SelectCompany', component: SelectCompanyComponent, canActivate:[loginGuard] },
    { path: 'Dashboard', loadChildren: () => import('./Dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
    { path: 'Administration', loadChildren: () => import('./Administration/administration.module').then(m => m.AdministrationModule), canActivate: [AuthGuard] },
    { path: 'Invoices', loadChildren: () => import('./Invoices/invoices.module').then(m => m.InvoicesModule), canActivate: [AuthGuard] },
    { path: 'Manage', loadChildren: () => import('./Manage/manage.module').then(m => m.ManageModule), canActivate: [AuthGuard] },
    { path: 'Reports', loadChildren: () => import('./Reports/reports.module').then(m => m.ReportsModule), canActivate: [AuthGuard] },
    { path: 'Transactions', loadChildren: () => import('./Transaction/transaction.module').then(m => m.TransactionModule), canActivate: [AuthGuard] }
  ]},
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ bindToComponentInputs:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
