export interface Expense {
  id: number;
  eventId: number;
  name: string;
  amount: number;
  category: 'Venue' | 'Decoration' | 'Food' | 'Music' | 'Transport' | 'Miscellaneous';
  date: string;
  notes?: string;
}
