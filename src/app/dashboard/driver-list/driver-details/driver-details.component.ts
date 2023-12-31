import { Component, Input } from '@angular/core';
import { Drivers } from '../../models/driver.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss'],
})
export class DriverDetailsComponent {
  @Input() driver!: Drivers;

  constructor(private dialog: MatDialog) {}

  onClose() {
    this.dialog.closeAll();
  }
}
