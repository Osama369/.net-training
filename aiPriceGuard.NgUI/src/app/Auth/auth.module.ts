import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { SignUpComponent } from './Components/sign-up/sign-up.component';
import { SharedModule } from '../Shared/shared.module';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    SignUpComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class AuthModule { }
