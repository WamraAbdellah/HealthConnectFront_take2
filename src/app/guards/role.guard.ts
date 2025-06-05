import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = route.data?.['roles'] as string[];

  // Mock implementation - in a real app, this would check if the user has the required role
  if (allowedRoles && authService.hasRole(allowedRoles)) {
    return true;
  }

  // Redirect to appropriate dashboard based on user role
  const userRole = authService.getUserRole();
  if (userRole) {
    return router.parseUrl(`/${userRole}`);
  }

  // Redirect to login if no role or not authenticated
  return router.parseUrl('/login');
};