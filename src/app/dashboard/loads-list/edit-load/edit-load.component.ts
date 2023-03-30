import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { CustomFormatterService } from 'src/app/shared/customFormatter.service';
import { getStates, getCommission } from 'src/app/shared/shared.data';
import { States, Commission } from 'src/app/shared/shared.model';
import { Loads } from '../../models/loads.model';
import { LoadsService } from '../../services/loads.service';

@Component({
  selector: 'app-edit-load',
  templateUrl: './edit-load.component.html',
  styleUrls: ['./edit-load.component.scss'],
})
export class EditLoadComponent implements OnInit {
  @Input() loads!: HttpResponseObject<Loads>;

  editLoadForm!: FormGroup;

  states: States[] = [];
  commision: Commission[] = [];

  constructor(
    private fb: FormBuilder,
    public customFormatterService: CustomFormatterService,
    private loadService: LoadsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.editLoadForm = this.fb.group({
      loadnumber: ['', [Validators.required]],
      date: [new Date(), [Validators.required]],
      from: ['', [Validators.required]],
      destination: ['', [Validators.required]],
      commPercentage: ['', [Validators.required]],
      amount: [
        '',
        [
          Validators.required,
          this.customFormatterService.customPatternValidator(
            /^\d+(\.\d+)?$/, //Best pattern for ensuring everything is number even after the (.)
            'amount'
          ),
        ],
      ],
    });

    this.getStates();
    this.getCommision();

    this.editLoad(this.loads.data as Loads);
  }

  getStates() {
    this.states = getStates();
  }

  getCommision() {
    this.commision = getCommission();
  }

  onModalClose() {
    this.dialog.closeAll();
  }

  editLoad(load: Loads) {
    this.editLoadForm.setValue({
      loadnumber: load.loadnumber,
      date: load.date,
      from: load.from,
      destination: load.destination,
      commPercentage: load.commPercentage,
      amount: load.amount,
    });
  }

  onSubmit() {
    if (this.editLoadForm.invalid) {
      return;
    }

    const payload: Loads = {
      loadnumber: this.editLoadForm?.get('loadnumber')?.value,
      date: this.editLoadForm?.get('date')?.value,
      from: this.editLoadForm?.get('from')?.value,
      destination: this.editLoadForm?.get('destination')?.value,
      commPercentage: this.editLoadForm?.get('commPercentage')?.value,
      amount: this.editLoadForm?.get('amount')?.value,
    };
    this.loadService.editLoad(payload, this.loads.data?.id).subscribe({
      next: (response) => {
        console.log('updated successfully!', response);
        this.editLoadForm.reset();
        this.dialog.closeAll();
      },
    });
  }
}
