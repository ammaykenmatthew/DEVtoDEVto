import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Comments, Posts } from 'src/app/services/data.schema';
import { from, merge, Observable, scan, Subject, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import {
  faComment,
  faArrowDown,
  faArrowUp,
} from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment.prod';
import { Comment } from '../comment/comment.model';
import { ReportCommentComponent } from '../report-comment/report-comment.component';
@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.scss'],
})
export class ViewPostComponent implements OnInit {
  image = environment.image;

  selectedFile!: string;
  files: any = [];
  fileChange = false;

  isShowDiv = false;
  faComment = faComment;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;

  visible: boolean = false;

  postId: any;
  posts$: Array<any> = [];
  comments: Array<any> = [];

  commentForm!: FormGroup;
  replyForm!: FormGroup;
  comments$$: Array<Comments> = [];

  durationInSeconds = 2;

  id: any;
  fname_fld: any;
  mname_fld: any;
  lname_fld: any;
  profilepic_fld: any;

  isPostVisited: boolean = false;

  constructor(
    private _apiService: AuthService,
    private postService: UserService,
    private activateRoute: ActivatedRoute,
    private _location: Location,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    public snackbar: MatSnackBar // @Inject(MAT_DIALOG_DATA) public post_id: {id: number},
  ) {
    this.activateRoute.queryParams.subscribe(params => {
      this.isPostVisited = params['visited'] === 'true';
    });
  }

  //EXTRA

  isEditing = false;
  replyClick() {
    this.isEditing = !this.isEditing;
  }

  editing = false;
  editedComment: any;
  comment: any;
  onEditSubmit() {
    // Update the comment content
    const updatedComment = {
      content: this.editedComment
    };

    // Make an HTTP PUT request to update the comment on the server
    const commentId = this.comment.comments.id;
    this._apiService.request('editComment/' + commentId, '', updatedComment, 'put')
      .subscribe(
        (res:any) => {
          // Handle the success response
          console.log()
          console.log('Comment updated:', res);
          this.editing = false; // Exit editing mode
        },
        (error:any) => {
          // Handle the error response
          console.error('Error updating comment:', error);
          // You can display an error message or handle the error accordingly
        }
      );
  }

  //EXTRA

  editComment(comment: any) {
    // Find the comment with the given id and set the editedComment variable to its content
    let commentId = comment.comments.id;
    console.log(commentId);
    // Set the editing variable to true to show the edit form
    this.editing = true;
  }

  totalCredits: number = 0;
  ngOnInit(): void {
    this.commentForm = this.formBuilder.group({
      content: ['', Validators.required],
    });

    this.replyForm = this.formBuilder.group({
      replyContent: ['', Validators.required],
    });

    this.viewComment();

    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    let fullData: any = JSON.parse(retrievedData);

    this.id = fullData.id;
    this.fname_fld = fullData.fname_fld;
    this.mname_fld = fullData.mname_fld;
    this.lname_fld = fullData.lname_fld;
    this.profilepic_fld = fullData.profilepic_fld;

    // if(this.editData){
    //   this.postForm.controls['title'].setValue(this.editData.title);
    //   this.postForm.controls['description'].setValue(this.editData.description);
    // }
    this.showOnePost();
  }

  onClick(comment: any) {
    if (comment.visible == true) {
      delete comment.visible; //toggle replies, hide
    } else {
      comment.visible = true; //add this key value pair, open replies
    }
  }

  quillConfig={
    //toolbar: '.toolbar',
    toolbar: {
      container: [
        ['bold', 'italic', 'underline',],        // toggled buttons
        ['code-block'],
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        //[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        //[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        //[{ 'direction': 'rtl' }],                         // text direction

        //[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        //[{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        //[{ 'font': [] }],
        //[{ 'align': [] }],


        //['link', 'image', 'video']
      ],

    }
  }

  showLoader = false;
  showOnePost() {
    this.showLoader = true;
    let id: any = this.activateRoute.snapshot.params['id'];
    console.log(id);
    this._apiService
      .request('showOnePostby/' + id, '', this.posts$, 'get')
      .subscribe(
        (res: any) => {
          console.log(res);
          this.posts$ = res;
          this.showLoader = false;

          console.log(this.posts$);

          this._apiService.request('addViews/' + id, '', '', 'post').subscribe(
            (res: any) => {

            },
            (error: any) => {
              console.log('Error', error);
            }
          );
        },
        (error: any) => {
          console.log('Error', error);
        }
      );
  }

