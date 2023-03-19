import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.scss'],
})
export class CommentBoxComponent implements OnInit {
  @Output() add = new EventEmitter<string>();
  value!: string;
  constructor() {}

  ngOnInit() {}

  post() {
    if (this.value.trim()) {
      this.add.emit(this.value);
      this.value = '';
    }
  }
}
