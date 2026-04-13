import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterOutlet } from "@angular/router";
import { ThemeService } from "../../services/theme.service";
import jsPDF from "jspdf";

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
  imports: [CommonModule, RouterOutlet],
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
  selectedAnimal: Animal | null = null;

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

  constructor(private router: Router, private themeService: ThemeService) {}

  ngOnInit(): void {
    this.getSelectedAnimal();
  }

  getSelectedAnimal(): void {
    const saved = localStorage.getItem("tinyStepsSelectedAnimal");
    let animalId: string | null = null;

    if (saved) {
      try {
        animalId = JSON.parse(saved).selected;
      } catch (e) {}
    }

    if (animalId) {
      this.selectedAnimal = this.animals.find((a) => a.id === animalId) || null;
    }

    if (!this.selectedAnimal) {
      const usedAnimals = this.getUsedAnimals();

      const unusedAnimals = this.animals.filter(
        (a) => !usedAnimals.includes(a.id),
      );

      if (unusedAnimals.length > 0) {
        this.selectedAnimal = unusedAnimals[0];
      } else {
        this.selectedAnimal =
          this.animals[Math.floor(Math.random() * this.animals.length)];
      }

      this.trackAnimalUse(this.selectedAnimal.id);
    }
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
    let state: AnimalState = { usedAnimals: [], lastAssigned: null, timestamp: Date.now() };

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
      const saved = localStorage.getItem("tinyStepsAnimalCheckboxes");
      if (saved) {
        const animalCheckboxes = JSON.parse(saved);
        const itemIndex = parseInt(itemId.replace("item", "")) - 1;
        return animalCheckboxes[animalId]?.[itemIndex] || false;
      }
    } catch (e) {}

    return false;
  }

  getSelectedAnimalId(): string | null {
    const saved = localStorage.getItem("tinyStepsSelectedAnimal");
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
      const saved = localStorage.getItem("tinyStepsAnimalCheckboxes");
      if (saved) {
        animalCheckboxes = JSON.parse(saved);
      }
    } catch (e) {}

    if (!animalCheckboxes[animalId]) {
      animalCheckboxes[animalId] = new Array(7).fill(false);
    }

    const itemIndex = parseInt(itemId.replace("item", "")) - 1;

    animalCheckboxes[animalId][itemIndex] = checkbox.checked;

    localStorage.setItem(
      "tinyStepsAnimalCheckboxes",
      JSON.stringify(animalCheckboxes),
    );
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
    document.documentElement.classList.toggle("dark", this.themeService.isDark());
  }

  toggleDarkMode(): void {
    this.themeService.toggleTheme();
  }



  generatePDF(): void {
    const doc = new jsPDF();
    doc.setProperties({
      title: "KLPT Report",
      subject: "Early Childhood Education Assessment",
      author: "TinySteps",
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(51, 65, 85);
    doc.text("KLPT Report", 105, 20, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 32, {
      align: "center",
    });

    const savedState = JSON.parse(
      localStorage.getItem("tinyStepsAnimalCheckboxes") || "{}",
    );

    if (Object.keys(savedState).length === 0) {
      doc.setFontSize(14);
      doc.setTextColor(71, 85, 105);
      doc.text("No animals selected", 105, 60, { align: "center" });
    } else {
      const lineHeight = 14;
      let y = 50;

      Object.entries(savedState).forEach(([animalId, checkboxes]) => {
        const animal = this.animals.find((a) => a.id === animalId);
        const animalName = animal?.name || "Animal";
        const checkedIndices = (checkboxes as boolean[])
          .map((checked, index) => (checked ? index : -1))
          .filter((i) => i !== -1);

        if (checkedIndices.length > 0) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(14);
          doc.setTextColor(51, 65, 85);
          doc.text(animalName!, 105, y, { align: "center" });
          y += lineHeight * 1.5;

          checkedIndices.forEach((index) => {
            const item = this.checklistItems[index];

            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(51, 65, 85);
            doc.text(item.text, 20, y);
            y += lineHeight * 0.8;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(75, 85, 99);
            const descriptionLines = doc.splitTextToSize(item.description, 170);
            doc.text(descriptionLines, 20, y);
            y += descriptionLines.length * lineHeight * 0.8 + lineHeight;

            if (y > 270) {
              doc.addPage();
              y = 20;
            }
          });

          y += lineHeight * 0.5;
        }
      });
    }

    doc.setFontSize(10);
    doc.setTextColor(156, 163, 175);
    doc.text(
      "Generated by TinySteps - Kindergarten Learning Toolkit",
      105,
      295,
      { align: "center" },
    );
    doc.save("words-and-sentences-checked-items.pdf");
  }

  printPage(): void {
    window.print();
  }
}
