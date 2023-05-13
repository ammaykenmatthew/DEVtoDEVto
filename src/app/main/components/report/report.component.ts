import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
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
    @Inject(MAT_DIALOG_DATA) public data: { post_id: number }
  ) {}

  form = new FormGroup({
    report: new FormControl('Misinformation', Validators.required),
    otherReport: new FormControl('')
  });

  reportOptions = [
    'Hate speech or graphic violence',
    'Inappropriate language',
    'Malicious content',
    'Misinformation',
    'Other'
  ];

  ngOnInit(): void {}

  reports$: any;
  reportPost() {
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    let fullData: any = JSON.parse(retrievedData);

    let user_id = fullData.id;
    let reportValue = this.form.get('report')?.value;
    if (reportValue === 'Other') {
      reportValue = this.form.get('otherReport')?.value;
    }
    const formData = { report: reportValue };
    console.log(formData);
    this._apiService.request('setReport/' + user_id + '/' + this.data.post_id,'',formData,'post').subscribe((res: any) => {
        this.reports$ = res;
      });

    const message = 'Post reported successfully!';
    this.snackbar.open(message, '', {
      duration: 3000,
    });
  }
}
