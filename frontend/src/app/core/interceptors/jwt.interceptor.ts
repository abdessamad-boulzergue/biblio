import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorageService = inject(TokenStorageService);
  const token = tokenStorageService.getToken();

  let authReq = req;
  if (token != null) {
    authReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
  }

  return next(authReq);
};
