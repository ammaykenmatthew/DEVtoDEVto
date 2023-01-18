import { Component, OnInit } from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {ProgressBarMode} from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {

  durationInSeconds = 2;

  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  value = 50;
  bufferValue = 75;

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
  }

  goToPost(id: any): void{
    this.route.navigateByUrl('main/view-post/'+id);
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
  remove(book_id:any){
    this._apiService.request('destroy/'+book_id ,'', '', 'delete').subscribe((res:any)=>{
      this.deletedData = res;
      this.showBookmarks();

      const message = 'Removed Succesfully!';
        this.snackbar.open(message , '' , {
          duration: this.durationInSeconds * 1000,
        });

    },(error: any)=>{
      console.log ("Error", error);
     });
  }

}
