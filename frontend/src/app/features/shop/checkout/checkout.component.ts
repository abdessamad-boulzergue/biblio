import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule, Router } from '@angular/router';

import { CartService, CartItem } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { PaymentService } from '../../../core/services/payment.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, MatStepperModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatIconModule, MatDividerModule,
    MatRadioModule, RouterModule
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;

  cartItems: CartItem[] = [];
  shippingFormGroup: FormGroup;
  billingFormGroup: FormGroup;
  
  isLinear = true;
  isLoggedIn = false;
  
  orderId: number | null = null;
  selectedPaymentMethod: 'CMI' | 'COD' | null = null;
  
  paymentProcessing = false;
  paymentError = '';
  orderNumber = '';

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {
    this.shippingFormGroup = this.fb.group({
      fullName: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['Maroc', Validators.required]
    });

    this.billingFormGroup = this.fb.group({
      fullName: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['Maroc', Validators.required]
    });
  }

  ngOnInit() {
    this.isLoggedIn = this.tokenStorage.isLoggedIn();
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    }
    
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });
  }

  get totalHT() { return this.cartService.getTotal(); }
  get totalTTC() {
    return this.cartItems.reduce((total, item) => {
      const taxMultiplier = 1 + (item.article.taxRate / 100);
      return total + (item.article.priceHT * item.quantity * taxMultiplier);
    }, 0);
  }

  copyShippingToBilling() {
    this.billingFormGroup.patchValue(this.shippingFormGroup.value);
  }

  pay() {
    if (!this.selectedPaymentMethod || this.shippingFormGroup.invalid || this.billingFormGroup.invalid || this.cartItems.length === 0) return;
    this.paymentProcessing = true;
    this.paymentError = '';

    const orderRequest = {
      shippingAddress: this.shippingFormGroup.value,
      billingAddress: this.billingFormGroup.value,
      paymentMethod: this.selectedPaymentMethod,
      items: this.cartItems.map(item => ({
        articleId: item.article.id,
        quantity: item.quantity
      }))
    };

    this.orderService.createOrder(orderRequest).subscribe({
      next: (order) => {
        this.orderId = order.id;
        this.orderNumber = order.orderNumber;
        
        if (this.selectedPaymentMethod === 'CMI') {
          // Demander les paramètres CMI
          this.paymentService.createPaymentIntent(order.id).subscribe({
            next: (cmiParams) => {
              this.submitCmiForm(cmiParams);
            },
            error: (err) => {
              console.error("Erreur de paiement", err);
              this.paymentProcessing = false;
              this.paymentError = 'Erreur lors de la communication avec CMI';
            }
          });
        } else {
          // COD : Terminer (la commande est déjà créée avec statut CREEE)
          this.paymentProcessing = false;
          this.cartService.clearCart();
          this.stepper.next();
        }
      },
      error: (err) => {
        console.error("Erreur création commande", err);
        this.paymentProcessing = false;
        this.paymentError = 'Erreur lors de la création de la commande';
      }
    });
  }

  submitCmiForm(cmiParams: any) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://testpayment.cmi.co.ma/fim/est3Dgate';
    
    for (const key in cmiParams) {
      if (cmiParams.hasOwnProperty(key)) {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = key;
        hiddenField.value = cmiParams[key];
        form.appendChild(hiddenField);
      }
    }
    
    document.body.appendChild(form);
    form.submit();
  }
}
