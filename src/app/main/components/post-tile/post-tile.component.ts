import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {faArrowUp, faArrowDown, faComments} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { Posts } from 'src/app/services/data.schema';

@Component({
  selector: 'app-post-tile',
  templateUrl: './post-tile.component.html',
  styleUrls: ['./post-tile.component.scss']
})
export class PostTileComponent implements OnInit {

  posts$: Array<any> = [];
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faComments = faComments;

  fname_fld:any;

  constructor(
    private _apiService: AuthService,
    private route: Router
    ) {

      this._apiService.request('showAll', '', this.posts$, 'get').subscribe((res:any)=>{
        this.posts$ = res;

        console.log(res);
      });
   }

  ngOnInit(): void {
  }

  goToPost(id: number): void{

    this.route.navigateByUrl('main/view-post/' + id);
  }


}
