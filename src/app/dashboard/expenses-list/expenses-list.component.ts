import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
  constructor() {}

  ngOnInit(): void {}
}
