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
  itemsPerPage: number = 7;
  totalPages: number = 1;

  constructor(private storage: LocalStorageService) {}

  ngOnInit(): void {
    this.loadEvents();
    this.applyFilters();
  }  
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

  // Dark Mode Toggle
  toggleTheme(event: any) {
  const isDark = event.target.checked;
  document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

ngAfterViewInit() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-bs-theme', savedTheme);
  const switchEl = document.getElementById('themeSwitch') as HTMLInputElement;
  if (switchEl) switchEl.checked = savedTheme === 'dark';
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

  // getEmptyEvent(): AppEvent {
  //   return {
  //     id: 0,
  //     name: '',
  //     description: '',
  //     category: '',
  //     location: '',
  //     startDate: '',
  //     endDate: '',
  //     createdBy: 1,
  //     guests: [],
  //     tasks: [],
  //     expenses: [],
  //     feedback: [],
  //     status: 'Upcoming'
  //   };
  // }

  saveEvent(): void {
    if (!this.selectedEvent) return;

    // Convert comma-separated text fields back to arrays
    this.selectedEvent.guests = this.toNumberArray(this.selectedEvent.guests);
    this.selectedEvent.tasks = this.toNumberArray(this.selectedEvent.tasks);
    this.selectedEvent.expenses = this.toNumberArray(this.selectedEvent.expenses);
    this.selectedEvent.feedback = this.toNumberArray(this.selectedEvent.feedback);

    if (this.dialogMode === 'create') {
      this.storage.addItem<AppEvent>('events', this.selectedEvent);
    } else if (this.dialogMode === 'update') {
      this.storage.updateItem<AppEvent>('events', this.selectedEvent);
    }

    this.loadEvents();
    this.closeDialog();
  }

  deleteEvent(id: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.storage.deleteItem<AppEvent>('events', id);
      this.loadEvents();
    }
  }

  private toNumberArray(value: any): number[] {
    if (Array.isArray(value)) return value.map(Number);
    if (typeof value === 'string' && value.trim() !== '')
      return value.split(',').map(v => Number(v.trim()));
    return [];
  }
}
