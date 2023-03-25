import { Component, OnInit } from '@angular/core';
import { FormGroup,Validators,FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-reg-moderator',
  templateUrl: './reg-moderator.component.html',
  styleUrls: ['./reg-moderator.component.scss']
})
export class RegModeratorComponent implements OnInit {
  // myControl = new FormControl();
  // options: string[] = [];
  // filteredOptions!: Observable<string[]>;
  students:any= [];


  durationInSeconds = 2;

  constructor(
    private formBuilder: FormBuilder,
    private _apiService: AuthService,
    public snackbar: MatSnackBar,

  ) { }

  ngOnInit(): void {
    this.getAllStudents();
    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value)),
    // );
  }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.options.filter(option => option.toLowerCase().includes(filterValue));
  // }

  getAllStudents() {
    this._apiService.request('getUsers', '', '', 'get').subscribe(
      (res: any) => {
        this.students = res;
      },
      (error: any) => {
        alert("Error posting data...");
        console.log("Error posting data", error);
      }
    );
  }


  // frmGroup: FormGroup = this.formBuilder.group({
  //   studnum_fld: [null, Validators.required],
  //   fname_fld: [null, [Validators.required]],
  //   mname_fld: [null, []],
  //   lname_fld: [null, [Validators.required]],
  //   extname_fld: [null, []],
  //   dept_fld: [null, [Validators.required]],
  //   program_fld: [null, [Validators.required]],
  //   profilepic_fld: [null, [Validators.required]],


  //  });

   frmGroup2:FormGroup = this.formBuilder.group({
    email_add: [null, Validators.required],
    pword_fld: [null, [Validators.required]],
    role: [null],
    recno_fld: [null, [Validators.required]],
   });

  //  onFile(event: any){

  //   const reader = new FileReader();
  //   if(event.target.files && event.target.files.length) {
  //     const [profilepic_fld] = event.target.files;
  //     reader.readAsDataURL(profilepic_fld);

  //     reader.onload = () => {
  //      this.selectedFile = reader.result as string;
  //      this.fileChange = true;
  //      this.frmGroup.patchValue({profilepic_fld: reader.result})
  //      console.log(this.frmGroup.get('profilepic_fld'));

  //     };
  //   }

  //   this.files = event.target.files;

  //   }


  regAcc: any;
  regAccStud(){
    if(this.frmGroup2.valid){
      this._apiService.request('registerAcc', '', this.frmGroup2.value, 'post').subscribe((res:any)=>{

        this.regAcc = res;

        const message = 'Your moderator has been added sucessfully!';
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
