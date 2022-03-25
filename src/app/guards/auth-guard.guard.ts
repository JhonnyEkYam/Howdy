import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanLoad {
  constructor(private router: Router) { }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return (async () => {
      let isAuth: boolean;
      try {
        if (await StorageService.getValue(StorageService.config.authKeys.__ACCESS_TOKEN)) isAuth = true;
        else {
          isAuth = false;
          await this.router.navigateByUrl('auth/login');
        }
      } catch (error) {
        isAuth = false;
        console.log("[try-catch]No existe", StorageService.config.authKeys.__ACCESS_TOKEN)
      } finally {
        return isAuth;
      }
    })().then((isAuth) => isAuth)
  }

}
