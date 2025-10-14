export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Organizer' | 'Guest' | 'Admin';
  password?: string; // mock login only
}
