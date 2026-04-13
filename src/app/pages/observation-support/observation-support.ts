import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-observation-support',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './observation-support.html',
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
