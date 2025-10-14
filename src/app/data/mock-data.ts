import { Expense } from "../models/expense";
import { Event } from "../models/event";
import { Feedback } from "../models/feedback";
import { Guest } from "../models/guest";
import { Task } from "../models/task";
import { User } from "../models/user";

export const mockUsers: User[] = [
  { id: 1, name: 'Amira Mohamed', email: 'amira@evnto.com', role: 'Organizer', password: '1234' },
  { id: 2, name: 'Aya Mohamed', email: 'aya@evnto.com', role: 'Guest', password: '1234' },
  { id: 3, name: 'Admin User', email: 'admin@evnto.com', role: 'Admin', password: '1234' },
];

export const mockEvents: Event[] = [
  {
    id: 101,
    name: 'Tech Innovation Summit',
    description: 'A summit focusing on technology and innovation trends.',
    category: 'Conference',
    location: 'Mansoura University Hall A',
    startDate: '2025-10-15',
    endDate: '2025-10-17',
    createdBy: 1,
    guests: [201, 202],
    tasks: [301, 302],
    expenses: [401, 402],
    feedback: [501],
    status: 'Upcoming',
  },
  {
    id: 102,
    name: 'Graduation Gala',
    description: 'Celebration event for final-year students.',
    category: 'Ceremony',
    location: 'Campus Auditorium',
    startDate: '2025-06-01',
    endDate: '2025-06-01',
    createdBy: 1,
    guests: [203],
    tasks: [303],
    expenses: [403],
    feedback: [502],
    status: 'Completed',
  }
];

export const mockGuests: Guest[] = [
  { id: 201, name: 'Sara Ali', email: 'sara@evnto.com', phone: '01012345678', status: 'Accepted', eventId: 101 },
  { id: 202, name: 'Omar Hassan', email: 'omar@evnto.com', phone: '01087654321', status: 'Invited', eventId: 101 },
  { id: 203, name: 'Mona Said', email: 'mona@evnto.com', phone: '01122334455', status: 'Accepted', eventId: 102 },
];

export const mockTasks: Task[] = [
  {
    id: 301,
    eventId: 101,
    title: 'Book Venue',
    description: 'Reserve the main hall for the event.',
    assignedTo: 'Amira Mohamed',
    priority: 'High',
    deadline: '2025-10-10',
    status: 'In Progress',
    comments: ['Waiting for confirmation.'],
    createdAt: '2025-09-20',
    updatedAt: '2025-09-25'
  },
  {
    id: 302,
    eventId: 101,
    title: 'Arrange Catering',
    description: 'Order food and drinks for attendees.',
    assignedTo: 'Sara Ali',
    priority: 'Medium',
    deadline: '2025-10-12',
    status: 'Not Started',
    comments: [],
    createdAt: '2025-09-21',
    updatedAt: '2025-09-21'
  },
  {
    id: 303,
    eventId: 102,
    title: 'Prepare Certificates',
    description: 'Design and print certificates for graduates.',
    assignedTo: 'Amira Mohamed',
    priority: 'High',
    deadline: '2025-05-25',
    status: 'Completed',
    comments: ['All done and distributed.'],
    createdAt: '2025-05-01',
    updatedAt: '2025-05-30'
  },
];

export const mockExpenses: Expense[] = [
  { id: 401, eventId: 101, name: 'Venue Booking', amount: 5000, category: 'Venue', date: '2025-09-22', notes: 'Paid deposit' },
  { id: 402, eventId: 101, name: 'Decorations', amount: 1200, category: 'Decoration', date: '2025-10-05', notes: '' },
  { id: 403, eventId: 102, name: 'Catering', amount: 2500, category: 'Food', date: '2025-05-30', notes: 'Final payment done' },
];

export const mockFeedback: Feedback[] = [
  { id: 501, guestId: 201, eventId: 101, rating: 0, comment: '', createdAt: '' }, // future event
  { id: 502, guestId: 203, eventId: 102, rating: 5, comment: 'Amazing event! Everything was perfect.', createdAt: '2025-06-02' },
];
