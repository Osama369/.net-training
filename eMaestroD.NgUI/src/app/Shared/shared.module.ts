import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { GirdComponent } from './Components/gird/gird.component';
import { NotAuthorizeComponent } from './Components/not-authorize/not-authorize.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { PleaseWaitComponent } from './Components/please-wait/please-wait.component';
import { ResetPasswordComponent } from './Components/reset-password/reset-password.component';
import { SelectCompanyComponent } from './Components/select-company/select-company.component';
import { ConfirmVerificationComponent } from './Components/confirm-verification/confirm-verification.component';
import { TimezoneDatePipe } from './Pipes/timezone-date.pipe';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PermissionGuard } from '../guards/permission.guard';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { InvoicesComponent } from './Components/invoices/invoices.component';
import { AddRowDirective } from './Directive/add-row.directive';
import { DateFilterPipe } from './Pipes/date-filter-pipe.pipe';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    GirdComponent,
    ConfirmVerificationComponent,
    NotAuthorizeComponent,
    NotFoundComponent,
    PleaseWaitComponent,
    ResetPasswordComponent,
    SelectCompanyComponent,
    InvoicesComponent,
    TimezoneDatePipe,
    DateFilterPipe,
    AddRowDirective
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    })
],
  exports: [
    FormsModule,
    HttpClientModule,
    GirdComponent,
    PrimeNgModule,
    InvoicesComponent,
    TimezoneDatePipe,
    AddRowDirective,
    PleaseWaitComponent,
    DateFilterPipe
  ],
  providers: [
    DatePipe,
    MessageService,
    PermissionGuard,
    ConfirmationService,
    {
      provide:HTTP_INTERCEPTORS,
      useClass:TokenInterceptor,
      multi:true,
    },
  ],
})
export class SharedModule { }
