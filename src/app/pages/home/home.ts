import { Component, AfterViewInit, ChangeDetectorRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { RouterOutlet } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import {
  EducatorService,
  type Educator,
} from "../../services/educator.service";

import { WordsAndSentences } from "../sounds-speech/words-and-sentences";
import { PdfNotesModalComponent } from "../../components/pdf-notes-modal/pdf-notes-modal.component";

export interface Animal {
  id: string;
  name: string;
  svgName: string;
}

interface ThirdLevelItem {
  id: string;
  label: string;
}

interface SecondLevelItem {
  id: string;
  label: string;
  thirdLevel?: ThirdLevelItem[];
}

interface TopLevelButton {
  id: number;
  label: string;
  icon: string;
  secondLevel?: SecondLevelItem[];
}

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, WordsAndSentences],
  templateUrl: "./home.html",
  styleUrls: ["./home.scss"],
})
export class Home implements AfterViewInit {
  trainingMode = false;
  showNavButtons = false;

  // 3-level hierarchical nav state
  selectedTopLevel: number | null = null;
  selectedSecondLevel: string | null = null;
  selectedThirdLevel: string | null = null;

  isAnimating = false;
  showWordsAndSentences = false;
  showExpansionPanel = false;

  showInlineNotification = false;
  inlineNotificationMessage = "";

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

  navButtons: TopLevelButton[] = [
    {
      id: 1,
      label: "Language and Literacy",
      icon: "📚",
      secondLevel: [
        {
          id: "sounds-speech",
          label: "Sounds and Speech",
          thirdLevel: [
            { id: "words-sentences", label: "Words and Sentences" },
            { id: "storytelling", label: "Storytelling/Conversations" },
            { id: "sounds-words", label: "Sounds in Words" },
          ],
        },
        {
          id: "comprehension",
          label: "Comprehension",
          thirdLevel: [
            { id: "retelling", label: "Retelling" },
            { id: "interpreting", label: "Interpreting" },
            { id: "linking", label: "Linking" },
            { id: "evaluating", label: "Evaluating" },
            { id: "text-purpose", label: "Text Purpose" },
          ],
        },
      ],
    },
    {
      id: 2,
      label: "Maths & Numbers",
      icon: "🔢",
    },
    {
      id: 3,
      label: "Social/Emotional",
      icon: "❤️",
    },
    {
      id: 4,
      label: "Physical",
      icon: "🏃",
    },
    {
      id: 5,
      label: "Executive Function",
      icon: "🧠",
    },
  ];

  selectedAnimalId: string | null = null;
  educatorInput = "";

  get activeEducator(): Educator | null {
    return this.educatorService.getActiveEducator();
  }

  get assignedAnimals(): Animal[] {
    const activeEducator = this.educatorService.getActiveEducator();
    if (!activeEducator) return [];

    const assignedIds = this.educatorService.getAssignedAnimals(
      activeEducator.id,
    );
    return this.animals.filter((a) => assignedIds.includes(a.id));
  }

  getSelectedAnimals(): Animal[] {
    const activeEducator = this.educatorService.getActiveEducator();
    if (!activeEducator) return [];

    const selectedIds = this.educatorService.getSelectedAnimalIds(
      activeEducator.id,
    );
    return this.animals.filter((a) => selectedIds.includes(a.id));
  }

  getUnselectedAssignedAnimals(): Animal[] {
    const activeEducator = this.educatorService.getActiveEducator();
    if (!activeEducator) return [];

    const assignedIds = this.educatorService.getAssignedAnimals(
      activeEducator.id,
    );
    const selectedIds = this.educatorService.getSelectedAnimalIds(
      activeEducator.id,
    );
    return this.animals.filter(
      (a) => assignedIds.includes(a.id) && !selectedIds.includes(a.id),
    );
  }

  get unassignedAnimals(): Animal[] {
    const activeEducator = this.educatorService.getActiveEducator();

    if (!activeEducator) {
      return this.animals;
    }

    const assignedIds = this.educatorService.getAssignedAnimals(
      activeEducator.id,
    );
    return this.animals.filter((a) => !assignedIds.includes(a.id));
  }

  get wordsAndSentencesReady(): boolean {
    return this.canShowWordsAndSentences().canShow;
  }

