import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,Validators,FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-reg-student',
  templateUrl: './reg-student.component.html',
  styleUrls: ['./reg-student.component.scss']
})
export class RegStudentComponent implements OnInit {

  image = environment.image;

  singupForm:any = FormGroup;

  selectedOptions: string[] = [];
  selectedFile!: string;
  files: any =[];
  fileChange: any;

  durationInSeconds = 2;

  constructor(
    private formBuilder: FormBuilder,
    private _apiService: AuthService,
    public snackbar: MatSnackBar,

  ) { }

  ngOnInit(): void {
  }

  frmGroup: FormGroup = this.formBuilder.group({
    studnum_fld: [null, Validators.required],
    fname_fld: [null, [Validators.required]],
    mname_fld: [null, []],
    lname_fld: [null, [Validators.required]],
    extname_fld: [null, []],
    dept_fld: [null, [Validators.required]],
    program_fld: [null, [Validators.required]],
    profilepic_fld: [null, [Validators.required]],


   });

   frmGroup2:FormGroup = this.formBuilder.group({
    email_add: [null, Validators.required],
    pword_fld: [null, [Validators.required]],
    role: [null],
    recno_fld: [null, [Validators.required]],
   });

   onFile(event: any){
    // get image preview
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [profilepic_fld] = event.target.files;
      reader.readAsDataURL(profilepic_fld);
      // console.log( picture);
      reader.onload = () => {
       this.selectedFile = reader.result as string;
       this.fileChange = true;
       this.frmGroup.patchValue({profilepic_fld: reader.result})
       console.log(this.frmGroup.get('profilepic_fld'));

      };
    }
    //store file to global variable
    this.files = event.target.files;
      // console.log(this.files);
    }

   studData: any;
   submitStud(){
    if(this.frmGroup.valid){
      this._apiService.request('registerStud', '', this.frmGroup.value, 'post').subscribe((res:any)=>{

        this.studData = res;

        const message = 'Your student has been added sucessfully!';
        this.snackbar.open(message , '' , {
          duration: this.durationInSeconds * 1000,
        });

        this.frmGroup.reset();
        console.log(this.studData)
      }), (error: any)=>{
        alert("Error posting data...");
        console.log("Error posting data", error);
      }
    }

  }

  regAcc: any;
  regAccStud(){
    if(this.frmGroup2.valid){
      this._apiService.request('registerAcc', '', this.frmGroup2.value, 'post').subscribe((res:any)=>{

        this.regAcc = res;

        const message = 'Your user has been added sucessfully!';
        this.snackbar.open(message , '' , {
          duration: this.durationInSeconds * 1000,
        });
        this.frmGroup2.reset();
      }), (error: any)=>{
        alert("Error posting data...");
        console.log("Error posting data", error);
      }
    }
  }
}
