import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-logout-form',
  templateUrl: './logout-form.component.html',
  styleUrls: ['./logout-form.component.scss']
})
export class LogoutFormComponent implements OnInit {

  constructor(
    private _apiService:AuthService,
    private route: Router,
    public token: UserService,
    private dialogRef: MatDialogRef<LogoutFormComponent>,
  ) { }

  ngOnInit(): void {
  }

  logout(){
    this._apiService.request('logout', '', '', 'post').subscribe((res:any)=>{
    this.token = res;
    localStorage.removeItem('token');
    this.route.navigate(['/login']);
    console.log("Logged out successfully")
});
  }

}
