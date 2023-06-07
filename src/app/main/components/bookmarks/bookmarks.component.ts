import { Component, OnInit } from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {ProgressBarMode} from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {

  image = environment.image;

  durationInSeconds = 2;

  email_add:any;
  fname_fld:any;
  mname_fld:any;
  lname_fld:any;

  bookmarks:any;
  constructor(
    private _apiService: AuthService,
    public snackbar: MatSnackBar,
    private route: Router,
  ) { }

  ngOnInit(): void {


    //userdata

   this.showBookmarks();
   this.getAllHiddenPosts();
  }

  goToPost(book_id: any): void{
    this.route.navigateByUrl('main/view-post/'+book_id);
    console.log(book_id);
  }

  showLoader = false;
  showBookmarks(){
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    let fullData:any = JSON.parse(retrievedData);

    this.email_add = fullData.email_add;
    this.fname_fld = fullData.fname_fld;
    this.mname_fld = fullData.mname_fld;
    this.lname_fld = fullData.lname_fld;

    let id = fullData.id;
    this.showLoader = true;
    this._apiService.request('getBookmarks/'+id ,'', '', 'get').subscribe((res:any)=>{

      this.bookmarks = res;
      this.showLoader = false;
      console.log(res);
    });

  }

  deletedData:any;
  remove(id:any){
    console.log(id)
    this._apiService.request('destroyBookmark/'+id ,'', '', 'delete').subscribe((res:any)=>{
      this.deletedData = res;
      console.log(res)
      this.showBookmarks();

      const message = 'Removed Succesfully!';
        this.snackbar.open(message , '' , {
          duration: this.durationInSeconds * 1000,
        });

    },(error: any)=>{
      console.log ("Error", error);
     });
  }

  // hiddenPosts:any;
  // showHiddenPosts(){
  //   let retrievedData = localStorage.getItem('userdata') as unknown as string;
  //   let fullData:any = JSON.parse(retrievedData);

  //   this.email_add = fullData.email_add;
  //   this.fname_fld = fullData.fname_fld;
  //   this.mname_fld = fullData.mname_fld;
  //   this.lname_fld = fullData.lname_fld;

  //   let id = fullData.id;
  //   this._apiService.request('getHiddenPosts/'+id ,'', '', 'get').subscribe((res:any)=>{

  //     this.hiddenPosts = res;

  //     console.log(res);
  //   });

  // }

  hiddenPosts: any[] = [];

  getAllHiddenPosts() {
    const retrievedData = localStorage.getItem('userdata');
    const fullData: any = JSON.parse(retrievedData || '{}');
    const userId = fullData.id;

    this._apiService.request('getHiddenPosts/' + userId, '', '', 'get').subscribe(
      (res: any) => {
        if (Array.isArray(res.hidden_post)) {
          this.hiddenPosts = res.hidden_post; // Assign the array of hidden posts to hiddenPosts
        } else {
          this.hiddenPosts = []; // If the response is not an array, assign an empty array
        }
        console.log(this.hiddenPosts);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }


  unhiddenPost: any;
  unhidePost(id: any) {
    console.log(id);
    this._apiService.request('unhidePost/' + id, '', '', 'delete').subscribe(
      (res: any) => {
        this.unhiddenPost = res;
        console.log(res);
        this.getAllHiddenPosts();

        const message = 'Removed Successfully!';
        this.snackbar.open(message, '', {
          duration: this.durationInSeconds * 1000,
        });
      },
      (error: any) => {
        console.error('Error:', error);
        const errorMessage = 'An error occurred while removing the post.';
        this.snackbar.open(errorMessage, '', {
          duration: this.durationInSeconds * 1000,
        });
      }
    );
  }





}
