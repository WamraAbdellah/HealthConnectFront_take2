import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // This is a mock implementation - in a real app, this would check if the user is authenticated
  if (authService.isLoggedIn()) {
    return true;
  }

  // Redirect to login page if not authenticated
  return router.parseUrl('/login');
};