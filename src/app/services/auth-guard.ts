import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { LocalStorageService } from "./local-storage";

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const storage = inject(LocalStorageService);

    const currentUser = storage.getCurrentUser();

    if (currentUser) {
        return true; // user is logged in
    } else {
        router.navigate(['/login']);
        return false;
    }
}