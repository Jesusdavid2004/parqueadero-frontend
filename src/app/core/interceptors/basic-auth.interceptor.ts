import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { API_URL } from '../services/api-base';

export const basicAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getBasicToken();

  const isApiRequest = req.url.startsWith(API_URL);
  const isAuthRequest =
    req.url.includes('/auth/login') || req.url.includes('/auth/register');

  console.log('Interceptor -> URL:', req.url);
  console.log('Interceptor -> Token existe:', !!token);

  if (!isApiRequest || isAuthRequest || !token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: token
    }
  });

  console.log('Interceptor -> Authorization enviada');
  return next(authReq);
};