import { Component, OnInit, Input } from '@angular/core';
import { Comment } from './comment.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  @Input() comment?: any;
  isEditing = false;
  constructor() {}

  ngOnInit() {
    console.log(this.comment);
  }

  replyClick() {
    this.isEditing = !this.isEditing;
  }

  onAdd($event: any) {
    const comment: Comment = {
      text: $event,
      username: 'Kevin',
      votes: 0,
      date: '1 min ago',
    };
    if (!this.comment.comments) {
      this.comment.comments = [];
    }
    this.comment.comments.unshift(comment);
    this.isEditing = false;
  }
}
