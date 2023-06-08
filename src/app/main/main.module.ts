import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { QuestionsComponent } from './components/questions/questions.component';
import { BookmarksComponent } from './components/bookmarks/bookmarks.component';

import { MaterialModules } from '../modules/material.module';
import { MainRoutingModule } from './main-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PostTileComponent } from './components/post-tile/post-tile.component';
import { VoteButtonComponent } from './components/vote-button/vote-button.component';
import { PostFormComponent } from './components/post-form/post-form.component';
import { ViewPostComponent } from './components/view-post/view-post.component';
import { LogoutFormComponent } from './components/logout-form/logout-form.component';
import { DeletePostComponent } from './components/delete-post/delete-post.component';
import { SearchPipe } from '../shared/filter.pipe';
import { DateAsAgoPipe } from '../shared/date-as-ago.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { MyQuestionsComponent } from './components/my-questions/my-questions.component';
import { AllQuestionsComponent } from './components/all-questions/all-questions.component';
import { QuestComponent } from './components/quest/quest.component';
import { ReportComponent } from './components/report/report.component';
import { CommentBoxComponent } from './components/comment-box/comment-box.component';
import { CommentComponent } from './components/comment/comment.component';
import { QuillModule } from 'ngx-quill';
import { ReportCommentComponent } from './components/report-comment/report-comment.component';
import { PolicyComponent } from './components/policy/policy.component';
import { GuidelinesComponent } from './components/guidelines/guidelines.component';

// import { MainRoutingModule } from "./main-routing.module";
// import { QuestionsComponent } from './components/questions/questions.component';
// import { BookmarksComponent } from './components/bookmarks/bookmarks.component';
// import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    QuestionsComponent,
    BookmarksComponent,
    PostTileComponent,
    VoteButtonComponent,
    PostFormComponent,
    ViewPostComponent,
    LogoutFormComponent,
    DeletePostComponent,
    SearchPipe,
    DateAsAgoPipe,
    MyQuestionsComponent,
    AllQuestionsComponent,
    QuestComponent,
    ReportComponent,
    CommentBoxComponent,
    CommentComponent,
    ReportCommentComponent,
    PolicyComponent,
    GuidelinesComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModules,
    MainRoutingModule, // lagi meron ditong import ng MainRoutingModule
    FontAwesomeModule,
    NgxPaginationModule,
    QuillModule,
  ],
})
export class MainModule {}
