export interface Task {
  id: number;
  eventId: number;
  title: string;
  description: string;
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  deadline: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  comments: string[];
  createdAt: string;
  updatedAt: string;
}
