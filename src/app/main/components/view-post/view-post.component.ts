import { Component,Inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Comments, Posts } from 'src/app/services/data.schema';
import { throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import {Location} from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef , MAT_DIALOG_DATA} from '@angular/material/dialog';
import { faComment, faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.scss']
})
export class ViewPostComponent implements OnInit {

  isShowDiv = false;
  faComment = faComment;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;

  visible:boolean = false;

  postId: any;
  posts$: Array<any> = [];
  comments: Array<any> = [];

  commentForm!: FormGroup;
  replyForm!: FormGroup;
  comments$$: Array<Comments> = [];

  durationInSeconds = 2;

  fname_fld:any;
  mname_fld:any;
  lname_fld:any;

  constructor(
    private _apiService: AuthService,
    private postService: UserService,
    private activateRoute: ActivatedRoute,
    private _location: Location,
    private formBuilder: FormBuilder,
    public snackbar: MatSnackBar,

    )
  { }

  ngOnInit(): void {
    this.commentForm = this.formBuilder.group({
      content: ['', Validators.required],
    });

    this.replyForm = this.formBuilder.group({
      replyContent: ['', Validators.required],
    });

    this.viewComment();

    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    let fullData:any = JSON.parse(retrievedData);

    this.fname_fld = fullData.fname_fld;
    this.mname_fld = fullData.mname_fld;
    this.lname_fld = fullData.lname_fld;

    // if(this.editData){
    //   this.postForm.controls['title'].setValue(this.editData.title);
    //   this.postForm.controls['description'].setValue(this.editData.description);
    // }
    this.showOnePost();
  }

  onClick(){

    this.visible = !this.visible;
  }

  showLoader = false;
  showOnePost(){
    this.showLoader = true;
    let id:any = this.activateRoute.snapshot.params['id'];
     this._apiService.request('showOnePostby/'+id, '', this.posts$, 'get').subscribe((res:any)=>{
     this.posts$ = res;
     this.showLoader = false;

      console.log(this.posts$);
     }, (error: any)=>{
      console.log ("Error", error);
     });
  }

  goBack(){
    this._location.back();
  }

  postComment(){
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    let fullData:any = JSON.parse(retrievedData);

    let user_id = fullData.id;
    let post_id:any = this.activateRoute.snapshot.params['id'];

  if(this.commentForm.valid){
    this._apiService.request('storeComment/'+user_id +'/'+ post_id, '', this.commentForm.value, 'post').subscribe((res:any)=>{

      this.comments$$ = res;
      this.commentForm.reset();
      this.viewComment();

      const message = 'Commented sucessfully!';
        this.snackbar.open(message , '' , {
          duration: this.durationInSeconds * 1000,
        });
    }), (error: any)=>{
      alert("Error posting data...");
      console.log("Error posting data", error);
    }
  }

  }
  dateCreated:any;

  /*View Comments per post  */
  viewComment(){
    let post_id:any = this.activateRoute.snapshot.params['id'];
    this._apiService.request('showAllwithComments/'+post_id , '',  '', 'get').subscribe((res:any)=>{
    this.comments = res;

    console.log(this.comments)

    }), (error: any)=>{
      alert("Error posting data...");
      console.log("Error posting data", error);
    }

  }

  total_comment: any = [];

  getTotalPost(){
    this._apiService.request('countAll', '', '', 'get').subscribe((res:any)=>{

      this.total_comment = res.post_total;

      // console.log(this.total_post);
    },(error: any)=>{
      console.log ("Error", error);
     });
  }


  replyComment(comment:any){
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    let fullData:any = JSON.parse(retrievedData);

    let user_id = fullData.id;


  if(this.replyForm.valid){
    this._apiService.request('createReply/'+user_id +'/'+ comment.comments.id, '', this.replyForm.value, 'post').subscribe((res:any)=>{

      this.comments$$ = res;
      this.replyForm.reset();
      this.viewComment();

      console.log(this.replyForm.value)

      const message = 'Commented sucessfully!';
        this.snackbar.open(message , '' , {
          duration: this.durationInSeconds * 1000,
        });
    }), (error: any)=>{
      alert("Error posting data...");
      console.log("Error posting data", error);
    }
  }

  }


  // toggleReply(){
  //   this.isShowDiv = true;
  //   return this.isShowDiv;
  // }


}
