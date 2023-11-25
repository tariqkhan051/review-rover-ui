import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth-service/auth-service.service';
import { SESSION_KEYS, BASE_API_URL, ENDPOINTS } from 'src/helpers/constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let request;

    // if (
    //   req.url.includes(BASE_API_URL) &&
    //   req.url !== ENDPOINTS.LOGIN &&
    //   this.authService.isTokenExpired()
    // ) {
    //   this.authService.refreshToken().subscribe(() => {
    //     request= this.addTokenHeader(req, next);
    //   });
    // }
    request = this.addTokenHeader(req, next).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          !req.url.includes(ENDPOINTS.LOGIN) &&
          error.status === 401
        ) {
          return this.handle401Error(req, next);
        }

        return throwError(() => error);
      })
    );

    return request;
  }

  addTokenHeader = (req: HttpRequest<unknown>, next: HttpHandler) => {
    const accessToken = sessionStorage.getItem(SESSION_KEYS.ACCESS_TOKEN);

    if (
      req.url.includes(BASE_API_URL) &&
      !req.url.includes(ENDPOINTS.LOGIN) &&
      accessToken
    ) {
      const cloned = req.clone({
        headers: req.headers.set(
          'Authorization',
          `${sessionStorage.getItem(SESSION_KEYS.TOKEN_TYPE)} ${accessToken}`
        )
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  };

  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      if (this.authService.isLoggedIn()) {
        return this.authService.refreshToken().pipe(
          switchMap(() => {
            this.isRefreshing = false;

            return next.handle(req);
          }),
          catchError((error) => {
            this.isRefreshing = false;

            if (error.status === 403) {
              this.authService.logout();
            }

            return throwError(() => error);
          })
        );
      }
    }

    return next.handle(req);
  }
}
