// src/app/dashboard/guests/guests.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Guest } from '../../models/guest';
import { AppEvent } from '../../models/event';

declare const bootstrap: any;

@Component({
  selector: 'app-guests',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './guests.html',
  styleUrls: ['./guests.css']
})
export class Guests implements OnInit {
  guests: Guest[] = [];
  filteredGuests: Guest[] = [];
  events: AppEvent[] = [];
  statuses = ['Invited', 'Accepted', 'Declined', 'Pending'];

  selectedEvent: string = '';
  selectedStatus: string = '';
  searchTerm: string = '';

  guestForm: Guest = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    status: 'Pending',
    eventId: 0
  };

  editMode = false;

  ngOnInit(): void {
    this.loadEvents();
    this.loadGuests();

  }

  // Load guests from localStorage
  loadGuests(): void {
    const stored = localStorage.getItem('guests');
    this.guests = stored ? JSON.parse(stored) as Guest[] : [];
    this.filteredGuests = [...this.guests];
  }

  // Load events from localStorage
  loadEvents(): void {
    const storedEvents = localStorage.getItem('events');
    this.events = storedEvents ? JSON.parse(storedEvents) as AppEvent[] : [];
  }

  saveToStorage(): void {
    localStorage.setItem('guests', JSON.stringify(this.guests));
  }

  filterGuests(): void {
    this.filteredGuests = this.guests.filter(g => {
      const matchEvent = this.selectedEvent ? g.eventId === +this.selectedEvent : true;
      const matchStatus = this.selectedStatus ? g.status === this.selectedStatus : true;
      const matchSearch = this.searchTerm
        ? g.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          g.email.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
      return matchEvent && matchStatus && matchSearch;
    });
  }

  getEventName(id: number): string {
    const ev = this.events.find(e => Number(e.id) === Number(id));
    return ev ? ev.name : 'Unknown Event';
  }

  saveGuest(): void {
    if (!this.guestForm.name || !this.guestForm.email || !this.guestForm.eventId) {
      alert('Please fill in all required fields.');
      return;
    }

    const guestsForEvent = this.guests.filter(g => g.eventId === this.guestForm.eventId);
    if (!this.editMode && guestsForEvent.length >= 300) {
      alert('Maximum 300 guests allowed per event.');
      return;
    }

    if (this.editMode) {
      const index = this.guests.findIndex(g => g.id === this.guestForm.id);
      if (index > -1) this.guests[index] = { ...this.guestForm };
      this.editMode = false;
    } else {
      this.guestForm.id = Date.now();
      this.guests.push({ ...this.guestForm });
    }

    this.saveToStorage();
    this.filterGuests();
    this.resetForm();

    // Close modal (Bootstrap)
    const modalEl = document.getElementById('guestModal');
    if (modalEl) {
      const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modalInstance.hide();
    }
  }

  editGuest(guest: Guest): void {
    this.guestForm = { ...guest };
    this.editMode = true;
    const modalEl = document.getElementById('guestModal');
    if (modalEl) {
      const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modalInstance.show();
    }
  }

  deleteGuest(id: number): void {
    if (!confirm('Are you sure you want to delete this guest?')) return;
    this.guests = this.guests.filter(g => g.id !== id);
    this.saveToStorage();
    this.filterGuests();
  }

  resetForm(): void {
    this.guestForm = {
      id: 0,
      name: '',
      email: '',
      phone: '',
      status: 'Pending',
      eventId: 0
    };
    this.editMode = false;
  }

  
}
