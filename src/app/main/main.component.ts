import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import {map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Users } from '../services/data.schema';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent{

  durationInSeconds = 2;

  users$: Array<Users> = [];

  userData:any;
  email_add:any;
  fname_fld:any;
  mname_fld:any;
  lname_fld:any;
  program_fld:any;
  dept_fld:any;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result=> result.matches),
    shareReplay()
  );
  constructor(
    private breakpointObserver: BreakpointObserver,
    public _apiService: AuthService,
    private route: Router,
    public token: UserService,
    public snackbar: MatSnackBar


  ) {
    //localStorage.clear();
  // let retrievedData = localStorage.getItem('userdata');
  //   console.log(retrievedData);

  }

  ngOnInit(){
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    console.log(JSON.parse(retrievedData));
    let fullData:any = JSON.parse(retrievedData);

    this.email_add = fullData.email_add;
    this.fname_fld = fullData.fname_fld;
    this.mname_fld = fullData.mname_fld;
    this.lname_fld = fullData.lname_fld;
    this.program_fld = fullData.program_fld;
    this.dept_fld = fullData.dept_fld;

    const message = 'Welcome, ' + this.fname_fld + ' ' + this.mname_fld + ' ' +  this.lname_fld + '!';
    this.snackbar.open(message , '' , {
      duration: this.durationInSeconds * 1000,
    });
   }

  // logoutUser(){
  //   localStorage.removeItem('token')
  //   this.route.navigate(['/login']);
  // }

  logoutUsers(){
    this._apiService.request('logout', '', '', 'post').subscribe((res:any)=>{
      this.token = res;
      localStorage.removeItem('token');
      this.route.navigate(['/login']);
      console.log("Logged out successfully")
    });
  }

}
