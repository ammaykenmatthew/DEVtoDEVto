import { Component, Inject, OnInit } from '@angular/core';
import { FormControl,FormGroup,Validators,FormBuilder } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

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


  // posts$: Array<any> = [];
  post: any;

  durationInSeconds = 2;

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
  actionBtn: string = "Save";

  constructor(
    private formBuilder: FormBuilder,
    private _apiService: AuthService,
    private dialogRef: MatDialogRef<PostFormComponent>,
    public snackbar: MatSnackBar,
    private activateRoute: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData: any,

  ) { }

  ngOnInit(): void {
    this.postForm = this.formBuilder.group({

      title: ['', Validators.required],
      description: ['', Validators.required],

    });
    if(this.editData){
      this.actionBtn = "Update";
      this.postForm.controls['title'].setValue(this.editData.title);
      this.postForm.controls['description'].setValue(this.editData.description);
    }
  }



  SavePost(){

    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    let fullData:any = JSON.parse(retrievedData);

    let user_id = fullData.id;
    if(!this.editData){
    if(this.postForm.valid){
      this._apiService.request('createPosts/'+user_id, '', this.postForm.value, 'post').subscribe((res:any)=>{
        this.post = res;
        this.postForm.reset();
        this.dialogRef.close('post');
        console.log(res)


        const message = 'Your post has been added sucessfully!';
        this.snackbar.open(message , '' , {
          duration: this.durationInSeconds * 1000,
        });

      }), (error: any)=>{
        alert("Error posting data...");
        console.log("Error posting data", error);
      }
    }

  }else{
    this.updatePost()
  }

  }

  updatePost(){
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    let fullData:any = JSON.parse(retrievedData);

    let user_id = fullData.id;

    let post_id:any = this.activateRoute.snapshot.params['id'];
    this._apiService.request('updatePosts/'+this.editData.id, '', this.postForm.value, 'put').subscribe((res:any)=>{
    this.post = res;
    alert("Updated Sucessfully");
    this.postForm.reset();
    this.dialogRef.close('update');
  }), (error: any)=>{
    alert("Error posting data...");
    console.log("Error posting data", error);
  }

  }
}
