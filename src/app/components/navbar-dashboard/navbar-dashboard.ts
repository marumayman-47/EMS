import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar-dashboard',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './navbar-dashboard.html',
  styleUrl: './navbar-dashboard.css'
})
export class NavbarDashboard {
  isDark = false;

  constructor(private router: Router, private storage: LocalStorageService, private themeService: ThemeService) {
    this.isDark = document.body.classList.contains('dark-theme');
  }

  logout() {
    this.storage.logoutUser();
    this.router.navigate(['/login']);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.isDark = document.body.classList.contains('dark-theme');
  }
}
