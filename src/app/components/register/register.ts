import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  user = { name: '', email: '', password: '', role: '' };

  constructor(private storage: LocalStorageService, private router: Router) {}

  onRegister(): void {
    const success = this.storage.registerUser(this.user);
    if(success) {
      alert('Registration successful!');
      this.router.navigate(['/login']);
    } else {
      alert('Email already exists. Please use another one.');
    }
  }
}
