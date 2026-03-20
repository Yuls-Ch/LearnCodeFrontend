import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const token = localStorage.getItem('google_token');
  const role = localStorage.getItem('role')?.toUpperCase();
  
  if (!token) {
    router.navigate(['/'], { replaceUrl: true });
    return false;
  }

  const requiredRole = route.data?.['role']?.toUpperCase();
  if (requiredRole && role !== requiredRole) {
    router.navigate(['/home'], { replaceUrl: true });
    return false;
  }

  return true;
};