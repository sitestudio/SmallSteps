import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Router, RouterOutlet, ActivatedRoute } from "@angular/router";
import { ThemeService } from "../../services/theme.service";
import jsPDF from "jspdf";

import {
  EducatorService,
  type Educator,
} from "../../services/educator.service";

import { PdfNotesModalComponent } from "../../components/pdf-notes-modal/pdf-notes-modal.component";

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

interface AnimalState {
  usedAnimals: string[];
  lastAssigned: string | null;
  timestamp: number;
}

@Component({
  selector: "app-words-and-sentences",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, PdfNotesModalComponent],
  templateUrl: "./words-and-sentences.html",
  styleUrls: ["./words-and-sentences.scss"],
})
export class WordsAndSentences implements OnInit {
  checklistItems: ChecklistItem[] = [
    {
      id: "item1",
      text: "Single Words and Gestures",
      description:
        "The child uses single words accompanied by physical gestures (pointing, nodding) to communicate needs or observations.",
    },
    {
      id: "item2",
      text: "Single Words and Short Phrases",
      description:
        'Moving beyond single words, the child begins to combine two or three words (e.g., "More juice," "Big ball").',
    },
    {
      id: "item3",
      text: "Short Sentences",
      description:
        'The child uses simple subject-verb structures (e.g., "I want cookie," "Dog is running").',
    },
    {
      id: "item4",
      text: "Short Sentences, joint thoughts, descriptions",
      description:
        'The child begins to link ideas using simple conjunctions like "and" or "because."',
    },
    {
      id: "item5",
      text: "Connected sentences, extra details, coherent",
      description:
        "Sentences are structured logically with descriptive adjectives and a clear flow of thought.",
    },
    {
      id: "item6",
      text: "Longer sentences, connecting ideas, pronouns",
      description:
        "The child uses complex sentence structures and correctly applies pronouns (he, she, they) to connect ideas.",
    },
    {
      id: "item7",
      text: "Many longer sentences, rich language, stories",
      description:
        "The child can narrate a sequence of events or tell a simple story using varied and sophisticated vocabulary.",
    },
  ];

