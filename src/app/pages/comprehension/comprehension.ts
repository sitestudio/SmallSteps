import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import jsPDF from 'jspdf';

interface Animal {
  id: string;
  name: string;
  svgName: string;
}

interface ChecklistItem {
  id: string;
  text: string;
  description: string;
}

@Component({
  selector: 'app-comprehension',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './comprehension.html',
  styleUrls: ['./comprehension.scss']
})
export class Comprehension implements OnInit {
  checklistItems: ChecklistItem[] = [
    { id: 'item1', text: 'Listening Attention', description: 'The child pays attention when others are speaking, making eye contact and showing interest.' },
    { id: 'item2', text: 'Following Simple Instructions', description: 'The child follows one-step instructions (e.g., "Pick up the toy") and begins to follow two-step instructions.' },
    { id: 'item3', text: 'Understanding Questions', description: 'The child answers simple wh-questions (who, what, where) about stories or daily activities.' },
    { id: 'item4', text: 'Repeating Words and Sentences', description: 'The child repeats words and short sentences heard in stories or conversations.' },
    { id: 'item5', text: 'Predicting Events', description: 'The child predicts what will happen next in a story or routine activity.' },
    { id: 'item6', text: 'Understanding Stories', description: 'The child demonstrates understanding of story sequence (beginning, middle, end).' },
    { id: 'item7', text: 'Connecting Ideas to Life', description: 'The child connects story content or new information to their own experiences.' }
  ];

  expandedItem: string | null = null;
  selectedAnimal: Animal | null = null;

