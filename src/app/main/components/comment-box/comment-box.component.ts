import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Comments } from 'src/app/services/data.schema';
import {Location} from '@angular/common';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.scss'],
})
export class CommentBoxComponent implements OnInit {
  @Output() add = new EventEmitter<string>();
  value!: string;

  durationInSeconds = 2;

  comment:any;
  commentForm!: FormGroup;
  replyForm!: FormGroup;
  comments$$: Array<Comments> = [];

  constructor(
    private _apiService: AuthService,
    private activateRoute: ActivatedRoute,
    private _location: Location,
    private formBuilder: FormBuilder,
    public snackbar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.replyForm = this.formBuilder.group({
      replyContent: ['', Validators.required],
    });
  }

  post() {
    if (this.value.trim()) {
      this.add.emit(this.value);
      this.value = '';
    }
  }

replyComment(comment: any) {
  let retrievedData = localStorage.getItem('userdata') as unknown as string;
  let fullData: any = JSON.parse(retrievedData);

  let user_id = fullData.id;

  if (this.replyForm.valid) {
    this._apiService
      .request(
        'createReply/' + user_id + '/' + comment.comments.id,
        '',
        this.replyForm.value,
        'post'
      )
      .subscribe((res: any) => {
        this.comments$$ = res;
        this.replyForm.reset();


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

}
