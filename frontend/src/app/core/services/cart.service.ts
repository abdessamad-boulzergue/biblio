import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  article: any;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'biblio-cart';
  private cartItems: CartItem[] = [];
  
  // Observable for cart changes (useful for navbar badge)
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem(this.cartKey);
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next(this.cartItems);
    }
  }

  private saveCart(): void {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cartItems));
    this.cartSubject.next(this.cartItems);
  }

  addToCart(article: any, quantity: number = 1): void {
    const existingItem = this.cartItems.find(item => item.article.id === article.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ article, quantity });
    }
    
    this.saveCart();
  }

  removeFromCart(articleId: number): void {
    this.cartItems = this.cartItems.filter(item => item.article.id !== articleId);
    this.saveCart();
  }

  updateQuantity(articleId: number, quantity: number): void {
    const item = this.cartItems.find(i => i.article.id === articleId);
    if (item && quantity > 0) {
      item.quantity = quantity;
      this.saveCart();
    } else if (quantity === 0) {
      this.removeFromCart(articleId);
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.saveCart();
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.article.priceHT * item.quantity), 0);
  }

  getItemCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }
}