  goBack() {
    this._location.back();
  }

  postComment() {
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    let fullData: any = JSON.parse(retrievedData);

    let user_id = fullData.id;
    let post_id: any = this.activateRoute.snapshot.params['id'];

    if (this.commentForm.valid) {
      this._apiService
        .request(
          'storeComment/' + user_id + '/' + post_id,
          '',
          this.commentForm.value,
          'post'
        )
        .subscribe((res: any) => {
          this.comments$$ = res;
          this.commentForm.reset();
          this.viewComment();

          const message = 'Commented sucessfully!';
          this.snackbar.open(message, '', {
            duration: this.durationInSeconds * 1000,
          });
        }),
        (error: any) => {
          alert('Error posting data...');
          console.log('Error posting data', error);
        };
    }
  }
  dateCreated: any;

  mycomments!: Observable<Array<any>>;
  src: any = [];
  commentAction$ = new Subject<any>();
  commentSubject$ = this.commentAction$.asObservable();
  commentStream$!: any;
  /*View Comments per post  */
  viewComment() {
    let post_id: any = this.activateRoute.snapshot.params['id'];
    this._apiService
      .request('showAllwithComments/' + post_id, '', '', 'get')
      .subscribe((res: any) => {
        this.comments = res;
        console.log(this.comments)
      }),
      (error: any) => {
        alert('Error posting data...');
        console.log('Error posting data', error);
      };
  }

   // this.src = res;
        // this.commentAction$ = new Subject<any>();
        // this.commentSubject$ = this.commentAction$.asObservable();
        // this.commentStream$ = merge(this.commentSubject$, from([res])).pipe(
        //   scan((acc: Array<any>, value: any) => [value, ...acc])

        // );

        // this.mycomments = this.commentStream$;

  total_comment: any = [];

  getTotalPost() {
    this._apiService.request('countAll', '', '', 'get').subscribe(
      (res: any) => {
        this.total_comment = res.post_total;

        // console.log(this.total_post);
      },
      (error: any) => {
        console.log('Error', error);
      }
    );
  }

  replyComment(comment: any) {
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    let fullData: any = JSON.parse(retrievedData);

    let user_id = fullData.id;

    if (this.replyForm.valid) {
      this._apiService.request('createReply/' + user_id + '/' + comment.comments.id,'',this.replyForm.value,'post').subscribe((res: any) => {
          this.comments$$ = res;
          this.replyForm.reset();
          this.viewComment();

          console.log(this.replyForm.value);

          const message = 'Commented sucessfully!';
          this.snackbar.open(message, '', {
            duration: this.durationInSeconds * 1000,
          });
        }),
        (error: any) => {
          alert('Error posting data...');
          console.log('Error posting data', error);
        };
    }
  }

  // toggleReply(){
  //   this.isShowDiv = true;
  //   return this.isShowDiv;
  // }

  unmarkAsAnswered(post: any) {
    this._apiService
      .request('setStatus/' + post.id + '/' + 'Pending', '', '', 'post')
      .subscribe(
        (res: any) => {
          post.status = 'Pending';
          this.snackbar.open('Successfully unmarked as answered', '', {
            duration: this.durationInSeconds * 1000,
          });
        },
        (error: any) => {
          console.log('Error', error);
        }
      );
  }

  markAsAnswered(post: any) {
    this._apiService
      .request('setStatus/' + post.id + '/' + 'Accepted', '', '', 'post')
      .subscribe(
        (res: any) => {
          post.status = 'Accepted';
          this.snackbar.open('Successfully marked as answered', '', {
            duration: this.durationInSeconds * 1000,
          });
        },
        (error: any) => {
          console.log('Error', error);
        }
      );
  }

  reportComment(comment_id: any) {
    console.log(comment_id);

    this.dialog.open(ReportCommentComponent, {
      maxHeight: '40vh',
      maxWidth: '100vw',
      data: {
        comment_id: comment_id,
      },
    });
  }

  openReportDialog(comment: any) {
    console.log(comment)
    const commentId = comment.comments.id; // Assuming 'id' is the property representing the comment's ID
    this.reportComment(commentId);
    console.log(commentId);


  }


}
