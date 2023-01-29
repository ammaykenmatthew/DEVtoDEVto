import { Component, OnInit, ViewChild} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import { PostFormComponent } from '../post-form/post-form.component';
import { Router } from '@angular/router';
import {faArrowUp, faArrowDown, faComments, faSearch} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

import { SearchPipe } from 'src/app/shared/filter.pipe';

@Component({
  selector: 'app-all-questions',
  templateUrl: './all-questions.component.html',
  styleUrls: ['./all-questions.component.scss']
})
export class AllQuestionsComponent implements OnInit {



  title= 'pagination';
  page: number = 1;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [5, 10, 15, 20];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  durationInSeconds = 2;

  //*Search KEY
  searchKey:string = "";

  email_add:any;
  fname_fld:any;
  mname_fld:any;
  lname_fld:any;

  posts$: Array<any> = []; //why array? try not array

  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faComments = faComments;
  faSearch = faSearch;

  // fname_fld:any;


  constructor(
    public snackbar: MatSnackBar,
    private dialog: MatDialog,
    private _apiService: AuthService,
    private route: Router
    ){}



  ngOnInit(): void {
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    console.log(JSON.parse(retrievedData));
    let fullData:any = JSON.parse(retrievedData);

    this.email_add = fullData.email_add;
    this.fname_fld = fullData.fname_fld;
    this.mname_fld = fullData.mname_fld;
    this.lname_fld = fullData.lname_fld;

    // const message = 'Welcome, ' + this.fname_fld + ' ' + this.mname_fld + ' ' +  this.lname_fld;
    // this.snackbar.open(message , '' , {
    //   duration: this.durationInSeconds * 1000,
    // });
    this._apiService.search.subscribe((val:any)=>{
      this.searchKey = val;
    });

    //instances//
    this.getTotalPost();
    this.getAllData();
    this.onTableDataChange(event); //fix fix
  }


  returnTags(tags:any){
    let temp:any = [];
    let array = tags.split(',');
      array.forEach((element:any) => {
        temp.push({name:element});

      });

      return temp;
  }

  bookMarks:any
  setBookmark(post_id:any){
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    let fullData:any = JSON.parse(retrievedData);

    let id = fullData.id;

    this._apiService.request('setBookmarks' ,'', {id:id , post_id:post_id}, 'post').subscribe((res:any)=>{

      this.bookMarks = res;

      const message = 'Bookmark added sucessfully!';
      this.snackbar.open(message , '' , {
        duration: this.durationInSeconds * 1000,
      });
      console.log(this.bookMarks);
    });
  }

  showLoader = false;
  getAllData(){
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    let fullData:any = JSON.parse(retrievedData);

    let id = fullData.id;

    this.showLoader = true;
    this._apiService.request('showAllGlobal', '', this.posts$, 'get').subscribe((res:any)=>{

      this.posts$ = res;
      this.posts$.forEach(element => {
        element.tags= this.returnTags(element.tags);
      });
      this.showLoader = false;
      console.log(res);
    });
  }

  // openModal(){
  //   this.postForm.show();
  // }
  goToPost(id: number): void{

    this.route.navigateByUrl('main/view-post/' + id);
  }


  openDialog(){
    this.dialog.open(PostFormComponent, {
        width: '98vh',
        height: '90vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
    });
  }

  total_post: any = [];

  getTotalPost(){
    this._apiService.request('countAll', '', '', 'get').subscribe((res:any)=>{
      this.total_post = res.post_total;
      // console.log(this.total_post);
    },(error: any)=>{
      console.log ("Error", error);
     });
  }

/*Pagination */
  onTableDataChange(event: any){
    this.page = event;
    this.getAllData();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page= 1;
    this.getAllData();
  }
/*Pagination */

}
