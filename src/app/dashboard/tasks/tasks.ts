import { Component } from '@angular/core';
import { Task } from '../../models/task';
import { mockTasks } from '../../data/mock-data';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface EventTasks {
  eventId: number;
  tasks: Task[];
  progress: number;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class Tasks {
  tasks: Task[] = [];
  groupedTasks: EventTasks[] = [];
  events: any[] = [];

  selectedStatus: string = '';
  selectedPriority: string = '';

  newTask: Task = this.resetTask();
  editTaskObj: Task | null = null;
  viewTaskObj: Task | null = null;
  dialogMode: 'create' | 'edit' | 'view' = 'create';


  constructor() {
    const storedTasks = this.loadFromLocalStorage<Task[]>('tasks');
    this.tasks = storedTasks && storedTasks.length ? storedTasks : mockTasks;

    // Ensure events exist in localStorage for linking
    this.events = this.loadFromLocalStorage<any[]>('events') || [];
    // if (!localStorage.getItem('events')) {
    //   localStorage.setItem('events', JSON.stringify([]));
    // }

    this.groupTasksByEvent();
  }

  // 🔹 Local Storage helpers
  loadFromLocalStorage<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  

  saveToLocalStorage<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // 🔹 Reset Task template
  resetTask(): Task {
    return {
      id: 0,
      eventId: 0,
      title: '',
      description: '',
      assignedTo: '',
      priority: 'Low',
      status: 'Not Started',
      comments: [],
      createdAt: '',
      updatedAt: '',
      deadline: ''
    };
  }

  // 🔹 Group by event
  groupTasksByEvent() {
    let filteredTasks = this.tasks.filter(t =>
      (this.selectedStatus ? t.status === this.selectedStatus : true) &&
      (this.selectedPriority ? t.priority === this.selectedPriority : true)
    );

    const map = new Map<number, Task[]>();
    filteredTasks.forEach(task => {
      if (!map.has(task.eventId)) map.set(task.eventId, []);
      map.get(task.eventId)?.push(task);
    });

    this.groupedTasks = Array.from(map.entries()).map(([eventId, tasks]) => {
      tasks.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
      const completed = tasks.filter(t => t.status === 'Completed').length;
      const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
      return { eventId, tasks, progress };
    });
  }

  // 🔹 Add new task
  addTask() {
    this.newTask.id = this.tasks.length ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
    this.newTask.createdAt = new Date().toISOString().split('T')[0];
    this.newTask.updatedAt = new Date().toISOString().split('T')[0];

    const newTaskCopy = { ...this.newTask, comments: [] };
    this.tasks.push(newTaskCopy);

    // ✅ Save updated task list
    this.saveToLocalStorage('tasks', this.tasks);

    // ✅ Update event’s tasks array
    const storedEvents = this.loadFromLocalStorage<any[]>('events') || [];
    const eventIndex = storedEvents.findIndex(e => e.id === newTaskCopy.eventId);
    if (eventIndex !== -1) {
      if (!Array.isArray(storedEvents[eventIndex].tasks)) {
        storedEvents[eventIndex].tasks = [];
      }
      if (!storedEvents[eventIndex].tasks.includes(newTaskCopy.id)) {
        storedEvents[eventIndex].tasks.push(newTaskCopy.id);
      }
      this.saveToLocalStorage('events', storedEvents);
    }

    this.newTask = this.resetTask();
    this.groupTasksByEvent();
  }

  // 🔹 Edit task
  updateTask(task: Task) {
    this.editTaskObj = { ...task };
  }

  saveEdit() {
    if (!this.editTaskObj) return;

    const index = this.tasks.findIndex(t => t.id === this.editTaskObj!.id);
    if (index !== -1) {
      this.editTaskObj.updatedAt = new Date().toISOString().split('T')[0];
      this.tasks[index] = { ...this.editTaskObj };
    }

    this.saveToLocalStorage('tasks', this.tasks);
    this.editTaskObj = null;
    this.groupTasksByEvent();
  }

  // 🔹 Delete task (and unlink from event)
  deleteTask(taskId: number) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    const deletedTask = this.tasks.find(t => t.id === taskId);
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    this.saveToLocalStorage('tasks', this.tasks);

    // Remove from event’s task array
    if (deletedTask) {
      const storedEvents = this.loadFromLocalStorage<any[]>('events') || [];
      const eventIndex = storedEvents.findIndex(e => e.id === deletedTask.eventId);
      if (eventIndex !== -1) {
        storedEvents[eventIndex].tasks = storedEvents[eventIndex].tasks.filter((id: number) => id !== taskId);
        this.saveToLocalStorage('events', storedEvents);
      }
    }

    this.groupTasksByEvent();
  }

  // 🔹 Progress helpers
  taskProgress(task: Task): number {
    switch (task.status) {
      case 'Not Started': return 0;
      case 'In Progress': return 50;
      case 'Completed': return 100;
      default: return 0;
    }
  }

  getEventProgressColor(progress: number): string {
    if (progress <= 40) return 'bg-danger';
    if (progress <= 70) return 'bg-warning';
    return 'bg-success';
  }

  getTaskProgressColor(task: Task): string {
    if (this.isOverdue(task.deadline, task.status)) return 'bg-danger';
    switch (task.status) {
      case 'Not Started': return 'bg-secondary';
      case 'In Progress': return 'bg-warning';
      case 'Completed': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  isOverdue(deadline: string, status: string): boolean {
    return new Date(deadline) < new Date() && status !== 'Completed';
  }

  applyFilters() {
    this.groupTasksByEvent();
  }

  viewTask(task: Task): void {
  this.viewTaskObj = task;
  this.dialogMode = 'view';
}

ngOnInit() {
  this.refreshEvents();
  window.addEventListener('storage', () => this.refreshEvents());
}

refreshEvents() {
  this.events = this.loadFromLocalStorage<any[]>('events') || [];
}


}