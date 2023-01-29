import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LogoutFormComponent } from '../main/components/logout-form/logout-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  // ---- ASSIGNED VARIABLES --- //
  email_add: any;
  date_today = new Date();

  // ---- ASSIGNED VARIABLES --- //

  constructor(
    private breakpointObserver: BreakpointObserver,
    public _apiService: AuthService,
    private route: Router,
    public token: UserService,
    public datepipe: DatePipe,
    private dialog: MatDialog,

    ) {
      let retrievedData = localStorage.getItem('userdata') as unknown as string;
      console.log(JSON.parse(retrievedData));
      let fullData:any = JSON.parse(retrievedData);

      this.email_add = fullData.email_add;
      let date_today = this.datepipe.transform((new Date), 'EEEE, MMMM d, y, h:mm:ss a');

    }


    logoutUsers(){
      Swal.fire({
        title: 'Confirm logout?',
        text: 'Are you sure you want to exit application?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, log me out!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.value) {
          this._apiService.request('logout', '', '', 'post').subscribe((res:any)=>{
            this.token = res;
            localStorage.removeItem('token');
            localStorage.removeItem('userdata');
            this.route.navigate(['/login']);
            console.log("Logged out successfully")
        });
        } else if (result.dismiss === Swal.DismissReason.cancel) {

        }
      })
    }

}

