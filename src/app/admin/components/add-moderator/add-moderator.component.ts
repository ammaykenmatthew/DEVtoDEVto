import { Component, OnInit , ViewChild } from '@angular/core';
import { FormControl,FormGroup,Validators,FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RegStudentComponent } from '../reg-student/reg-student.component';
import { environment } from 'src/environments/environment.prod';
import { RegModeratorComponent } from '../reg-moderator/reg-moderator.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-moderator',
  templateUrl: './add-moderator.component.html',
  styleUrls: ['./add-moderator.component.scss']
})
export class AddModeratorComponent implements OnInit {
  currentPage = 1;
  pageSize = 5;

  image = environment.image;
  durationInSeconds = 2;

  displayedColumns: string[] = [ 'number','studnum_fld', 'fname_fld', 'lname_fld', 'dept_fld', 'program_fld', 'profilepic_fld', 'created_at', 'action' ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public _apiService: AuthService,
    private route: Router,
    public snackbar: MatSnackBar,
    private dialog: MatDialog,

  ) { }


  ngOnInit(): void {
    this.getAllModerators();
  }

  moderatorsData:any;
  getAllModerators(){
    this._apiService.request('getModerators', '', '', 'get').subscribe((res:any)=>{
      this.dataSource = new MatTableDataSource(res);
      console.log(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.moderatorsData = res;


    }), (error: any)=>{
      alert("Error posting data...");
      console.log("Error posting data", error);
    }
  }

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

  addModal(){
    this.dialog.open(RegModeratorComponent,{
      width: '70vh',
      maxWidth: '90vw',

    });
  }

  deletedData:any;
  deleteModerator(user_id: any) {
    Swal.fire({
      title: 'Revoke Access',
      text: 'Are you sure you want to revoke this privilege?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        const moderator = this.moderatorsData.find((mod: any) => mod.user_id === user_id);

        if (moderator) {
          this._apiService.request('revokeModerator/' + moderator.user_id, '', '', 'delete').subscribe(
            (res: any) => {
              this.deletedData = res;
              console.log(this.deletedData);
              window.location.reload();

              const message = 'Revoked Successfully!';
              this.snackbar.open(message, '', {
                duration: this.durationInSeconds * 1000,
              });
            },
            (error: any) => {
              console.log('Error', error);
            }
          );
        }
      }
    });
  }



}
