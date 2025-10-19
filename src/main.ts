import { bootstrapApplication } from '@angular/platform-browser';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

// import { initAdmin } from './app/services/init-admin';
// initAdmin();


bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

bootstrapApplication(App, { providers: [provideRouter(routes)] });
