import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar-dashboard',
  standalone: true, 
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-dashboard.html',
  styleUrls: ['./navbar-dashboard.css']
})
export class NavbarDashboard {
  userName = '';
  userRole = '';

  constructor(private router: Router, private storage: LocalStorageService) {}

  ngOnInit(): void {
    const user = this.storage.getCurrentUser();
    if(user) {
      this.userName = user.name || '';
      this.userRole = user.role || '';
    }
  }
  
  logout() {
    this.storage.logoutUser();
    this.router.navigate(['/login']);
  }

  
}
