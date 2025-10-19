import { User } from '../models/user';

export function initAdmin() {
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  const adminExists = users.some((u: User) => u.role === 'Admin');

  if (!adminExists) {
    const adminUser: User = {
      id: Date.now(),
      name: 'System Admin',
      email: 'admin@ems.com',
      password: 'admin123',
      role: 'Admin'
    };

    users.push(adminUser);
    localStorage.setItem('users', JSON.stringify(users));
  }
}

