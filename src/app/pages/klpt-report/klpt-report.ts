import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
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

@Component({
  selector: "app-klpt-report",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./klpt-report.html",
  styleUrls: ["./klpt-report.scss"],
})
export class KLPTReport implements OnInit {
  currentDate: string = new Date().toLocaleDateString();

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

  selectedAnimal: Animal | null = null;
  checkedItemsText: string[] = [];

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

  constructor() {}

  get checkedItems(): { text: string; description: string }[] {
    return this.getCheckedItems();
  }

  navigateToHome(): void {
    window.location.href = "/";
  }

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

  getCheckedItems(): { text: string; description: string }[] {
    const animalId = this.getSelectedAnimalId();

    if (!animalId) return [];

    try {
      const saved = localStorage.getItem("tinyStepsAnimalCheckboxes");
      if (saved) {
        const animalCheckboxes = JSON.parse(saved);
        const checkboxes = animalCheckboxes[animalId] || [];

        return this.checklistItems
          .map((item, index) => ({ ...item, isChecked: checkboxes[index] }))
          .filter((item) => item.isChecked)
          .map((item) => ({ text: item.text, description: item.description }));
      }
    } catch (e) {}

    return [];
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

    const checkedItems = this.getCheckedItems();

    if (checkedItems.length === 0) {
      doc.setFontSize(14);
      doc.setTextColor(71, 85, 105);
      doc.text("No checklist items checked", 105, 60, { align: "center" });
    } else {
      let y = 50;
      const lineHeight = 12;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);

      checkedItems.forEach((item, index) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(`${index + 1}. ${item.text}`, 20, y);
        y += lineHeight;

        doc.setFont("helvetica", "normal");
        const wrappedDescription = doc.splitTextToSize(item.description, 170);
        wrappedDescription.forEach((line: string) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, 25, y);
          y += lineHeight;
        });

        y += lineHeight;
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
    doc.save("klpt-report.pdf");
  }
}
