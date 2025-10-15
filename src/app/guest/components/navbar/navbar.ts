import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit{
  isDarkMode = true;

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      // use saved theme if exists
      this.isDarkMode = savedTheme === 'dark';
    } else {
      // if first time, set dark mode as default
      this.isDarkMode = true;
      localStorage.setItem('theme', 'dark');
    }

    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
