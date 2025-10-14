import { Injectable } from '@angular/core';
import { mockUsers, mockEvents, mockGuests, mockTasks, mockExpenses, mockFeedback } from '../data/mock-data';
import { JsonPipe } from '@angular/common';

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

  // user auth methods
  loginUser (email: string, password: string): any | null {
    const users = this.getData('users');
    const user = users.find((u: any) => u.email === email && u.password === password);
    if(user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    return null;
  }

  registerUser(newUser: any): boolean {
    const users = this.getData('users');
    const exists = users.find((u: any) => u.email === newUser.email);
    if(exists) {
      return false; // email already taken.
    }

    newUser.id = Date.now();
    users.push(newUser);
    this.saveData('users', users);
    return true; 
  }

  getCurrentUser(): any | null {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

  logoutUser(): void {
    localStorage.removeItem('currentUser');
  }
}
