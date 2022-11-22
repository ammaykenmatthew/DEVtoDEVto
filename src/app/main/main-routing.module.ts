import { NgModule } from "@angular/core";
import { RouterModule , Routes} from "@angular/router";

import { HomeComponent } from "./components/home/home.component";
import { QuestionsComponent } from "./components/questions/questions.component";
import { BookmarksComponent } from "./components/bookmarks/bookmarks.component";
import { ProfileComponent } from "./components/profile/profile.component";

const routes : Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'questions', component: QuestionsComponent},
    { path: 'bookmarks', component: BookmarksComponent},
    { path: 'profile', component: ProfileComponent},
    {
        path: '', 
        redirectTo: 'home', 
        pathMatch: 'full'
    },
]

@NgModule({
    imports: [ RouterModule.forChild(routes)],
    exports: [ RouterModule]
})
export class MainRoutingModule{}