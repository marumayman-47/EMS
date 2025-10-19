import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {
  storage = inject(LocalStorageService);
  
  adminName: string = '';

  ngOnInit(): void {
    const user = this.storage.getCurrentUser();
    this.adminName = user?.name || 'Admin';
  }
  getCount(type: string): number {
    const data = JSON.parse(localStorage.getItem(type) || '[]');
    return Array.isArray(data) ? data.length : 0;
  }
  

  logout(): void {
    this.storage.logoutUser();
    window.location.href = '/login';
  }
}
