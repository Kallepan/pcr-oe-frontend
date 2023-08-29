import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { HomeComponent } from './home/home.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { GlobalInterceptor } from './app-interceptor.module';
import { LoginComponent } from './login/login.component';
import { AuthDialogComponent } from './login/auth-dialog/auth-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GlobalErrorHandler } from './app-handlers.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from './services/message.service';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AuthDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: GlobalInterceptor, multi: true},
    {provide: ErrorHandler, useClass: GlobalErrorHandler},
    {provide: MAT_DIALOG_DATA, useValue: {}}, // This is a workaround for the error: "NullInjectorError: No provider for MAT_DIALOG_DATA!"
    {provide: MatDialogRef, useValue: {}},
    MessageService,
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
