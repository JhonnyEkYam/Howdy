import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Router } from "@angular/router";
import { StorageService } from "../storage/storage.service";

@Injectable()

class AuthInterceptor implements HttpInterceptor {
    private authToken: string;
    constructor(private router: Router) {
        (async () => {
            this.authToken = await StorageService.getValue(StorageService.config.authKeys.__ACCESS_TOKEN)
        })()
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // const authReq = req.clone({
        //     headers: req.headers.set('Authorization', this.authToken)
        // })
        // return next.handle(authReq);
        return next.handle(req)
    }
}

export const httpInterceptorProviders = [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true,
    }
]