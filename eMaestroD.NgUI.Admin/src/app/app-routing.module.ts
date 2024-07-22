import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantsComponent } from './components/tenants/tenants.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { RenewalEmailComponent } from './components/renewal-email/renewal-email.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RoleAuthorizationComponent } from './components/role-authorization/role-authorization.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {path: '', component: AppLayoutComponent,
  children: [
       { path: 'login', component: LoginComponent },
       { path: 'Dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
       { path: 'tenants', component: TenantsComponent, canActivate:[AuthGuard]},
       { path: 'reminderEmail', component: RenewalEmailComponent, canActivate:[AuthGuard]},
       { path: 'AuthorizationTemplate', component: RoleAuthorizationComponent, canActivate:[AuthGuard]},
     ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
