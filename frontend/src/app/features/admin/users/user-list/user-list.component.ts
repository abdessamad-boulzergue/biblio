import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../core/services/user.service';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSlideToggleModule, MatSelectModule, MatCardModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'email', 'firstName', 'lastName', 'role', 'status'];
  dataSource: any[] = [];
  roles: string[] = ['ROLE_CLIENT', 'ROLE_ADMIN'];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe((data) => {
      this.dataSource = data;
    });
  }

  toggleStatus(user: any): void {
    this.userService.updateStatus(user.id, !user.enabled).subscribe(() => {
      this.loadUsers();
    });
  }

  changeRole(user: any, newRole: string): void {
    this.userService.updateRole(user.id, newRole).subscribe(() => {
      this.loadUsers();
    });
  }
}
