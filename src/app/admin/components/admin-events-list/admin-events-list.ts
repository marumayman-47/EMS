import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../../services/local-storage';

@Component({
  selector: 'app-admin-events-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-events-list.html',
  styleUrls: ['./admin-events-list.css']
})
export class AdminEventsList implements OnInit {
  storage = inject(LocalStorageService);
  users: any[] = [];
  events: any[] = [];

  ngOnInit(): void {
    this.events = this.storage.getData('events');
    this.users = this.storage.getData('users');
  }

  getUser(id: string) {
    return (this.users.find((u: any) => u.id === id)).name;
  }

}
