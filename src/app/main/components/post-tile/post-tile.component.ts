import { Component, OnInit } from '@angular/core';
import {faArrowUp, faArrowDown, faComments} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { Posts } from 'src/app/services/data.schema';

@Component({
  selector: 'app-post-tile',
  templateUrl: './post-tile.component.html',
  styleUrls: ['./post-tile.component.scss']
})
export class PostTileComponent implements OnInit {

  posts$: Array<Posts> = [];
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faComments = faComments;

  constructor(private _apiService: AuthService,) {
      this._apiService.request('showAll', '', this.posts$, 'get').subscribe((res:any)=>{
        this.posts$ = res;

      });
   }

  ngOnInit(): void {
  }

}
