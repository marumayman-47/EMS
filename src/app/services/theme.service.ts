import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private themeKey = 'app-theme';

    constructor() {
        this.loadTheme();
    }

    toggleTheme(): void {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem(this.themeKey, isDark ? 'dark' : 'light');
    }

    loadTheme(): void {
        const saved = localStorage.getItem(this.themeKey);
        if(saved === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
}