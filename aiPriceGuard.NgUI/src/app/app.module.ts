import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, NgModule,Pipe, PipeTransform } from '@angular/core';
import { AppComponent } from './app.component';
import { CommonModule, DatePipe } from '@angular/common';
import { AppLayoutModule } from './layout/app.layout.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SharedModule } from './Shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { AppConfigService } from './Shared/Services/app-config.service';
import { AuthModule } from './Auth/auth.module';





export function initializeApp(appConfigService: AppConfigService) {
  return () => {
    return appConfigService.loadAppConfig()
      .then(() => {
        const pleaseWaitElement = document.getElementById('please-wait-main');
        if (pleaseWaitElement) {
          pleaseWaitElement.style.display = 'none';
        }
      })
      .catch(error => {
        const errorElement = document.getElementById('error-message');
        const pleaseWaitElement = document.getElementById('please-wait-main');
        if (errorElement) {
          pleaseWaitElement.style.display = 'none';
          errorElement.style.display = 'block';
          errorElement.textContent = 'Could not connect to the server. Please try again later.';
        }
        return Promise.reject(new Error('Application initialization failed.')); // This will stop the initialization process.
      });
  };
}

@NgModule({
  declarations: [
    AppComponent
   
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    
    AppLayoutModule,
    AppRoutingModule,
    ],
    providers: [
      {
        provide: APP_INITIALIZER,
        useFactory: initializeApp,
        deps: [AppConfigService],
        multi: true
      },
     
    ],
  bootstrap: [AppComponent],
})
export class AppModule { }
