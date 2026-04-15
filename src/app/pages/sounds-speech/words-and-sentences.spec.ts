import { ComponentFixture, TestBed } from "@angular/core/testing";
import { WordsAndSentences } from "./words-and-sentences";
import { EducatorService } from "../../services/educator.service";

describe("WordsAndSentences", () => {
  let component: WordsAndSentences;
  let fixture: ComponentFixture<WordsAndSentences>;

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
      imports: [WordsAndSentences],
    }).compileComponents();

    fixture = TestBed.createComponent(WordsAndSentences);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have checklist items", () => {
    expect(component.checklistItems).toBeDefined();
    expect(component.checklistItems.length).toBeGreaterThan(0);
  });

  it("should have at least one checklist item with text", () => {
    expect(component.checklistItems[0].text).toBeTruthy();
    expect(typeof component.checklistItems[0].text).toBe("string");
  });

  it("should have items with descriptions", () => {
    component.checklistItems.forEach((item) => {
      expect(item.description).toBeTruthy();
      expect(typeof item.description).toBe("string");
    });
  });

  it("should have initialized with no expanded item", () => {
    expect(component.expandedItem).toBeNull();
  });

  it("should toggle expand", () => {
    const itemId = "item1";
    component.toggleExpand(itemId);
    expect(component.expandedItem).toBe(itemId);

    component.toggleExpand(itemId);
    expect(component.expandedItem).toBeNull();
  });

  it("should have at least one animal", () => {
    expect(component.animals).toBeDefined();
    expect(component.animals.length).toBeGreaterThan(0);
  });

  it("should have animals with required properties", () => {
    component.animals.forEach((animal) => {
      expect(animal.id).toBeTruthy();
      expect(animal.name).toBeTruthy();
      expect(animal.svgName).toBeTruthy();
    });
  });

  it("should have lion animal with correct svgName", () => {
    const lion = component.animals.find((a) => a.id === "lion");
    expect(lion).toBeDefined();
    if (lion) {
      expect(lion.id).toBe("lion");
      expect(lion.name).toBe("Lion");
      expect(lion.svgName).toBe("animal-lion");
    }
  });

  it("should have all animals with svgName property", () => {
    component.animals.forEach((animal) => {
      expect(animal.svgName).toBeTruthy();
      expect(typeof animal.svgName).toBe("string");
    });
  });

  it("should have navigation methods (navigateBack, navigateToHome)", () => {
    expect(component.navigateBack).toBeDefined();
    expect(typeof component.navigateBack).toBe("function");
    expect(component.navigateToHome).toBeDefined();
    expect(typeof component.navigateToHome).toBe("function");
  });

  it("should have generatePDF method", () => {
    expect(component.generatePDF).toBeDefined();
    expect(typeof component.generatePDF).toBe("function");
  });

  it("should have isDarkMode method", () => {
    expect(component.isDarkMode).toBeDefined();
    expect(typeof component.isDarkMode).toBe("function");
  });

  describe("Multi-select animal management", () => {
    it("should return selected animals from service when educator is active", () => {
      const service = TestBed.inject(EducatorService);
      service.addEducator("Test Educator");
      const educators = service.getEducators();
      service.selectEducator(educators[0].id);

      component.selectedAnimalId = "lion";
      const selectedAnimals = component.getSelectedAnimals();

      expect(selectedAnimals.length).toBe(0);
    });

    it("should return empty when no educator is selected", () => {
      component.selectedAnimalId = "tiger";

      const selectedAnimals = component.getSelectedAnimals();
      expect(selectedAnimals.length).toBe(0);
    });

    it("should get animal name correctly", () => {
      component.selectedAnimalId = "lion";
      expect(component.getSelectedAnimalName()).toBe("Lion");
    });

    it("should get selected animal SVG name", () => {
      component.selectedAnimalId = "tiger";
      expect(component.getSelectedAnimalSvgName()).toBe("animal-tiger");
    });
  });

  describe("Checkbox persistence", () => {
    const mockLocalStorageCheckboxes = (() => {
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

    beforeEach(() => {
      Object.defineProperty(window, "localStorage", {
        value: mockLocalStorageCheckboxes,
        writable: true,
      });
    });

    it("should load checkboxes for selected animal", () => {
      const service = TestBed.inject(EducatorService);
      service.addEducator("Checkbox Test Educator");
      const educators = service.getEducators();
      service.selectEducator(educators[0].id);

      component.selectedAnimalId = "lion";

      expect(component.isItemChecked("item1")).toBe(false);
    });

    it("should save checkbox state", () => {
      component.selectedAnimalId = "tiger";

      const event = {
        stopPropagation: () => {},
        target: { checked: true },
      } as unknown as Event;
      component.handleCheck(event, "item1");

      expect(component.isItemChecked("item1")).toBe(true);
    });
  });

  describe("Animal state tracking", () => {
    it("should track animal usage", () => {
      component.trackAnimalUse("zebra");

      const used = component.getUsedAnimals();
      expect(used).toContain("zebra");
    });

    it("should select first available unused animal", () => {
      component.selectFirstAvailableAnimal();

      expect(component.selectedAnimalId).not.toBeNull();
    });
  });
});
