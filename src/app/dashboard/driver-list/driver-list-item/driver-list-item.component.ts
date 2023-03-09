import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Drivers } from '../../models/driver.model';

@Component({
  selector: 'app-driver-list-item',
  templateUrl: './driver-list-item.component.html',
  styleUrls: ['./driver-list-item.component.scss'],
})
export class DriverListItemComponent {
  // @Output() driver!: Driver;
  @Input() driver!: Drivers;

  // @Output() selected!: boolean
  @Input() selected!: boolean;

  @Output() driverSelected = new EventEmitter<Drivers>();

  selectDriver() {
    this.driverSelected.emit(this.driver);
  }
}
