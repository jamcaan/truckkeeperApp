import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { Drivers } from '../../models/driver.model';
import { Expenses } from '../../models/expenses.model';
import { Loads } from '../../models/loads.model';
import { DriverService } from '../../services/driver.service';
import { ExpensesService } from '../../services/expenses.service';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatDate } from '@angular/common';

export interface LoadsWithDriver extends HttpResponseObject<Loads> {
  driverName: string;
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
  expenses$!: Observable<HttpResponseObject<Expenses>[]>;

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  total!: number;
  totalCharges!: number;
  totalExpenses!: number;

  driverName!: string;

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
            this.driverName = driver.firstName;
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

  onSubmit() {
    // this is temporary; will change it to send as email to the driver.
    const content = this.pdfContent.nativeElement;

    html2canvas(content).then((canvas) => {
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const doc = new jsPDF.jsPDF('p', 'mm', 'a4');
      let position = 0;

      doc.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;
      }

      doc.save(
        `${this.driverName}-${formatDate(
          new Date(),
          'MM-dd-yyyy',
          'en-US'
        )}.pdf`
      );
    });
  }
}
