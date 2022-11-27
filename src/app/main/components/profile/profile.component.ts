import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userData:any;
  email_add:any;
  fname_fld:any;
  mname_fld:any;
  lname_fld:any;
  program_fld:any;
  dept_fld:any;

  constructor() { }

  ngOnInit(): void {
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    console.log(JSON.parse(retrievedData));
    let fullData:any = JSON.parse(retrievedData);

    this.email_add = fullData.email_add;
    this.fname_fld = fullData.fname_fld;
    this.mname_fld = fullData.mname_fld;
    this.lname_fld = fullData.lname_fld;
    this.program_fld = fullData.program_fld;
    this.dept_fld = fullData.dept_fld;
   }


}
