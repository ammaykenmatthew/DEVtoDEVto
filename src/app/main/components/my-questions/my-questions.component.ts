import { Component, OnInit, ViewChild} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import { PostFormComponent } from '../post-form/post-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import {faArrowUp, faArrowDown, faComments, faSearch,  faThumbsDown,
  faThumbsUp} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

import { SearchPipe } from 'src/app/shared/filter.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-questions',
  templateUrl: './my-questions.component.html',
  styleUrls: ['./my-questions.component.scss']
})
export class MyQuestionsComponent implements OnInit {


  title= 'pagination';
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: any = [5, 10, 15, 20];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  durationInSeconds = 2;

  //*Search KEY
  searchKey:string = "";
  public searchTerm: string = '';

  id:any;
  email_add:any;
  fname_fld:any;
  mname_fld:any;
  lname_fld:any;

  posts$: Array<any> = []; //why array? try not array
  comments: Array<any> = [];

  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faComments = faComments;
  faSearch = faSearch;
  faThumbsDown = faThumbsDown;
  faThumbsUp = faThumbsUp;

  // fname_fld:any;
  isPostVisited: boolean = false;

  constructor(
    public snackbar: MatSnackBar,
    private dialog: MatDialog,
    private _apiService: AuthService,
    private route: Router,
    private activateRoute: ActivatedRoute,

    ){ }

  ngOnInit(): void {
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    console.log(JSON.parse(retrievedData));
    let fullData:any = JSON.parse(retrievedData);

    this.id = fullData.user_id;
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

    this.activateRoute.queryParams.subscribe(params => {
      this.isPostVisited = params['visited'] === 'true';
    });
    //instances//

    this.getAllPosts();
  }


  returnTags(tags:any){
    let temp:any = [];
    let array = tags.split(',');
      array.forEach((element:any) => {
        temp.push({name:element});

      });

      return temp;
  }

  search(event:any){
    this.searchTerm = (event.target as HTMLInputElement).value;
    // console.log(this.searchTerm);
    this._apiService.search.next(this.searchTerm);
  }

  showLoader = false;
  getAllPosts(){
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    let fullData:any = JSON.parse(retrievedData);

    let user_id = fullData.id;

    this._apiService.request('showUserPostby/'+user_id, '', '', 'get').subscribe((res:any)=>{
      this.posts$ = res;
      this.showLoader = true;
      this.posts$.forEach(element => {
        element.tags= this.returnTags(element.tags);
      });
      console.log(res);
      this.showLoader = false;

    }), (error: any)=>{
      alert("Error posting data...");
      console.log("Error posting data", error);
    }
  }

  hideBadge(event: any) {
    event.target.style.display = 'none';
  }

  // goToPost(id: number): void{
  //   this.route.navigateByUrl('main/view-post/' + id + '?visited=true');

  //   const post = this.posts$.find(post => post.id === id); // Find the post object by its id
  //   if (post) {
  //     post.hasNewComments = false; // Reset the flag to hide the badge
  //   }
  // }
  goToPost(id: number): void {
    this.route.navigateByUrl(`main/view-post/${id}?visited=true`);

    const post = this.posts$.find(post => post.id === id);
    if (post) {
      post.visited = true;
      post.hasNewComments = false;

      // Update the visited flag in the database using an API request
      this._apiService.request('updateVisitedFlag/' + id, '', '', 'post').subscribe(
        (res: any) => {
          console.log('Visited flag updated successfully');
        },
        (error: any) => {
          console.log('Error updating visited flag', error);
        }
      );

      console.log('Visited:', post.visited);
      console.log('Has new comments:', post.hasNewComments);
    }
  }



  editQuestions(row: any){
    this.dialog.open(PostFormComponent,{

      width: '98vh',
      maxWidth: '100vw',
      data:row
    });
  }

  deletedData:any;
  deleteQuestions(id: any){
    Swal.fire({
      title: 'Delete Post?',
      text: 'Are you sure you want to delete this post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this._apiService.request('deletePost/'+id, '', '', 'delete').subscribe((res:any ) =>{

          this.deletedData = res;
          window.location.reload();
          const message = 'Deleted Succesfully!';
            this.snackbar.open(message , '' , {
              duration: this.durationInSeconds * 1000,
            });

        },(error: any)=>{
          console.log ("Error", error);
         });
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }

  // openModal(){
  //   this.postForm.show();
  // }
  archivedData:any;
  archiveQuestion(id: any){
    Swal.fire({
      title: 'Delete Post?',
      text: 'Are you sure you want to delete this post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this._apiService.request('archivePost/'+id, '', '', 'post').subscribe((res:any ) =>{

          this.archivedData = res;
          this.posts$ = this.posts$.filter(post => post.id !== id);

          window.location.reload();
          const message = 'Deleted Succesfully!';
            this.snackbar.open(message , '' , {
              duration: this.durationInSeconds * 1000,
            });

        },(error: any)=>{
          console.log ("Error", error);
         });
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }




  openDialog(){
    this.dialog.open(PostFormComponent, {
        width: '98vh',
        height: '90vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
    });
  }

  closePost(post: any) {
    Swal.fire({
      title: 'Close Post?',
      text: 'Are you sure you want to close this post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, close it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.value) {
        this._apiService
          .request('setPostStatus/' + post.id + '/' + 'close', '', '', 'post')
          .subscribe(
            (res: any) => {
              post.post_status = 'close';
              this.snackbar.open(res.message, '', {
                duration: this.durationInSeconds * 1000,
              });
            },
            (error: any) => {
              console.log('Error', error);
            }
          );
      }
    });
  }

  declineRequest(post: any) {
    Swal.fire({
      title: 'Decline Request?',
      text: 'Are you sure you want to decline the request to close this post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, decline it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this._apiService
          .request('setPostStatus/' + post.id + '/' + 'open', '', '', 'post')
          .subscribe(
            (res: any) => {
              post.post_status = 'open';
              this.snackbar.open('Request to close the post has been declined.', '', {
                duration: this.durationInSeconds * 1000,
              });
            },
            (error: any) => {
              console.log('Error', error);
            }
          );
      }
    });
  }


  openPost(post: any) {
    this._apiService
      .request('setPostStatus/' + post.id + '/' + 'open', '', '', 'post')
      .subscribe(
        (res: any) => {
          post.post_status = 'open';
          this.snackbar.open(res.message, '', {
            duration: this.durationInSeconds * 1000,
          });
        },
        (error: any) => {
          console.log('Error', error);
        }
      );
  }


}
