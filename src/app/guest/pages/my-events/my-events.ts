import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AppEvent } from '../../../models/event';
import { Feedback } from '../../../models/feedback';
import { LocalStorageService } from '../../../services/local-storage';
import { Guest } from '../../../models/guest';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-events',
  imports: [CommonModule, FormsModule],
  templateUrl: './my-events.html',
  styleUrl: './my-events.css'
})
export class MyEvents {
  attendedEvents: AppEvent[] = [];
  feedbackText: { [eventId: number]: string } = {};
  feedbackRating: { [eventId: number]: number } = {};

  constructor(private localStorage: LocalStorageService) {}

  ngOnInit(): void {
    const currentUser = this.localStorage.getCurrentUser();
    const allGuests = this.localStorage.getData<Guest>('guests');
    const allEvents = this.localStorage.getData<AppEvent>('events');

    // find all events this user attended
    const myGuestEntries = allGuests.filter(
      g => g.email === currentUser?.email && g.status === 'Accepted'
    );
    const eventIds = myGuestEntries.map(g => g.eventId);

    this.attendedEvents = allEvents.filter(e => eventIds.includes(e.id));
  }

  submitFeedback(eventId: number): void {
    const comment = this.feedbackText[eventId];
    const rating = this.feedbackRating[eventId];
    const currentUser = this.localStorage.getCurrentUser();

    if (!comment || !rating) {
      alert('Please enter both comment and rating.');
      return;
    }

    const newFeedback: Feedback = {
      id: Date.now(),
      eventId: eventId,
      guestId: currentUser.id,
      comment: comment,
      rating: rating,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    this.localStorage.addItem('feedback', newFeedback);

    // Reset form
    this.feedbackText[eventId] = '';
    this.feedbackRating[eventId] = 0;

    alert('Feedback submitted successfully!');
  }

}
