import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RegStudentComponent } from '../reg-student/reg-student.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'user_id',
    'post_id',
    'reported',
    'report',
    'created_at',

  ];
  displayedColumns2: string[] = [
    'id',
    'user_id',
    'comment_id',
    'reported',
    'report',
    'created_at',

  ];
  dataSource!: MatTableDataSource<any>;
  dataSource2!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator) paginator2!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatSort) sort2!: MatSort;

  constructor(
    public _apiService: AuthService,
    private route: Router,
    public snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._apiService
      .request('showAllReports', '', '', 'get')
      .subscribe((res: any) => {
        this.dataSource = new MatTableDataSource(res);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(res);
      }),
      (error: any) => {
        alert('Error getting data...');
        console.log('Error getting data', error);
      };

      this._apiService
      .request('showAllReportComments', '', '', 'get')
      .subscribe((res: any) => {
        this.dataSource2 = new MatTableDataSource(res);

        this.dataSource2.paginator = this.paginator2;
        this.dataSource2.sort = this.sort2;
        console.log(res);
      }),
      (error: any) => {
        alert('Error getting data...');
        console.log('Error getting data', error);
      };



  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
