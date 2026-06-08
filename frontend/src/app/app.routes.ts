import { Routes } from '@angular/router';
import { ShopLayoutComponent } from './features/shop/layout/shop-layout/shop-layout.component';
import { HomeComponent } from './features/shop/home/home.component';
import { CatalogueComponent } from './features/shop/catalogue/catalogue.component';
import { ArticleDetailComponent } from './features/shop/article-detail/article-detail.component';
import { CartComponent } from './features/shop/cart/cart.component';
import { CheckoutComponent } from './features/shop/checkout/checkout.component';
import { CheckoutSuccessComponent } from './features/shop/checkout-success/checkout-success.component';
import { CheckoutFailComponent } from './features/shop/checkout-fail/checkout-fail.component';
import { OrdersComponent } from './features/client/orders/orders.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';

// Admin Components
import { AdminLayoutComponent } from './features/admin/layout/admin-layout/admin-layout.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { ArticleListComponent } from './features/admin/articles/article-list/article-list.component';
import { ArticleFormComponent } from './features/admin/articles/article-form/article-form.component';
import { CategoryListComponent } from './features/admin/categories/category-list/category-list.component';
import { CategoryFormComponent } from './features/admin/categories/category-form/category-form.component';
import { UserListComponent } from './features/admin/users/user-list/user-list.component';
import { OrderListComponent } from './features/admin/orders/order-list/order-list.component';

export const routes: Routes = [
  { 
    path: 'admin', 
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'articles', component: ArticleListComponent },
      { path: 'articles/new', component: ArticleFormComponent },
      { path: 'articles/edit/:id', component: ArticleFormComponent },
      { path: 'categories', component: CategoryListComponent },
      { path: 'categories/new', component: CategoryFormComponent },
      { path: 'categories/edit/:id', component: CategoryFormComponent },
      { path: 'users', component: UserListComponent },
      { path: 'orders', component: OrderListComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  
  // Shop / Public Routes
  {
    path: '',
    component: ShopLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'catalogue', component: CatalogueComponent },
      { path: 'article/:id', component: ArticleDetailComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'checkout/success', component: CheckoutSuccessComponent },
      { path: 'checkout/fail', component: CheckoutFailComponent },
      { path: 'client/orders', component: OrdersComponent, canActivate: [authGuard] },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },
  
  // Fallback
  { path: '**', redirectTo: '' }
];
