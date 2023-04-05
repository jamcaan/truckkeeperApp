import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Drivers } from '../../models/driver.model';

@Component({
  selector: 'app-driver-list-item',
  templateUrl: './driver-list-item.component.html',
  styleUrls: ['./driver-list-item.component.scss'],
})
export class DriverListItemComponent implements OnInit {
  @Input() driver!: Drivers;

  @Input() selected!: boolean;

  @Output() driverSelected = new EventEmitter<Drivers>();

  @ViewChild('loadModal') loadModal!: TemplateRef<any>;

  @ViewChild('editDriverModal') editDriverModal!: TemplateRef<any>;

  @ViewChild('driverDetails') driverDetails!: TemplateRef<any>;

  constructor(private dialog: MatDialog) {}

  selectDriver() {
    this.driverSelected.emit(this.driver);
  }

  openDialog() {
    this.dialog.open(this.loadModal, {
      width: '800px',
      height: '627px',
    });
  }

  openEditDriverDialog() {
    this.dialog.open(this.editDriverModal, {
      width: '800px',
      height: '600px',
    });
  }

  openDriverDetailsDialog() {
    this.dialog.open(this.driverDetails, {
      width: '800px',
      height: '450px',
    });
  }

  ngOnInit(): void {}
}
