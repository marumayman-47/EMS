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

  constructor(private localStorage: LocalStorageService) {}

  ngOnInit(): void {
    const currentUser = this.localStorage.getCurrentUser();
    const allGuests = this.localStorage.getData<Guest>('guests') || [];
    const allEvents = this.localStorage.getData<AppEvent>('events') || [];
    const allFeedback = this.localStorage.getData<Feedback>('feedback') || [];

    // Find all events the user attended
    const myGuestEntries = allGuests.filter(
      g => g.email === currentUser?.email && g.status === 'Accepted'
    );
    const eventIds = myGuestEntries.map(g => g.eventId);
    this.attendedEvents = allEvents.filter(e => eventIds.includes(e.id));

    // Pre-fill feedbacks if they exist
    allFeedback
      .filter(f => f.guestId === currentUser.id)
      .forEach(f => (this.feedbackText[f.eventId] = f.comment));
  }

  submitFeedback(eventId: number): void {
    const comment = this.feedbackText[eventId];
    const currentUser = this.localStorage.getCurrentUser();

    if (!comment || comment.trim() === '') {
      alert('Please enter your feedback comment.');
      return;
    }

    let feedbacks = this.localStorage.getData<Feedback>('feedback') || [];

    // Check if user already gave feedback for this event
    const existingFeedbackIndex = feedbacks.findIndex(
      f => f.eventId === eventId && f.guestId === currentUser.id
    );

    if (existingFeedbackIndex !== -1) {
      // Update existing feedback
      feedbacks[existingFeedbackIndex].comment = comment;
      feedbacks[existingFeedbackIndex].createdAt = new Date().toISOString();
      alert('Feedback updated successfully!');
    } else {
      // Add new feedback
      const newFeedback: Feedback = {
        id: Date.now(),
        eventId,
        guestId: currentUser.id,
        comment,
        rating: 0, // not used, but to keeps model consistent
        createdAt: new Date().toISOString()
      };
      feedbacks.push(newFeedback);
      alert('Feedback submitted successfully!');
    }

    // Save back to local storage
    this.localStorage.saveData('feedback', feedbacks);
  }
}
