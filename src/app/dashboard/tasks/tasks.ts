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
 
   tasks: Task[] = mockTasks;
   groupedTasks: EventTasks[] = [];

  // Filters
  selectedStatus: string = '';
  selectedPriority: string = '';

  // New Task form
   newTask: Task = {
    id: 0,
    eventId: 0,
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Low',
    deadline: '',
    status: 'Not Started',
    comments: [],
    createdAt: '',
    updatedAt: ''
  };
  
  // Edit Task form
  editTaskObj: Task | null = null;

  constructor() {
    this.groupTasksByEvent();
  }

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
    // Sort tasks by deadline ascending
    tasks.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const progress = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
    return { eventId, tasks, progress };
  });
}

// Calculate mini progress for individual task
taskProgress(task: Task): number {
  switch(task.status) {
    case 'Not Started': return 0;
    case 'In Progress': return 50;
    case 'Completed': return 100;
    default: return 0;
  }
}

  viewTask(task: Task) {
    alert(`Viewing Task: ${task.title}\nDescription: ${task.description}`);
  }

  updateTask(task: Task) {
    this.editTaskObj = { ...task }; // copy task to edit
  }

  saveEdit() {
    if (!this.editTaskObj) return;
    const index = this.tasks.findIndex(t => t.id === this.editTaskObj!.id);
    if (index !== -1) {
      this.editTaskObj.updatedAt = new Date().toISOString().split('T')[0];
      this.tasks[index] = { ...this.editTaskObj };
      this.editTaskObj = null;
      this.groupTasksByEvent();
    }
  }

  deleteTask(taskId: number) {
    if(confirm('Are you sure you want to delete this task?')) {
      this.tasks = this.tasks.filter(t => t.id !== taskId);
      this.groupTasksByEvent();
    }
  }

  isOverdue(deadline: string, status: string): boolean {
    return new Date(deadline) < new Date() && status !== 'Completed';
  }

  addTask() {
    this.newTask.id = this.tasks.length ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
    this.newTask.createdAt = new Date().toISOString().split('T')[0];
    this.newTask.updatedAt = new Date().toISOString().split('T')[0];
    this.tasks.push({ ...this.newTask, comments: [] });
    this.newTask = this.resetTask();
    this.groupTasksByEvent();
  }

  applyFilters() {
    this.groupTasksByEvent();
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

}