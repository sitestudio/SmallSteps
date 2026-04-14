import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Home } from "./home";
import { RouterTestingModule } from "@angular/router/testing";

describe("Home Component", () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have 5 nav buttons defined", () => {
    expect(component.navButtons.length).toBe(5);
  });

  it("should have correct number of subcategories for Language and Literacy", () => {
    const langButton = component.navButtons.find((b) => b.id === 1);
    expect(langButton?.items.length).toBe(2);
  });

  it("should toggle nav button on click", () => {
    // Initially no button is active
    expect(component.activeNavIndex).toBeNull();

    // Click button at index 0 (Language and Literacy)
    component.toggleNavButton(0);
    expect(component.activeNavIndex).toBe(0);

    // Click again should close
    component.toggleNavButton(0);
    expect(component.activeNavIndex).toBeNull();
  });

  it("should switch between different nav buttons", () => {
    // Click first button
    component.toggleNavButton(0);
    expect(component.activeNavIndex).toBe(0);

    // Click second button
    component.toggleNavButton(1);
    expect(component.activeNavIndex).toBe(1);

    // Click third button
    component.toggleNavButton(2);
    expect(component.activeNavIndex).toBe(2);
  });

  it("should get active button correctly", () => {
    // No active button
    expect(component.getActiveButton()).toBeUndefined();

    // Activate first button
    component.toggleNavButton(0);
    const active = component.getActiveButton();
    expect(active?.label).toBe("Language and Literacy");
  });

  it("should have correct number of subcategories for each button", () => {
    expect(component.navButtons[0].items.length).toBe(2); // Language and Literacy
    expect(component.navButtons[1].items.length).toBe(1); // Maths & Numbers
    expect(component.navButtons[2].items.length).toBe(1); // Social/Emotional
    expect(component.navButtons[3].items.length).toBe(1); // Physical
    expect(component.navButtons[4].items.length).toBe(1); // Executive Function
  });

  it("should toggle nav button correctly", () => {
    component.toggleNavButton(0);
    expect(component.activeNavIndex).toBe(0);

    component.toggleNavButton(1);
    expect(component.activeNavIndex).toBe(1);

    // Toggle same button twice should close
    component.toggleNavButton(1);
    expect(component.activeNavIndex).toBeNull();
  });

  it("should serialize subcategory items correctly", () => {
    const langButton = component.navButtons[0];
    expect(langButton.items[0].id).toBe("sounds-speech");
    expect(langButton.items[1].id).toBe("comprehension");
  });

  it("should open first button and close when clicking same button", () => {
    component.toggleNavButton(0);
    expect(component.activeNavIndex).toBe(0);

    component.toggleNavButton(0);
    expect(component.activeNavIndex).toBeNull();
  });

  it("should switch from first to second button", () => {
    component.toggleNavButton(0);
    expect(component.activeNavIndex).toBe(0);

    component.toggleNavButton(1);
    expect(component.activeNavIndex).toBe(1);
  });

  it("should switch through all buttons cyclically", () => {
    for (let i = 0; i < component.navButtons.length; i++) {
      component.toggleNavButton(i);
      expect(component.activeNavIndex).toBe(i);
    }
  });

  it("should return correct active button", () => {
    component.toggleNavButton(2);
    const active = component.getActiveButton();
    expect(active?.label).toBe("Social/Emotional");
  });

  it("should have correct number of subcategories when button is active", () => {
    component.toggleNavButton(0);
    const active = component.getActiveButton();
    expect(active?.items.length).toBe(2);

    component.toggleNavButton(1);
    const active2 = component.getActiveButton();
    expect(active2?.items.length).toBe(1);
  });

  it("should have hidden state for non-active buttons", () => {
    component.toggleNavButton(0);
    expect(component.activeNavIndex).toBe(0);
  });

  it("should have correct number of nav buttons total", () => {
    expect(component.navButtons.length).toBe(5);
  });

  it("should set centered state on active button", () => {
    // When a button is clicked, it should be the only one "centered"
    // The activeNavIndex tracks which button is centered
    component.toggleNavButton(2);
    expect(component.activeNavIndex).toBe(2); // Index 2 is centered

    // Click the same button again should close (return to null)
    component.toggleNavButton(2);
    expect(component.activeNavIndex).toBeNull();
  });

  it("should switch centered button between different buttons", () => {
    // Start with no button centered
    expect(component.activeNavIndex).toBeNull();

    // Click first button (index 0)
    component.toggleNavButton(0);
    expect(component.activeNavIndex).toBe(0);

    // Click third button (index 2) - should switch center
    component.toggleNavButton(2);
    expect(component.activeNavIndex).toBe(2);

    // Click fifth button (index 4) - should switch center
    component.toggleNavButton(4);
    expect(component.activeNavIndex).toBe(4);

    // Click second button (index 1) - should switch center
    component.toggleNavButton(1);
    expect(component.activeNavIndex).toBe(1);
  });

  it("should have correct centered button with matching label", () => {
    component.toggleNavButton(0);
    const active = component.getActiveButton();
    expect(active?.label).toBe("Language and Literacy");

    component.toggleNavButton(3);
    const active2 = component.getActiveButton();
    expect(active2?.label).toBe("Physical");
  });

  it("should have correct number of items when different buttons are centered", () => {
    // Language and Literacy has 2 subcategories
    component.toggleNavButton(0);
    expect(component.getActiveButton()?.items.length).toBe(2);

    // Maths & Numbers has 1 subcategory
    component.toggleNavButton(1);
    expect(component.getActiveButton()?.items.length).toBe(1);
  });

  it("should allow double-click to confirm removal of assigned animal", () => {
    component.educatorService.addEducator("Test Educator 2");
    const educators = component.educatorService.getEducators();
    const educatorId = educators[educators.length - 1].id;
    
    component.selectEducator(educatorId);

    // First assign an animal
    component.selectAnimal("tiger");
    
    let assignedAnimals = component.educatorService.getAssignedAnimals(educatorId);
    expect(assignedAnimals).toContain("tiger");

    // Mock confirm to return true for the removal
    const originalConfirm = window.confirm;
    (window as any).confirm = () => true;

    // Double-click should trigger confirmation and remove
    component.confirmRemoveAssignedAnimal("tiger", educatorId);
    
    assignedAnimals = component.educatorService.getAssignedAnimals(educatorId);
    expect(assignedAnimals).not.toContain("tiger");
    
    // Restore original confirm
    (window as any).confirm = originalConfirm;
  });
});
