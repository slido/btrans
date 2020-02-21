import { Injectable, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { AuthenticationService, TokenResponse } from '../services/authentication.service';
import { BehaviorSubject, Observable, empty, throwError } from 'rxjs';
import { filter, take, switchMap, catchError, finalize, tap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor {
    private auth: AuthenticationService;
    private url: string;

    isRefreshingToken: boolean;

    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private inj: Injector
    ) {
        setTimeout(() => { // <-- TODO: hack
            this.auth = inj.get(AuthenticationService);
            this.route.url.subscribe(input => {
                this.url = input.join('/');
            });
        });
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.headers.has('X-Token')) {
            next.handle(req)
                .pipe(
                    tap(
                        (event: HttpEvent<any>) => {},
                        (err: any) => {
                            if (err instanceof HttpErrorResponse) {
                                switch (err.status) {
                                    case 401:
                                        return this.handle401Error(req, next);
                                    case 500:
                                        this.router.navigate(['/internal-server-error']);
                                        break;
                                }
                            }
                        }
                    )
                );
        }

        return next.handle(req);
    }

    addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
        return req.clone({setHeaders: {'X-Token': token}});
    }

    handle401Error(req: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;

            // Reset here so that the following requests wait until the token
            // comes back from the refreshToken call.
            this.tokenSubject.next(null);

            return this.auth.refresh()
                .pipe(switchMap((response: TokenResponse) => {
                    this.auth.token = response.token_key;
                    this.auth.refreshToken = response.refresh_token;
                    this.auth.user = response.user;

                    if (response.token_key) {
                        this.tokenSubject.next(response.token_key);
                        return next.handle(this.addToken(req, response.token_key));
                    }

                    // If we don't get a new token, we are in trouble so logout.

                    this.auth.logout();

                    if (!this.router.url.startsWith('/login')) {
                        this.router.navigateByUrl('/login');
                    }

                    return empty();
                }),
                finalize(() => {
                    this.isRefreshingToken = false;
                }),
                catchError(error => {
                    this.auth.logout();

                    if (!this.router.url.startsWith('/login')) {
                        this.router.navigateByUrl('/login');
                    }

                    return empty();
                }));
        } else {
            return this.tokenSubject.
                pipe(
                    filter(token => token !== null),
                    take(1),
                    switchMap(token => {
                        return next.handle(this.addToken(req, token));
                    })
                );
        }
    }

}
