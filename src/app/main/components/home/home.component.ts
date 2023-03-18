import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { PostFormComponent } from '../post-form/post-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faArrowUp,
  faArrowDown,
  faComments,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

import { SearchPipe } from 'src/app/shared/filter.pipe';
import { ReportComponent } from '../report/report.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  title = 'pagination';
  page: number = 1;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [5, 10, 15, 20];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  durationInSeconds = 2;

  //*Search KEY
  searchKey: string = '';

  searchKeyTwo: string ='';

  filteredList : any = [];

  email_add: any;
  fname_fld: any;
  mname_fld: any;
  lname_fld: any;

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
    private route: Router,
    private activateRoute: ActivatedRoute
  ) {}

  filterFromSearch(){
    this.allTags = this.filteredList
    this.allTags = this.allTags.filter((o:any) =>
    Object.keys(o).some((k:any) => {
      if (k == 'id' || k == 'remember_token' || 'tags'){
        return this.allTags;
      }else {
        return o[k].toLowerCase().includes(this.searchKeyTwo.toLowerCase())
      }
    }
    ));
  }

  allTags: any[] = [];
  ngOnInit(): void {
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    console.log(JSON.parse(retrievedData));
    let fullData: any = JSON.parse(retrievedData);

    this.email_add = fullData.email_add;
    this.fname_fld = fullData.fname_fld;
    this.mname_fld = fullData.mname_fld;
    this.lname_fld = fullData.lname_fld;

    // const message = 'Welcome, ' + this.fname_fld + ' ' + this.mname_fld + ' ' +  this.lname_fld;
    // this.snackbar.open(message , '' , {
    //   duration: this.durationInSeconds * 1000,
    // });
    this._apiService.search.subscribe((val: any) => {
      this.searchKey = val;
    });

    //instances//
    this.getTotalPost();
    this.getAllData();

    this.searchTags();
    // this.onTableSizeChange(this.getAllData);

    this._apiService.request('tags', '', '', 'get').subscribe(
      (res: any) => {
        console.log(
          '🚀 ~ file: home.component.ts:83 ~ HomeComponent ~ this._apiService.request ~ res',
          res
        );
        this.allTags = res;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  searchTags(){
    this._apiService.searchTwo.subscribe((val: any) => {
      this.searchKeyTwo = val;

    });
  }

  filterTag(item?: any) {
    console.log(item);
    this.getAllData(item.tags);
  }

  reportPost(post_id: any) {
    console.log(post_id);

    this.dialog.open(ReportComponent, {
      maxHeight: '40vh',
      maxWidth: '100vw',
      data: {
        post_id: post_id,
      },
    });
  }

  bookMarks: any;
  setBookmark(post_id: any) {
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    let fullData: any = JSON.parse(retrievedData);

    let id = fullData.id;

    this._apiService
      .request('setBookmarks', '', { id: id, post_id: post_id }, 'post')
      .subscribe((res: any) => {
        this.bookMarks = res;

        const message = 'Bookmark added sucessfully!';
        this.snackbar.open(message, '', {
          duration: this.durationInSeconds * 1000,
        });
        console.log(this.bookMarks);
      });
  }

  votes: any;
  upVotes(user_id: any, post_id: any) {
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    let fullData: any = JSON.parse(retrievedData);

    let id = fullData.id;

    this._apiService
      .request('addVotes/' + id + '/' + post_id, '', this.posts$, 'post')
      .subscribe((res: any) => {
        this.votes = res;
        this.getAllData();
        console.log(this.votes);
      });
  }

  downVotes(user_id: any, post_id: any) {
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    let fullData: any = JSON.parse(retrievedData);

    let id = fullData.id;

    this._apiService
      .request('minusVotes/' + id + '/' + post_id, '', this.posts$, 'post')
      .subscribe((res: any) => {
        this.votes = res;
        this.getAllData();
        console.log(this.votes);
      });
  }

  returnTags(tags: any) {
    let temp: any = [];
    let array = tags.split(',');
    array.forEach((element: any) => {
      temp.push({ name: element });
    });

    return temp;
  }

  showLoader = false;
  // limit : number = 5
  getAllData(tag: any = '') {
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    let fullData: any = JSON.parse(retrievedData);

    let id = fullData.id;

    this.showLoader = true;
    this._apiService
      .request('showAll/' + id + '/' + tag, '', this.posts$, 'get')
      .subscribe((res: any) => {
        console.log(res);

        this.posts$ = res;
        this.posts$.forEach((element) => {
          element.tags = this.returnTags(element.tags);
        });

        // this.posts$ = this.posts$.filter((value, index, self) =>
        // index === self.findIndex((t) => (
        //   t.id=== value.id
        // ))
        // )

        // let temp : any= []
        // let ctr = 0;
        // //limit
        // this.posts$.forEach(element => {
        //   if (ctr < limit) {
        //    temp.push(element)
        //   }
        //   ctr++;
        // });

        // this.posts$ = temp;
        this.showLoader = false;
      });
  }

  // openModal(){
  //   this.postForm.show();
  // }
  goToPost(id: number): void {
    this.route.navigateByUrl('main/view-post/' + id);
  }

  openDialog() {
    this.dialog.open(PostFormComponent, {
      width: '98vh',

      maxWidth: '100vw',
    });
  }

  total_post: any = [];

  getTotalPost() {
    this._apiService.request('countAll', '', '', 'get').subscribe(
      (res: any) => {
        this.total_post = res.post_total;
        // console.log(this.total_post);
      },
      (error: any) => {
        console.log('Error', error);
      }
    );
  }

  /*Pagination */
  onTableDataChange(event: any) {
    this.page = event;
    this.getAllData();
  }

  onTableSizeChange(event: any): void {
    // this.getAllData(event.target.value);
    this.tableSize = event.target.value;
    this.page = 1;
    this.getAllData();
  }
  /*Pagination */
}
