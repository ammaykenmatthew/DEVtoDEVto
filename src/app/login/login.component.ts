import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,Validators,FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginUsers} from '../services/data.schema';


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
    if(this.frmGroup.valid){
      this._apiService.request('login', '', user, 'post').subscribe((res:any)=>{
        console.log(res);
        if (res !=null){
          alert("Login Successfully...")
          this.token =  res.token;
          this.role =  res.user.role;
          this.userData = res.user;
          // token
          localStorage.setItem('token', this.token);
          // user Data
          localStorage.setItem('userdata', JSON.stringify(this.userData));

          let retrievedData = localStorage.getItem('userdata');
          console.log(retrievedData);

          if(res.user.role === "admin"){
            this.route.navigate(['/admin'],{replaceUrl:true});
          }
          if(res.user.role === "student"){
            this.route.navigate(['/main'],{replaceUrl:true});
          }
          console.log("Logged In Successfully");
        }
      }), (error: any)=>{
        console.log ("Error", error);
      }
    } else {
      if (!this.frmGroup.valid){
              console.log('Please provide all the required values!')
              return;
      }
    }
  }

}


