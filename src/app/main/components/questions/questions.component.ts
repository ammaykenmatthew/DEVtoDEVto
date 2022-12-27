import { Component, OnInit , ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DeletePostComponent } from '../delete-post/delete-post.component';
import { PostFormComponent } from '../post-form/post-form.component';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'description', 'created_at', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public _apiService: AuthService,
    private dialog: MatDialog,
    private route: Router,


  ) { }

  ngOnInit(): void {
    this.getAllPosts();
  }

  getAllPosts(){
    let retrievedData = localStorage.getItem('userdata') as unknown as string;
    let fullData:any = JSON.parse(retrievedData);

    let user_id = fullData.id;

    this._apiService.request('showUserPostby/'+user_id, '', '', 'get').subscribe((res:any)=>{
      this.dataSource = new MatTableDataSource(res);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(res);

    }), (error: any)=>{
      alert("Error posting data...");
      console.log("Error posting data", error);
    }
  }
  editQuestions(row: any){
    this.dialog.open(PostFormComponent,{

      width: '98vh',
      height: '90vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data:row
    });
  }
  deleteQuestions(id: any){
    this.dialog.open(DeletePostComponent,{
      data: { id: id },
      width: '20%',
      height: '20%',
      //responsive not

    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  viewPost(id: number): void{
      this.route.navigateByUrl('main/view-post/' + id);
  }



}
