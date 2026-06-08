import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="result-container">
      <mat-card class="result-card success">
        <mat-icon color="primary" class="result-icon">check_circle</mat-icon>
        <h2>Paiement Réussi !</h2>
        <p>Merci pour votre achat. Votre paiement a été traité avec succès par CMI.</p>
        <p>Vous recevrez très prochainement un e-mail de confirmation avec le récapitulatif de votre commande.</p>
        <div class="actions">
          <button mat-raised-button color="primary" routerLink="/">Retour à l'accueil</button>
          <button mat-stroked-button routerLink="/client/orders">Suivre mes commandes</button>
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
      border-top: 4px solid #10b981;
    }
    .result-icon {
      font-size: 80px;
      height: 80px;
      width: 80px;
      margin-bottom: 20px;
      color: #10b981;
    }
    h2 { font-size: 2rem; color: #1e293b; margin-bottom: 15px; }
    p { font-size: 1.1rem; color: #475569; margin-bottom: 10px; }
    .actions { margin-top: 30px; display: flex; gap: 15px; justify-content: center; }
  `]
})
export class CheckoutSuccessComponent implements OnInit {
  constructor(private cartService: CartService) {}

  ngOnInit() {
    // Le paiement CMI est réussi, on s'assure de vider le panier.
    this.cartService.clearCart();
  }
}
