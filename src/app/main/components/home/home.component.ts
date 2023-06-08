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
  faCaretUp,
  faCaretDown,
  faThumbsDown,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

import { SearchPipe } from 'src/app/shared/filter.pipe';
import { ReportComponent } from '../report/report.component';

import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment.prod';
import { PolicyComponent } from '../policy/policy.component';
import { GuidelinesComponent } from '../guidelines/guidelines.component';

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

  image = environment.image;

  durationInSeconds = 2;

  //*Search KEY
  searchKey: string = '';

  searchKeyTwo: string = '';

  filteredList: any = [];

  profilepic_fld: any;
  email_add: any;
  fname_fld: any;
  mname_fld: any;
  lname_fld: any;
  role: any;


  posts$: Array<any> = []; //why array? try not array

  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faComments = faComments;
  faSearch = faSearch;
  faCaretUp = faCaretUp;
  faCaretDown = faCaretDown;
  faThumbsDown = faThumbsDown;
  faThumbsUp = faThumbsUp;

  // fname_fld:any;
  isAllowedToPost = false;
  isAllowedToPostLoading = true;
  constructor(
    public snackbar: MatSnackBar,
    private dialog: MatDialog,
    private _apiService: AuthService,
    private route: Router,
    private activateRoute: ActivatedRoute
  ) {}


  //this is not being used anymore ==
  filterFromSearch() {
  this.allTags = this.filteredList;
  this.allTags = this.allTags.filter((o: any) =>
    Object.keys(o).some((k: any) => {
      if (k === 'id' || k === 'remember_token' || k === 'tags') {
        return false;
      } else {
        return typeof o[k] === 'string' && o[k].toLowerCase().includes(this.searchKeyTwo.toLowerCase());
      }

    })

  );
}
// ==

  id:any;
  totalCredits : number = 0;
  allTags: any[] = [];
  ngOnInit(): void {
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    console.log(JSON.parse(retrievedData));
    let fullData: any = JSON.parse(retrievedData);

    this.profilepic_fld = fullData.profilepic_fld;
    this.email_add = fullData.email_add;
    this.fname_fld = fullData.fname_fld;
    this.mname_fld = fullData.mname_fld;
    this.lname_fld = fullData.lname_fld;
    this.role = fullData.role;


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
    this.getAllHiddenPosts();

    this.searchTags();
    // this.onTableSizeChange(this.getAllData);

    // this._apiService.request('tags', '', '', 'get').subscribe(
    //   (res: any) => {
    //     console.log(
    //       '🚀 ~ file: home.component.ts:83 ~ HomeComponent ~ this._apiService.request ~ res',
    //       res
    //     );
    //     this.allTags = res;
    //   },
    //   (error: any) => {
    //     console.log(error);
    //   }
    // );

    interface Tag {
      name: string;
      count: number;
    }

    this._apiService.request('tags', '', '', 'get').subscribe(
      (res: Tag[]) => {
        console.log('🚀 ~ file: home.component.ts:83 ~ HomeComponent ~ this._apiService.request ~ res', res);

        // Sort tags based on count
        const sortedTags = res.sort((a: Tag, b: Tag) => b.count - a.count);

        // Select only the top 10 tags
        this.allTags = sortedTags.slice(0, 10);

      },
      (error: any) => {
        console.log(error);
      }
    );

    this._apiService
      .request('isAllowedToPost/' + fullData.id, '', '', 'get')
      .subscribe(
        (res: any) => {
          console.log(res);

          this.isAllowedToPost = res.isAllowedToPost;
          this.isAllowedToPostLoading = false;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  deletedData: any;
  deletePostAsModerator(id: any) {
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
          .request('deletePost/' + id, '', '', 'delete')
          .subscribe(
            (res: any) => {
              this.deletedData = res;
              window.location.reload();
              const message = 'Deleted Succesfully!';
              this.snackbar.open(message, '', {
                duration: this.durationInSeconds * 1000,
              });
            },
            (error: any) => {
              console.log('Error', error);
            }
          );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  //for Hiding Post


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

  closePostRequest(post: any) {
    Swal.fire({
      title: 'Close Post?',
      text: 'Request to close this post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, close it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
    this._apiService
      .request('requestModerator/' + post.id + '/' + 'pending', '', '', 'post')
      .subscribe(
        (res: any) => {
          post.post_status = 'pending';
          this.snackbar.open(res.message, '', {
            duration: this.durationInSeconds * 1000,
          });
        },
        (error: any) => {
          console.log('Error', error);
        }
      );
       }
    })
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

  searchTags() {
    this._apiService.searchTwo.subscribe((val: any) => {
      this.searchKeyTwo = val;
    });
  }

  //this is for filtering the post based on tags that has been clicked
  filterTag(item?: any) {
    console.log(item);
    this.getAllData(item.tags);

  }
  //try for fixing the search tag -- 5/6/23
  searchData:any;

  get_the_tag(){
    this._apiService
    .request('searchTags/', '', { searchKeyTwo: this.searchKeyTwo }, 'get')
    .subscribe((res:any) => {
      this.searchData = res;
    });
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
  hiddenPosts: any[] = [];

  hidePost(postId: any) {
    const retrievedData = localStorage.getItem('userdata');
    const fullData: any = JSON.parse(retrievedData || '{}');
    const userId = fullData.id;

    this._apiService.request('hidePost', '', { user_id: userId, post_id: postId }, 'post').subscribe(
      (res: any) => {
        const hiddenPost = res.hidden_post;

        // Add the hidden post to the local hiddenPosts array
        this.hiddenPosts.push(hiddenPost);

        // Update the hiddenPosts in local storage
        localStorage.setItem('hiddenPosts', JSON.stringify(this.hiddenPosts));

        // ... Update UI to hide the post ...

        const message = 'Post has been hidden successfully!';
        this.snackbar.open(message, '', {
          duration: this.durationInSeconds * 1000,
        });

        console.log(this.hiddenPosts);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }



  isPostHidden(postId: string): boolean {
    const retrievedData = localStorage.getItem('userdata');
    const fullData: any = JSON.parse(retrievedData || '{}');
    const userId = fullData.id; // Helper function to get the user ID

    if (!this.hiddenPosts || !Array.isArray(this.hiddenPosts)) {
      return false; // Return false if hiddenPosts is not defined or not an array
    }

    return this.hiddenPosts.some((post: any) => post.post_id === postId && post.user_id === userId);
  }



getUserIdFromLocalStorage(): string {
  const retrievedUserData = localStorage.getItem('userdata');
  const fullData: any = JSON.parse(retrievedUserData || '{}');
  return fullData.id || '';
}

getAllHiddenPosts() {
  const retrievedData = localStorage.getItem('userdata');
  const fullData: any = JSON.parse(retrievedData || '{}');
  const userId = fullData.id;

   // Load hidden posts from local storage if available
   const storedHiddenPosts = localStorage.getItem('hiddenPosts');
   if (storedHiddenPosts) {
     this.hiddenPosts = JSON.parse(storedHiddenPosts);
   }

  this._apiService.request('getHiddenPosts/' + userId, '', '', 'get').subscribe(
    (res: any) => {
      this.hiddenPosts = res.hidden_post;
      console.log(this.hiddenPosts);
    },
    (error: any) => {
      console.error(error);
    }
  );
}

//   hiddenPosts: any[] = [];

//   hidePost(postId: any) {
//     const retrievedData = localStorage.getItem('userdata');
//     const fullData: any = JSON.parse(retrievedData || '{}');
//     const userId = fullData.id;

//     console.log(userId);

//     this._apiService.request('hidePost', '', { user_id: userId, post_id: postId }, 'post').subscribe(
//       (res: any) => {
//         const hiddenPost = res.hidden_post;

//         // Initialize hiddenPosts if it's not already an array
//         if (!Array.isArray(this.hiddenPosts)) {
//           this.hiddenPosts = [];
//         }

//         // Add the hidden post to the local hiddenPosts array
//         this.hiddenPosts.push(hiddenPost);

//         // Find the index of the post in the posts$ array and remove it
//         const postIndex = this.posts$.findIndex((post: any) => post.id === postId);

//         if (postIndex !== -1) {
//           this.posts$.splice(postIndex, 1);
//         }

//         const message = 'Post has been hidden successfully!';
//         this.snackbar.open(message, '', {
//           duration: this.durationInSeconds * 1000,
//         });

//         console.log(this.hiddenPosts);
//       },
//       (error: any) => {
//         console.error(error);
//       }
//     );
//   }

// isPostHidden(postId: string): boolean {
//   const retrievedData = localStorage.getItem('userdata');
//   const fullData: any = JSON.parse(retrievedData || '{}');
//   const userId = fullData.id; // Helper function to get the user ID

//   if (!this.hiddenPosts || !Array.isArray(this.hiddenPosts)) {
//     return false; // Return false if hiddenPosts is not defined or not an array
//   }
//   return this.hiddenPosts.some((post: any) => post.id === postId && post.user_id === userId);
// }


// getUserIdFromLocalStorage(): string {
//   const retrievedUserData = localStorage.getItem('userdata');
//   const fullData: any = JSON.parse(retrievedUserData || '{}');
//   return fullData.id || '';
// }

// getAllHiddenPosts() {
//   const retrievedData = localStorage.getItem('userdata');
//   const fullData: any = JSON.parse(retrievedData || '{}');
//   const userId = fullData.id;

//   this._apiService.request('getHiddenPosts/' + userId, '', '', 'get').subscribe(
//     (res: any) => {
//       this.hiddenPosts = res.hidden_post;
//       console.log(this.hiddenPosts);
//     },
//     (error: any) => {
//       console.error(error);
//     }
//   );
// }


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

        this.showLoader = false;
      });
  }

  // openModal(){
  //   this.postForm.show();
  // }
  goToPost(id: number): void {
    this.route.navigateByUrl('main/view-post/' + id);
  }

  //OPEN POST FORM DIALOG
  openDialog() {
    this.dialog.open(PostFormComponent, {
      width: '98vh',
      maxWidth: '100vw',
    });
  }

  openTermsPrivacy(){
    this.dialog.open(PolicyComponent, {
      width: '98vh',
      maxWidth: '100vw',
    });
  }

  openGuidelines(){
    this.dialog.open(GuidelinesComponent, {
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
