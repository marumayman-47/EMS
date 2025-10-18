import { Component, OnInit } from '@angular/core';
import { AppEvent } from '../../../models/event';
import { LocalStorageService } from '../../../services/local-storage';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit{
  allEvents: AppEvent[] = [];
  filteredEvents: AppEvent[] = [];
  categories: string[] = [];
  selectedCategory: string | null = null;

  constructor(private localStorage: LocalStorageService, private router: Router) {}

  ngOnInit(): void {
    this.allEvents = this.localStorage.getData<AppEvent>('events') || [];
    this.filteredEvents = this.allEvents.slice(0, 6);
    this.categories = Array.from(new Set(this.allEvents.map(e => e.category))).filter(Boolean);
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.filteredEvents = this.allEvents
      .filter(e => e.category === category)
      .slice(0, 6);
  }

  clearFilter(): void {
    this.selectedCategory = null;
    this.filteredEvents = this.allEvents.slice(0, 6);
  }

  //event details
  viewDetails(eventId: number):void{
    this.router.navigate(['guest/events', eventId]);
  }

}
