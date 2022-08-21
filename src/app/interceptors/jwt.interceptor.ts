import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { ApiService } from '../services/api.service';
import { catchError, take, switchMap, map, filter, finalize } from 'rxjs/operators';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { ToastController } from "@ionic/angular";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    isRefreshingToken = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject(null);

    constructor(private apiService: ApiService, private toastCtrl: ToastController) { }

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isInBlockedList(request.url)) {
            const token = this.apiService.token;
            if (token && token !== '') {
                request = this.addToken(request, token);
            }
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {                
                if (error.status == 401) {
                    return this.apiService.isRefreshTokenValid().pipe(
                        take(1),
                        switchMap(valid => {                            
                            if (valid) {
                                return this.handleTokenRefresh(request, next);
                            } else {
                                this.toastCtrl.create({
                                    message: 'Your session has expired!',
                                    duration: 2000
                                }).then(toast => toast.present());
                                this.apiService.logout();
                                return of(null);
                            }
                        })
                    )
                }
                return throwError(error);
            })
        )
    }

    private isInBlockedList(url: string) {
        // Example: Filter out our login and logout API call
        if (url.indexOf('/auth') >= 0 || url.indexOf('/refresh') >= 0) {
            return true;
        } else {
            return false;
        }
    }

    private addToken(req: HttpRequest<any>, token) {
        return req.clone({
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`
            })
        });
    }

    handleTokenRefresh(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshingToken) {
            this.tokenSubject.next(null);
            this.isRefreshingToken = true;

            return this.apiService.getNewAccessToken().pipe(
                switchMap((token: any) => {
                    if (token) {                        
                        const accessToken = token.accessToken;
                        return this.apiService.saveAccessToken(accessToken).pipe(
                            switchMap(_ => {                                
                                this.tokenSubject.next(accessToken);
                                return next.handle(this.addToken(request, accessToken));
                            })
                        )
                    } else {
                        return of(null);
                    }
                }),
                finalize(() => {
                    this.isRefreshingToken = false;
                })
            );
        } else {            
            // Queue
            return this.tokenSubject.pipe(
                filter(token => token !== null),
                take(1),
                switchMap(token => {                    
                    return next.handle(this.addToken(request, token));
                })
            )
        }
    }
}

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