import { Component, OnInit } from '@angular/core';
import { AppEvent } from '../../../models/event';
import { LocalStorageService } from '../../../services/local-storage';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-events',
  imports: [CommonModule, FormsModule],
  templateUrl: './events.html',
  styleUrl: './events.css'
})
export class Events {
  events: AppEvent[] = [];
  filteredEvents: AppEvent[] = []; // filtered results
  visibleEvents: AppEvent[] = [];

  searchTerm: string = '';
  visibleCount: number = 9;

  constructor(private localStorage: LocalStorageService, private router: Router)
  {}

  // get all events from localStorage
  ngOnInit(): void
  {
    this.events = this.localStorage.getData<AppEvent>('events');
    // console.log(this.events);
    this.filteredEvents = [...this.events];
    this.updateVisibleEvents();
  }

  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredEvents = this.events.filter(
      (event) =>
        event.name.toLowerCase().includes(term) ||
        event.category.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term)
    );
    this.visibleCount = 9; 
    this.updateVisibleEvents();
  }

  updateVisibleEvents(): void {
    this.visibleEvents = this.filteredEvents.slice(0, this.visibleCount);
  }

  viewMore(): void {
    this.visibleCount += 9;
    this.updateVisibleEvents();
  }

  //event details
  viewDetails(eventId: number):void{
    this.router.navigate(['guest/events', eventId]);
  }
}
