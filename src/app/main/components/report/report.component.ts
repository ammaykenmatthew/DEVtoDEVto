import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  reportStatement!: string;
  durationInSeconds = 2;
  // reports: any[] = [];


  constructor(
    private _apiService: AuthService,
    private formBuilder: FormBuilder,
    public snackbar: MatSnackBar,
    private activateRoute: ActivatedRoute,

    ) {
  }

  form = new FormGroup({
    report: new FormControl('', Validators.required)
  });


  ngOnInit(): void {
  }

  reports$: any;
  reportPost(){
    // console.log(this.form.value);
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    let fullData:any = JSON.parse(retrievedData);

    let user_id = fullData.id;
    let post_id:any = this.activateRoute.snapshot.params['id'];

    this._apiService.request('setReport/'+user_id +'/'+ post_id, '', this.form.value, 'post').subscribe((res:any)=>{
    this.reports$ = res;

    });

    const message = 'Post reported sucessfully!';
    this.snackbar.open(message , '' , {
      duration: this.durationInSeconds * 1000,
    });
  }
}
