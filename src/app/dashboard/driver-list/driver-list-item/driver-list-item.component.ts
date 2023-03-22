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
import { ActivatedRoute } from '@angular/router';
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

  ngOnInit(): void {
  }
}
