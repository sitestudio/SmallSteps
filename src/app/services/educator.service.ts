import { Injectable, signal } from "@angular/core";

export interface Educator {
  id: string;
  name: string;
}

export interface EducatorAssignment {
  educatorId: string;
  animalIds: string[];
  activeAnimalId: string | null;
  selectedAnimalIds: string[];
}

const EDUCATORS_STORAGE_KEY = "tinyStepsEducators";

@Injectable({
  providedIn: "root",
})
export class EducatorService {
  private educators = signal<Educator[]>([]);
  private activeEducatorId = signal<string | null>(null);
  private assignments = signal<EducatorAssignment[]>([]);
  private readonly CHECKBOX_STORAGE_KEY = "tinyStepsEducatorCheckboxes";

  educators$ = this.educators.asReadonly();
  activeEducatorId$ = this.activeEducatorId.asReadonly();
  assignments$ = this.assignments.asReadonly();

  constructor() {
    this.loadFromLocalStorage();
    this.migrateCheckboxStorage();
  }

  private migrateCheckboxStorage(): void {
    const oldData = localStorage.getItem("tinyStepsAnimalCheckboxes");
    if (oldData && !localStorage.getItem(this.CHECKBOX_STORAGE_KEY)) {
      try {
        const oldCheckboxes = JSON.parse(oldData);
        const activeEducator = this.getActiveEducator();

        if (activeEducator) {
          const newStructure: any = {};
          newStructure[activeEducator.id] = oldCheckboxes;
          localStorage.setItem(
            this.CHECKBOX_STORAGE_KEY,
            JSON.stringify(newStructure),
          );
        }

        localStorage.removeItem("tinyStepsAnimalCheckboxes");
      } catch (e) {
        console.warn("Checkbox migration failed:", e);
      }
    }
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

        const assignmentsWithDefault = (data.assignments || []).map(
          (a: any) => ({
            ...a,
            selectedAnimalIds: a.selectedAnimalIds || a.animalIds || [],
          }),
        );

        this.educators.set(data.educators || []);
        this.activeEducatorId.set(data.activeEducatorId || null);
        this.assignments.set(assignmentsWithDefault);
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

    localStorage.removeItem(EDUCATORS_STORAGE_KEY);
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
  getActiveAnimal(educatorId: string): string | null {
    const assignment = this.assignments().find(
      (a) => a.educatorId === educatorId,
    );
    return assignment?.activeAnimalId || null;
  }

  getSelectedAnimalIds(educatorId: string): string[] {
    const assignment = this.assignments().find(
      (a) => a.educatorId === educatorId,
    );
    return assignment?.selectedAnimalIds || [];
  }

  setSelectedAnimals(educatorId: string, animalIds: string[]): void {
    let assignment = this.assignments().find(
      (a) => a.educatorId === educatorId,
    );

    if (!assignment) {
      assignment = {
        educatorId: educatorId,
        animalIds: [],
        activeAnimalId: null,
        selectedAnimalIds: animalIds,
      };
      this.assignments.set([...this.assignments(), assignment]);
    } else {
      const updatedAssignment = { ...assignment, selectedAnimalIds: animalIds };
      this.assignments.set(
        this.assignments().map((a) =>
          a.educatorId === educatorId ? updatedAssignment : a,
        ),
      );
    }
    this.saveToLocalStorage();
  }

  toggleAnimalSelection(educatorId: string, animalId: string): void {
    const assignment = this.assignments().find(
      (a) => a.educatorId === educatorId,
    );

    if (!assignment) return;

    const isSelected = assignment.selectedAnimalIds.includes(animalId);
    let updatedSelectedIds: string[];

    if (isSelected) {
      updatedSelectedIds = assignment.selectedAnimalIds.filter(
        (id) => id !== animalId,
      );
    } else {
      updatedSelectedIds = [...assignment.selectedAnimalIds, animalId];
    }

    const updatedAssignment = {
      ...assignment,
      selectedAnimalIds: updatedSelectedIds,
    };
    this.assignments.set(
      this.assignments().map((a) =>
        a.educatorId === educatorId ? updatedAssignment : a,
      ),
    );
    this.saveToLocalStorage();
  }

  setActiveAnimal(educatorId: string, animalId: string | null): void {
    let assignment = this.assignments().find(
      (a) => a.educatorId === educatorId,
    );

    if (!assignment) {
      assignment = {
        educatorId: educatorId,
        animalIds: [],
        activeAnimalId: animalId,
        selectedAnimalIds: [],
      };
      this.assignments.set([...this.assignments(), assignment]);
    } else {
      const updatedAssignment = { ...assignment, activeAnimalId: animalId };
      this.assignments.set(
        this.assignments().map((a) =>
          a.educatorId === educatorId ? updatedAssignment : a,
        ),
      );
    }
    this.saveToLocalStorage();
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
        activeAnimalId: null,
        selectedAnimalIds: [animalId],
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

    let updatedAssignment: EducatorAssignment;
    if (updatedAnimalIds.length === 0) {
      this.assignments.set(
        this.assignments().filter((a) => a.educatorId !== educatorId),
      );
    } else {
      updatedAssignment = { ...assignment, animalIds: updatedAnimalIds };
      if (updatedAssignment.activeAnimalId === animalId) {
        updatedAssignment.activeAnimalId = null;
      }

      const isSelected = updatedAssignment.selectedAnimalIds.includes(animalId);
      let updatedSelectedIds = updatedAssignment.selectedAnimalIds;
      if (isSelected) {
        updatedSelectedIds = updatedSelectedIds.filter((id) => id !== animalId);
      }
      updatedAssignment.selectedAnimalIds = updatedSelectedIds;
      this.assignments.set(
        this.assignments().map((a) =>
          a.educatorId === educatorId ? updatedAssignment : a,
        ),
      );
    }

    this.saveToLocalStorage();
  }
}