  get wordsAndSentencesAlertMessage(): string {
    const result = this.canShowWordsAndSentences();
    return result.errorMessage || "";
  }

  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    public educatorService: EducatorService,
  ) {}

  selectAnimal(animalId: string): void {
    const activeEducator = this.educatorService.getActiveEducator();

    if (!activeEducator) {
      this.selectedAnimalId =
        this.selectedAnimalId === animalId ? null : animalId;
    } else {
      const isAssigned = this.educatorService
        .getAssignedAnimals(activeEducator.id)
        .includes(animalId);

      if (isAssigned) {
        const currentActive = this.educatorService.getActiveAnimal(
          activeEducator.id,
        );
        if (currentActive === animalId) {
          this.educatorService.setActiveAnimal(activeEducator.id, null);
        } else {
          this.educatorService.setActiveAnimal(activeEducator.id, animalId);
        }
      } else {
        this.educatorService.assignAnimal(animalId);
        this.educatorService.setActiveAnimal(activeEducator.id, animalId);
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

  confirmRemoveAssignedAnimal(animalId: string, educatorId: string): void {
    const animal = this.animals.find((a) => a.id === animalId);
    const educator = this.educatorService
      .getEducators()
      .find((e) => e.id === educatorId);

    if (animal && educator) {
      const confirmed = window.confirm(
        `Remove ${animal.name} from ${educator.name}?`,
      );

      if (confirmed) {
        this.removeAssignedAnimal(animalId, educatorId);
      }
    }
  }

  removeAssignedAnimal(animalId: string, educatorId: string): void {
    this.educatorService.unassignAnimal(educatorId, animalId);

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

    const activeAnimal = this.educatorService.getActiveAnimal(
      activeEducator.id,
    );
    return activeAnimal === animalId || this.selectedAnimalId === animalId;
  }

  getActiveAnimal(animalId: string): boolean {
    const activeEducator = this.educatorService.getActiveEducator();

    if (!activeEducator) {
      return false;
    }

    const activeAnimal = this.educatorService.getActiveAnimal(
      activeEducator.id,
    );
    return activeAnimal === animalId;
  }

  isSelectedAnimal(animalId: string): boolean {
    const activeEducator = this.educatorService.getActiveEducator();
    if (!activeEducator) return false;

    const selectedIds = this.educatorService.getSelectedAnimalIds(
      activeEducator.id,
    );
    return selectedIds.includes(animalId);
  }

  toggleAnimalSelection(animalId: string, event: Event): void {
    const activeEducator = this.educatorService.getActiveEducator();
    if (!activeEducator) return;

    event.stopPropagation();
    this.educatorService.toggleAnimalSelection(activeEducator.id, animalId);
  }

  getActiveAnimalName(animalId: string | null): string {
    if (!animalId) return "";
    const animal = this.animals.find((a) => a.id === animalId);
    return animal?.name || "";
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

  getActiveEducatorDisplayName(): string {
    const activeEducator = this.educatorService.getActiveEducator();
    if (!activeEducator) return "";

    const activeAnimalId = this.educatorService.getActiveAnimal(
      activeEducator.id,
    );
    const activeAnimalName = this.getActiveAnimalName(activeAnimalId);

    if (activeAnimalName) {
      return `${activeEducator.name}, ${activeAnimalName}`;
    }
    return activeEducator.name;
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

  onTopLevelClick(index: number): void {
    if (this.selectedTopLevel === index) {
      this.resetAllSelections();
    } else {
      this.selectedTopLevel = index;
      this.selectedSecondLevel = null;
    }
  }

  onSecondLevelClick(secondLevelId: string): void {
    if (this.selectedSecondLevel === secondLevelId) {
      this.selectedSecondLevel = null;
    } else {
      this.selectedSecondLevel = secondLevelId;
    }
  }

  resetAllSelections(): void {
    this.selectedTopLevel = null;
    this.selectedSecondLevel = null;
  }

  isTopLevelActive(index: number): boolean {
    return this.selectedTopLevel === index;
  }

  isTopLevelDisabled(index: number): boolean {
    return this.selectedTopLevel !== null && this.selectedTopLevel !== index;
  }

  isSecondLevelActive(secondLevelId: string): boolean {
    return this.selectedSecondLevel === secondLevelId;
  }

  getActiveTopButton(): TopLevelButton | undefined {
    if (this.selectedTopLevel === null) return undefined;
    return this.navButtons[this.selectedTopLevel];
  }

  getSecondLevelItems(): SecondLevelItem[] | undefined {
    const activeButton = this.getActiveTopButton();
    return activeButton?.secondLevel;
  }

  getThirdLevelItems(): ThirdLevelItem[] | undefined {
    const secondLevel = this.getSecondLevelItems();
    if (!secondLevel || !this.selectedSecondLevel) return undefined;
    const item = secondLevel.find((s) => s.id === this.selectedSecondLevel);
    return item?.thirdLevel;
  }

  onThirdLevelClick(thirdLevelId: string): void {
    if (thirdLevelId === 'words-sentences') {
      const validation = this.canShowWordsAndSentences();
      
      if (!validation.canShow) {
        this.inlineNotificationMessage = validation.errorMessage || "";
        this.showInlineNotification = true;
        return;
      }
      
      this.showWordsAndSentences = !this.showWordsAndSentences;
      if (this.showWordsAndSentences) {
        this.showExpansionPanel = true;
      } else {
        this.showExpansionPanel = false;
      }
      return;
    }
    
    if (this.selectedThirdLevel === thirdLevelId) {
      this.selectedThirdLevel = null;
    } else {
      this.selectedThirdLevel = thirdLevelId;
    }
  }

  getButtonColor(buttonId: number): string {
    const colors: Record<number, string> = {
      1: "#FF6B6B",
      2: "#9B59B6",
      3: "#E91E63",
      4: "#2ECC71",
      5: "#3498DB",
    };
    return colors[buttonId] || "#667eea";
  }

  onOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest(".nav-btn-pill")) {
      this.resetAllSelections();
    }
  }

  goHome() {
    this.router.navigate(["/"]);
  }

  goBack(): void {
    window.history.back();
  }

  openWordsAndSentencesModal(): void {
    const validation = this.canShowWordsAndSentences();
    
    if (!validation.canShow) {
      this.inlineNotificationMessage = validation.errorMessage || "";
      this.showInlineNotification = true;
      return;
    }
    
    this.showWordsAndSentences = true;
    this.showExpansionPanel = true;
  }

  closeWordsAndSentencesModal(): void {
    this.showWordsAndSentences = false;
    this.showExpansionPanel = false;
    this.selectedThirdLevel = null;
  }

  closeWordsAndSentences(): void {
    this.closeWordsAndSentencesModal();
  }

  handlePdfNotesGenerate(notes: string): void {
    console.log("PDF Notes generated from inline modal:", notes);
  }

  savePdfNotes(notes: string): void {
    if (notes.trim()) {
      const activeEducator = this.educatorService.getActiveEducator();
      if (activeEducator) {
        const key = `tinyStepsPdfNotes_${activeEducator.id}_${this.selectedAnimalId || ""}`;
        localStorage.setItem(key, notes);
      } else {
        localStorage.setItem("tinyStepsPdfNotes", notes);
      }
    }
  }

  toggleExpansionPanel(): void {
    const validation = this.canShowWordsAndSentences();
    
    if (!validation.canShow) {
      this.inlineNotificationMessage = validation.errorMessage || "Invalid state";
      this.showInlineNotification = true;
      return;
    }
    
    this.showExpansionPanel = !this.showExpansionPanel;
  }


  closeExpansionPanel(): void {
    this.showExpansionPanel = false;
  }
  closeInlineNotification(): void {
    this.showInlineNotification = false;
    this.inlineNotificationMessage = "";
  }

  canShowWordsAndSentences(): { canShow: boolean; errorMessage?: string } {
    const activeEducator = this.educatorService.getActiveEducator();

    if (!activeEducator) {
      return {
        canShow: false,
        errorMessage: "Add and select an educator to get started.",
      };
    }

    const activeAnimalId = this.educatorService.getActiveAnimal(activeEducator.id);

    if (!activeAnimalId) {
      return {
        canShow: false,
        errorMessage: `Select an animal for ${activeEducator.name} to continue.`,
      };
    }

    return { canShow: true };
  }

}
