import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, Observable } from 'rxjs';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { Drivers } from '../models/driver.model';
import { Expenses } from '../models/expenses.model';
import { Loads } from '../models/loads.model';
import { ExpensesService } from '../services/expenses.service';
import { LoadsService } from '../services/loads.service';

@Component({
  selector: 'app-loads-list',
  templateUrl: './loads-list.component.html',
  styleUrls: ['./loads-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class LoadsListComponent implements OnInit {
  @Input() driver!: Drivers;
  selectedLoad!: HttpResponseObject<Loads>;
  @ViewChild('addExpenseModal') addExpenseModal!: TemplateRef<any>;

  constructor(
    public loadsService: LoadsService,
    private expensesService: ExpensesService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  displayedColumns: string[] = [
    'loadnumber',
    'date',
    'from',
    'destination',
    'commPercentage',
    'amount',
    'actions',
  ];

  expandedElement: Loads | null | undefined;

  loadsList$!: Observable<HttpResponseObject<Loads>[]>;
  expensesList$!: Observable<HttpResponseObject<Expenses>[]>;

  expensesByLoad$: Observable<{ [loadId: string]: Expenses[] }> = combineLatest(
    [this.loadsList$, this.expensesList$]
  ).pipe(
    map(([loads, expenses]) => {
      const expensesByLoad: { [loadId: string]: Expenses[] } = {};
      for (const load of loads) {
        expensesByLoad[load.data!.id] = expenses
          .map((expenseObj) => expenseObj.data!)
          .filter((expense) => expense.loadId === load.data!.id);
      }
      return expensesByLoad;
    })
  );

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const driverId = params.get('id');
      console.log('driverId: ', driverId);
      if (driverId) {
        this.loadsList$ = this.loadsService.getLoadsByDriver(driverId);
      }
    });
  }

  openDialog(): void {
    this.dialog.open(this.addExpenseModal, {
      width: '800px',
      height: '460px',
    });
  }

  onModalClose(): void {
    this.dialog.closeAll();
  }
  onLoadSelected(load: HttpResponseObject<Loads>) {
    this.selectedLoad = load;
    console.log('onloadsSelected:', this.selectedLoad.data?.id);
  }
}
