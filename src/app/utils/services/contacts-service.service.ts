import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, BehaviorSubject, throwError } from 'rxjs';

import { ContactInterface } from '../interfaces/contact-interface';
import { ContactsResponse } from '../interfaces/contacts-response';
import { MessageInterface } from '../interfaces/message-interface';
import { StorageService } from 'src/app/storage/storage.service';

@Injectable({ providedIn: 'root' })
export class ContactsServiceService {
  AUTH_SERVER_ADDRESS: string = 'http://localhost:3000';
  authSubject = new BehaviorSubject(false);
  constructor(private httpClient: HttpClient) {}
  getAccount(authToken: string): Observable<any> {
    return this.httpClient.get(`${this.AUTH_SERVER_ADDRESS}/api/account`, {
      headers: {
        Authorization: authToken,
        Identidad: 'dev'
      }
    })
  }
  getContacts(authToken: string): Observable<any> {
    return this.httpClient
      .get<ContactsResponse>(`${this.AUTH_SERVER_ADDRESS}/api/users`, {
        headers: {
          Authorization: authToken,
          Identidad: 'dev',
        },
      })
      .pipe(
        map((data: ContactsResponse) => {
          return data;
        }),
        catchError((err, caught) => {
          console.log(err.message);
          return throwError(err.message);
        })
      );
  }

  getMessages(authToken: string, to: string): Observable<any> {
    return this.httpClient.get<ContactsResponse>(
      `${this.AUTH_SERVER_ADDRESS}/messages`,
      {
        headers: {
          Authorization: authToken,
          to: to,
        },
      }
    );
  }

  sendMessage(authToken: string, to: string, message: string): Observable<any> {
    return this.httpClient.post<any>(
      `${this.AUTH_SERVER_ADDRESS}/send`,
      {
        message: message,
      },
      {
        headers: {
          Authorization: authToken,
          to: to,
        },
      }
    );
  }
}
