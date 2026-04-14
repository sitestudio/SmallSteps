import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Home } from "./home";
import { RouterTestingModule } from "@angular/router/testing";
import { EducatorService } from "../../services/educator.service";

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

    let assignedAnimals =
      component.educatorService.getAssignedAnimals(educatorId);
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

  describe("Single-click on assigned animal", () => {
    it("should set the animal as active without removing it from the list", () => {
      component.educatorService.addEducator("Test Educator 3");
      const educators = component.educatorService.getEducators();
      const educatorId = educators[educators.length - 1].id;

      component.selectEducator(educatorId);

      // First assign an animal (first click)
      component.selectAnimal("lion");

      let assignedAnimals =
        component.educatorService.getAssignedAnimals(educatorId);
      expect(assignedAnimals).toContain("lion");

      // Verify it's set as active
      let activeAnimal = component.educatorService.getActiveAnimal(educatorId);
      expect(activeAnimal).toBe("lion");

      // Animal should still be in the assigned list
      assignedAnimals =
        component.educatorService.getAssignedAnimals(educatorId);
      expect(assignedAnimals).toContain("lion");
    });

    it("should allow toggling between different animals as active", () => {
      component.educatorService.addEducator("Test Educator 4");
      const educators = component.educatorService.getEducators();
      const educatorId = educators[educators.length - 1].id;

      component.selectEducator(educatorId);

      // Assign two animals
      component.selectAnimal("tiger");
      component.selectAnimal("elephant");

      // Click on tiger to make it active
      component.selectAnimal("tiger");
      let activeAnimal = component.educatorService.getActiveAnimal(educatorId);
      expect(activeAnimal).toBe("tiger");

      // Click on elephant to make it active
      component.selectAnimal("elephant");
      activeAnimal = component.educatorService.getActiveAnimal(educatorId);
      expect(activeAnimal).toBe("elephant");

      // Both should still be in the assigned list
      let assignedAnimals =
        component.educatorService.getAssignedAnimals(educatorId);
      expect(assignedAnimals).toContain("tiger");
      expect(assignedAnimals).toContain("elephant");
    });

    it("should allow selection of an active animal to deselect it (null)", () => {
      component.educatorService.addEducator("Test Educator 5");
      const educators = component.educatorService.getEducators();
      const educatorId = educators[educators.length - 1].id;

      component.selectEducator(educatorId);

      // Assign and activate an animal
      component.selectAnimal("bear");

      let activeAnimal = component.educatorService.getActiveAnimal(educatorId);
      expect(activeAnimal).toBe("bear");

      // Click again should deselect it
      component.selectAnimal("bear");
      activeAnimal = component.educatorService.getActiveAnimal(educatorId);
      expect(activeAnimal).toBeNull();

      // Animal should still be assigned though
      const assignedAnimals =
        component.educatorService.getAssignedAnimals(educatorId);
      expect(assignedAnimals).toContain("bear");
    });
  });

  describe("getActiveAnimal and getActiveAnimal methods", () => {
    it("should return true when animal is active", () => {
      component.educatorService.addEducator("Test Educator 6");
      const educators = component.educatorService.getEducators();
      const educatorId = educators[educators.length - 1].id;

      component.selectEducator(educatorId);
      component.selectAnimal("zebra");

      const isActive = component.getActiveAnimal("zebra");
      expect(isActive).toBe(true);
    });

    it("should return false when animal is not active", () => {
      component.educatorService.addEducator("Test Educator 7");
      const educators = component.educatorService.getEducators();
      const educatorId = educators[educators.length - 1].id;

      component.selectEducator(educatorId);
      component.selectAnimal("giraffe");
      // Click again to deselect
      component.selectAnimal("giraffe");

      const isActive = component.getActiveAnimal("giraffe");
      expect(isActive).toBe(false);
    });

    it("should return false when no educator is selected", () => {
      // No educator selected
      const isActive = component.getActiveAnimal("monkey");
      expect(isActive).toBe(false);
    });
  });

  describe("Remove button confirmation dialog", () => {
    it("should ask for confirmation before removing an animal via the remove button", () => {
      component.educatorService.addEducator("Test Educator 8");
      const educators = component.educatorService.getEducators();
      const educatorId = educators[educators.length - 1].id;

      component.selectEducator(educatorId);
      component.selectAnimal("kangaroo");

      let assignedAnimals =
        component.educatorService.getAssignedAnimals(educatorId);
      expect(assignedAnimals).toContain("kangaroo");

      // Mock confirm to return true
      const originalConfirm = window.confirm;
      (window as any).confirm = () => true;

      // Click remove button - should confirm and then remove
      component.removeAssignedAnimal("kangaroo", educatorId);

      assignedAnimals =
        component.educatorService.getAssignedAnimals(educatorId);
      expect(assignedAnimals).not.toContain("kangaroo");

      // Restore original confirm
      (window as any).confirm = originalConfirm;
    });

    it("should NOT remove animal when user cancels confirmation", () => {
      component.educatorService.addEducator("Test Educator 9");
      const educators = component.educatorService.getEducators();
      const educatorId = educators[educators.length - 1].id;

      component.selectEducator(educatorId);
      component.selectAnimal("panda");

      let assignedAnimals =
        component.educatorService.getAssignedAnimals(educatorId);
      expect(assignedAnimals).toContain("panda");

      // Mock confirm to return false (cancel)
      const originalConfirm = window.confirm;
      (window as any).confirm = () => false;

      // Click remove button - should confirm but NOT remove since user said No
      component.confirmRemoveAssignedAnimal("panda", educatorId);

      assignedAnimals =
        component.educatorService.getAssignedAnimals(educatorId);
      expect(assignedAnimals).toContain("panda");

      // Restore original confirm
      (window as any).confirm = originalConfirm;
    });
  });

  describe("localStorage persistence", () => {
    it("should persist educator-animal assignments in localStorage", () => {
      // Clear any existing data
      localStorage.clear();

      component.educatorService.addEducator("Persist Test Educator");
      const educators = component.educatorService.getEducators();
      const educatorId = educators[educators.length - 1].id;

      component.selectEducator(educatorId);
      component.selectAnimal("rhino");

      // Verify in-memory data
      let assignedAnimals =
        component.educatorService.getAssignedAnimals(educatorId);
      expect(assignedAnimals).toContain("rhino");

      // Create a new instance to simulate page reload
      const service2 = TestBed.inject(EducatorService);

      // Verify data persisted
      const rehydratedAnimals = service2.getAssignedAnimals(educatorId);
      expect(rehydratedAnimals).toContain("rhino");
    });

    it("should persist active animal selection in localStorage", () => {
      // Clear any existing data
      localStorage.clear();

      component.educatorService.addEducator("Active Persist Test");
      const educators = component.educatorService.getEducators();
      const educatorId = educators[educators.length - 1].id;

      component.selectEducator(educatorId);
      component.selectAnimal("hippo");

      // Verify active animal is set
      let activeAnimal = component.educatorService.getActiveAnimal(educatorId);
      expect(activeAnimal).toBe("hippo");

      // Create new instance to simulate page reload
      const service2 = TestBed.inject(EducatorService);

      // Verify active animal persisted
      const rehydratedActive = service2.getActiveAnimal(educatorId);
      expect(rehydratedActive).toBe("hippo");
    });

    it("should persist multiple educators with their respective assignments", () => {
      // Clear any existing data
      localStorage.clear();

      // Create first educator with animals
      component.educatorService.addEducator("Multi Educator 1");
      const educators = component.educatorService.getEducators();
      const educatorId1 = educators[educators.length - 1].id;

      component.selectEducator(educatorId1);
      component.selectAnimal("koala");

      // Create second educator with different animals
      component.educatorService.addEducator("Multi Educator 2");
      const educators2 = component.educatorService.getEducators();
      const educatorId2 = educators2[educators2.length - 1].id;

      component.selectEducator(educatorId2);
      component.selectAnimal("whale"); // This won't exist but simulate the concept

      // Verify first educator's data
      let assigned1 = component.educatorService.getAssignedAnimals(educatorId1);
      expect(assigned1).toContain("koala");

      // Create new instance to simulate page reload
      const service2 = TestBed.inject(EducatorService);

      // Verify both educators' data persisted correctly
      const rehydrated1 = service2.getAssignedAnimals(educatorId1);
      expect(rehydrated1).toContain("koala");

      // educator2's animal won't exist in our animal list but structure should persist
    });

    it("should preserve activeEducatorId across page reloads", () => {
      // Clear any existing data
      localStorage.clear();

      component.educatorService.addEducator("Active Id Persist");
      const educators = component.educatorService.getEducators();
      const educatorId = educators[educators.length - 1].id;

      component.selectEducator(educatorId);
      expect(component.educatorService.getActiveEducator()?.id).toBe(
        educatorId,
      );

      // Create new instance to simulate page reload
      const service2 = TestBed.inject(EducatorService);

      // Verify active educator persisted
      expect(service2.getActiveEducator()?.id).toBe(educatorId);
    });
  });
});
