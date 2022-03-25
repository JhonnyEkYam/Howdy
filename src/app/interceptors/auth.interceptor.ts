import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Router } from "@angular/router";
import { StorageService } from "../storage/storage.service";

@Injectable()

class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        try {
            let __authToken = StorageService.getValue(StorageService.config.authKeys.__ACCESS_TOKEN);
            const newReq = req.clone({
                setHeaders: {
                    'Authorization': ''+__authToken
                },
            })
            return next.handle(newReq);
        } catch (err) {
            debugger
            console.log(err.message)
        }
    }
}

export const httpInterceptorProviders = [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true,
    }
]