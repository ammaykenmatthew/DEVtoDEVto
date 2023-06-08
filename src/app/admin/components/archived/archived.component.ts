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
  selector: 'app-archived',
  templateUrl: './archived.component.html',
  styleUrls: ['./archived.component.scss']
})
export class ArchivedComponent implements OnInit {
  currentPage = 1;
  pageSize = 5;
  durationInSeconds = 2;

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
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  posts$: Array<any> = [];
  constructor(
    public _apiService: AuthService,
    private route: Router,
    public snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {

  }

  archived$: Array<any> = [];
  ngOnInit(): void {
    this._apiService
    .request('showAllArchivedAdmin', '', this.archived$, 'get')
    .subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.archived$ = res;
      console.log(res);
    }),
    (error: any) => {
      alert('Error fetching data...');
      console.log('Error fetching data', error);
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


   //for archived posts
   applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onPageChanged2(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
  }
}
