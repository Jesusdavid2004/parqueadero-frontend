import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['role'] as 'ADMIN' | 'CLIENTE' | undefined;
  const currentRole = authService.getUserRole();

  return expectedRole && currentRole === expectedRole
    ? true
    : router.createUrlTree(['/login']);
};