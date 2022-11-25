import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import {map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent{


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result=> result.matches),
    shareReplay()
  );
  constructor(
    private breakpointObserver: BreakpointObserver,
    public _apiService: AuthService,
    private route: Router,
    public token: UserService,
  ) {
    //localStorage.clear();
  }
  ngOnInit(){

  }

  // logoutUser(){
  //   localStorage.removeItem('token')
  //   this.route.navigate(['/login']);
  // }

  logoutUsers(){
    this._apiService.request('logout', '', '', 'post').subscribe((res:any)=>{
      this.token = res;
      localStorage.removeItem('token');
      this.route.navigate(['/login']);
    });
  }

}
