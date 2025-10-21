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
// getData<T>() returns an array of type T[].
//addItem, updateItem, deleteItem only work with objects that have an id (using <T extends { id: number }>).
//So item is now known, not unknown.

  // Generic getData
  getData<T>(key: string): T[] {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  // Generic saveData
  saveData<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Generic addItem
  addItem<T extends { id?: number }>(key: string, item: T): void {
    const data = this.getData<T>(key);
    item.id = item.id || Date.now();
    data.push(item);
    this.saveData(key, data);
  }

  // Generic updateItem
  updateItem<T extends { id: number }>(key: string, updatedItem: T): void {
    const data = this.getData<T>(key).map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    this.saveData(key, data);
  }

  // Generic deleteItem
  deleteItem<T extends { id: number }>(key: string, id: number): void {
    const data = this.getData<T>(key).filter((item) => item.id !== id);
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
