import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../../core/services/order.service';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSelectModule, MatCardModule, FormsModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  displayedColumns: string[] = ['orderNumber', 'user', 'totalAmountTTC', 'status', 'createdAt'];
  dataSource: any[] = [];
  statuses: string[] = ['CREEE', 'PAYEE', 'EN_PREPARATION', 'EXPEDIEE', 'LIVREE', 'ANNULEE', 'REMBOURSEE', 'RETOUR_DEMANDE', 'RETOUR_ACCEPTE', 'RETOUR_REFUSE'];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAll().subscribe((data) => {
      this.dataSource = data;
    });
  }

  changeStatus(order: any, newStatus: string): void {
    this.orderService.updateStatus(order.id, newStatus).subscribe(() => {
      this.loadOrders();
    });
  }
}
