import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PostFormComponent } from '../post-form/post-form.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  durationInSeconds = 2;

  email_add:any;
  fname_fld:any;
  mname_fld:any;
  lname_fld:any;


  constructor(
    public snackbar: MatSnackBar,
    private dialog: MatDialog,
    ){


  }

  ngOnInit(): void {
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    console.log(JSON.parse(retrievedData));
    let fullData:any = JSON.parse(retrievedData);

    this.email_add = fullData.email_add;
    this.fname_fld = fullData.fname_fld;
    this.mname_fld = fullData.mname_fld;
    this.lname_fld = fullData.lname_fld;

    // const message = 'Welcome, ' + this.fname_fld + ' ' + this.mname_fld + ' ' +  this.lname_fld;
    // this.snackbar.open(message , '' , {
    //   duration: this.durationInSeconds * 1000,
    // });

  }

  // openModal(){
  //   this.postForm.show();
  // }


  openDialog(){
    this.dialog.open(PostFormComponent, {
        width: '98vh',
        height: '90vh',
        maxWidth: '100vw',
        maxHeight: '100vh',

    });
  }


}
