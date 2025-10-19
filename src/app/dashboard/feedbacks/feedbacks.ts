import { Component, OnInit } from '@angular/core';
import { Feedback } from '../../models/feedback';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppEvent } from '../../models/event';
import { Guest } from '../../models/guest';

@Component({
  selector: 'app-feedbacks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedbacks.html',
  styleUrl: './feedbacks.css'
})
export class Feedbacks implements OnInit{

  feedbacks: Feedback[] = [];
  filteredFeedbacks: Feedback[] = [];
  selectedRating: string = '';
  viewFeedbackObj: Feedback | null = null;

  // For event and guest names
  events: AppEvent[] = [];
  guests: Guest[] = [];
  
  // New feedback form object
  newFeedback: Feedback = { id: 0, guestId: 0, eventId: 0, rating: 0, comment: '', createdAt: '' };

  ngOnInit(): void {
    this.loadData();

    // ✅ Auto-refresh whenever another component updates localStorage (e.g. Event Details)
    window.addEventListener('storage', () => this.loadData());
  }

  /** ✅ Load feedback + related data from localStorage */
  loadData(): void {
    const storedFeedbacks = localStorage.getItem('feedback');
    const storedEvents = localStorage.getItem('events');
    const storedGuests = localStorage.getItem('guests');

    this.feedbacks = storedFeedbacks ? JSON.parse(storedFeedbacks) : [];
    this.events = storedEvents ? JSON.parse(storedEvents) : [];
    this.guests = storedGuests ? JSON.parse(storedGuests) : [];

    this.filteredFeedbacks = this.feedbacks;
  }

    /** ✅ Filter feedback by rating */
  applyFilter() {
    if (this.selectedRating) {
      this.filteredFeedbacks = this.feedbacks.filter(f => f.rating === +this.selectedRating);
    } else {
      this.filteredFeedbacks = this.feedbacks;
    }
  }


  deleteFeedback(id: number) {
    if (confirm('Are you sure you want to delete this feedback?')) {
      this.feedbacks = this.feedbacks.filter(f => f.id !== id);
      this.filteredFeedbacks = this.filteredFeedbacks.filter(f => f.id !== id);
      localStorage.setItem('feedbacks', JSON.stringify(this.feedbacks));
    }
  }

   viewFeedback(feedback: Feedback) {
    this.viewFeedbackObj = feedback;
  }

  /** ✅ Show event name in table */
  getEventName(eventId: number): string {
    return this.events.find(e => e.id === eventId)?.name || 'Unknown Event';
  }

  /** ✅ Show guest name in table */
  getGuestName(guestId: number): string {
    return this.guests.find(g => g.id === guestId)?.name || 'Unknown Guest';
  }
}


