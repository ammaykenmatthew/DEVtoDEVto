import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-post',
  templateUrl: './delete-post.component.html',
  styleUrls: ['./delete-post.component.scss']
})
export class DeletePostComponent implements OnInit {

  durationInSeconds = 2;

  constructor(
    private _apiService:AuthService,
    private route: Router,
    public token: UserService,
    public dialog: MatDialog,
    private activateRoute: ActivatedRoute,
    public snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public id: {id: number}

  ) { }

  ngOnInit(): void {
  }


  deleteData(): void{
    // this.dialog.closeAll();
    console.log(this.id);
    //delete function
    let post_id:any = this.activateRoute.snapshot.params['id'];
    let id_:any = this.id.id;

    this._apiService.request('deletePost/'+id_, '', '', 'delete').subscribe((res:any ) =>{

      window.location.reload();
      const message = 'Deleted Succesfully!';
        this.snackbar.open(message , '' , {
          duration: this.durationInSeconds * 1000,
        });

    },(error: any)=>{
      console.log ("Error", error);
     });
  }
}
