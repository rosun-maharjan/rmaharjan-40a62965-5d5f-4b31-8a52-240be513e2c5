import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // Use a Signal to track the state reactively
  isDarkMode = signal<boolean>(localStorage.getItem('theme') === 'dark');

  constructor() {
    // Automatically apply the theme whenever the signal changes
    effect(() => {
      this.applyTheme(this.isDarkMode());
    });
  }

  toggleTheme() {
    this.isDarkMode.set(!this.isDarkMode());
    localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
  }

  private applyTheme(isDark: boolean) {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}