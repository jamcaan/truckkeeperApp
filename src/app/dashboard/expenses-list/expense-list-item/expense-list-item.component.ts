import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { Expenses } from '../../models/expenses.model';

@Component({
  selector: 'app-expense-list-item',
  templateUrl: './expense-list-item.component.html',
  styleUrls: ['./expense-list-item.component.scss'],
})
export class ExpenseListItemComponent implements OnInit {
  @Input() expensesList$!: Observable<HttpResponseObject<Expenses>[]>;

  constructor() {}

  ngOnInit(): void {}
}
