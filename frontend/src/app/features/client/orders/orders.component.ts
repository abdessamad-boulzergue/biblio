import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatChipsModule, MatIconModule, MatButtonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  displayedColumns: string[] = ['orderNumber', 'date', 'status', 'total', 'actions'];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getMyOrders().subscribe({
      next: (data: any) => this.orders = data,
      error: (err: any) => console.error("Error loading orders", err)
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'CREEE': return '#64748b'; // gray
      case 'PAYEE': return '#3b82f6'; // blue
      case 'EN_PREPARATION': return '#f59e0b'; // orange
      case 'EXPEDIEE': return '#8b5cf6'; // purple
      case 'LIVREE': return '#10b981'; // green
      case 'ANNULEE': 
      case 'REMBOURSEE': 
      case 'RETOUR_REFUSE': return '#ef4444'; // red
      case 'RETOUR_DEMANDE': return '#f59e0b'; // orange
      case 'RETOUR_ACCEPTE': return '#3b82f6'; // blue
      default: return '#64748b';
    }
  }

  requestReturn(orderId: number) {
    if (confirm("Voulez-vous vraiment demander un retour pour cette commande ?")) {
      this.orderService.requestReturn(orderId).subscribe({
        next: (updatedOrder) => {
          // Update order locally
          const index = this.orders.findIndex(o => o.id === orderId);
          if (index !== -1) {
            this.orders[index] = updatedOrder;
            this.orders = [...this.orders]; // trigger change detection for table
          }
        },
        error: (err) => {
          console.error("Erreur lors de la demande de retour", err);
          alert(err.error || "Une erreur est survenue");
        }
      });
    }
  }
}
