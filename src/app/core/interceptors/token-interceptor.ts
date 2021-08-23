import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import {  map, catchError } from 'rxjs/operators';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UrlService } from '../services/url.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private notification: NzNotificationService, private url: UrlService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let headers = req.headers;
        if (this.authService.isLoggedIn()) {
            const token = this.authService.getToken();
            headers = headers.set('Authorization', `Bearer ${token}`);
        }
        if (req.url.includes('loan/document/upload') || req.url.includes('document/upload')) {
            headers = headers.delete('content-type');
        } else {
           headers = headers.set('Content-Type', 'application/json');
        }
        const authReq = req.clone({ headers });
        this.toggleAllButtonsDisable(true);
        return next.handle(authReq).pipe(map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                console.log(event.body);
                this.toggleAllButtonsDisable(false);
                if (event.body.status === 'success') {
                    // this.notification.success('Successful', event.body.message);
                } else {
                    this.notification.error('Error', event.body.message);
                }
            }
            return event;
        }), catchError((error: HttpErrorResponse) => {
            const errorStatus = error.status;
            this.toggleAllButtonsDisable(false);
            console.log(error);
            if (errorStatus === 401) {
                console.log(this.url.getCurrentUrl());
                const currentUrl = this.url.getCurrentUrl();
                location.replace(`https://intranet.creditwallet.ng/login?service=finance&continue=${currentUrl}`);
            } else if (errorStatus === 400) {
                console.log(400);
                this.notification.error('Error', error.error.message);

            } else if (errorStatus === 500) {
                // tslint:disable-next-line: max-line-length
                this.notification.error('Server Error', 'Something went wrong! This is likely from IT, we will fix it soon. Please try again later');
            } else {
                this.notification.error('Error', error.error.message || error.message);
            }
            return throwError(error);
        }));
    }

    private toggleAllButtonsDisable(value) {
        const buttons: any = document.getElementsByTagName('button');

        for (const button of buttons) {
          button.disabled = value;
        }
      }
}
