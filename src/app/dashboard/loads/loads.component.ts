import { Component } from '@angular/core';
import { combineLatest, Observable, of, switchMap } from 'rxjs';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { Loads } from '../models/loads.model';
import { LoadsWithDriver } from '../models/reporting.model';
import { DriverService } from '../services/driver.service';
import { LoadsService } from '../services/loads.service';

@Component({
  selector: 'app-loads',
  templateUrl: './loads.component.html',
  styleUrls: ['./loads.component.scss'],
})
export class LoadsComponent {
  loadsAndDrivers$!: Observable<LoadsWithDriver[]>;
  loads!: HttpResponseObject<Loads>[];

  loadsWithDriverName!: LoadsWithDriver[];

  paginatedData: LoadsWithDriver[] = [];
  currentPage = 1;
  itemsPerPage = 4;
  totalPages: number = 0;
  searchTerm: string = '';

  constructor(
    private loadsService: LoadsService,
    private driversService: DriverService
  ) {}

  ngOnInit(): void {
    this.loadsAndDrivers$ = combineLatest([
      this.loadsService.getAllLoads(),
      this.driversService.getActiveDriversList(),
    ]).pipe(
      switchMap(([loads, drivers]) => {
        this.loadsWithDriverName = loads.map((pay) => {
          const driver = drivers.find(
            (driver) => driver.data?.id === pay.data?.driverId
          );
          const driverName = driver ? `${driver?.data?.firstName}` : '';
          return {
            ...pay,
            driverName,
          } as LoadsWithDriver;
        });
        this.loads = this.loadsWithDriverName; // Assign to payStub
        this.totalPages = Math.ceil(
          this.loadsWithDriverName.length / this.itemsPerPage
        );
        this.updatePaginatedData(); // Update paginated data initially
        return of(this.loadsWithDriverName);
      })
    );

    this.loadsAndDrivers$.subscribe();
  }

  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.loads.slice(startIndex, endIndex); // Use payStub instead of paginatedData
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.loads.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  getPaginatedData(): LoadsWithDriver[] {
    const filteredData = this.loadsWithDriverName.filter((item) =>
      item.driverName?.toLowerCase().includes(this.searchTerm.toLowerCase())
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
