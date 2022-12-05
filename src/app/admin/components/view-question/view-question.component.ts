import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Comments } from 'src/app/services/data.schema';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-view-question',
  templateUrl: './view-question.component.html',
  styleUrls: ['./view-question.component.scss']
})
export class ViewQuestionComponent implements OnInit {

  postId: any;
  posts$: Array<any> = [];
  comments: Array<any> = [];

  commentForm!: FormGroup;
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
  {

    let id:any = this.activateRoute.snapshot.params['id'];
     this._apiService.request('showOnePostby/'+id, '', this.posts$, 'get').subscribe((res:any)=>{
     this.posts$ = res;
      console.log(this.posts$);
     }, (error: any)=>{
      console.log ("Error", error);
     });

  }

  ngOnInit(): void {
    this.commentForm = this.formBuilder.group({
      content: ['', Validators.required],
    });

    this.viewComment();

    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    let fullData:any = JSON.parse(retrievedData);

    this.fname_fld = fullData.fname_fld;
    this.mname_fld = fullData.mname_fld;
    this.lname_fld = fullData.lname_fld;


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
      console.log(this.commentForm.value);

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

  viewComment(){
    let post_id:any = this.activateRoute.snapshot.params['id'];
    this._apiService.request('showAllwithComments/'+post_id , '',  this.comments , 'get').subscribe((res:any)=>{
    this.comments = res;
    console.log(this.comments)
    }), (error: any)=>{
      alert("Error posting data...");
      console.log("Error posting data", error);
    }

  }

}
