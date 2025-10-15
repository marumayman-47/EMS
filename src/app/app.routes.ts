import { Routes } from '@angular/router';
import { Eventlist } from './components/events/eventlist/eventlist';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Home } from './dashboard/home/home';
import { authGuard } from './services/auth-guard';
import { guestRoutes } from './guest/guest-routes';
import { EventManage } from './dashboard/events/event-manage/event-manage';
import { Tasks } from './dashboard/tasks/tasks';
import { Feedbacks } from './dashboard/feedbacks/feedbacks';
import { Expenses } from './dashboard/expenses/expenses';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'  },
    { path: 'login', component: Login }, 
    { path: 'register', component: Register }, 
    { path: 'dashboard', component: Home, canActivate: [authGuard] }, 
    { path: 'events', component: Eventlist },
    { path: 'guest', children: guestRoutes},
    { path: 'dashboard/events/event-manage', component: EventManage },
    { path: 'feedbacks', component: Feedbacks},
    { path: 'expenses', component: Expenses },
    {
    path: 'dashboard',
    children: [
      { path: 'tasks', component: Tasks },
    ]
  }

];
