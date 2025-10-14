export interface Guest {
  
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'Invited' | 'Accepted' | 'Declined' | 'Pending';
  feedback?: number;
  eventId: number;
}
