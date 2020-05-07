import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationServiceService } from 'src/app/services/authentication-service.service';
import { AlertService } from '../alert/alert.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private router: Router, private authenticationService: AuthenticationServiceService, private alertsService: AlertService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request)
            .pipe(tap((event: HttpEvent<any>) => {
            }, (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status == 403) {
                        this.authenticationService.cleanCookie().then(value => {
                            if (value) {
                                this.router.navigate(['/unathorized']);
                            }
                        });
                    } else if (err.status == 500) {
                        this.router.navigate(['/servererror']);
                    } else if (err.status == 404) {
                        this.router.navigate(['/pagenotfound']);
                    } else if (err.status == 412) {
                        this.router.navigate(['/sessiontimeout']);
                        this.authenticationService.cleanCookie().then(value => {
                            if (value) {
                                console.log("Sessione svuotata.");
                                this.alertsService.warn("Sessione scaduta. Ti chiedo di rieffettuare il login.", null, 8);
                            }
                        });
                    }
                }
            })
            );
    }
}