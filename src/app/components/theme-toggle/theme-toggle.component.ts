import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button
      class="theme-toggle-btn"
      (click)="toggleTheme()"
      aria-label="Toggle dark mode"
    >
      {{ isDark() ? '☀️' : '🌙' }}
    </button>
  `,
  styles: [`
    .theme-toggle-btn {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background-color: rgba(255, 255, 255, 0.9);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      z-index: 9999;
    }

    .theme-toggle-btn:hover {
      transform: scale(1.05);
      background-color: rgba(255, 255, 255, 1);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 600px) {
      .theme-toggle-btn {
        top: 15px;
        right: 15px;
        width: 36px;
        height: 36px;
        font-size: 18px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeToggleComponent {
  constructor(private themeService: ThemeService) {}

  isDark(): boolean {
    return this.themeService.isDark();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
