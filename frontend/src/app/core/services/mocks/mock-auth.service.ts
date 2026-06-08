import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class MockAuthService {
  constructor() { }

  login(credentials: any): Observable<any> {
    console.log('MockAuthService: login with', credentials);
    // Simulate successful login
    return of({
      token: 'mock-jwt-token-12345',
      user: {
        id: 1,
        email: credentials.email,
        firstName: 'Mock',
        lastName: 'User',
        role: 'USER'
      }
    }).pipe(delay(500)); // Simulate network delay
  }

  register(user: any): Observable<any> {
    console.log('MockAuthService: register with', user);
    // Simulate successful registration
    return of({
      message: 'User registered successfully',
      user: {
        id: 2,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: 'USER'
      }
    }).pipe(delay(500));
  }
}
