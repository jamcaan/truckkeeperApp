import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  GeneralResponse,
  HttpResponseObject,
} from 'src/app/auth/models/auth.model';
import { Drivers } from '../models/driver.model';
import { DriverService } from '../services/driver.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.scss'],
})
export class DriverListComponent implements OnInit {
  userId!: string;

  constructor(
    private dialog: MatDialog,
    public driverService: DriverService,
    private route: ActivatedRoute
  ) {}

  isModalVisible = false;
  @ViewChild('AddLoadModal') AddLoadModal!: TemplateRef<any>;

  driversList$: Observable<GeneralResponse<Drivers[]>> | undefined;

  selectedDriver!: Drivers;

  ngOnInit(): void {
    setTimeout(() => {
      // Retrieve the currentUser JSON string from sessionStorage
      const currentUserString = sessionStorage.getItem('currentUser');

      // Check if currentUserString is not null before parsing
      if (currentUserString) {
        // Parse the currentUser JSON string into an object
        const currentUser = JSON.parse(currentUserString);

        // Access the id property of the currentUser object
        const userId = currentUser?.entities?.[currentUser.ids[0]]?.id;
        this.userId = userId;
        // Log the userId
        console.log(this.userId);
      }
      this.driversList$ = this.driverService.getDriversList();
      this.driverService.getActiveDriversList2(this.userId).subscribe({
        // will update later n correct the name.
        next: () => {},
        error: (error) => {
          console.log(error);
        },
        complete: () => {},
      });
    }, 1000);
  }

  openDialog(): void {
    this.dialog.open(this.AddLoadModal, {
      width: '800px',
      height: '580px',
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
