import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { map, of } from 'rxjs';
import { CustomFormatterService } from 'src/app/shared/customFormatter.service';
import { getStates } from 'src/app/shared/shared.data';
import { States } from 'src/app/shared/shared.model';
import { v4 } from 'uuid';
import { Drivers } from '../../models/driver.model';
import { DriverService } from '../../services/driver.service';

@Component({
  selector: 'app-add-new-driver',
  templateUrl: './add-new-driver.component.html',
  styleUrls: ['./add-new-driver.component.scss'],
})
export class AddNewDriverComponent implements OnInit {
  constructor(
    private driverService: DriverService,
    private fb: FormBuilder,
    public customFormatterService: CustomFormatterService,
    private dialog: MatDialog
  ) {}
  private readonly currentUser!: string;

  addDriverForm: FormGroup | undefined;
  states: States[] = [];
  @Output() addNewDriverSubmitted = new EventEmitter<any>();

  ngOnInit(): void {
    this.addDriverForm = this.fb.group({
      stepOne: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required]],
        truckNumber: ['', [Validators.required]],
        licenseNo: ['', [Validators.required]],

        email: [
          '',
          [
            Validators.required,
            Validators.email,
            this.customFormatterService.customPatternValidator(
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              'invalidEmail'
            ),
          ],
        ],
      }),
      stepTwo: this.fb.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        zipCode: [
          '',
          [
            Validators.required,
            this.customFormatterService.customPatternValidator(
              /^[0-9]+$/,
              'zipCode'
            ),
            Validators.minLength(5),
            Validators.maxLength(5),
          ],
        ],
        phoneNumber: [
          '',
          [
            Validators.required,
            this.customFormatterService.customPatternValidator(
              /^\(\d{3}\) \d{3}-\d{4}$/,
              'phone'
            ),
          ],
        ],
      }),
    });

    this.getStates();
  }

  getStates() {
    this.states = getStates();
  }

  onSubmit() {
    const test = JSON.parse(sessionStorage.getItem('currentUser')!);

    if (!this.addDriverForm?.valid) {
      return;
    }
    const payload: Drivers = {
      id: v4(),
      firstName: this.addDriverForm?.get('stepOne')?.get('firstName')?.value,
      lastName: this.addDriverForm?.get('stepOne')?.get('lastName')?.value,
      truckNumber: this.addDriverForm?.get('stepOne')?.get('truckNumber')
        ?.value,
      licenseNo: this.addDriverForm?.get('stepOne')?.get('licenseNo')?.value,
      phoneNumber: this.addDriverForm?.get('stepTwo')?.get('phoneNumber')
        ?.value,
      email: this.addDriverForm?.get('stepOne')?.get('email')?.value,
      address: {
        street: this.addDriverForm?.get('stepTwo')?.get('street')?.value,
        state: this.addDriverForm?.get('stepTwo')?.get('state')?.value,
        city: this.addDriverForm?.get('stepTwo')?.get('city')?.value,
        zipCode: this.addDriverForm?.get('stepTwo')?.get('zipCode')?.value,
      },
      active: true,
      userId: test.ids[0],
    };

    this.driverService.addDriver(payload).subscribe();
    console.log('This AddDriverForm values are: ', payload);
    this.addDriverForm.reset();
    this.dialog.closeAll();
  }

  onModalClose(): void {
    this.dialog.closeAll();
  }
}
