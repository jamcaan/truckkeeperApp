import { Component, OnInit } from '@angular/core';
import { takeUntil, tap } from 'rxjs';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { Unsub } from 'src/app/unsub.class';
import { Drivers } from '../../models/driver.model';
import { DriverService } from '../../services/driver.service';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss'],
})
export class DriversComponent extends Unsub implements OnInit {
  paginatedData: HttpResponseObject<Drivers>[] = [];

  drivers!: HttpResponseObject<Drivers>[];

  currentPage = 1;
  itemsPerPage = 4;
  totalPages: number = 0;
  searchTerm: string = '';

  constructor(private driversService: DriverService) {
    super();
  }

  ngOnInit(): void {
    this.driversService
      .getActiveDriversList()
      .pipe(
        takeUntil(this.unsubscribe$),
        tap((responseArray) => {
          // Assign the response to the driversList property
          const driversList = responseArray || [];
          this.drivers = driversList;
          // Calculate the total number of pages based on the number of items and itemsPerPage
          this.totalPages = Math.ceil(driversList.length / this.itemsPerPage);

          // Update the paginatedData based on the current page
          this.updatePaginatedData();
        })
      )
      .subscribe();
  }

  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.drivers.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.drivers.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  getPaginatedData(): HttpResponseObject<Drivers>[] {
    const filteredData = this.drivers.filter((item) =>
      item.data?.firstName
        ?.toLowerCase()
        .includes(this.searchTerm.toLowerCase())
    );
    this.totalPages = Math.ceil(filteredData.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }

  filterData() {
    this.currentPage = 1;
    this.paginatedData = this.getPaginatedData(); // Update paginated data after filtering
  }
}
