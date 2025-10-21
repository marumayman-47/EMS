import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Guest } from '../../models/guest';
import { AppEvent } from '../../models/event';
import { LocalStorageService } from '../../services/local-storage';

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
  formStatuses = ['Invited', 'Pending'];


  selectedEvent: string = '';
  selectedStatus: string = '';
  searchTerm: string = '';

  guestForm: any = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    status: 'Invited',
    eventId: 0,
    password: ''
  };

  editMode = false;
  currentUser: any = null;

  constructor(private storage: LocalStorageService) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadEvents();
    this.loadGuests();
  }

  /** Load the currently logged-in user */
  loadCurrentUser(): void {
    this.currentUser = this.storage.getCurrentUser();
  }

  /** Load only this user's events */
  loadEvents(): void {
    const allEvents = this.storage.getData<AppEvent>('events');
    if (this.currentUser) {
      this.events = allEvents.filter(e => +e.createdBy === +this.currentUser.id);
    } else {
      this.events = [];
    }
  }

  /** Load guests for the current user's events */
  loadGuests(): void {
    const allGuests = this.storage.getData<Guest>('guests');
    const allEvents = this.storage.getData<AppEvent>('events');

    if (this.currentUser) {
      const userEventIds = allEvents
        .filter(e => +e.createdBy === +this.currentUser.id)
        .map(e => e.id);

      this.guests = allGuests.filter(g => userEventIds.includes(g.eventId));
    } else {
      this.guests = [];
    }

    this.filteredGuests = [...this.guests];
  }

  /** Filter guests by event, status, or search */
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

  /** Get event name by ID */
  getEventName(id: number): string {
    const ev = this.events.find(e => +e.id === +id);
    return ev ? ev.name : 'Unknown Event';
  }

  /** Add or update a guest */
  saveGuest(): void {
    if (!this.guestForm.name || !this.guestForm.email || !this.guestForm.phone || !this.guestForm.password || !this.guestForm.eventId) {
      alert('Please fill in all required fields.');
      return;
    }

    // Ensure the guest is added to one of the current user's events only
    const validEvent = this.events.find(e => +e.id === +this.guestForm.eventId);
    if (!validEvent) {
      alert('You can only add guests to your own events.');
      return;
    }

    const allUsers = this.storage.getData<any>('users');
    const existingUser = allUsers.find(u => u.email === this.guestForm.email);
    if (!this.editMode && existingUser) {
      alert('A user with this email already exists.');
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
      this.storage.updateItem('guests', this.guestForm);
      this.editMode = false;
    } else {
      const newId = Date.now();
      const newGuest: Guest = {
        id: newId,
        name: this.guestForm.name,
        email: this.guestForm.email,
        phone: this.guestForm.phone,
        status: this.guestForm.status || 'Invited',
        eventId: +this.guestForm.eventId
      };

      // Save guest to guests list
      this.storage.addItem('guests', newGuest);

      // Save guest also as a user with role 'Guest'
      const newUser = {
        id: newId,
        name: this.guestForm.name,
        email: this.guestForm.email,
        password: this.guestForm.password,
        role: 'Guest'
      };
      this.storage.addItem('users', newUser);

      this.guests.push(newGuest);
    }

    this.filterGuests();
    this.resetForm();

    // Close modal
    const modalEl = document.getElementById('guestModal');
    if (modalEl) {
      const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
      modalInstance.hide();
    }
  }

  editGuest(guest: Guest): void {
    this.guestForm = { ...guest, password: '' }; // password not stored in guest, new required only if updated as user
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
    this.storage.deleteItem('guests', id);
    this.storage.deleteItem('users', id);
    this.filterGuests();
  }

  resetForm(): void {
    this.guestForm = {
      id: 0,
      name: '',
      email: '',
      phone: '',
      status: 'Invited',
      eventId: 0,
      password: ''
    };
    this.editMode = false;
  }
}
