import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenStorageService = inject(TokenStorageService);
  const router = inject(Router);

  if (true || tokenStorageService.isLoggedIn()) {
    return true;
  }

  return router.parseUrl('/login');
};
