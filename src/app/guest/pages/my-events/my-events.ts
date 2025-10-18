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
  invitedEvents: AppEvent[] = [];
  feedbackText: { [eventId: number]: string } = {};
  feedbackRating: { [eventId: number]: number } = {};
  existingFeedback: Feedback[] = [];

  constructor(private localStorage: LocalStorageService) {}

  ngOnInit(): void {
    const currentUser = this.localStorage.getCurrentUser();
    const allGuests = this.localStorage.getData<Guest>('guests') || [];
    const allEvents = this.localStorage.getData<AppEvent>('events') || [];
    const allFeedbacks = this.localStorage.getData<Feedback>('feedback') || [];

    // Get events this user is invited to
    const myInvited = allGuests.filter(
      g => g.email === currentUser?.email && g.status === 'Invited'
    );
    const invitedIds = myInvited.map(g => g.eventId);
    this.invitedEvents = allEvents.filter(e => invitedIds.includes(e.id));

    // Get events this user accepted
    const myAccepted = allGuests.filter(
      g => g.email === currentUser?.email && g.status === 'Accepted'
    );
    const attendedIds = myAccepted.map(g => g.eventId);
    this.attendedEvents = allEvents.filter(e => attendedIds.includes(e.id));

    // Load existing feedbacks by this user
    this.existingFeedback = allFeedbacks.filter(f => f.guestId === currentUser?.id);

    // Pre-fill text and rating for events user already gave feedback on
    this.existingFeedback.forEach(f => {
      this.feedbackText[f.eventId] = f.comment;
      this.feedbackRating[f.eventId] = f.rating;
    });
  }

  hasFeedback(eventId: number): boolean {
    return this.existingFeedback.some(f => f.eventId === eventId);
  }

  submitFeedback(eventId: number): void {
    const currentUser = this.localStorage.getCurrentUser();
    const comment = this.feedbackText[eventId];
    const rating = this.feedbackRating[eventId];

    if (!comment || !rating) {
      alert('Please provide both a comment and a rating.');
      return;
    }

    let feedbacks = this.localStorage.getData<Feedback>('feedback') || [];

    const existingIndex = feedbacks.findIndex(
      f => f.eventId === eventId && f.guestId === currentUser.id
    );

    if (existingIndex > -1) {
      // Update existing feedback
      feedbacks[existingIndex].comment = comment;
      feedbacks[existingIndex].rating = rating;
      feedbacks[existingIndex].createdAt = new Date().toISOString();
      alert('Feedback updated successfully!');
    } else {
      // Add new feedback
      const newFeedback: Feedback = {
        id: Date.now(),
        eventId,
        guestId: currentUser.id,
        comment,
        rating,
        createdAt: new Date().toISOString()
      };
      feedbacks.push(newFeedback);
      alert('Feedback submitted successfully!');
    }

    // Save changes
    this.localStorage.saveData('feedback', feedbacks);

    // Refresh local data
    this.existingFeedback = feedbacks.filter(f => f.guestId === currentUser.id);
  }

  acceptInvitation(eventId: number): void {
    const currentUser = this.localStorage.getCurrentUser();
    const guests = this.localStorage.getData<Guest>('guests') || [];
    const guestIndex = guests.findIndex(
      g => g.email === currentUser.email && g.eventId === eventId
    );
    if (guestIndex > -1) {
      guests[guestIndex].status = 'Accepted';
      this.localStorage.saveData('guests', guests);
      alert('Invitation accepted!');
      this.ngOnInit();
    }
  }

  declineInvitation(eventId: number): void {
    const currentUser = this.localStorage.getCurrentUser();
    const guests = this.localStorage.getData<Guest>('guests') || [];
    const guestIndex = guests.findIndex(
      g => g.email === currentUser.email && g.eventId === eventId
    );
    if (guestIndex > -1) {
      guests[guestIndex].status = 'Declined';
      this.localStorage.saveData('guests', guests);
      alert('Invitation declined!');
      this.ngOnInit();
    }
  }
}
