import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,Validators,FormBuilder } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';

export interface Fruit {
  name: string;
}

declare var window:any;

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  fruits: Fruit[] = [{name: 'Laravel'}, {name: 'Php'}, {name: 'Angular'}];

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push({name: value});
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(fruit: Fruit): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  postForm !: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private _apiService: AuthService,
    private dialogRef: MatDialogRef<PostFormComponent>,
  ) { }

  ngOnInit(): void {
    this.postForm = this.formBuilder.group({

      title: ['', Validators.required],
      description: ['', Validators.required],

    })
  }


  SavePost(){

    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    let fullData:any = JSON.parse(retrievedData);

    let user_id = fullData.id;
    if(this.postForm.valid){
      this._apiService.request('createPosts/'+user_id, '', this.postForm.value, 'post').subscribe((res:any)=>{
        alert("Post Successfull...")
        this.postForm.reset();
        this.dialogRef.close('post');
        console.log(res)
      }), (error: any)=>{
        alert("Error posting data...");
        console.log("Error posting data", error);
      }
    }

  }

}
