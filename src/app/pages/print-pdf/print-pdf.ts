import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-print-pdf',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './print-pdf.html',
  styleUrls: ['./print-pdf.scss']
})
export class PrintPdf {
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

  checklistSummary(itemKey: string): string {
    const summaries = {
      'item1': 'Single Words and Gestures',
      'item2': 'Single Words and Short Phrases',
      'item3': 'Short Sentences',
      'item4': 'Short Sentences, joint thoughts, descriptions',
      'item5': 'Connected sentences, extra details, coherent',
      'item6': 'Longer sentences, connecting ideas, pronouns',
      'item7': 'Many longer sentences, rich language, stories'
    };
    return summaries[itemKey] || '';
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
