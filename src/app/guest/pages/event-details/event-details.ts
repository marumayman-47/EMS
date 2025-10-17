import { Component } from '@angular/core';
import { AppEvent } from '../../../models/event';
import { Guest } from '../../../models/guest';
import { Task } from '../../../models/task';
import { Expense } from '../../../models/expense';
import { Feedback } from '../../../models/feedback';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-details',
  imports: [CommonModule],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css'
})
export class EventDetails {
  event?: AppEvent;
  guests: Guest[] = [];
  tasks: Task[] = [];
  expenses: Expense[] = [];
  feedback: Feedback[] = [];
  currentUser: any;

  constructor(private route: ActivatedRoute, private localStorage: LocalStorageService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const events = this.localStorage.getData<AppEvent>('events');
    this.event = events.find(e => e.id === id);

    if (this.event) {
      const allGuests = this.localStorage.getData<Guest>('guests');
      const allTasks = this.localStorage.getData<Task>('tasks');
      const allExpenses = this.localStorage.getData<Expense>('expenses');
      const allFeedback = this.localStorage.getData<Feedback>('feedback');

      this.guests = allGuests.filter(g => this.event?.guests.includes(g.id));
      this.tasks = allTasks.filter(t => this.event?.tasks.includes(t.id));
      this.expenses = allExpenses.filter(ex => this.event?.expenses.includes(ex.id));
      // this.feedback = allFeedback.filter(f => this.event?.feedback.includes(f.id));
      this.feedback = allFeedback.filter(f => f.eventId === this.event?.id);
    }
    this.currentUser = this.localStorage.getCurrentUser();
  }
  bookEvent(): void {
    if (!this.event) return;

    if (this.event.status !== 'Upcoming') {
      alert('You cannot attend this event. It is not upcoming.');
      return;
    }

    if (!this.currentUser) {
      alert('Please log in to book this event.');
      return;
    }

    const guests = this.localStorage.getData<Guest>('guests');

    // Check if user already booked
    const alreadyBooked = guests.some(
      g => g.eventId === this.event!.id && g.email === this.currentUser.email
    );

    if (alreadyBooked) {
      alert('You have already booked this event.');
      return;
    }

    // Create new guest
    const newGuest: Guest = {
      id: Date.now(),
      name: this.currentUser.name,
      email: this.currentUser.email,
      phone: this.currentUser.phone || 'N/A',
      status: 'Accepted',
      eventId: this.event.id
    };

    // Add guest to storage
    guests.push(newGuest);
    this.localStorage.saveData('guests', guests);

    // Update event’s guest list
    this.event.guests.push(newGuest.id);
    const events = this.localStorage.getData<AppEvent>('events');
    const updatedEvents = events.map(e => e.id === this.event!.id ? this.event! : e);
    this.localStorage.saveData('events', updatedEvents);

    alert('You have successfully booked this event!');
  }
}
