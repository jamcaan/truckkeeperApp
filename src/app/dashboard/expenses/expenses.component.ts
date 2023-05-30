import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable, of, switchMap } from 'rxjs';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { Expenses } from '../models/expenses.model';
import { ExpenseWithDriverName } from '../models/reporting.model';
import { DriverService } from '../services/driver.service';
import { ExpensesService } from '../services/expenses.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
})
export class ExpensesComponent implements OnInit {
  expenses!: HttpResponseObject<Expenses>[];
  driverName: string | undefined;

  expensesWithDriverName$!: Observable<ExpenseWithDriverName[]>;

  paginatedData!: ExpenseWithDriverName[];
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 0;
  searchTerm: string = '';

  expenseWithDriverName!: ExpenseWithDriverName[];

  constructor(
    private expenseService: ExpensesService,
    private driversService: DriverService
  ) {}

  ngOnInit(): void {
    this.expensesWithDriverName$ = combineLatest([
      this.expenseService.getAllExpenses(),
      this.driversService.getActiveDriversList(),
    ]).pipe(
      switchMap(([expenses, drivers]) => {
        this.expenseWithDriverName = expenses.map((exp) => {
          const driver = drivers.find(
            (driver) => driver.data?.id === exp.data?.driverId
          );

          const driverName = driver ? `${driver.data?.firstName}` : '';
          return {
            ...exp,
            driverName,
          } as ExpenseWithDriverName;
        });

        this.expenses = this.expenseWithDriverName;
        this.totalPages = Math.ceil(
          this.expenseWithDriverName.length / this.itemsPerPage
        );

        this.updatePaginatedData();

        return of(this.expenseWithDriverName);
      })
    );

    this.expensesWithDriverName$.subscribe();
  }

  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.expenses.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.expenses.length / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  getPaginatedData(): ExpenseWithDriverName[] {
    const filteredData = this.expenseWithDriverName.filter((item) =>
      item.driverName?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.totalPages = Math.ceil(filteredData.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }

  filterData() {
    this.currentPage = 1;
    this.paginatedData = this.getPaginatedData();
  }
}
