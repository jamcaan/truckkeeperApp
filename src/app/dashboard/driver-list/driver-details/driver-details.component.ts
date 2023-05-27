import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { Drivers } from '../../models/driver.model';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss'],
})
export class DriverDetailsComponent implements OnInit {
  @Input() driver!: Drivers;

  // constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
  //   console.log('driver details: ', this.driver);
  }

  // onClose() {
  //   this.dialog.closeAll();
  // }
}
