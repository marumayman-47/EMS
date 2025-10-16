import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage';

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

  constructor(private localStorageService: LocalStorageService, private router: Router) {}

  ngOnInit(): void {
    const currentUser = this.localStorageService.getCurrentUser();
    if (currentUser) {
      this.user = { ...currentUser };
    }

    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.applyTheme();
  }

  saveProfile(): void {
    const users = this.localStorageService.getData('users');
    const updatedUsers = users.map((u: any) => u.id === this.user.id ? this.user : u);
    this.localStorageService.saveData('users', updatedUsers);
    localStorage.setItem('currentUser', JSON.stringify(this.user));
    alert('Profile updated successfully!');
  }

  toggleTheme(): void {
    const theme = this.isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    this.applyTheme();
  }

  applyTheme(): void {
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }

  logout(): void {
    this.localStorageService.logoutUser();
    this.router.navigate(['/login']);
  }
}
