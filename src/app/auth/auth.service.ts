import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators'
import { Observable, BehaviorSubject, throwError } from 'rxjs';

import { Storage } from '@ionic/storage-angular';
import { User } from './user';
import { AuthResponse } from './auth-response';
import { Drivers } from '@ionic/storage';


@Injectable({providedIn: 'root'})

export class AuthService {
  AUTH_SERVER_ADDRESS: string = 'http://localhost:3000';
  authSubject = new BehaviorSubject(false);
  private storage: Storage;
  constructor(private httpClient: HttpClient) { 
    (async ()=> {
      this.storage = new Storage({
        name: '__authcredentials',
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
      })
      await this.storage.create();
    })()
  }

  signUp(userData: any): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.AUTH_SERVER_ADDRESS}/api/register`, userData.value).pipe(
      tap(async (res: any) => {
        if (res.user) {
          await this.storage.set("ACCESS_TOKEN", res.user.access_token);
          await this.storage.set("EXPIRES_IN", res.user.expires_in);
          this.authSubject.next(true);
        }
      })
    );
  }

  
  login(user: User): Observable<AuthResponse> {
    let  observableLoginResponse: Observable<AuthResponse>;
    // try{
      observableLoginResponse = this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/api/login`, user).pipe(
        tap(async (res: AuthResponse) => {
          if (res.data) {
            console.log(res)
            console.log(res.data)
            await this.storage.set("ACCESS_TOKEN", res.data._access_token);
            await this.storage.set("EXPIRES_IN", res.data._expires_in);
            this.authSubject.next(true);
          }
        }),
        catchError((error: HttpErrorResponse) => {
            return throwError(error.error);
        })
      );
    // }catch(err) {
    //   console.log("[Error al solicitar acceso]", err.message)
    // }
    return observableLoginResponse;
  }

  async logout() {
    await this.storage.remove("ACCESS_TOKEN");
    await this.storage.remove("EXPIRES_IN");
    this.authSubject.next(false);
  }

  
  isLoggedIn() {
    return this.authSubject.asObservable();
  }
}
