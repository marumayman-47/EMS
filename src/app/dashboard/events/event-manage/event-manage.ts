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

  searchTerm: string = '';
  filterCategory: string = '';
  filterStatus: string = '';
  filteredEvents: any[] = [];
  uniqueCategories: string[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private storage: LocalStorageService) {}

  ngOnInit(): void {
    this.loadEvents();
    this.applyFilters();
  } 
  /** Load Events from LocalStorage */ 
  loadEvents(): void {
   this.events = this.storage.getData<AppEvent>('events');
   this.uniqueCategories = [...new Set(this.events.map((e: any) => e.category))];
   this.applyFilters();
  }

  applyFilters(): void {
  // filter
  const filtered = this.events.filter((e: any) => {
    const matchesName = e.name.toLowerCase().includes(this.searchTerm.toLowerCase());
    const matchesCategory = this.filterCategory ? e.category === this.filterCategory : true;
    const matchesStatus = this.filterStatus ? e.status === this.filterStatus : true;
    return matchesName && matchesCategory && matchesStatus;
  });

  // pagination
  this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
  if (this.currentPage > this.totalPages) this.currentPage = this.totalPages || 1;

  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  this.filteredEvents = filtered.slice(start, end);
}

// reset page when filter/search changes
onFiltersChanged(): void {
  this.currentPage = 1;
  this.applyFilters();
}

// page controls
goToPage(page: number): void {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.applyFilters();
  }
}

previousPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.applyFilters();
  }
}

nextPage(): void {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.applyFilters();
  }
}

  openDialog(mode: 'create' | 'update' | 'view', event?: AppEvent): void {
    this.dialogMode = mode;
    this.selectedEvent = event
      ? { ...event }
      : {
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

    const modal = document.getElementById('eventModal') as any;
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
  }

  closeDialog(): void {
    const modalEl = document.getElementById('eventModal');
    const modal = bootstrap.Modal.getInstance(modalEl!);
    modal?.hide();
  }

  /** Save Event with Full Validation */
saveEvent(): void {
  console.log("✅ Save button clicked", this.selectedEvent);

  if (!this.selectedEvent) return;

  const events = this.storage.getData<AppEvent>('events');
  const user = this.storage.getCurrentUser();

  // --- VALIDATIONS ---

  // 1️⃣ Ensure unique event name per user
  const duplicate = events.find(
    (e: AppEvent) =>
      e.name.trim().toLowerCase() === this.selectedEvent!.name.trim().toLowerCase() &&
      e.createdBy === user?.id &&
      e.id !== this.selectedEvent!.id
  );
  if (duplicate) {
    alert('❌ Event name must be unique for this user.');
    return;
  }

  // 2️⃣ Start date must be before end date
  if (new Date(this.selectedEvent.startDate) >= new Date(this.selectedEvent.endDate)) {
    alert('❌ Start date must be before End date.');
    return;
  }

  // 3️⃣ Max 300 guests check
  if (this.selectedEvent.guests && this.selectedEvent.guests.length > 300) {
    alert('❌ Maximum 300 guests allowed per event.');
    return;
  }

  // --- SANITIZE / DEFAULT ARRAYS ---
  // Initialize arrays if they don’t exist
  this.selectedEvent.tasks = this.selectedEvent.tasks || [];
  this.selectedEvent.expenses = this.selectedEvent.expenses || [];
  this.selectedEvent.feedback = this.selectedEvent.feedback || [];

  // --- CREATE OR UPDATE ---
  if (this.dialogMode === 'create') {
    const newEventId = Date.now();
    this.selectedEvent.id = newEventId;
    this.selectedEvent.createdBy = user?.id || 1;

    events.push(this.selectedEvent);
    this.storage.saveData('events', events);
    console.log("🎉 Event created:", this.selectedEvent);
  } 
  else if (this.dialogMode === 'update') {
    const idx = events.findIndex(e => e.id === this.selectedEvent!.id);
    if (idx !== -1) {
      events[idx] = this.selectedEvent!;
      this.storage.saveData('events', events);
      console.log("✏️ Event updated:", this.selectedEvent);
    }
  }

  // --- REFRESH + CLOSE ---
  this.loadEvents();
  this.closeDialog();
}


  //  Returns an array (fixes the `.forEach` error)
  private toArrayObjects(value: any, type: 'task' | 'expense'): any[] {
    if (!value) return [];
    const items = typeof value === 'string'
      ? value.split(',').map(v => v.trim()).filter(v => v)
      : value;

    return items.map((item: any, index: number) => {
      if (type === 'task') {
        return {
          title: `Task ${index + 1}: ${item}`,
          description: '',
          assignedTo: '',
          priority: 'Medium',
          deadline: new Date().toISOString().split('T')[0],
          status: 'Not Started',
          comments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else {
        return {
          name: `Expense ${index + 1}: ${item}`,
          amount: 0,
          category: 'Miscellaneous',
          date: new Date().toISOString().split('T')[0],
          notes: '',
        };
      }
    });
  }

  /** Prevent deletion of completed events */
  deleteEvent(id: number): void {
    const event = this.events.find(e => e.id === id);
    if (!event) return;

    if (event.status === 'Completed') {
      alert('❌ Completed events cannot be deleted.');
      return;
    }

    if (confirm('Are you sure you want to delete this event?')) {
      this.storage.deleteItem<AppEvent>('events', id);
      this.loadEvents();
    }
  }

  /** Utility: convert string to number[] */
  private toNumberArray(value: any): number[] {
    if (Array.isArray(value)) return value.map(Number);
    if (typeof value === 'string' && value.trim() !== '')
      return value.split(',').map(v => Number(v.trim()));
    return [];
  }
}
