import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule,Pipe, PipeTransform } from '@angular/core';
import { AppComponent } from './app.component';
import { CommonModule, DatePipe } from '@angular/common';
import { AppLayoutModule } from './layout/app.layout.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SharedModule } from './Shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
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
    SharedModule,
    AppLayoutModule,
    AppRoutingModule,
    ],
  bootstrap: [AppComponent],
})
export class AppModule { }
