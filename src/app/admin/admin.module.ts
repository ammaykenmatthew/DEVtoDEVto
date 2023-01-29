import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModules } from "../modules/material.module";
import { AdminRoutingModule } from "./admin-routing.module";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StudentpostComponent } from './components/studentpost/studentpost.component';
import { FiltersComponent } from './components/filters/filters.component';
import { ViewQuestionComponent } from './components/view-question/view-question.component';
import { AddStudentComponent } from './components/add-student/add-student.component';
import { RegStudentComponent } from './components/reg-student/reg-student.component';


@NgModule({
    declarations:[
    DashboardComponent,
    StudentpostComponent,
    FiltersComponent,
    ViewQuestionComponent,
    AddStudentComponent,
    RegStudentComponent,

  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModules,
        AdminRoutingModule // lagi meron ditong import ng #RoutingModule ng kung anong component to ex. admin, main
    ],
})

export class AdminModule{}