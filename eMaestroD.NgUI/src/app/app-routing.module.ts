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
import { SharedDataResolver } from './Shared/Resolver/shared-data.resolver';
import { APP_ROUTES } from './app-routes';
// import { IntialCongfigComponent } from './Shared/Components/intial-congfig/intial-congfig.component';


const routes: Routes = [
  { path: APP_ROUTES.default, redirectTo: APP_ROUTES.account.login, pathMatch: 'full' },
  { path: APP_ROUTES.default, component: AppLayoutComponent,
    children: [
    { path: APP_ROUTES.account.login, component: LoginComponent },
    { path: APP_ROUTES.account.signUp, component: SignUpComponent },
    { path: APP_ROUTES.account.register, component: RegisterComponent },
    { path: APP_ROUTES.topbar, component: AppTopBarComponent },
    // { path: APP_ROUTES.initialConfig, component:IntialCongfigComponent },
    { path: APP_ROUTES.account.confirmation, component: ConfirmVerificationComponent },
    { path: APP_ROUTES.notFound, component: NotFoundComponent },
    { path: APP_ROUTES.notAuthorized, component: NotAuthorizeComponent },
    { path: APP_ROUTES.account.selectCompany, component: SelectCompanyComponent, canActivate:[loginGuard] },
    { path: APP_ROUTES.dashboard, loadChildren: () => import('./Dashboard/dashboard.module').then(m => m.DashboardModule),canActivate: [AuthGuard] },
    { path: APP_ROUTES.administration.base, loadChildren: () => import('./Administration/administration.module').then(m => m.AdministrationModule),resolve: {
      sharedData: SharedDataResolver,
    }, canActivate: [AuthGuard] },
    { path: APP_ROUTES.invoices.base, loadChildren: () => import('./Invoices/invoices.module').then(m => m.InvoicesModule),
      resolve: {
        sharedData: SharedDataResolver,
      }, canActivate: [AuthGuard] },
    { path: APP_ROUTES.manage.base, loadChildren: () => import('./Manage/manage.module').then(m => m.ManageModule),
      resolve: {
        sharedData: SharedDataResolver,
      }, canActivate: [AuthGuard] },
    { path: APP_ROUTES.reports.base, loadChildren: () => import('./Reports/reports.module').then(m => m.ReportsModule),resolve: {
      sharedData: SharedDataResolver,
    }, canActivate: [AuthGuard] },
    { path: APP_ROUTES.transactions.base, loadChildren: () => import('./Transaction/transaction.module').then(m => m.TransactionModule),resolve: {
      sharedData: SharedDataResolver,
    }, canActivate: [AuthGuard] }
  ]},
  { path: '**', redirectTo: APP_ROUTES.notFound }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ bindToComponentInputs:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
