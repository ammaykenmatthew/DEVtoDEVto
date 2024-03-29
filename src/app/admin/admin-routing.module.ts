import { NgModule } from "@angular/core";
import { RouterModule , Routes} from "@angular/router";

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StudentpostComponent } from './components/studentpost/studentpost.component';
import { FiltersComponent } from './components/filters/filters.component';
import { AddStudentComponent } from "./components/add-student/add-student.component";
import { ReportsComponent } from "./components/reports/reports.component";
import { AddModeratorComponent } from "./components/add-moderator/add-moderator.component";
import { ArchivedComponent } from "./components/archived/archived.component";

const routes : Routes =  [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'studentpost', component: StudentpostComponent},
    { path: 'filters', component: FiltersComponent},
    { path: 'add-student', component: AddStudentComponent},
    { path: 'add-moderator', component: AddModeratorComponent},
    { path: 'reports', component: ReportsComponent},
    { path: 'archived', component: ArchivedComponent},
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },

]

@NgModule({
    imports: [ RouterModule.forChild(routes)],
    exports: [ RouterModule]
})
export class AdminRoutingModule{}
