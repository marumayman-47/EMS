export interface Feedback {
  
  id: number;
  guestId: number;
  eventId: number;
  rating: number; // 1–5
  comment: string;
  createdAt: string;
}
