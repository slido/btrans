import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';

import { environment } from '../../../environments/environment';

export interface AuthenticationRequest {
    email: string;
    password: string;
}

export interface TokenResponse {
    user: User;
    token_key: string;
    refresh_token: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private apiURL = environment.apiURL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {

  }

  get user(): User {
    const user = JSON.parse(localStorage.getItem('user') || null);
    if (user) {
      return new User(user);
    }
    return new User({});
  }

  set user(value: User) {
    localStorage.setItem('user', JSON.stringify(value));
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }
  set token(value: string) {
    localStorage.setItem('token', value);
  }

  get refreshToken(): string {
    return localStorage.getItem('refresh_token') || '';
  }
  set refreshToken(value: string) {
    localStorage.setItem('refresh_token', value);
  }

  get viewType(): string {
    return localStorage.getItem('view_type');
  }

  refresh() {
      const body = {
          'user_id': this.user.id,
          'refresh_token': this.refreshToken
      };

      return this.http.post<TokenResponse>(this.apiURL + '/token/refresh', body, {
          headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Do-Not-Intercept': 'true'
          })
      });
  }

  loginUser(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiURL}api/token`, { email: email, password: password });
  }

  logout(): void {
    localStorage.removeItem('user');
  }
}
