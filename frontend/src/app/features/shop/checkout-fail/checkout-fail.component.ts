import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-checkout-fail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="result-container">
      <mat-card class="result-card fail">
        <mat-icon color="warn" class="result-icon">error</mat-icon>
        <h2>Échec du paiement</h2>
        <p>Malheureusement, votre paiement n'a pas pu être validé par CMI.</p>
        <p>Veuillez réessayer avec une autre carte ou choisir le paiement à la livraison.</p>
        <div class="actions">
          <button mat-raised-button color="primary" routerLink="/checkout">Réessayer</button>
          <button mat-stroked-button routerLink="/cart">Retourner au panier</button>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .result-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: 20px;
    }
    .result-card {
      max-width: 500px;
      text-align: center;
      padding: 40px;
      border-top: 4px solid #ef4444;
    }
    .result-icon {
      font-size: 80px;
      height: 80px;
      width: 80px;
      margin-bottom: 20px;
    }
    h2 { font-size: 2rem; color: #1e293b; margin-bottom: 15px; }
    p { font-size: 1.1rem; color: #475569; margin-bottom: 10px; }
    .actions { margin-top: 30px; display: flex; gap: 15px; justify-content: center; }
  `]
})
export class CheckoutFailComponent {}
