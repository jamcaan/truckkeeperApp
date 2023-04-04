import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { CustomFormatterService } from 'src/app/shared/customFormatter.service';
import { getCatergories } from 'src/app/shared/shared.data';
import { ExpensesCatergory } from 'src/app/shared/shared.model';
import { Expenses } from '../../models/expenses.model';
import { ExpensesService } from '../../services/expenses.service';

@Component({
  selector: 'app-edit-expense',
  templateUrl: './edit-expense.component.html',
  styleUrls: ['./edit-expense.component.scss'],
})
export class EditExpenseComponent implements OnInit {
  @Input() expense!: HttpResponseObject<Expenses>;

  editExpenseForm!: FormGroup;
  expensesCategory: ExpensesCatergory[] = [];

  constructor(
    private fb: FormBuilder,
    public customFormatterService: CustomFormatterService,
    private expenseService: ExpensesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.editExpenseForm = this.fb.group({
      amount: [
        '',
        [
          Validators.required,
          this.customFormatterService.customPatternValidator(
            /^\d+(\.\d+)?$/,
            'amount'
          ),
        ],
      ],
      description: ['', [Validators.maxLength(50)]],
      type: ['', [Validators.required]],
    });
    console.log('selected expense in edit expense component: ', this.expense);

    this.editExpenses(this.expense);

    this.getExpensesCategorty();
  }

  getExpensesCategorty() {
    this.expensesCategory = getCatergories();
  }

  onModalClose() {
    this.dialog.closeAll();
  }

  editExpenses(expense: HttpResponseObject<Expenses>) {
    this.editExpenseForm.setValue({
      amount: expense.data?.amount,
      type: expense.data?.type,
      description: expense.data?.description,
    });
  }

  onSubmit() {
    if (this.editExpenseForm.invalid) {
      return;
    }

    const payload: Expenses = {
      amount: this.editExpenseForm.get('amount')?.value,
      type: this.editExpenseForm.get('type')?.value,
      description: this.editExpenseForm.get('description')?.value,
    };

    this.expenseService.editExpense(payload, this.expense.data?.id).subscribe({
      next: () => {
        this.editExpenseForm.reset();
        this.dialog.closeAll();
      },
      error: (err) => {
        console.log('Unable to edit expense. Error occured.', err);
      },
      complete: () => {},
    });
  }
}
