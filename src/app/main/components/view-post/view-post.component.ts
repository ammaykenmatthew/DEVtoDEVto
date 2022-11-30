import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Posts } from 'src/app/services/data.schema';
import { throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.scss']
})
export class ViewPostComponent implements OnInit {

  postId: any;
  posts$: Array<any> = [];

  constructor(
    private _apiService: AuthService,
    private postService: UserService,
    private activateRoute: ActivatedRoute,
    private _location: Location,

    )
    {

    let id:any = this.activateRoute.snapshot.params['id'];
     this._apiService.request('showOnePostby/'+id, '', this.posts$, 'get').subscribe((res:any)=>{
     this.posts$ = res;
      console.log(this.posts$);
     }, (error: any)=>{
      console.log ("Error", error);
     });

     }

  ngOnInit(): void {

  }

  goBack(){
    this._location.back();
  }

}
