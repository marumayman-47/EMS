import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {
  storage = inject(LocalStorageService);
  adminName: string = this.storage.getCurrentUser().name|| 'Admin';

  totalUsers = 0;
  totalEvents = 0;
  totalGuests = 0;
  totalExpenses = 0;

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    const users = this.storage.getData('users');
    const events = this.storage.getData('events');
    const guests = this.storage.getData('guests');
    // const expenses = this.storage.getData('expenses');
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');

    this.totalUsers = Array.isArray(users) ? users.length : 0;
    this.totalEvents = Array.isArray(events) ? events.length : 0;
    this.totalGuests = Array.isArray(guests) ? guests.length : 0;
    this.totalExpenses = Array.isArray(expenses)
      ? expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
      : 0;
  }
}
