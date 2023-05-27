import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { combineLatest, map, Observable, takeUntil } from 'rxjs';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { Drivers } from '../../models/driver.model';
import { Expenses } from '../../models/expenses.model';
import { Loads, PayStubSummary } from '../../models/loads.model';
import { DriverService } from '../../services/driver.service';
import { ExpensesService } from '../../services/expenses.service';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatDate } from '@angular/common';
import { LoadsService } from '../../services/loads.service';
import { v4 } from 'uuid';
import { Unsub } from 'src/app/unsub.class';
import { LoadsWithDriver } from '../../models/reporting.model';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.scss'],
})
export class CompleteComponent
  extends Unsub
  implements OnInit, AfterContentInit
{
  @Input() driver!: Drivers;
  @Input() loads$!: Observable<HttpResponseObject<Loads>[]>;
  loadsAndDrivers$!: Observable<LoadsWithDriver[]>;
  expenses$!: Observable<HttpResponseObject<Expenses>[]>;

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  total!: number;
  totalCharges!: number;
  totalExpenses!: number;

  driverName!: string | undefined;
  driverId!: string | undefined;

  ytdTotal: number = 0;
  ytdNet: number = 0;

  constructor(
    private driverService: DriverService,
    private expensesService: ExpensesService,
    private loadsService: LoadsService
  ) {
    super();
  }

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
            this.driverId = load.data?.driverId;

            const dName = drivers.filter((b) => b.id === load.data?.driverId);
            this.driverName = dName.map((t) => t.firstName).toString();
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
    this.loadsAndDrivers$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((loads) => {
        const amounts = loads.map((load) => +(load.data?.amount || 0)); // replace undefined with 0
        this.total = amounts.reduce((acc, val) => acc + val, 0); // calculate the sum
        console.log('Total:', this.total); // display the sum in the console

        const totalChares = loads.map(
          (load) => +(load.data?.amount || 0) * (load.data?.commPercentage || 0)
        ); // replace undefined with 0
        this.totalCharges = totalChares.reduce((acc, val) => acc + val, 0);
      });
    this.ytdTotal = this.total;
    this.expenses$.subscribe((expenses) => {
      const totalExpenses = expenses.map((exp) => +(exp.data?.amount || 0));
      this.totalExpenses = totalExpenses.reduce((acc, val) => acc + val, 0);

      this.ytdNet = this.total - (this.totalExpenses + this.totalCharges);
    });

    this.getYTDPayStubCalc();
  }

  onModalClose() {}

  onSubmit() {
    let loadnumbers!: string[];
    let dates!: string[];
    let from!: string[];
    let destination!: string[];
    let commission!: number[];
    let amount!: number[];

    this.loads$.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (loads) => {
        loadnumbers = loads.map((s) => s.data?.loadnumber) as string[];
        dates = loads.map((s) => s.data?.date) as string[];
        from = loads.map((s) => s.data?.from) as string[];
        destination = loads.map((s) => s.data?.destination) as string[];
        commission = loads.map((s) => s.data?.commPercentage) as number[];
        amount = loads.map((s) => s.data?.amount) as number[];
      },
    });
    const payload: PayStubSummary = {
      id: v4(),
      paystubDate: new Date(),
      loadnumbers: loadnumbers,
      dates: dates,
      from: from,
      destination: destination,
      commission: commission,
      amount: amount,
      totalAmount: this.total,
      totalCommission: this.totalCharges,
      totalExpense: this.totalExpenses,
      netAmount: this.total - (this.totalExpenses + this.totalCharges),
      status: 'Paid',
      driverId: this.driverId,
    };

    this.loadsService
      .addPayStub(payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          console.log('Successfully added a new record! ', res);
        },
      });

    this.downloadPayStupAsPdf();
  }

  private downloadPayStupAsPdf() {
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

  getYTDPayStubCalc() {
    this.loadsService
      .getPayStubYtdCalc(this.driverId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          const totalsArray = res.map((s) => s.data?.totalAmount);
          const netTotals = res.map((n) => n.data?.netAmount);
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth() + 1;

          for (let i = 0; i < 12; i++) {
            if (i < currentMonth) {
              this.ytdTotal += totalsArray[i] || 0;
              this.ytdNet += netTotals[i] || 0;
            }
          }
        },
      });
  }
}
