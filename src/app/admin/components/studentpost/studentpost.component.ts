import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-studentpost',
  templateUrl: './studentpost.component.html',
  styleUrls: ['./studentpost.component.scss']
})
export class StudentpostComponent implements OnInit {
  currentPage = 1;
  pageSize = 5;
  durationInSeconds = 2;

  displayedColumns: string[] = [
    'number',
    'id',
    'student_name',
    'student_program',
    'title',
    'description',
    'created_at',
    'action',

  ];

  displayedColumns2: string[] = [
    'id',
    'user_id',
    'comment_id',
    'reported',
    'report',
    'created_at',

  ];

  displayedColumns3: string[] = [
    'id',
    'user_id',
    'post_id',
    'reported',
    'report',
    'created_at',

  ];

  dataSource!: MatTableDataSource<any>; //for All Posts
  dataSource2!: MatTableDataSource<any>; //for Reported Comments
  dataSource3!: MatTableDataSource<any>; //for Reported Posts

  @ViewChild('paginator') paginator!: MatPaginator; //for All Posts
  @ViewChild('paginator2') paginator2!: MatPaginator; //for reported comment
  @ViewChild('paginator3') paginator3!: MatPaginator; //for Reported Posts

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatSort) sort2!: MatSort;
  @ViewChild(MatSort) sort3!: MatSort;

  posts$: Array<any> = [];
  constructor(
    public _apiService: AuthService,
    private route: Router,
    public snackbar: MatSnackBar,
    private dialog: MatDialog
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

  archived$: Array<any> = [];
  ngOnInit(): void {
    this._apiService
      .request('showAllReports', '', '', 'get')
      .subscribe((res: any) => {
        this.dataSource3 = new MatTableDataSource(res);

        this.dataSource3.paginator = this.paginator3;
        this.dataSource3.sort = this.sort3;
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

  deletedData:any;
  deleteQuestions(id: any){
    Swal.fire({
      title: 'Delete Post?',
      text: 'Are you sure you want to delete this post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this._apiService.request('deletePost/'+id, '', '', 'delete').subscribe((res:any ) =>{

          this.deletedData = res;
          window.location.reload();
          const message = 'Deleted Successfully!';
            this.snackbar.open(message , '' , {
              duration: this.durationInSeconds * 1000,
            });

        },(error: any)=>{
          console.log ("Error", error);
         });
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }

  recoverData:any;
  recoverQuestions(id: any){
    Swal.fire({
      title: 'Unarchive Post?',
      text: 'Are you sure you want to unarchive this post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, recover it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this._apiService.request('recoverArchivedPost/'+id, '', '', 'post').subscribe((res:any ) =>{

          this.recoverData = res;
          window.location.reload();
          const message = 'Unarchived Successfully!';
            this.snackbar.open(message , '' , {
              duration: this.durationInSeconds * 1000,
            });

        },(error: any)=>{
          console.log ("Error", error);
         });
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }

  _setDataSource(indexNumber: any) {
    setTimeout(() => {
      switch (indexNumber) {
        case 0:
          !this.dataSource.paginator ? this. dataSource.paginator = this.paginator : null;
          break;
        case 1:
          !this.dataSource2.paginator ? this. dataSource2.paginator = this.paginator2 : null;
          break;
        case 2:
        !this.dataSource3.paginator ? this. dataSource3.paginator = this.paginator3 : null;
        break;
      }
    });
  }



  //for all posts
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onPageChanged(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
  }


  //for archived posts
  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }
  onPageChanged2(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
  }

    //for archived posts
  applyFilter3(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource3.filter = filterValue.trim().toLowerCase();

      if (this.dataSource3.paginator) {
        this.dataSource3.paginator.firstPage();
      }
    }
  onPageChanged3(event: PageEvent) {
      this.currentPage = event.pageIndex + 1;
      this.pageSize = event.pageSize;
    }

}
