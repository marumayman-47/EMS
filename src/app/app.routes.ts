import { Routes } from '@angular/router';
import { Eventlist } from './components/events/eventlist/eventlist';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Home } from './dashboard/home/home';
import { authGuard } from './services/auth-guard';
import { guestRoutes } from './guest/guest-routes';
import { EventManage } from './dashboard/events/event-manage/event-manage';
import { Layout } from './dashboard/layout/layout';

import { EventView } from './dashboard/events/event-view/event-view';
import { Guests } from './dashboard/guests/guests';
import { Tasks } from './dashboard/tasks/tasks';
import { Expenses } from './dashboard/expenses/expenses';
import { Feedbacks } from './dashboard/feedbacks/feedbacks';
import { Settings } from './dashboard/settings/settings';

import { Reports } from './dashboard/reports/reports';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'  },
    { path: 'login', component: Login }, 
    { path: 'register', component: Register }, 
    // ============ start organizer dashboard routes ==================
    { 
        path: 'dashboard', 
        component: Layout, 
        canActivate: [authGuard], 
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: Home },
            { path: 'events', component: EventView },
            { path: 'guests', component: Guests },
            { path: 'tasks', component: Tasks },
            { path: 'expenses', component: Expenses },
            { path: 'feedback', component: Feedbacks },
            { path: 'settings', component: Settings },
        ]
     }, 
    // ============ end organizer dashboard routes ====================
    
    { path: 'events', component: Eventlist },
    { path: 'guest', children: guestRoutes},
    { path: 'dashboard/events/event-manage', component: EventManage },

    { path: 'feedbacks', component: Feedbacks},
    { path: 'expenses', component: Expenses },
    { path: 'reports', component: Reports },


    // =================================================================
    { path: '**', redirectTo: 'login' }
];
