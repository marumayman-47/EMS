import { Injectable } from '@angular/core';
import { mockUsers, mockEvents, mockGuests, mockTasks, mockExpenses, mockFeedback } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {
    this.initializeData();
  }

   initializeData(): void {
    this.setIfEmpty('users', mockUsers);
    this.setIfEmpty('events', mockEvents);
    this.setIfEmpty('guests', mockGuests);
    this.setIfEmpty('tasks', mockTasks);
    this.setIfEmpty('expenses', mockExpenses);
    this.setIfEmpty('feedback', mockFeedback);
  }

  private setIfEmpty(key: string, data: any[]): void {
    if (!localStorage.getItem(key) || localStorage.getItem(key) === '[]') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  getData(key: string): any[] {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  saveData(key: string, data: any[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  addItem(key: string, item: any): void {
    const data = this.getData(key);
    item.id = Date.now();
    data.push(item);
    this.saveData(key, data);
  }

  updateItem(key: string, updatedItem: any): void {
    const data = this.getData(key).map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    this.saveData(key, data);
  }

  deleteItem(key: string, id: number): void {
    const data = this.getData(key).filter(item => item.id !== id);
    this.saveData(key, data);
  }
}
