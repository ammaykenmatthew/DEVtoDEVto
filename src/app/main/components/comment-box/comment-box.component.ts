import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Comments } from 'src/app/services/data.schema';
import { Location } from '@angular/common';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.scss'],
})
export class CommentBoxComponent implements OnInit {
  @Output() add = new EventEmitter<string>();
  @Input() commentdata!: any;
  value!: string;

  durationInSeconds = 2;

  commentForm!: FormGroup;
  replyForm!: FormGroup;
  comments$$: Array<Comments> = [];

  constructor(
    private _apiService: AuthService,
    private activateRoute: ActivatedRoute,
    private _location: Location,
    private formBuilder: FormBuilder,
    public snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.replyForm = this.formBuilder.group({
      replyContent: ['', Validators.required],
    });
    console.log(this.commentdata);
  }

  post() {
    if (this.value.trim()) {
      this.add.emit(this.value);
      this.value = '';
    }
  }

  replyComment() {
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    let fullData: any = JSON.parse(retrievedData);

    let user_id = fullData.id;

    if (this.value) {
      this._apiService
        .request(
          'storeComment/' + user_id + '/' + this.commentdata.post_id,
          '',
          { content: this.value, parent_id: this.commentdata.id },
          'post'
        )
        .subscribe((res: any) => {
          console.log(res);

          this.add.emit(res.comment);

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
