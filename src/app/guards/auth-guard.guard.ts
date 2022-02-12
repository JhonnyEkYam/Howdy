import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanLoad {
  constructor(private router: Router){}
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let isAuth = false;
      if (isAuth) {
        console.log("puedes"); 
        return isAuth;
      } else {
        (async ()=> {
          console.log("no puedes"); 
          await this.router.navigateByUrl('sign-in');
        })()
      }
  }
}
