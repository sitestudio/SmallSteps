import { Injectable, signal } from "@angular/core";

export interface Educator {
  id: string;
  name: string;
}

export interface EducatorAssignment {
  educatorId: string;
  animalIds: string[];
}

const EDUCATORS_STORAGE_KEY = "tinyStepsEducators";

@Injectable({
  providedIn: "root",
})
export class EducatorService {
  private educators = signal<Educator[]>([]);
  private activeEducatorId = signal<string | null>(null);
  private assignments = signal<EducatorAssignment[]>([]);

  educators$ = this.educators.asReadonly();
  activeEducatorId$ = this.activeEducatorId.asReadonly();
  assignments$ = this.assignments.asReadonly();

  constructor() {
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage(): void {
    try {
      const data = {
        educators: this.educators(),
        activeEducatorId: this.activeEducatorId(),
        assignments: this.assignments(),
      };
      localStorage.setItem(EDUCATORS_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  private loadFromLocalStorage(): void {
    try {
      const saved = localStorage.getItem(EDUCATORS_STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        this.educators.set(data.educators || []);
        this.activeEducatorId.set(data.activeEducatorId || null);
        this.assignments.set(data.assignments || []);
      }
    } catch (e) {}
  }

  getEducators(): Educator[] {
    return this.educators();
  }

  addEducator(name: string): Educator | null {
    const trimmedName = name.trim();
    if (!trimmedName) return null;

    const existing = this.educators().find((e) => e.name === trimmedName);
    if (existing) return existing;

    const newEducator: Educator = {
      id: `educator-${Date.now()}`,
      name: trimmedName,
    };

    this.educators.set([...this.educators(), newEducator]);
    this.saveToLocalStorage();
    return newEducator;
  }

  deleteEducator(id: string): void {
    const confirmed = confirm("Are you sure you want to delete this educator?");
    if (!confirmed) return;

    const updatedEducators = this.educators().filter((e) => e.id !== id);
    const updatedAssignments = this.assignments().filter(
      (a) => a.educatorId !== id,
    );

    this.educators.set(updatedEducators);
    this.assignments.set(updatedAssignments);

    if (this.activeEducatorId() === id) {
      this.activeEducatorId.set(null);
    }

    this.saveToLocalStorage();
  }

  selectEducator(id: string | null): void {
    this.activeEducatorId.set(id);
    this.saveToLocalStorage();
  }

  getActiveEducator(): Educator | null {
    const activeId = this.activeEducatorId();
    if (!activeId) return null;
    return this.educators().find((e) => e.id === activeId) || null;
  }

  getAssignedAnimals(educatorId: string): string[] {
    const assignment = this.assignments().find(
      (a) => a.educatorId === educatorId,
    );
    return assignment?.animalIds || [];
  }

  assignAnimal(animalId: string): boolean {
    const activeEducatorId = this.activeEducatorId();
    if (!activeEducatorId) {
      return false;
    }

    let assignment = this.assignments().find(
      (a) => a.educatorId === activeEducatorId,
    );

    if (!assignment) {
      assignment = {
        educatorId: activeEducatorId,
        animalIds: [],
      };
      this.assignments.set([...this.assignments(), assignment]);
    } else if (assignment.animalIds.includes(animalId)) {
      return true;
    }

    assignment.animalIds.push(animalId);
    this.assignments.set(
      this.assignments().map((a) =>
        a.educatorId === activeEducatorId ? assignment! : a,
      ),
    );
    this.saveToLocalStorage();
    return true;
  }

  unassignAnimal(educatorId: string, animalId: string): void {
    const assignment = this.assignments().find(
      (a) => a.educatorId === educatorId,
    );

    if (!assignment) return;

    const updatedAnimalIds = assignment.animalIds.filter(
      (id) => id !== animalId,
    );

    if (updatedAnimalIds.length === 0) {
      this.assignments.set(
        this.assignments().filter((a) => a.educatorId !== educatorId),
      );
    } else {
      this.assignments.set(
        this.assignments().map((a) =>
          a.educatorId === educatorId
            ? { ...a, animalIds: updatedAnimalIds }
            : a,
        ),
      );
    }

    this.saveToLocalStorage();
  }
}
