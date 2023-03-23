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
import { SearchPipe } from './shared/filter.pipe';
import { DateAsAgoPipe } from './shared/date-as-ago.pipe';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faComment, faHouse } from '@fortawesome/free-solid-svg-icons';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { QuillModule } from 'ngx-quill';


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
    ServiceWorkerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),


  ],
  providers: [
    DatePipe,
    {provide: LocationStrategy, useClass: HashLocationStrategy, }],
  bootstrap: [AppComponent]
})
export class AppModule {

}
