import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MaterialModules } from 'src/app/modules/material.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewQuestionComponent } from '../view-question/view-question.component';
import { ViewPostComponent } from 'src/app/main/components/view-post/view-post.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'student_name',
    'student_program',
    'title',
    'description',
    'created_at',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;
  postscount: number = 0;
  userscount: number = 0;
  commentscount: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  posts$: Array<any> = [];

  constructor(
    public _apiService: AuthService,
    private dialog: MatDialog,
    private route: Router
  ) {
    this._apiService
      .request('showAllGlobal', '', this.posts$, 'get')
      .subscribe((res: any) => {
        this.dataSource = new MatTableDataSource(res);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.posts$ = res;
        console.log(res);
      }),
      (error: any) => {
        alert('Error posting data...');
        console.log('Error posting data', error);
      };
    this._apiService
      .request('adminDashboard', '', '', 'get')
      .subscribe((res: any) => {
        this.userscount = res.userscount;
        this.commentscount = res.commentscount;
        this.postscount = res.postscount;
      }),
      (error: any) => {
        alert('Error getting data...');
        console.log('Error getting data', error);
      };
  }

  ngAfterViewInit() {}

  ngOnInit() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewPost(id: number): void {
    this.route.navigateByUrl('main/view-post/' + id);
  }

  viewStudentPost(id: number): void {
    this.dialog.open(ViewPostComponent, {
      width: '100vh',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {
        id: id,
      },
    });
  }
}
