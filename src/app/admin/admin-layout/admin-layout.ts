import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayout {
  storage = inject(LocalStorageService);
  router = inject(Router);
  themeService = inject(ThemeService);

  isDarkMode = false;
  isCollapsed = false;
  userName = '';
  userRole = '';

  ngOnInit() {
    this.isDarkMode = document.body.classList.contains('dark-theme');

    const user = this.storage.getCurrentUser();
    if(user) {
      this.userName = user.name || '';
      this.userRole = user.role || 'Admin';
    }
  }
  
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this.storage.logoutUser();
    this.router.navigate(['/login']);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.isDarkMode = document.body.classList.contains('dark-theme');
  }

}
