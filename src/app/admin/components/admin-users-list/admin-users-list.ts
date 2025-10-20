import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users-list.html',
  styleUrls: ['./admin-users-list.css']
})
export class AdminUsersList implements OnInit {
  users: any[] = [];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    this.users = Array.isArray(storedUsers) ? storedUsers : [];
  }
}
