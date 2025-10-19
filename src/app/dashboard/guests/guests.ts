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
  currentUser: any = null;

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadEvents();
    this.loadGuests();
  }

  /** Load the currently logged-in user */
  loadCurrentUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUser = storedUser ? JSON.parse(storedUser) : null;
  }

  /** Load only this user's events */
  loadEvents(): void {
    const storedEvents = localStorage.getItem('events');
    const allEvents = storedEvents ? JSON.parse(storedEvents) as AppEvent[] : [];

    if (this.currentUser) {
      this.events = allEvents.filter(e => +e.createdBy === +this.currentUser.id);
    } else {
      this.events = [];
    }
  }

  /** Load guests for the current user's events */
  loadGuests(): void {
    const storedGuests = localStorage.getItem('guests');
    const storedEvents = localStorage.getItem('events');
    const allGuests: Guest[] = storedGuests ? JSON.parse(storedGuests) : [];
    const allEvents: AppEvent[] = storedEvents ? JSON.parse(storedEvents) : [];

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

  saveToStorage(): void {
    // Update only the global guest list, not just filtered ones
    const allGuests = JSON.parse(localStorage.getItem('guests') || '[]');
    const updatedGuests = allGuests.filter((g: Guest) => !this.guests.find(ug => ug.id === g.id));
    const mergedGuests = [...updatedGuests, ...this.guests];
    localStorage.setItem('guests', JSON.stringify(mergedGuests));
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
    if (!this.guestForm.name || !this.guestForm.email || !this.guestForm.eventId) {
      alert('Please fill in all required fields.');
      return;
    }

    // Ensure the guest is added to one of the current user's events only
    const validEvent = this.events.find(e => +e.id === +this.guestForm.eventId);
    if (!validEvent) {
      alert('You can only add guests to your own events.');
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

    // Close modal
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
