import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pdf-notes-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div
      class="modal-backdrop"
      (click)="onClose()"
      *ngIf="isOpen"
    >
      <div
        class="modal-content"
        (click)="$event.stopPropagation()"
        role="dialog"
        aria-modal="true"
      >
        <div class="modal-header">
          <h3>Pdf Notes</h3>
        </div>

        <div class="modal-body">
          <textarea
            [(ngModel)]="pdfNotes"
            class="notes-textarea"
            placeholder="Enter any additional notes for the PDF report..."
          ></textarea>
        </div>

        <div class="modal-footer">
          <button type="button" (click)="onClose()" class="btn-cancel">
            Cancel
          </button>
          <button type="button" (click)="onGenerate()" class="btn-generate">
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }

    .modal-content {
      background-color: white;
      border-radius: 16px;
      padding: 32px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s ease;
    }

    .modal-header {
      margin-bottom: 24px;
    }

    .modal-header h3 {
      font-family: 'Montserrat', sans-serif;
      font-size: 24px;
      color: #1c2b33;
      margin: 0;
      font-weight: 600;
    }

    .modal-body {
      margin-bottom: 32px;
    }

    .notes-textarea {
      width: 100%;
      min-height: 120px;
      padding: 16px;
      border: 2px solid #dee3e9;
      border-radius: 12px;
      font-family: 'Inter', sans-serif;
      font-size: 15px;
      resize: vertical;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      color: #1c2b33;
    }

    .notes-textarea:focus {
      outline: none;
      border-color: #0064e0;
      box-shadow: 0 0 0 3px rgba(0, 100, 224, 0.2);
    }

    .notes-textarea::placeholder {
      color: #94a3b8;
    }

    .modal-footer {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
    }

    .btn-cancel {
      padding: 12px 32px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      background-color: #f1f5f9;
      color: #475569;
    }

    .btn-cancel:hover {
      background-color: #e2e8f0;
      transform: translateY(-1px);
    }

    .btn-generate {
      padding: 12px 32px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      background-color: #0064e0;
      color: white;
    }

    .btn-generate:hover {
      background-color: #0143b5;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 100, 224, 0.3);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    :host-context(html.dark) {
      .modal-content {
        background-color: var(--dark-surface);
      }

      .notes-textarea {
        background-color: var(--dark-bg);
        border-color: var(--dark-border);
        color: var(--dark-text);
      }

      .notes-textarea::placeholder {
        color: #64748b;
      }

      .modal-header h3 {
        color: var(--dark-text);
      }

      .btn-cancel {
        background-color: var(--dark-bg-secondary);
        color: var(--dark-text);
      }

      .btn-cancel:hover {
        background-color: var(--dark-bg-tertiary);
      }
    }

    @media (max-width: 480px) {
      .modal-content {
        padding: 24px;
        margin: 16px;
      }

      .modal-header h3 {
        font-size: 20px;
      }

      .notes-textarea {
        min-height: 100px;
        padding: 12px;
      }
    }
  `]
})
export class PdfNotesModalComponent {
  isOpen = false;
  pdfNotes = '';

  @Output() generate = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  open(): void {
    this.isOpen = true;
    this.pdfNotes = '';
  }

  setNotes(notes: string): void {
    this.pdfNotes = notes;
  }

  onClose(): void {
    this.isOpen = false;
    this.close.emit();
  }

  onGenerate(): void {
    if (this.isOpen) {
      this.generate.emit(this.pdfNotes);
      this.isOpen = false;
    }
  }
}
