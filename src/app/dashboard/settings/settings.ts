import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class Settings implements OnInit {
  user: any = {};
  isDarkMode = false;

  constructor(
    private localStorageService: LocalStorageService, 
    private router: Router, 
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    const currentUser = this.localStorageService.getCurrentUser();
    if (currentUser) {
      this.user = { ...currentUser };
    }

    this.isDarkMode = document.body.classList.contains('dark-theme');
  }

  saveProfile(): void {
    const users = this.localStorageService.getData('users');
    const updatedUsers = users.map((u: any) => u.id === this.user.id ? this.user : u);
    this.localStorageService.saveData('users', updatedUsers);
    localStorage.setItem('currentUser', JSON.stringify(this.user));
    alert('Profile updated successfully!');
  }

  toggleTheme(): void {
    this.themeService.toggleTheme(); 
    this.isDarkMode = document.body.classList.contains('dark-theme');
  }

  

  logout(): void {
    this.localStorageService.logoutUser();
    this.router.navigate(['/login']);
  }
}
