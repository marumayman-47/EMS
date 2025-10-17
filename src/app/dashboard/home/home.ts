import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  user: any;
  today: string = '';
  events: any[] = [];
  guests: any[] = [];
  tasks: any[] = [];
  expenses: any[] = [];
  feedback: any[] = [];

  stats = {
    totalEvents: 0,
    upcomingEvents: 0,
    totalGuests: 0,
    totalTasks: 0,
    totalExpenses: 0,
    totalFeedback: 0
  };

  upcomingEvents: any[] = [];

  constructor(private localStorage: LocalStorageService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.localStorage.getCurrentUser();
    this.today = new Date().toLocaleDateString();

    this.events = this.localStorage.getData('events');
    this.guests = this.localStorage.getData('guests');
    this.tasks = this.localStorage.getData('tasks');
    this.expenses = this.localStorage.getData('expenses');
    this.feedback = this.localStorage.getData('feedback');

    this.calculateStats();
  }

  calculateStats() {
    this.stats.totalEvents = this.events.length;
    this.stats.upcomingEvents = this.events.filter(e => e.status === 'Upcoming').length;
    this.stats.totalGuests = this.guests.length;
    this.stats.totalTasks = this.tasks.length;
    this.stats.totalExpenses = this.expenses.reduce((sum, e) => sum + e.amount, 0);
    this.stats.totalFeedback = this.feedback.length;

    this.upcomingEvents = this.events.filter(e => e.status === 'Upcoming').slice(0, 3);
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
