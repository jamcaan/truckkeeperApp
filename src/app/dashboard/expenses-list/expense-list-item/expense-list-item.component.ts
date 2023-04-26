import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  selectedExpense!: HttpResponseObject<Expenses>;

  @ViewChild('expenseEditModal') expenseEditModal!: TemplateRef<any>;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  editExpense(expense: HttpResponseObject<Expenses>) {
    this.selectedExpense = expense;
  }

  openDialog(): void {
    this.dialog.open(this.expenseEditModal, {
      width: '800px',
      height: '440px',
    });
  }

  onModalClose(): void {
    this.dialog.closeAll();
  }
}
