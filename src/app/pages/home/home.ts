import { Component, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";
import { RouterOutlet, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import {
  EducatorService,
  type Educator,
} from "../../services/educator.service";

export interface Animal {
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

interface NavButton {
  id: number;
  label: string;
  icon: string;
  route?: string[];
  items: SubcategoryItem[];
}

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, FormsModule],
  templateUrl: "./home.html",
  styleUrls: ["./home.scss"],
})
export class Home implements AfterViewInit {
  trainingMode = false;
  showNavButtons = false;

  activeNavIndex: number | null = null;

  isAnimating = false;

  animals: Animal[] = [
    { id: "lion", name: "Lion", svgName: "animal-lion" },
    { id: "tiger", name: "Tiger", svgName: "animal-tiger" },
    { id: "elephant", name: "Elephant", svgName: "animal-elephant" },
    { id: "bear", name: "Bear", svgName: "animal-bear" },
    { id: "zebra", name: "Zebra", svgName: "animal-zebra" },
    { id: "giraffe", name: "Giraffe", svgName: "animal-giraffe" },
    { id: "monkey", name: "Monkey", svgName: "animal-monkey" },
    { id: "kangaroo", name: "Kangaroo", svgName: "animal-kangaroo" },
    { id: "panda", name: "Panda", svgName: "animal-panda" },
    { id: "koala", name: "Koala", svgName: "animal-koala" },
    { id: "hippo", name: "Hippo", svgName: "animal-hippo" },
    { id: "rhino", name: "Rhino", svgName: "animal-rhino" },
  ];

  navButtons: NavButton[] = [
    {
      id: 1,
      label: "Language and Literacy",
      icon: "📚",
      items: [
        {
          id: "sounds-speech",
          label: "Sounds and Speech",
          route: ["/sounds-speech/words-and-sentences"],
          color: "#FF6B6B",
        },
        {
          id: "comprehension",
          label: "Comprehension",
          route: ["/comprehension"],
          color: "#4D96FF",
        },
      ],
    },
    {
      id: 2,
      label: "Maths & Numbers",
      icon: "🔢",
      items: [
        {
          id: "math-basics",
          label: "Math Basics",
          route: ["/math-numbers"],
          color: "#9B59B6",
        },
      ],
    },
    {
      id: 3,
      label: "Social/Emotional",
      icon: "❤️",
      items: [
        {
          id: "social-emotional",
          label: "Social/Emotional",
          route: ["/social-emotional"],
          color: "#E91E63",
        },
      ],
    },
    {
      id: 4,
      label: "Physical",
      icon: "🏃",
      items: [
        {
          id: "physical",
          label: "Physical",
          route: ["/physical"],
          color: "#2ECC71",
        },
      ],
    },
    {
      id: 5,
      label: "Executive Function",
      icon: "🧠",
      items: [
        {
          id: "executive-function",
          label: "Executive Function",
          route: ["/executive-function"],
          color: "#3498DB",
        },
      ],
    },
  ];

  selectedAnimalId: string | null = null;
  educatorInput = "";

  get activeEducator(): Educator | null {
    return this.educatorService.getActiveEducator();
  }

  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    public educatorService: EducatorService,
  ) {}

  selectAnimal(animalId: string): void {
    const activeEducator = this.educatorService.getActiveEducator();
    
    if (!activeEducator) {
      this.selectedAnimalId = this.selectedAnimalId === animalId ? null : animalId;
    } else {
      const isAssigned = this.educatorService.getAssignedAnimals(activeEducator.id).includes(animalId);
      
      if (isAssigned) {
        this.educatorService.unassignAnimal(activeEducator.id, animalId);
      } else {
        this.educatorService.assignAnimal(animalId);
      }
    }
    
    try {
      localStorage.setItem(
        "tinyStepsSelectedAnimal",
        JSON.stringify({ selected: this.selectedAnimalId }),
      );
    } catch (e) {}
    
    this.cdRef.detectChanges();
  }

  getAnimalSelected(animalId: string): boolean {
    const activeEducator = this.educatorService.getActiveEducator();
    
    if (!activeEducator) {
      return this.selectedAnimalId === animalId;
    }
    
    const assignedIds = this.educatorService.getAssignedAnimals(activeEducator.id);
    return assignedIds.includes(animalId) || this.selectedAnimalId === animalId;
  }

  getAnimalName(animalId: string): string {
    const animal = this.animals.find((a) => a.id === animalId);
    return animal?.name || "Animal";
  }

  addEducator(): void {
    const result = this.educatorService.addEducator(this.educatorInput);
    if (result) {
      this.educatorInput = "";
    }
    this.cdRef.detectChanges();
  }

  deleteEducator(id: string): void {
    this.educatorService.deleteEducator(id);
  }

  selectEducator(id: string | null): void {
    const currentActive = this.educatorService.getActiveEducator();
    if (currentActive?.id === id) {
      this.educatorService.selectEducator(null);
    } else {
      this.educatorService.selectEducator(id);
    }
  }

  getActiveEducator(): Educator | null {
    return this.educatorService.getActiveEducator();
  }

  isEducatorSelected(id: string): boolean {
    return this.educatorService.activeEducatorId$() === id;
  }

  getAssignedAnimals(): Animal[] {
    const activeEducator = this.getActiveEducator();
    if (!activeEducator) return [];

    const assignedIds = this.educatorService.getAssignedAnimals(
      activeEducator.id,
    );
    return this.animals.filter((a) => assignedIds.includes(a.id));
  }

  ngOnInit(): void {
    const saved = localStorage.getItem("tinyStepsSelectedAnimal");
    if (saved) {
      try {
        this.selectedAnimalId = JSON.parse(saved).selected;
      } catch (e) {}
    }
  }

  ngAfterViewInit(): void {
    this.ngOnInit();
  }

  toggleTrainingMode(event: Event) {
    this.trainingMode = (event.target as HTMLInputElement).checked;
  }

  toggleNavButton(index: number): void {
    if (this.activeNavIndex === index) {
      this.activeNavIndex = null;
    } else {
      this.activeNavIndex = index;
    }
  }

  getActiveButton(): NavButton | undefined {
    return this.navButtons.find((_, i) => i === this.activeNavIndex);
  }

  goHome() {
    this.router.navigate(["/"]);
  }

  goBack(): void {
    window.history.back();
  }
}
