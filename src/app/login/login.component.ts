import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,Validators,FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginUsers, Users} from '../services/data.schema';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm:any = FormGroup;
  submitted = false;

  // token: any = [];
  role:any;
  data:any;
  userData:any;

  constructor(
    private formBuilder: FormBuilder,
    private _apiService: AuthService,
    private route: Router,

    ){
      localStorage.clear();
    }

  //Add user form actions
  get f() {
    return this.loginForm.controls;
  }

  ngOnInit() :void {

  }

  frmGroup: FormGroup = this.formBuilder.group({
    email_add: [null, Validators.required],
    pword_fld: [null, [Validators.required]],
   })


   hide = true;
   isLoading = false;

  token:any;
          // , `/${dt}`,
  onSubmit(e:any): void{
    e.preventDefault();

    let ct = this.frmGroup.controls;

    let user: LoginUsers = {
      email_add: ct['email_add'].value,
      pword_fld: ct['pword_fld'].value,
      role: '',
      token: '',
    }
    // this.submitted = true;
    this.isLoading = true;
    if(this.frmGroup.valid){
      this._apiService.request('login', '', user, 'post').subscribe((res:any)=>{
        console.log(res);

        if (res !=null){
          // alert("Login Successfully...")
          this.token =  res.token;
          this.role =  res.user.role;
          this.userData = res.user;
          // token
          localStorage.setItem('token', this.token);
          // user Data
          localStorage.setItem('userdata', JSON.stringify(this.userData));

          let retrievedData = localStorage.getItem('userdata') as unknown as string;
          console.log(JSON.parse(retrievedData));

          this.userData.email_add = res.user.email_add;
          this.userData.fname_fld = res.user.fname_fld;
          this.userData.mname_fld = res.user.mname_fld;
          this.userData.lname_fld = res.user.lname_fld;

          if(res.user.role === "admin"){
            this.route.navigate(['/admin'],{replaceUrl:true});
          }
          if(res.user.role === "student"){
            this.route.navigate(['/main'],{replaceUrl:true});
          }
          console.log("Logged In Successfully");
        }
      }), (error: any)=>{
        alert(error);
        console.log ("Error", error);
        this.isLoading = false;
      }
    } else {
      if (!this.frmGroup.valid){
              console.log('Please provide all the required values!')
              return;
      }
    }
  }

}


