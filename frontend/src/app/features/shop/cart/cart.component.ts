import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../../core/services/cart.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatDividerModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  displayedColumns: string[] = ['product', 'price', 'quantity', 'total', 'actions'];

  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe((items: CartItem[]) => {
      this.cartItems = items;
    });
  }

  increaseQuantity(item: CartItem): void {
    if (item.quantity < item.article.stockQuantity) {
      this.cartService.updateQuantity(item.article.id, item.quantity + 1);
    }
  }

  decreaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.article.id, item.quantity - 1);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.article.id);
  }

  get totalHT(): number {
    return this.cartService.getTotal();
  }

  get totalTTC(): number {
    // Basic calculation for TTC across all items based on their individual tax rates
    return this.cartItems.reduce((total, item) => {
      const taxMultiplier = 1 + (item.article.taxRate / 100);
      return total + (item.article.priceHT * item.quantity * taxMultiplier);
    }, 0);
  }
}
