import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Comprehension } from './comprehension';

describe('Comprehension', () => {
  let component: Comprehension;
  let fixture: ComponentFixture<Comprehension>;

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
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    await TestBed.configureTestingModule({
      imports: [Comprehension],
    }).compileComponents();

    fixture = TestBed.createComponent(Comprehension);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have checklist items', () => {
    expect(component.checklistItems).toBeDefined();
    expect(component.checklistItems.length).toBeGreaterThan(0);
  });

  it('should have at least one checklist item with text', () => {
    expect(component.checklistItems[0].text).toBeTruthy();
    expect(typeof component.checklistItems[0].text).toBe('string');
  });

  it('should have items with descriptions', () => {
    component.checklistItems.forEach((item) => {
      expect(item.description).toBeTruthy();
      expect(typeof item.description).toBe('string');
    });
  });

  it('should initialize with no expanded item', () => {
    expect(component.expandedItem).toBeNull();
  });

  it('should toggle expand', () => {
    const itemId = 'item1';
    component.toggleExpand(itemId);
    expect(component.expandedItem).toBe(itemId);

    component.toggleExpand(itemId);
    expect(component.expandedItem).toBeNull();
  });

  it('should have at least one animal', () => {
    expect(component.animals).toBeDefined();
    expect(component.animals.length).toBeGreaterThan(0);
  });

  it('should have animals with required properties', () => {
    component.animals.forEach((animal) => {
      expect(animal.id).toBeTruthy();
      expect(animal.name).toBeTruthy();
      expect(animal.svgName).toBeTruthy();
    });
  });

  it('should have lion animal with correct svgName', () => {
    const lion = component.animals.find((a) => a.id === 'lion');
    expect(lion).toBeDefined();
    if ( lion) {
      expect(lion.id).toBe('lion');
      expect(lion.name).toBe('Lion');
      expect(lion.svgName).toBe('animal-lion');
    }
  });

  it('should have all animals with svgName property', () => {
    component.animals.forEach((animal) => {
      expect(animal.svgName).toBeTruthy();
      expect(typeof animal.svgName).toBe('string');
    });
  });

  it('should have navigation methods (navigateBack, navigateToHome)', () => {
    expect(component.navigateBack).toBeDefined();
    expect(typeof component.navigateBack).toBe('function');
    expect(component.navigateToHome).toBeDefined();
    expect(typeof component.navigateToHome).toBe('function');
  });

  it('should have generatePDF method', () => {
    expect(component.generatePDF).toBeDefined();
    expect(typeof component.generatePDF).toBe('function');
  });

  it('should have isDarkMode method', () => {
    expect(component.isDarkMode).toBeDefined();
    expect(typeof component.isDarkMode).toBe('function');
  });
});
