import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { CustomFormatterService } from 'src/app/shared/customFormatter.service';
import { getCatergories } from 'src/app/shared/shared.data';
import { ExpensesCatergory } from 'src/app/shared/shared.model';
import { v4 } from 'uuid';
import { Expenses } from '../../models/expenses.model';
import { Loads } from '../../models/loads.model';
import { ExpensesService } from '../../services/expenses.service';

@Component({
  selector: 'app-add-expenses',
  templateUrl: './add-expenses.component.html',
  styleUrls: ['./add-expenses.component.scss'],
})
export class AddExpensesComponent implements OnInit {
  @Input() loads!: HttpResponseObject<Loads>;

  addExpenseForm!: FormGroup;

  expensesCategory: ExpensesCatergory[] = [];
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private expensesService: ExpensesService,
    public customFormatterService: CustomFormatterService
  ) {}

  onModalClose(): void {
    this.dialog.closeAll();
  }

  ngOnInit(): void {
    this.addExpenseForm = this.fb.group({
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

    this.getExpensesCategorty();
  }

  newExpensesAdded() {
    if (this.addExpenseForm.invalid) {
      return;
    }
    const payload: Expenses = {
      id: v4(),
      amount: this.addExpenseForm.get('amount')?.value,
      type: this.addExpenseForm.get('type')?.value,
      description: this.addExpenseForm.get('description')?.value,
      loadId: this.loads.data?.id,
      loadNo: this.loads.data?.loadnumber,
    };

    this.expensesService.addNewExpense(payload).subscribe({
      next: (response) => {
        console.log('successfully added new expense record!', response);
        this.addExpenseForm.reset();
        this.dialog.closeAll();
      },
      error: (err)=> {
        console.log('Un able to add new expense record. ', err)
      },
      complete: ()=> {}
    });

  }

  getExpensesCategorty() {
    this.expensesCategory = getCatergories();
  }
}
