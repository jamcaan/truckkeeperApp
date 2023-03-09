import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() headerText!: string;
  @Input() size: 'sm' | 'md' | 'lg' = 'md'; // TODO: I don't need I will need this check later.

  @Output() modalClosed = new EventEmitter<boolean>();

  constructor(public dialogRef: MatDialogRef<ModalComponent>) {}

  onClose(): void {
    this.modalClosed.emit(true);
    this.dialogRef.close();
  }
}
