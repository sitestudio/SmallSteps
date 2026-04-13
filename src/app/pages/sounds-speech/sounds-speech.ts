import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sounds-speech',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule],
  templateUrl: './sounds-speech.html',
  styleUrls: ['./sounds-speech.scss']
})
export class SoundsSpeech {
  expandedItem: string | null = null;
  checklistItems = {
    item1: { checked: false },
    item2: { checked: false },
    item3: { checked: false },
    item4: { checked: false },
    item5: { checked: false },
    item6: { checked: false },
    item7: { checked: false }
  };

  constructor(private router: Router) {}

  toggleExpand(itemId: string) {
    if (this.expandedItem === itemId) {
      this.expandedItem = null;
    } else {
      this.expandedItem = itemId;
    }
  }

  isExpanded(itemId: string): boolean {
    return this.expandedItem === itemId;
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goBack() {
    window.history.back();
  }

  printReport() {
    window.print();
  }
}
