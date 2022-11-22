import { NgModule } from "@angular/core";
import { RouterModule , Routes} from "@angular/router";

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StudentpostComponent } from './components/studentpost/studentpost.component';
import { FiltersComponent } from './components/filters/filters.component';

const routes : Routes =  [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'studentpost', component: StudentpostComponent},
    { path: 'filters', component: FiltersComponent},
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