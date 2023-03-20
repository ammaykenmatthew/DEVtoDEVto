import { AfterViewInit, Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MaterialModules } from 'src/app/modules/material.module';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewQuestionComponent } from '../view-question/view-question.component';
import { ViewPostComponent } from 'src/app/main/components/view-post/view-post.component';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {

  @ViewChild('barCanvas') barCanvas: ElementRef | undefined;
  barChart: any;

  currentPage =1;
  pageSize =  5;

  displayedColumns: string[] = [
    'number',
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
  studentscount: number = 0;
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
        this.studentscount = res.studentscount;
      }),
      (error: any) => {
        alert('Error getting data...');
        console.log('Error getting data', error);
      };
  }

  ngAfterViewInit() {
    this.barChartMethod();
  }




  // barChartMethod() {
  //   this._apiService
  //   .request('tags', '', '', 'get')
  //   .subscribe((res: any) => {
  //     console.log(res)
  //   this.barChart = new Chart(this.barCanvas?.nativeElement, {
  //     type: 'bar',
  //     data: {
  //       labels: ['BJP', 'INC', 'AAP', 'CPI', 'CPI-M', 'NCP'],
  //       datasets: [
  //         {
  //           label: '# of Votes',
  //           data: [200, 50, 30, 15, 20, 34],
  //           backgroundColor: [
  //             'rgba(255, 99, 132, 0.2)',
  //             'rgba(54, 162, 235, 0.2)',
  //             'rgba(255, 206, 86, 0.2)',
  //             'rgba(75, 192, 192, 0.2)',
  //             'rgba(153, 102, 255, 0.2)',
  //             'rgba(255, 159, 64, 0.2)',
  //           ],
  //           borderColor: [
  //             'rgba(255,99,132,1)',
  //             'rgba(54, 162, 235, 1)',
  //             'rgba(255, 206, 86, 1)',
  //             'rgba(75, 192, 192, 1)',
  //             'rgba(153, 102, 255, 1)',
  //             'rgba(255, 159, 64, 1)',
  //           ],
  //           borderWidth: 1,
  //         },
  //       ],
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true,
  //         },
  //       },
  //     },
  //   });
  //   })

  // }

  barChartMethod() {
    this._apiService
      .request('tags', '', '', 'get')
      .subscribe((res: any) => {
        console.log(res)
        const labels = res.map((tag: any) => tag.tags); // Assuming the API response contains an array of objects with a "tags" property
        console.log(labels)
        const data = res.map((tag: any) => tag.count); // Assuming the API response contains an array of objects with a "count" property
        this.barChart = new Chart(this.barCanvas?.nativeElement, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: '# of Tags',
                data,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },

        });
      });
  }




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

  onPageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
  }
}
