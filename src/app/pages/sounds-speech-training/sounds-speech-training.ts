import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sounds-speech-training',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="content-wrapper">
      <header>
        <h1>Sounds and Speech Training</h1>
      </header>

      <main>
        <section class="info-section">
          <h2>Training Resources</h2>
          <p>This section contains training materials for sounds and speech skills.</p>
        </section>
      </main>

      <nav class="bottom-nav">
        <button (click)="goHome()" class="nav-btn nav-home">🏠 Home</button>
        <button (click)="goBack()" class="nav-btn nav-back">← Back</button>
      </nav>
    </div>

    <router-outlet></router-outlet>
  `,
  styleUrls: ['./sounds-speech-training.scss']
})
export class SoundsSpeechTraining {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }

  goBack() {
    window.history.back();
  }
}
