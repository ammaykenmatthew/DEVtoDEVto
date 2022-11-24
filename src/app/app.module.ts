import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModules } from './modules/material.module';

import { AdminComponent } from './admin/admin.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';




@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    AdminComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModules,
    FontAwesomeModule, //global material modules
  

  ],
  providers: [
    {
    provide: LocationStrategy, useClass: HashLocationStrategy
    }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
