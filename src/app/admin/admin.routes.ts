import { Routes } from '@angular/router';
import { AdminLayout } from './admin-layout/admin-layout';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { AdminUsersList } from './components/admin-users-list/admin-users-list';
import { AdminEventsList } from './components/admin-events-list/admin-events-list';
import { AdminReports } from './components/admin-reports/admin-reports';
import { adminGuard } from './admin.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboard },
      { path: 'users', component: AdminUsersList },
      { path: 'events', component: AdminEventsList },
      { path: 'reports', component: AdminReports }
    ]
  }
];
