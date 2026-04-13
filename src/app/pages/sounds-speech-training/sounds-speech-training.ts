import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sounds-speech-training',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './sounds-speech-training.html',
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
