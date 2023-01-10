import { NgModule } from "@angular/core";
import { RouterModule , Routes} from "@angular/router";

import { HomeComponent } from "./components/home/home.component";
import { QuestionsComponent } from "./components/questions/questions.component";
import { BookmarksComponent } from "./components/bookmarks/bookmarks.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { ViewPostComponent } from "./components/view-post/view-post.component";
import { MyQuestionsComponent } from "./components/my-questions/my-questions.component";
import { AllQuestionsComponent } from "./components/all-questions/all-questions.component";

const routes : Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'view-post/:id', component: ViewPostComponent },
    { path: 'questions', component: QuestionsComponent},
    { path: 'bookmarks', component: BookmarksComponent},
    { path: 'profile', component: ProfileComponent},
    { path: 'my-questions', component: MyQuestionsComponent},
    { path: 'all-questions', component: AllQuestionsComponent},
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
