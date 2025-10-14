export interface Event {
  
  id: number;
  name: string;
  description: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  createdBy: number; // userId
  guests: number[];
  tasks: number[];
  expenses: number[];
  feedback: number[];
  status: 'Upcoming' | 'InProgress' | 'Completed' | 'Cancelled';
}