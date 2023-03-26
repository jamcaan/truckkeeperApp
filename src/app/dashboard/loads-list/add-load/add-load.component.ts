import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CustomFormatterService } from 'src/app/shared/customFormatter.service';
import { getCommission, getStates } from 'src/app/shared/shared.data';
import { Commission, States } from 'src/app/shared/shared.model';
import { v4 } from 'uuid';
import { Drivers } from '../../models/driver.model';
import { Loads } from '../../models/loads.model';
import { LoadsService } from '../../services/loads.service';

@Component({
  selector: 'app-add-load',
  templateUrl: './add-load.component.html',
  styleUrls: ['./add-load.component.scss'],
})
export class AddLoadComponent implements OnInit {
  addLoadForm!: FormGroup;
  states: States[] = [];
  commision: Commission[] = [];

  @Input() driver!: Drivers;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private loadService: LoadsService,
    public customFormatterService: CustomFormatterService
  ) {}
  ngOnInit(): void {
    this.addLoadForm = this.fb.group({
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

  addLoad() {
    if (this.addLoadForm.invalid) {
      return;
    }

    const payload: Loads = {
      id: v4(),
      loadnumber: this.addLoadForm?.get('loadnumber')?.value,
      date: this.addLoadForm?.get('date')?.value,
      from: this.addLoadForm?.get('from')?.value,
      destination: this.addLoadForm?.get('destination')?.value,
      commPercentage: this.addLoadForm?.get('commPercentage')?.value,
      amount: this.addLoadForm?.get('amount')?.value,
      driverId: this.driver.id,
    };

    this.loadService.addLoad(payload).subscribe({
      next: (response) => {
        console.log('Load added sucessfully! ', response);
        this.addLoadForm.reset();
        this.onModalClose();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {},
    });
  }
}
