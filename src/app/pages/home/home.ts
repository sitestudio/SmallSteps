import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Animal {
  id: string;
  name: string;
  svgName: string;
}

interface SubcategoryItem {
  id: string;
  label: string;
  route: string[];
  color: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements AfterViewInit {
  trainingMode = false;
  showNavButtons = false;
  showSubcategories = false;

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

  subcategoryItems: SubcategoryItem[] = [
    { 
      id: 'sounds-speech', 
      label: 'Sounds and speech', 
      route: ['/sounds-speech/words-and-sentences'],
      color: '#FF6B6B' 
    },
    { 
      id: 'comprehension', 
      label: 'Comprehension', 
      route: ['/comprehension'],
      color: '#4D96FF' 
    }
  ];

  selectedAnimalId: string | null = null;

  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  selectAnimal(animalId: string): void {
    this.selectedAnimalId = (this.selectedAnimalId === animalId) ? null : animalId;
    try {
      localStorage.setItem('tinyStepsSelectedAnimal', JSON.stringify({ selected: this.selectedAnimalId }));
    } catch (e) {}
    this.cdRef.detectChanges();
  }

  getAnimalSelected(animalId: string): boolean {
    return this.selectedAnimalId === animalId;
  }

  getAnimalName(animalId: string): string {
    const animal = this.animals.find(a => a.id === animalId);
    return animal?.name || 'Animal';
  }

  get checkedAnimals(): Animal[] {
    return this.animals.filter(animal => this.getAnimalSelected(animal.id));
  }

  get uncheckedAnimals(): Animal[] {
    return this.animals.filter(animal => !this.getAnimalSelected(animal.id));
  }

  ngOnInit(): void {
    const saved = localStorage.getItem('tinyStepsSelectedAnimal');
    if (saved) {
      try {
        this.selectedAnimalId = JSON.parse(saved).selected;
      } catch (e) {}
    }
  }

  ngAfterViewInit(): void {
    this.ngOnInit();
  }

  shouldShowDeleteButton(): boolean {
    if (!this.selectedAnimalId) return false;
    const animal = this.animals.find(a => a.id === this.selectedAnimalId);
    return !!animal && this.checkedAnimals.includes(animal);
  }

  toggleTrainingMode(event: Event) {
    this.trainingMode = (event.target as HTMLInputElement).checked;
  }

  toggleLanguageLiteracy(): void {
    if (this.trainingMode) {
      this.router.navigate(['/training', 'literacy-first']);
    } else {
      this.showSubcategories = !this.showSubcategories;
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goBack(): void {
    window.history.back();
  }

  deleteSelectedAnimal(): void {
    if (!this.selectedAnimalId) return;
    
    const animal = this.animals.find(a => a.id === this.selectedAnimalId);
    if (!animal) return;
    
    const confirmed = confirm('Are you sure you want to reset ' + animal.name + "'s progress?");
    if (confirmed) {
      this.selectedAnimalId = null;
      localStorage.removeItem('tinyStepsSelectedAnimal');
    }
  }
}
