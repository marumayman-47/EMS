import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Events } from './pages/events/events';
import { EventDetails } from './pages/event-details/event-details';
import { Feedback } from './pages/feedback/feedback';
import { Profile } from './pages/profile/profile';
import { About } from './pages/about/about';
import { Contact } from './pages/contact/contact';
import { Navbar } from './components/navbar/navbar';
import { GuestLayout } from './layout/guest-layout/guest-layout';
import { MyEvents } from './pages/my-events/my-events';

export const guestRoutes: Routes = [
    {
    path: '',
    component: GuestLayout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home },
      { path: 'events', component: Events },
      { path: 'events/:id', component: EventDetails },
      { path: 'feedback', component: Feedback },
      { path: 'profile', component: Profile },
      { path: 'about', component: About },
      { path: 'contact', component: Contact },
      { path: 'my-events', component: MyEvents }
    ]
  }
];
