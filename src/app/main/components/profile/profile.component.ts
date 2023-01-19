import { Component, OnInit } from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {ProgressBarMode} from '@angular/material/progress-bar';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  value = 50;
  bufferValue = 75;

  userData:any;
  studnum_fld:any;
  email_add:any;
  fname_fld:any;
  mname_fld:any;
  lname_fld:any;
  program_fld:any;
  dept_fld:any;


  constructor(
    public _apiService: AuthService
  ) { }

  id : any
  totalCredits : number = 0

  ngOnInit(): void {
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    console.log(JSON.parse(retrievedData));
    let fullData:any = JSON.parse(retrievedData);
    this.id = fullData.id
    this.studnum_fld = fullData.studnum_fld;
    this.email_add = fullData.email_add;
    this.fname_fld = fullData.fname_fld;
    this.mname_fld = fullData.mname_fld;
    this.lname_fld = fullData.lname_fld;
    this.program_fld = fullData.program_fld;
    this.dept_fld = fullData.dept_fld;



    this._apiService.request('credits/'+this.id, '', '', 'post').subscribe((res:any)=>{
      console.log(res);
      this.totalCredits = res.credits;
  },
  (error : any) =>{
    console.log(error);

  }

  );


   }


}
