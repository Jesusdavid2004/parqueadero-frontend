import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getBasicToken();

  const isAuthEndpoint =
    req.url.includes('/auth/login') || req.url.includes('/auth/register');

  const requestToSend = (!token || isAuthEndpoint)
    ? req
    : req.clone({
        setHeaders: {
          Authorization: token
        }
      });

  return next(requestToSend).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthEndpoint) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
