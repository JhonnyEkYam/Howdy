import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators'
import { Observable, BehaviorSubject, throwError } from 'rxjs';

import { Storage } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private static storage: Storage;
  public static config = {
    db_Name: "__authcredentials",
    authKeys: {
      __ACCESS_TOKEN: "ACCESS_TOKEN",
      __EXPIRES: "EXPIRES_IN",
    }
  }
  private constructor() { }

  private static async getStorage() {
    try {
      if (await this.storage.get(this.config.authKeys.__ACCESS_TOKEN)) () => { console.log("Se recupero storage"); return this.storage };
    } catch (error) {
      this.storage = new Storage({
        name: this.config.db_Name,
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
      })
      await this.storage.create();
      return this.storage;
    }
  }

  static async setValue(key: string, value: string | number) {
    await this.getStorage();
    await this.storage.set(key, value);
  }

  static async removeKeys(keys: string[]) {
    await this.getStorage();
    if (keys.length <= 0) return null;
    keys.forEach(key => { this.storage.remove(key) })
  }

  static async getValue(key: string): Promise<string> {
    await this.getStorage();
    return this.storage.get(key);
  }

  static async getAuthKeysAsArray(): Promise<string[]> {
    let authKeysArray: string[] = [];
    for ( let authKey in this.config.authKeys) authKeysArray.push(authKey)
    console.log(authKeysArray)
    return authKeysArray;
  }

  static getAuthToken(): string {
    let result: string = "No session";
    Promise.resolve(this.getValue(this.config.authKeys.__ACCESS_TOKEN)).then((authToken=>result=authToken));
    return result;
  }
}
