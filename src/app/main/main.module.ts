import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from "./components/home/home.component";
import { ProfileComponent } from './components/profile/profile.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { BookmarksComponent } from './components/bookmarks/bookmarks.component';

import { MaterialModules } from "../modules/material.module";
import { MainRoutingModule } from "./main-routing.module";
// import { MainRoutingModule } from "./main-routing.module";
// import { QuestionsComponent } from './components/questions/questions.component';
// import { BookmarksComponent } from './components/bookmarks/bookmarks.component';
// import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
    declarations:[
        HomeComponent,
        ProfileComponent,
        QuestionsComponent,
        BookmarksComponent,
     
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModules,
        MainRoutingModule, // lagi meron ditong import ng MainRoutingModule
    ],
})
export class MainModule {}