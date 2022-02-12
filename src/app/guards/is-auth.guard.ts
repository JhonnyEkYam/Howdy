import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class IsAuthGuard implements CanActivateChild {
  constructor(private router: Router) { }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return (async () => {
      let isAuth: boolean;
      try {
        if (await StorageService.getValue(StorageService.config.authKeys.__ACCESS_TOKEN)) {
          isAuth = false;
          await this.router.navigateByUrl('home');
        } else {
          isAuth = true;
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
