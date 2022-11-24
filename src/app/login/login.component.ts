import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup,Validators,FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginUsers } from '../services/data.schema';


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
 
   
  //sa loob ng onsubmit


  // let ct = this.FormGroup.controls;
  // let user: LoginUnit = {
  //   email: ct['email'].value, //email_fld
  //   password: ct['password'].value, //pword_fld
  //   token: '',
  //   grade: '',
  // } -- loob ng onSubmit()

  //admin  res.data.user.role; //access
  //if(res.data.user.grade === "admin"){
  //   this.router.navigate(['/main2'],{replaceUrl:true  //main2 == admin login
  //   });
  // }
  //role === admin

  // this.token = res; //wala nato
  // this.grade = res.data.user.grade;
  // localStorage.setItem('token', this.responsedata.token);

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
    if(this.frmGroup.valid){               //this.loginForm.value
      this._apiService.request('login', '', user, 'post').subscribe((res:any)=>{
        console.log(res);
        if (res !=null){
          alert("Login Successfully...")
          this.token =  res.token;  
          this.data =  res.user.role;                 //res.data.user.role;  //res.payload or data na ipapass
          localStorage.setItem('token', this.token); //.data
          

          if(res.user.role === "admin"){
            this.route.navigate(['/admin'],{replaceUrl:true});
          }
          if(res.user.role === "student"){
            this.route.navigate(['/main'],{replaceUrl:true});
          }

          // console.log(res);
          console.log("Logged In Successfully");
          // this.route.navigate(['/main']);
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


