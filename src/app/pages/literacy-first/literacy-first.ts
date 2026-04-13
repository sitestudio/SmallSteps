import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-literacy-first',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './literacy-first.html',
  styleUrls: ['./literacy-first.scss']
})
export class LiteracyFirst {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }

  goBack() {
    window.history.back();
  }
}
