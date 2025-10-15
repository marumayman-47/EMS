import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email = '';
  password = '';

  constructor(private storage: LocalStorageService, private router: Router) {}

  onLogin(): void {
    const user = this.storage.loginUser(this.email, this.password);
    
    if (user) {
      alert(`Welcome, ${user.name}!`);
      this.router.navigate((['/dashboard/events/event-manage']));
    } else {
      alert('Invalid email or password.');
    }
  }
}
