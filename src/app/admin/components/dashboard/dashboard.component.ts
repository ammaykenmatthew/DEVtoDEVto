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

  @ViewChild('lineCanvas') lineCanvas: ElementRef | undefined;
  lineChart: any;

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

    this.lineChartMethod();
  }

  lineChartMethod() {
    this.lineChart = new Chart(this.lineCanvas?.nativeElement, {
      type: 'line',
      data: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'November',
          'December',
        ],
        datasets: [
          {
            label: 'Post per month', //Von pagawa palagay kung gano kadami Post per Month
          //  lineTension: 0.2,
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40, 10, 5, 50, 10, 15],
            spanGaps: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
         scales: {
          x: {
            ticks: {
              display: true,
            },
          },
          y: {
            ticks: {
              display: true,
            },
          },
        },
      },
    });
  }


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
                label: 'No. of Tags ',
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
            responsive: true,
            maintainAspectRatio: false,
             scales: {
              x: {
                ticks: {
                  display: true,
                },
              },
              y: {
                ticks: {
                  display: true,
                },
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