  animals: Animal[] = [
    { id: 'lion', name: 'Lion', svgName: 'animal-lion' },
    { id: 'tiger', name: 'Tiger', svgName: 'animal-tiger' },
    { id: 'elephant', name: 'Elephant', svgName: 'animal-elephant' },
    { id: 'bear', name: 'Bear', svgName: 'animal-bear' },
    { id: 'zebra', name: 'Zebra', svgName: 'animal-zebra' },
    { id: 'giraffe', name: 'Giraffe', svgName: 'animal-giraffe' },
    { id: 'monkey', name: 'Monkey', svgName: 'animal-monkey' },
    { id: 'kangaroo', name: 'Kangaroo', svgName: 'animal-kangaroo' },
    { id: 'panda', name: 'Panda', svgName: 'animal-panda' },
    { id: 'koala', name: 'Koala', svgName: 'animal-koala' },
    { id: 'hippo', name: 'Hippo', svgName: 'animal-hippo' },
    { id: 'rhino', name: 'Rhino', svgName: 'animal-rhino' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getSelectedAnimal();
    this.updateDarkModeClass();
  }

  getSelectedAnimal(): void {
    const saved = localStorage.getItem('tinyStepsSelectedAnimal');
    let animalId: string | null = null;

    if (saved) {
      try {
        animalId = JSON.parse(saved).selected;
      } catch (e) {}
    }

    if (animalId) {
      this.selectedAnimal = this.animals.find(a => a.id === animalId) || null;
    }

    if (!this.selectedAnimal) {
      const usedAnimals = this.getUsedAnimals();
      const unusedAnimals = this.animals.filter(a => !usedAnimals.includes(a.id));

      if (unusedAnimals.length > 0) {
        this.selectedAnimal = unusedAnimals[0];
      } else {
        this.selectedAnimal = this.animals[Math.floor(Math.random() * this.animals.length)];
      }

      this.trackAnimalUse(this.selectedAnimal.id);
    }
  }

  getUsedAnimals(): string[] {
    try {
      const saved = localStorage.getItem('tinyStepsAnimalState');
      if (saved) {
        return JSON.parse(saved).usedAnimals || [];
      }
    } catch (e) {}
    return [];
  }

  trackAnimalUse(animalId: string): void {
    let state = { usedAnimals: [], lastAssigned: null, timestamp: Date.now() };

    try {
      const saved = localStorage.getItem('tinyStepsAnimalState');
      if (saved) {
        state = JSON.parse(saved);
      }
    } catch (e) {}

    if (!state.usedAnimals.includes(animalId)) {
      state.usedAnimals.push(animalId);
    }
    state.lastAssigned = animalId;
    state.timestamp = Date.now();

    localStorage.setItem('tinyStepsAnimalState', JSON.stringify(state));
  }

  toggleExpand(itemId: string): void {
    if (this.expandedItem === itemId) {
      this.expandedItem = null;
    } else {
      this.expandedItem = itemId;
    }
  }

  isItemChecked(itemId: string): boolean {
    const animalId = this.getSelectedAnimalId();
    
    if (!animalId) return false;
    
    try {
      const saved = localStorage.getItem('tinyStepsAnimalCheckboxes');
      if (saved) {
        const animalCheckboxes = JSON.parse(saved);
        const itemIndex = parseInt(itemId.replace('item', '')) - 1;
        return animalCheckboxes[animalId]?.[itemIndex] || false;
      }
    } catch (e) {}
    
    return false;
  }

  getSelectedAnimalId(): string | null {
    const saved = localStorage.getItem('tinyStepsSelectedAnimal');
    if (saved) {
      try {
        return JSON.parse(saved).selected;
      } catch (e) {}
    }
    return null;
  }

  handleCheck(event: Event, itemId: string): void {
    event.stopPropagation();
    
    const animalId = this.getSelectedAnimalId();
    if (!animalId) return;

    const checkbox = event.target as HTMLInputElement;
    
    let animalCheckboxes: { [key: string]: boolean[] } = {};
    try {
      const saved = localStorage.getItem('tinyStepsAnimalCheckboxes');
      if (saved) {
        animalCheckboxes = JSON.parse(saved);
      }
    } catch (e) {}

    if (!animalCheckboxes[animalId]) {
      animalCheckboxes[animalId] = new Array(7).fill(false);
    }

    const itemIndex = parseInt(itemId.replace('item', '')) - 1;

    animalCheckboxes[animalId][itemIndex] = checkbox.checked;

    localStorage.setItem('tinyStepsAnimalCheckboxes', JSON.stringify(animalCheckboxes));
  }

  navigateBack(): void {
    const isTraining = localStorage.getItem('trainingMode') === 'true';

    if (isTraining) {
      this.router.navigate(['/']);
    } else {
      window.history.back();
    }
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  isDarkMode(): boolean {
    return localStorage.getItem('darkMode') === 'true';
  }

  updateDarkModeClass(): void {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleDarkMode(): void {
    const isDark = localStorage.getItem('darkMode') === 'true';
    const newValue = !isDark;
    localStorage.setItem('darkMode', String(newValue));
    
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  generatePDF(): void {
    const doc = new jsPDF();
    doc.setProperties({
      title: 'Language and Literacy - Comprehension',
      subject: 'Early Childhood Education Assessment',
      author: 'TinySteps'
    });
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(51, 65, 85);
    doc.text('Comprehension Checklist', 105, 20, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 32, { align: 'center' });
    
    const savedState = JSON.parse(localStorage.getItem('tinyStepsAnimalCheckboxes') || '{}');
    
    if (Object.keys(savedState).length === 0) {
      doc.setFontSize(14);
      doc.setTextColor(71, 85, 105);
      doc.text('No animals selected', 105, 60, { align: 'center' });
    } else {
      const lineHeight = 12;
      let y = 50;
      
      Object.entries(savedState).forEach(([animalId, checkboxes]) => {
        const animalName = this.animals.find(a => a.id === animalId)?.name || 'Animal';
        const checkedItems = (checkboxes as boolean[]).filter(Boolean);
        
        if (checkedItems.length > 0) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(51, 65, 85);
          doc.text(`${animalName}: ${checkedItems.length} items checked`, 20, y);
          y += lineHeight;
          
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
        }
      });
    }
    
    doc.setFontSize(10);
    doc.setTextColor(156, 163, 175);
    doc.text('Generated by TinySteps - Kindergarten Learning Toolkit', 105, 295, { align: 'center' });
    doc.save('comprehension-checked-items.pdf');
  }

  printPage(): void {
    window.print();
  }
}
