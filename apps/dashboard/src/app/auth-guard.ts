import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    // User is authenticated
    return true;
  } else {
    // No token found, redirect to login
    router.navigate(['/login']);
    return false;
  }
};