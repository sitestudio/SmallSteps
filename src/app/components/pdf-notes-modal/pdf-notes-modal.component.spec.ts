import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PdfNotesModalComponent } from "./pdf-notes-modal.component";

describe("PdfNotesModalComponent", () => {
  let component: PdfNotesModalComponent;
  let fixture: ComponentFixture<PdfNotesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfNotesModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PdfNotesModalComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have initial state with modal closed", () => {
    expect(component.isOpen).toBe(false);
    expect(component.pdfNotes).toBe("");
  });

  it("should open modal and reset pdfNotes", () => {
    component.pdfNotes = "existing notes";
    component.open();
    
    expect(component.isOpen).toBe(true);
    expect(component.pdfNotes).toBe("");
  });

  it("should emit close event when onClose is called", () => {
    let closeEmitted = false;
    component.close.subscribe(() => {
      closeEmitted = true;
    });

    component.onClose();
    
    expect(component.isOpen).toBe(false);
    expect(closeEmitted).toBe(true);
  });

  it("should emit generate event with pdfNotes when onGenerate is called", () => {
    const testNotes = "Test notes content";
        component.open();
    component.pdfNotes = testNotes;
    
    let generatedNotes: string | null = null;
    component.generate.subscribe((notes) => {
      generatedNotes = notes;
    });

    component.onGenerate();
    
    expect(generatedNotes).toBe(testNotes);
    expect(component.isOpen).toBe(false);
  });

  it("should not emit generate if modal is not open", () => {
    let generatedNotes: string | null = null;
    component.generate.subscribe((notes) => {
      generatedNotes = notes;
    });

    // First close the modal
    component.onClose();
    
    // Then try to generate - should not emit
    component.onGenerate();
    
    expect(generatedNotes).toBeNull();
  });
});
