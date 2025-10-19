import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storage = inject(LocalStorageService);

  const currentUser = storage.getCurrentUser();

  if (currentUser && currentUser.role === 'Admin') {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
