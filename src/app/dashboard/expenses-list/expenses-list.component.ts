import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { Expenses } from '../models/expenses.model';
import { Loads } from '../models/loads.model';
import { ExpensesService } from '../services/expenses.service';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss'],
})
export class ExpensesListComponent implements OnInit {
  @Input() loads!: HttpResponseObject<Loads>;
  expensesList$!: Observable<HttpResponseObject<Expenses>[]>;

  constructor(private expensesService: ExpensesService) {}

  ngOnInit(): void {
    this.getExpensesByLoad();
  }

  getExpensesByLoad() {
    this.expensesList$ = this.expensesService.getExpensesByLoad(
      this.loads.data?.id
    );
    // .subscribe({
    //   next: (res)=> {
    //     console.log('response expenses by load: ', res)
    //   }
    // })
  }
}
