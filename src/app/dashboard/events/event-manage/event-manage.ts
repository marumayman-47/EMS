import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from '../../../services/local-storage';
import { AppEvent } from '../../../models/event';

declare const bootstrap: any;

@Component({
  selector: 'app-event-manage',
  imports: [CommonModule, FormsModule],
  templateUrl: './event-manage.html',
  styleUrl: './event-manage.css'
})
export class EventManage implements OnInit {
  events: AppEvent[] = [];
  selectedEvent: AppEvent | null = null;
  dialogMode: 'create' | 'update' | 'view' = 'create';

  constructor(private storage: LocalStorageService) {}

  ngOnInit(): void {
    this.loadEvents();
  }  
  loadEvents(): void {
   this.events = this.storage.getData<AppEvent>('events');
  }
  openDialog(mode: 'create' | 'update' | 'view', event?: AppEvent): void {
    this.dialogMode = mode;
    this.selectedEvent = event ? { ...event } : this.getEmptyEvent();
    const modal = document.getElementById('eventModal') as any;
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
  }

  closeDialog(): void {
    const modalEl = document.getElementById('eventModal');
    const modal = bootstrap.Modal.getInstance(modalEl!);
    modal?.hide();
  }

  getEmptyEvent(): AppEvent {
    return {
      id: 0,
      name: '',
      description: '',
      category: '',
      location: '',
      startDate: '',
      endDate: '',
      createdBy: 1,
      guests: [],
      tasks: [],
      expenses: [],
      feedback: [],
      status: 'Upcoming'
    };
  }

  saveEvent(): void {
    if (!this.selectedEvent) return;

    if (this.dialogMode === 'create') {
      this.storage.addItem('events', this.selectedEvent);
    } else if (this.dialogMode === 'update') {
      this.storage.updateItem('events', this.selectedEvent);
    }

    this.loadEvents();
    this.closeDialog();
  }

  deleteEvent(id: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.storage.deleteItem('events', id);
      this.loadEvents();
    }
  }
}
