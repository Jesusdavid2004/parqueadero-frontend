import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getBasicToken();

  const isAuthEndpoint =
    req.url.includes('/auth/login') || req.url.includes('/auth/register');

  if (!token || isAuthEndpoint) {
    return next(req);
  }

  const cloned = req.clone({
    setHeaders: {
      Authorization: token
    }
  });

  return next(cloned);
};