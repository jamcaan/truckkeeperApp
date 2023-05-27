import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable, of, switchMap } from 'rxjs';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { PayStubSummary } from '../models/loads.model';
import { PayStubWithDriverName } from '../models/reporting.model';
import { DriverService } from '../services/driver.service';
import { ReportingService } from '../services/reporting.service';

@Component({
  selector: 'app-paystub',
  templateUrl: './paystub.component.html',
  styleUrls: ['./paystub.component.scss'],
})
export class PaystubComponent implements OnInit {
  payStub!: HttpResponseObject<PayStubSummary>[];
  driverName!: string | undefined;
  payStubWithDriverName$!: Observable<PayStubWithDriverName[]>;

  paginatedData: PayStubWithDriverName[] = [];
  currentPage = 1;
  itemsPerPage = 3;
  totalPages: number = 0;
  searchTerm: string = '';

  payStubWithDriverName!: PayStubWithDriverName[];

  constructor(
    private driversService: DriverService,
    private reportService: ReportingService
  ) {}

  ngOnInit(): void {
    this.payStubWithDriverName$ = combineLatest([
      this.reportService.getPayStub(),
      this.driversService.getActiveDriversList(),
    ]).pipe(
      switchMap(([payStub, drivers]) => {
        this.payStubWithDriverName = payStub.map((pay) => {
          const driver = drivers.find(
            (driver) => driver.data?.id === pay.data?.driverId
          );
          const driverName = driver ? `${driver?.data?.firstName}` : '';
          return {
            ...pay,
            driverName,
          } as PayStubWithDriverName;
        });
        this.payStub = this.payStubWithDriverName; // Assign to payStub
        this.totalPages = Math.ceil(
          this.payStubWithDriverName.length / this.itemsPerPage
        );
        this.updatePaginatedData(); // Update paginated data initially
        return of(this.payStubWithDriverName);
      })
    );

    this.payStubWithDriverName$.subscribe();
  }

  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.payStub.slice(startIndex, endIndex); // Use payStub instead of paginatedData
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.payStub.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  getPaginatedData(): PayStubWithDriverName[] {
    const filteredData = this.payStubWithDriverName.filter((item) =>
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
