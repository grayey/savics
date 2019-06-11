import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {UserService} from './user.service';
import {environment} from "../environments/environment";
import {NotificationService} from "./notification.service";

@Injectable()
export class ApiInterceptorService implements HttpInterceptor {

    constructor(private Alert: NotificationService, private userService: UserService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       req = req.clone({headers: req.headers.set('Accept', 'application/json')});
        if (this.userService.isLoggedIn()) {
            req = req.clone({headers: req.headers.set('Authorization', this.userService.getAuthUserToken())});
        }
        if (!req.headers.has('Content-Type')) {
            req = req.clone({headers: req.headers.set('Content-Type', 'application/json')});
        }

        return next.handle(req);
    }

}
