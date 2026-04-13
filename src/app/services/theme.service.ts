import { Injectable, effect, signal } from '@angular/core';

export type Theme = 'light' | 'dark';
const THEME_STORAGE_KEY = 'themePreference';
const DEFAULT_THEME: Theme = 'light';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private theme = signal<Theme>(DEFAULT_THEME);

  constructor() {
    const storedTheme = this.getStoredTheme();
    if (storedTheme !== null) {
      this.setTheme(storedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }

    effect(() => {
      const currentTheme = this.theme();
      document.documentElement.classList.toggle('dark', currentTheme === 'dark');
    });
  }

  get theme$() {
    return this.theme.asReadonly();
  }

  isDark(): boolean {
    return this.theme() === 'dark';
  }

  getStoredTheme(): Theme | null {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored && (stored === 'light' || stored === 'dark')) {
        return stored as Theme;
      }
    } catch (e) {}
    return null;
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {}
  }

  toggleTheme(): void {
    const newTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
}
