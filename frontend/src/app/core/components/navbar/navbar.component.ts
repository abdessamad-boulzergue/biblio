import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { TokenStorageService } from '../../services/token-storage.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  username?: string;
  cartItemCount = 0; 

  constructor(private tokenStorageService: TokenStorageService, private router: Router, private cartService: CartService) { }

  ngOnInit(): void {
    this.updateAuthState();

    // Re-check auth state on every route change (like after login/logout navigation)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateAuthState();
    });

    // Subscribe to cart changes
    this.cartService.cart$.subscribe(items => {
      this.cartItemCount = this.cartService.getItemCount();
    });
  }

  updateAuthState(): void {
    this.isLoggedIn = this.tokenStorageService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      if (user) {
        this.username = user.firstName;
        this.isAdmin = user.role === 'ROLE_ADMIN';
      }
    } else {
      this.isAdmin = false;
      this.username = undefined;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    this.updateAuthState();
    this.router.navigate(['/login']);
  }
}
