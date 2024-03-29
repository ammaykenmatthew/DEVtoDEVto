import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RegStudentComponent } from '../reg-student/reg-student.component';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss'],
})
export class AddStudentComponent implements OnInit {
  image = environment.image;

  displayedColumns: string[] = [
    'id',
    'studnum_fld',
    'fname_fld',
    'lname_fld',
    'dept_fld',
    'program_fld',
    'profilepic_fld',
    'created_at',
    'reports',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public _apiService: AuthService,
    private route: Router,
    public snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  currentPage = 1;
  pageSize = 10;

  ngOnInit(): void {
    this.getAllPosts();
  }
  onPageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
  }

  getAllPosts() {
    this._apiService
      .request('getAllStudents', '', '', 'get')
      .subscribe((res: any) => {
        this.dataSource = new MatTableDataSource(res);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(res);
      }),
      (error: any) => {
        alert('Error posting data...');
        console.log('Error posting data', error);
      };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addModal() {
    this.dialog.open(RegStudentComponent, {
      width: '70vh',
      maxWidth: '90vw',
    });
  }

  reinstate(id: any) {
    this._apiService
      .request('destroy/' + id, '', '', 'post')
      .subscribe((res: any) => {
        alert(res.message);
        console.log(res);
        this.getAllPosts();
      }),
      (error: any) => {
        alert('Error posting data...');
        console.log('Error posting data', error);
      };
  }
}
