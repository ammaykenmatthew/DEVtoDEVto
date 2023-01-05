import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _url: string = 'http://localhost:8000/api/';

  public search =new BehaviorSubject<string>("");

  constructor(
    private http:HttpClient,
    private route: Router,

  ) { }

  public request(epoint: string, params:string, body:any, method: string,):any {
    switch(method){
      case 'post':
      return this.http.post(this._url + epoint + params, body, {headers: this.header()
      });
      case 'put':
      return this.http.put(this._url + epoint + params, body, {headers: this.header()
      });
      case 'get':
      return this.http.get(this._url + epoint + params,{headers: this.header()
      });
      case 'delete':
      return this.http.delete(this._url + epoint + params, {headers: this.header()
      });
    }

  }

  // login(data:any){
  //   return this.http.post(this._url + '/login', data );
  // }

  header(){
    let token = localStorage.getItem('token')
    let headers
    if (token) {
      headers = new HttpHeaders().set('Authorization',  'Bearer ' + token).set('Accept', 'application/json')
    }
    return headers
  }


  IsLoggedIn(){
    return localStorage.getItem('token')!=null;
  }



}
