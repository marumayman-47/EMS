import { Component } from '@angular/core';
import { LocalStorageService } from '../../../services/local-storage';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eventlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eventlist.html',
  styleUrls: ['./eventlist.css']
})
export class Eventlist {
  events: any[] = [];

  constructor(private storage: LocalStorageService) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.events = this.storage.getData('events');
  }

  addEvent() {
    const newEvent = {
      name: 'Demo Event',
      description: 'Sample event for testing',
      category: 'Conference',
      location: 'Hall A',
      startDate: '2025-10-15',
      endDate: '2025-10-17',
      createdBy: 1,
      guests: [],
      tasks: [],
      expenses: [],
      feedback: [],
      status: 'Upcoming'
    };
    this.storage.addItem('events', newEvent);
    this.loadEvents();
  }

}
