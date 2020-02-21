import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';

import { environment } from '../../../environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  headers: any;
  private apiURL = environment.apiURL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService) {
      this.headers = { 'X-TOKEN': this.auth.token };
    }

    getByID(id){
      return this.http.get(`${this.apiURL+ 'api/users'}/${id}`, {headers: this.headers});
    }

}
