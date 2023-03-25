import {
  AfterViewInit,
  Component,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { MaterialModules } from 'src/app/modules/material.module';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewPostComponent } from 'src/app/main/components/view-post/view-post.component';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-print-chart',
  templateUrl: './print-chart.component.html',
  styleUrls: ['./print-chart.component.scss']
})
export class PrintChartComponent implements OnInit {

  @ViewChild('barCanvas') barCanvas: ElementRef | undefined;
  barChart: any;

  @ViewChild('lineCanvas') lineCanvas: ElementRef | undefined;
  lineChart: any;

  @ViewChild('doughnutCanvas') doughnutCanvas: ElementRef | undefined;
  doughnutChart: any;

  canvas: any;
  ctx: any;
  @ViewChild('pieCanvas') pieCanvas!: { nativeElement: any };

  pieChart: any;



  currentPage = 1;
  pageSize = 5;

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
  postsPerMonth: any;

  studentProgram:any;
  postStatus:any;



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  posts$: Array<any> = [];

  constructor(
    public _apiService: AuthService,
    private dialog: MatDialog,
    private route: Router
  ) {
    this._apiService
      .request('showAllGlobalAdmin', '', this.posts$, 'get')
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
  }


  ngOnInit() {
    this.getAllStudentProgram();
    this.getAllPostStatus();

  }

  print(){
    window.print();
  }

  ngAfterViewInit() {
    this.barChartMethod();

    this.doughnutChartMethod();

    this.pieChartBrowser();

    this._apiService
      .request('adminDashboard', '', '', 'get')
      .subscribe((res: any) => {
        console.log(res);

        this.userscount = res.userscount;
        this.commentscount = res.commentscount;
        this.postscount = res.postscount;
        this.studentscount = res.studentscount;
        this.postsPerMonth = res.postsPerMonth;
        this.lineChartMethod();
      }),
      (error: any) => {
        alert('Error getting data...');
        console.log('Error getting data', error);
      };


  }

  lineChartMethod() {
    let data: any = [];
    this.postsPerMonth.forEach((element: any) => {
      data.push(element.rowcount);
    });
    let months: any = [];
    this.postsPerMonth.forEach((element: any) => {
      months.push(element.month);
    });
    this.lineChart = new Chart(this.lineCanvas?.nativeElement, {
      type: 'line',
      data: {
        labels: months,
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
            data: data,
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
    this._apiService.request('tags', '', '', 'get').subscribe((res: any) => {
      console.log(res);
      const labels = res.map((tag: any) => tag.tags); // Assuming the API response contains an array of objects with a "tags" property
      console.log(labels);
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

  doughnutChartMethod() {
    this.doughnutChart = new Chart(this.doughnutCanvas?.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Accepted', 'Pending'],
        datasets: [
          {
            label: '# of Posts',
            data: [],
            backgroundColor: [
              '#50C878 ',
              '#FF6384',
            ],
            hoverBackgroundColor: [
              '#50C878 ',
              '#FF6384',
            ],
          },
        ],
      },
    });

    this._apiService
      .request('findPostStatus', '', '', 'get')
      .subscribe((res: any) => {
        console.log(res);
        const data = [0, 0];

        res.forEach((status: { status: string }) => {
          if (status.status === 'Accepted') {
            data[0]++;
          } else if (status.status === 'Pending') {
            data[1]++;
          }
        });

        this.doughnutChart.data.datasets[0].data = data;
        this.doughnutChart.update();
      }),
      (error: any) => {
        alert('Error getting data...');
        console.log('Error getting data', error);
      };
  }


  pieChartBrowser(): void {
    this.canvas = this.pieCanvas.nativeElement;
    this.ctx = this.canvas.getContext('2d');

    this._apiService.request('getAllProgram', '', '', 'get').subscribe(
      (res: any) => {
        console.log(res);

        let bsitCount = 0;
        let bscsCount = 0;

        // Count the number of students for each program
        res.forEach((student: any) => {
          if (student.program_fld === 'BSIT') {
            bsitCount++;
          } else if (student.program_fld === 'BSCS') {
            bscsCount++;
          }
        });

        // Create the pie chart with the data
        this.pieChart = new Chart(this.ctx, {
          type: 'pie',
          data: {
            labels: ['BSIT', 'BSCS'],
            datasets: [
              {
                backgroundColor: [
                  '#FFA500',
                  '#FF5F1F',
                ],
                data: [bsitCount, bscsCount],
              },
            ],
          },
        });
      },
      (error: any) => {
        alert('Error getting data...');
        console.log('Error getting data', error);
      }
    );
  }

  getAllPostStatus(){
    this._apiService
    .request('findPostStatus', '', '', 'get')
    .subscribe((res: any) => {
      console.log(res);

      this.postStatus = res;
    }),
    (error: any) => {
      alert('Error getting data...');
      console.log('Error getting data', error);
    };
  }

  getAllStudentProgram(){
    this._apiService
    .request('getAllProgram', '', '', 'get')
    .subscribe((res: any) => {
      console.log(res);

      this.studentProgram = res;
    }),
    (error: any) => {
      alert('Error getting data...');
      console.log('Error getting data', error);
    };
  }



}
