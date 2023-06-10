import { Component, Inject, OnInit } from '@angular/core';
import { FormControl,FormGroup,Validators,FormBuilder } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';


export interface Tags {
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

  imageSrc!: string;
  fileChange = false;

  files:any =[];
  durationInSeconds = 2;

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags: Tags[] = [];

  //tags.toString();
  //tags = str.
  //let array = str.split(',');
  //str.split
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our tag
    if (value) {
      this.tags.push({name: value});
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tags: Tags): void {
    const index = this.tags.indexOf(tags);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  postForm !: FormGroup;
  actionBtn: string = "Post";
  titleForm: string = "Ask";
  public submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private _apiService: AuthService,
    private dialogRef: MatDialogRef<PostFormComponent>,
    public snackbar: MatSnackBar,
    private activateRoute: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public editData: any,

  ) {

   }

  ngOnInit(): void {
    this.postForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      photo: ['', ],
      tags: ['', []],
      fileSource: ['', ],
    });

    if(this.editData){
      this.actionBtn = "Update";
      this.postForm.controls['title'].setValue(this.editData.title);
      this.postForm.controls['description'].setValue(this.editData.description);
      //photo update
      this.postForm.controls['photo'].setValue('');
      this.imageSrc = this.editData.photo;
      this.postForm.controls['fileSource'].setValue(this.imageSrc);
      this.fileChange = false;
      //tags
      console.log(this.editData)
      this.tags = this.editData.tags;


    }
  }

  get f() {
    return this.postForm.controls;
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

  fileTypeError: boolean = false;
  // onFileChanged(event:any){
  //   const reader = new FileReader();
  //   if(event.target.files && event.target.files.length){
  //     const [photo] = event.target.files;
  //     reader.readAsDataURL(photo);
  //     reader.onload = () => {
  //       this.imageSrc = reader.result as string;
  //       this.fileChange = true;
  //       this.postForm.patchValue({fileSource: reader.result});
  //       console.log(this.postForm.get('photo'));
  //     };

  //   }
  //   this.files = event.target.files;
  //   //console.log(this.files);
  // }
  onFileChanged(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [photo] = event.target.files;

      // Check if the file is an image
      if (!photo.type.startsWith('image/')) {
        this.fileTypeError = true;
        return;
      } else {
        this.fileTypeError = false; // Set to false when the file type is valid
      }

      reader.readAsDataURL(photo);
      reader.onload = () => {
        this.imageSrc = reader.result as string;
        this.fileChange = true;
        this.postForm.patchValue({ fileSource: reader.result });
        console.log(this.postForm.get('photo'));
      };
    }
    this.files = event.target.files;
  }


  //*Save post per user id using localstorage and dialog
  SavePost(){

    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    let fullData:any = JSON.parse(retrievedData);
    let arr:any= [];
    this.tags.forEach(element => {
      arr.push(element.name);
    });
    this.postForm.patchValue({tags: arr.toString()});

    let user_id = fullData.id;
    if(!this.editData){
    if(this.postForm.valid){
      this._apiService.request('createPosts/'+user_id, '', this.postForm.value, 'post').subscribe((res:any)=>{
        this.post = res;
        this.postForm.reset();
        this.dialogRef.close('post');
        window.location.reload(); // Use to reload the page location
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
    console.log(this.postForm.value)
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    let fullData:any = JSON.parse(retrievedData);

    let user_id = fullData.id;

    let post_id:any = this.activateRoute.snapshot.params['id'];
    this._apiService.request('updatePost/', this.editData.id ,this.postForm.value, 'put').subscribe({next:(res:any)=>{
    this.post = res;
    console.log(this.editData)
    this.postForm.reset();
    this.dialogRef.close('update');
    window.location.reload();

    const message = 'Your post has been updated sucessfully!';
    this.snackbar.open(message , '' , {
      duration: this.durationInSeconds * 1000,
    });
  }, error:(error: any)=>{
    alert("Error posting data...");
    console.log("Error posting data", error);
  }
  });

  }
}
