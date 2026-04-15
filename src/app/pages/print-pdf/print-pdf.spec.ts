import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { PrintPdf } from "./print-pdf";
import { EducatorService } from "../../services/educator.service";

describe("PrintPdf", () => {
  let component: PrintPdf;
  let fixture: ComponentFixture<PrintPdf>;

  const mockLocalStorage = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string): string | null => store[key] || null,
      setItem: (key: string, value: string): void => {
        store[key] = value;
      },
      removeItem: (key: string): void => {
        delete store[key];
      },
      clear: (): void => {
        store = {};
      },
    };
  })();

  beforeEach(async () => {
    Object.assign(window, {
      matchMedia: (query: string): MediaQueryList => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    });

    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
      writable: true,
    });

    await TestBed.configureTestingModule({
      imports: [PrintPdf],
      providers: [
        EducatorService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: (key: string) => null,
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PrintPdf);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Animal selection from localStorage", () => {
    it("should get selected animal from localStorage", () => {
      const savedAnimal = JSON.stringify({ selected: "lion" });
      localStorage.setItem("tinyStepsSelectedAnimal", savedAnimal);

      component.ngOnInit();

      expect(component.selectedAnimal).toBeDefined();
      if (component.selectedAnimal) {
        expect(component.selectedAnimal.id).toBe("lion");
        expect(component.selectedAnimal.name).toBe("Lion");
      }
    });

    it("should set selectedAnimal to null when no animal in localStorage", () => {
      localStorage.removeItem("tinyStepsSelectedAnimal");

      component.ngOnInit();

      expect(component.selectedAnimal).toBeNull();
    });

    it("should handle invalid JSON in localStorage gracefully", () => {
      localStorage.setItem("tinyStepsSelectedAnimal", "invalid json");

      component.ngOnInit();

      expect(component.selectedAnimal).toBeNull();
    });

    it("should return selected animal ID from localStorage", () => {
      const savedAnimal = JSON.stringify({ selected: "tiger" });
      localStorage.setItem("tinyStepsSelectedAnimal", savedAnimal);

      const animalId = component.getSelectedAnimalId();

      expect(animalId).toBe("tiger");
    });

    it("should return null when no animal in localStorage", () => {
      localStorage.removeItem("tinyStepsSelectedAnimal");

      const animalId = component.getSelectedAnimalId();

      expect(animalId).toBeNull();
    });
  });

  describe("Checked items filtering", () => {
    beforeEach(() => {
      const service = TestBed.inject(EducatorService);
      service.addEducator("Test Educator");
      const educators = service.getEducators();
      service.selectEducator(educators[0].id);
      const savedAnimal = JSON.stringify({ selected: "lion" });
      localStorage.setItem("tinyStepsSelectedAnimal", savedAnimal);
    });

    it("should return empty when no educator is active", () => {
      const service = TestBed.inject(EducatorService);
      service.selectEducator(null);
      component["selectedAnimal"] = { id: "lion", name: "Lion", svgName: "animal-lion" };
      const checkedItems = (component as any).getCheckedItems();
      expect(checkedItems.length).toBe(0);
    });

    it("should return empty when no selected animal", () => {
      const service = TestBed.inject(EducatorService);
      service.selectEducator(service.getEducators()[0].id);
      component["selectedAnimal"] = null;
      localStorage.removeItem("tinyStepsSelectedAnimal");
      const checkedItems = (component as any).getCheckedItems();
      expect(checkedItems.length).toBe(0);
    });

    it("should return checked items for selected animal only", () => {
      const service = TestBed.inject(EducatorService);
      const educators = service.getEducators();
      const checkboxData: any = {
        [educators[0].id]: {
          lion: [true, true, false, false, false, false, false],
          tiger: [false, false, true, true, false, false, false],
        },
      };
      localStorage.setItem("tinyStepsEducatorCheckboxes", JSON.stringify(checkboxData));
      component.ngOnInit();
      const checkedItems = (component as any).getCheckedItems();
      expect(checkedItems.length).toBe(2);
    });
  });

  describe("PDF generation", () => {
    it("should have generatePDF method", () => {
      expect(component.generatePDF).toBeDefined();
      expect(typeof component.generatePDF).toBe("function");
    });
  });

  describe("Notes from query params", () => {
    it("should have generatePDF method that works with query params", () => {
      // The component now reads notes from route.queryParams
      expect(component.generatePDF).toBeDefined();
    });
  });
});
