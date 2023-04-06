import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { Drivers } from '../models/driver.model';
import { DriverService } from '../services/driver.service';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.scss'],
})
export class DriverListComponent implements OnInit {
  constructor(private dialog: MatDialog, public driverService: DriverService) {}

  isModalVisible = false;
  @ViewChild('AddLoadModal') AddLoadModal!: TemplateRef<any>;

  driversList$: Observable<HttpResponseObject<Drivers[]>> | undefined;

  selectedDriver!: Drivers;

  ngOnInit(): void {
    this.driversList$ = this.driverService.getDriversList();
    this.driverService.getActiveDriversList().subscribe({
      next: () => {},
      error: (error) => {
        console.log(error);
      },
      complete: () => {},
    });
  }

  openDialog(): void {
    this.dialog.open(this.AddLoadModal, {
      width: '800px',
      height: '600px',
    });
  }

  onModalClose(): void {
    this.dialog.closeAll();
  }

  //For selecting a driver in the future and display his LOADS
  onDriverSelected(driver: Drivers) {
    this.selectedDriver = driver;
    console.log('Selected Driver: ', this.selectedDriver);
  }
}
