import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-observation-support',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="content-wrapper">
      <header>
        <button (click)="goBack()" class="back-btn">← Back</button>
        <h1>Observation Support - Language & Literacy</h1>
      </header>

      <main>
        <section class="info-section">
          <h2>Observation Guidelines</h2>
          <p>This tool helps teachers observe and document language and literacy development.</p>
        </section>

        <section class="info-section">
          <h2>Assessment Tools</h2>
          <p>Available assessment tools and checklists for language literacy skills.</p>
        </section>

        <section class="info-section">
          <h2>Teacher Resources</h2>
          <p>Guides, tip sheets, and strategies for supporting language development.</p>
        </section>
      </main>

      <nav class="bottom-nav">
        <button (click)="goHome()" class="nav-btn nav-home">🏠 Home</button>
      </nav>
    </div>

    <router-outlet></router-outlet>
  `,
  styleUrls: ['./observation-support.scss']
})
export class ObservationSupport {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }

  goBack() {
    window.history.back();
  }
}
