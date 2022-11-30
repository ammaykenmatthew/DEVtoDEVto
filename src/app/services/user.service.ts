import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Posts } from './data.schema';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _url: string = 'http://localhost:8000/api/';

  constructor(
    private http: HttpClient,
  ) { }


  getPost(id:number): Observable<Posts>{
    return this.http.get<Posts>(this._url + 'showOnePostby/' +id, {headers: this.header()
    });
  }



  header(){
    let token = localStorage.getItem('token')
    let headers
    if (token) {
      headers = new HttpHeaders().set('Authorization',  'Bearer ' + token).set('Accept', 'application/json')
    }
    return headers
  }
}
