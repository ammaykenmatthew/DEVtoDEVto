import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Comment } from './comment.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  @Input() comment?: any;
  @Input() post_status?: any;

  image = environment.image;

  isEditing = false;
  constructor() {}

  ngOnInit() {
    console.log(this.comment);
  }

  replyClick() {
    this.isEditing = !this.isEditing;
  }

  onAdd($event: any) {
    console.log($event);

    if (!this.comment.comments) {
      this.comment.comments = [];
    }
    this.comment.comments.unshift($event);
    this.isEditing = false;
  }
}
