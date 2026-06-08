import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';

import { environment } from '../environments/environment';
import { AuthService } from './core/services/auth.service';
import { MockAuthService } from './core/services/mocks/mock-auth.service';
import { ArticleService } from './core/services/article.service';
import { MockArticleService } from './core/services/mocks/mock-article.service';
import { CategoryService } from './core/services/category.service';
import { MockCategoryService } from './core/services/mocks/mock-category.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    { provide: AuthService, useClass: environment.useMocks ? MockAuthService : AuthService },
    { provide: ArticleService, useClass: environment.useMocks ? MockArticleService : ArticleService },
    { provide: CategoryService, useClass: environment.useMocks ? MockCategoryService : CategoryService }
  ]
};
