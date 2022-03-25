import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators'
import { Observable, BehaviorSubject, throwError } from 'rxjs';

import { User } from './user';
import { AuthResponse } from './auth-response';
import { StorageService } from '../storage/storage.service';


@Injectable({ providedIn: 'root' })

export class AuthService {
  
  AUTH_SERVER_ADDRESS: string = 'http://localhost:3000';
  authSubject = new BehaviorSubject(false);

  constructor(private httpClient: HttpClient) { }

  signUp(userData: any): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.AUTH_SERVER_ADDRESS}/api/register`, userData.value).pipe(
      tap(async (res: any) => {
        if (res.user) {
          await StorageService.setValue(
            StorageService.config.authKeys.__ACCESS_TOKEN,
            res.user.access_token
          );
          await StorageService.setValue(
            StorageService.config.authKeys.__EXPIRES,
            res.user.expires_in
          );
          this.authSubject.next(true);
        }
      })
    );
  }


  login(user: User): Observable<AuthResponse> {
    let observableLoginResponse: Observable<AuthResponse>;
    observableLoginResponse = this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/api/login`, user).pipe(
      tap(async (res: AuthResponse) => {
        if (res.data) {
          await StorageService.setValue(
            StorageService.config.authKeys.__ACCESS_TOKEN,
            res.data._access_token
          );
          await StorageService.setValue(
            StorageService.config.authKeys.__EXPIRES,
            res.data._expires_in
          );
          this.authSubject.next(true);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error.error);
      })
    );
    return observableLoginResponse;
  }

  async logout() {
    await StorageService.removeKeys(await StorageService.getAuthKeysAsArray());
    this.authSubject.next(false);
  }


  isLoggedIn() {
    return this.authSubject.asObservable();
  }
}
