import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { Drivers } from '../../models/driver.model';
import { Expenses } from '../../models/expenses.model';
import { Loads } from '../../models/loads.model';
import { DriverService } from '../../services/driver.service';
import { ExpensesService } from '../../services/expenses.service';

export interface LoadsWithDriver extends HttpResponseObject<Loads> {
  driverName: string;
  expenses: Expenses;
  test: (number | undefined)[];
}

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.scss'],
})
export class CompleteComponent implements OnInit, AfterContentInit {
  @Input() driver!: Drivers;
  @Input() loads$!: Observable<HttpResponseObject<Loads>[]>;
  loadsAndDrivers$!: Observable<LoadsWithDriver[]>;
  // completedLoads: CompletedLoads[] = [];
  expenses$!: Observable<HttpResponseObject<Expenses>[]>;

  total!: number;
  totalCharges!: number;
  totalExpenses!: number;

  driverId!: string | undefined;

  constructor(
    private driverService: DriverService,
    private expensesService: ExpensesService
  ) {}

  ngOnInit(): void {
    this.loadsAndDrivers$ = combineLatest([
      this.loads$,
      this.driverService.driversList$,
    ]).pipe(
      map(([loads, drivers]) => {
        console.log('loads:', loads);
        console.log('drivers:', drivers);
        return loads.map((load) => {
          const driver = drivers.find((driver) => {
            driver.id === load.data?.driverId;
          });
          this.expenses$ = this.expensesService.getExpensesByDriver(
            load.data?.driverId
          );

          const driverName = driver ? `${driver.firstName}` : '';
          return {
            ...load,
            driverName,
          } as LoadsWithDriver;
        });
      })
    );
  }

  ngAfterContentInit(): void {
    this.loadsAndDrivers$.subscribe((loads) => {
      const amounts = loads.map((load) => +(load.data?.amount || 0)); // replace undefined with 0
      this.total = amounts.reduce((acc, val) => acc + val, 0); // calculate the sum
      console.log('Total:', this.total); // display the sum in the console

      const totalChares = loads.map(
        (load) => +(load.data?.amount || 0) * (load.data?.commPercentage || 0)
      ); // replace undefined with 0
      this.totalCharges = totalChares.reduce((acc, val) => acc + val, 0);
    });

    this.expenses$.subscribe((expenses) => {
      const totalExpenses = expenses.map((exp) => +(exp.data?.amount || 0));
      this.totalExpenses = totalExpenses.reduce((acc, val) => acc + val, 0);
    });
  }

  onModalClose() {}

  onSubmit() {}
}
