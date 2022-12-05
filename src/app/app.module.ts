import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModules } from './modules/material.module';
import { FormsModule } from '@angular/forms';

import { AdminComponent } from './admin/admin.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';


import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { SearchComponent } from './search/search.component';





@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    AdminComponent,
    SearchComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModules, //global material modules
    FormsModule,



  ],
  providers: [
    DatePipe,
    {provide: LocationStrategy, useClass: HashLocationStrategy, }],
  bootstrap: [AppComponent]
})
export class AppModule { }