  expandedItem: string | null = null;
  selectedAnimalId: string | null = null;
  showPdfNotesModal = false;
  pdfNotes = "";

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    public educatorService: EducatorService,
  ) {}

  ngOnInit(): void {
    this.loadSelectedAnimals();
    this.checkForNotesFromRoute();
  }

  checkForNotesFromRoute(): void {
    const notes = this.route.snapshot.queryParamMap.get("notes");
    if (notes) {
      try {
        const decodedNotes = decodeURIComponent(notes);
        if (decodedNotes && decodedNotes.trim()) {
          this.pdfNotes = decodedNotes;
        }
      } catch (e) {}
    }
  }

  loadSelectedAnimals(): void {
    const activeEducator = this.educatorService.getActiveEducator();

    if (activeEducator) {
      const selectedIds = this.educatorService.getSelectedAnimalIds(
        activeEducator.id,
      );

      if (selectedIds.length > 0) {
        // Always select first animal from selected list (leftmost)
        this.selectedAnimalId = selectedIds[0];
        this.loadCheckboxesForSelectedAnimal();
      } else {
        const activeAnimal = this.educatorService.getActiveAnimal(
          activeEducator.id,
        );
        if (activeAnimal) {
          this.selectedAnimalId = activeAnimal;
        }
      }
    } else {
      const saved = localStorage.getItem("tinyStepsSelectedAnimal");
      if (saved) {
        try {
          this.selectedAnimalId = JSON.parse(saved).selected;
        } catch (e) {}
      }
    }

    if (!this.selectedAnimalId) {
      this.selectFirstAvailableAnimal();
    }
  }

  selectFirstAvailableAnimal(): void {
    const usedAnimals = this.getUsedAnimals();
    const unusedAnimals = this.animals.filter(
      (a) => !usedAnimals.includes(a.id),
    );

    if (unusedAnimals.length > 0) {
      this.selectedAnimalId = unusedAnimals[0].id;
    } else {
      this.selectedAnimalId =
        this.animals[Math.floor(Math.random() * this.animals.length)].id;
    }
    this.trackAnimalUse(this.selectedAnimalId);
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

  getUsedAnimals(): string[] {
    try {
      const saved = localStorage.getItem("tinyStepsAnimalState");
      if (saved) {
        return JSON.parse(saved).usedAnimals || [];
      }
    } catch (e) {}
    return [];
  }

  trackAnimalUse(animalId: string): void {
    let state: AnimalState = {
      usedAnimals: [],
      lastAssigned: null,
      timestamp: Date.now(),
    };

    try {
      const saved = localStorage.getItem("tinyStepsAnimalState");
      if (saved) {
        state = JSON.parse(saved);
      }
    } catch (e) {}

    if (!state.usedAnimals.includes(animalId)) {
      state.usedAnimals.push(animalId);
    }
    state.lastAssigned = animalId;
    state.timestamp = Date.now();

    localStorage.setItem("tinyStepsAnimalState", JSON.stringify(state));
  }

  selectSingleAnimal(animalId: string): void {
    const activeEducator = this.educatorService.getActiveEducator();

    if (!activeEducator) {
      this.selectedAnimalId = animalId;
      localStorage.setItem(
        "tinyStepsSelectedAnimal",
        JSON.stringify({ selected: animalId }),
      );
      return;
    }

    const assignedIds = this.educatorService.getAssignedAnimals(
      activeEducator.id,
    );

    if (assignedIds.includes(animalId)) {
      this.selectedAnimalId = animalId;

      const currentSelectedIds = this.educatorService.getSelectedAnimalIds(
        activeEducator.id,
      );

      if (!currentSelectedIds.includes(animalId)) {
        this.educatorService.toggleAnimalSelection(activeEducator.id, animalId);
      }

      this.loadCheckboxesForSelectedAnimal();
    } else {
      const selectedIds = this.educatorService.getSelectedAnimalIds(
        activeEducator.id,
      );

      if (selectedIds.includes(animalId)) {
        this.educatorService.clearAllSelections(activeEducator.id);
      }
    }
  }

  loadCheckboxesForSelectedAnimal(): void {
    if (!this.selectedAnimalId) return;

    const activeEducator = this.educatorService.getActiveEducator();
    if (!activeEducator) return;

    const animalId = this.selectedAnimalId;

    try {
      const saved = localStorage.getItem("tinyStepsEducatorCheckboxes");
      if (saved) {
        const checkboxesData = JSON.parse(saved);

        const educatorCheckboxes = checkboxesData[activeEducator.id] || {};

        if (!educatorCheckboxes[animalId]) {
          educatorCheckboxes[animalId] = new Array(7).fill(false);
          localStorage.setItem(
            "tinyStepsEducatorCheckboxes",
            JSON.stringify(checkboxesData),
          );
        }
      } else {
        const newStructure: any = {
          [activeEducator.id]: {
            [animalId]: new Array(7).fill(false),
          },
        };
        localStorage.setItem(
          "tinyStepsEducatorCheckboxes",
          JSON.stringify(newStructure),
        );
      }
    } catch (e) {}
  }

  toggleExpand(itemId: string): void {
    if (this.expandedItem === itemId) {
      this.expandedItem = null;
    } else {
      this.expandedItem = itemId;
    }
  }

  isItemChecked(itemId: string): boolean {
    const animalId = this.selectedAnimalId;

    if (!animalId) return false;

    try {
      const saved = localStorage.getItem("tinyStepsEducatorCheckboxes");
      if (saved) {
        const checkboxesData = JSON.parse(saved);

        const activeEducator = this.educatorService.getActiveEducator();
        if (activeEducator) {
          const educatorCheckboxes = checkboxesData[activeEducator.id] || {};
          const animalCheckboxes = educatorCheckboxes[animalId];

          if (animalCheckboxes) {
            const itemIndex = parseInt(itemId.replace("item", "")) - 1;
            return animalCheckboxes[itemIndex] || false;
          }
        }
      }
    } catch (e) {}

    return false;
  }

  handleCheck(event: Event, itemId: string): void {
    event.stopPropagation();

    const animalId = this.selectedAnimalId;
    if (!animalId) return;

    const checkbox = event.target as HTMLInputElement;

    let checkboxesData: any = {};
    try {
      const saved = localStorage.getItem("tinyStepsEducatorCheckboxes");
      if (saved) {
        checkboxesData = JSON.parse(saved);
      }
    } catch (e) {}

    const activeEducator = this.educatorService.getActiveEducator();
    if (!activeEducator) return;

    if (!checkboxesData[activeEducator.id]) {
      checkboxesData[activeEducator.id] = {};
    }

    if (!checkboxesData[activeEducator.id][animalId]) {
      checkboxesData[activeEducator.id][animalId] = new Array(7).fill(false);
    }

    const itemIndex = parseInt(itemId.replace("item", "")) - 1;

    checkboxesData[activeEducator.id][animalId][itemIndex] = checkbox.checked;

    localStorage.setItem(
      "tinyStepsEducatorCheckboxes",
      JSON.stringify(checkboxesData),
    );
  }

  isAnimalActive(animalId: string): boolean {
    return this.selectedAnimalId === animalId;
  }

  navigateBack(): void {
    const isTraining = localStorage.getItem("trainingMode") === "true";

    if (isTraining) {
      this.router.navigate(["/"]);
    } else {
      window.history.back();
    }
  }

  navigateToHome(): void {
    this.router.navigate(["/"]);
  }

  isDarkMode(): boolean {
    return this.themeService.isDark();
  }

  updateDarkModeClass(): void {
    document.documentElement.classList.toggle(
      "dark",
      this.themeService.isDark(),
    );
  }

  toggleDarkMode(): void {
    this.themeService.toggleTheme();
  }

  getSelectedAnimalName(): string | null {
    if (!this.selectedAnimalId) return null;
    const animal = this.animals.find((a) => a.id === this.selectedAnimalId);
    return animal?.name || null;
  }

  getSelectedAnimalSvgName(): string | null {
    if (!this.selectedAnimalId) return null;
    const animal = this.animals.find((a) => a.id === this.selectedAnimalId);
    return animal?.svgName || null;
  }

  openPdfNotesModal(): void {
    this.showPdfNotesModal = true;
  }

  handlePdfNotesGenerate(notes: string): void {
    this.pdfNotes = notes;
    this.showPdfNotesModal = false;
    
    // Navigate to print-pdf page with notes as query param
    if (notes && notes.trim()) {
      const encodedNotes = encodeURIComponent(notes);
      this.router.navigate(['/print-pdf'], { queryParams: { notes: encodedNotes } });
    } else {
      // Navigate without notes if empty
      this.router.navigate(['/print-pdf']);
    }
  }

  handlePdfNotesClose(): void {
    this.showPdfNotesModal = false;
    this.pdfNotes = "";
  }

  generatePDF(notesOverride?: string): void {
    const doc = new jsPDF();
    doc.setProperties({
      title: "KLPT Report",
      subject: "Early Childhood Education Assessment",
      author: "TinySteps",
    });

    const educator = this.educatorService.getActiveEducator();
    const activeAnimalName = this.getSelectedAnimalName();

    if (educator) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(30, 64, 175);
      doc.text(`Educator: ${educator.name}`, 20, 15);
    }

    if (activeAnimalName) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(30, 64, 175);
      doc.text(`Animal: ${activeAnimalName}`, 20, 25);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(51, 65, 85);
    if (educator || activeAnimalName) {
      doc.text("KLPT Report", 105, 45, { align: "center" });
    } else {
      doc.text("KLPT Report", 105, 20, { align: "center" });
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    if (educator || activeAnimalName) {
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 57, {
        align: "center",
      });
    } else {
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 32, {
        align: "center",
      });
    }

    const savedState = JSON.parse(
      localStorage.getItem("tinyStepsEducatorCheckboxes") || "{}",
    );

    const activeEducator = this.educatorService.getActiveEducator();

    if (activeEducator) {
      const educatorCheckboxes = savedState[activeEducator.id] || {};

      // Filter to only include the currently selected animal
      const selectedAnimalId = this.selectedAnimalId;
      if (!selectedAnimalId) {
        doc.setFontSize(14);
        doc.setTextColor(71, 85, 105);
        if (educator || activeAnimalName) {
          doc.text("No animals selected", 105, 85, { align: "center" });
        } else {
          doc.text("No animals selected", 105, 60, { align: "center" });
        }
      } else {
        const selectedAnimalCheckboxes = educatorCheckboxes[selectedAnimalId];

        if (
          !selectedAnimalCheckboxes ||
          selectedAnimalCheckboxes.length === 0
        ) {
          doc.setFontSize(14);
          doc.setTextColor(71, 85, 105);
          if (educator || activeAnimalName) {
            doc.text(
              "No checklist items checked for selected animal",
              105,
              85,
              { align: "center" },
            );
          } else {
            doc.text(
              "No checklist items checked for selected animal",
              105,
              60,
              { align: "center" },
            );
          }
        } else {
          const checkedIndices = selectedAnimalCheckboxes
            .map((checked: boolean, index: number) => (checked ? index : -1))
            .filter((i: number) => i !== -1);

          if (checkedIndices.length === 0) {
            doc.setFontSize(14);
            doc.setTextColor(71, 85, 105);
            if (educator || activeAnimalName) {
              doc.text(
                "No checklist items checked for selected animal",
                105,
                85,
                { align: "center" },
              );
            } else {
              doc.text(
                "No checklist items checked for selected animal",
                105,
                60,
                { align: "center" },
              );
            }
          } else {
            const lineHeight = 14;
            let y = educator || activeAnimalName ? 75 : 50;

            const animal = this.animals.find((a) => a.id === selectedAnimalId);
            const animalName = animal?.name || "Animal";

            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(51, 65, 85);
            doc.text(animalName!, 105, y, { align: "center" });
            y += lineHeight * 1.5;

            checkedIndices.forEach((index: number) => {
              const item = this.checklistItems[index];

              doc.setFont("helvetica", "bold");
              doc.setFontSize(11);
              doc.setTextColor(51, 65, 85);
              doc.text(item.text, 20, y);
              y += lineHeight * 0.8;

              doc.setFont("helvetica", "normal");
              doc.setFontSize(10);
              doc.setTextColor(75, 85, 99);
              const descriptionLines = doc.splitTextToSize(
                item.description,
                170,
              );
              doc.text(descriptionLines, 20, y);
              y += descriptionLines.length * lineHeight * 0.8 + lineHeight;

              if (y > 270) {
                doc.addPage();
                y = 20;
              }
            });

            y += lineHeight * 2.0;

            const notesText = notesOverride || this.pdfNotes;
            if (notesText && notesText.trim()) {
              y += lineHeight * 0.5;

              doc.setFont("helvetica", "bold");
              doc.setFontSize(10);
              doc.setTextColor(51, 65, 85);
              const notesLabelLines = doc.splitTextToSize("Notes: ", 170);
              doc.text(notesLabelLines, 20, y);
              y += lineHeight * 0.8;

              doc.setFont("helvetica", "normal");
              const notesLines = doc.splitTextToSize(notesText, 170);
              doc.text(notesLines, 20, y);
              y += notesLines.length * lineHeight * 0.6;

              if (y > 270) {
                doc.addPage();
                y = 20;
              }
            }

            y += lineHeight * 0.5;
          }
        }
      }
    }

    doc.setFontSize(10);
    doc.setTextColor(156, 163, 175);
    doc.text(
      "Generated by TinySteps - Kindergarten Learning Toolkit",
      105,
      educator || activeAnimalName ? 285 : 305,
      { align: "center" },
    );

    localStorage.removeItem("tinyStepsPdfNotes");
    doc.save("words-and-sentences-checked-items.pdf");
  }

  printPage(): void {
    window.print();
  }
}
