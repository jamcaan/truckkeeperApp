import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { CustomFormatterService } from 'src/app/shared/customFormatter.service';
import { getStates } from 'src/app/shared/shared.data';
import { States } from 'src/app/shared/shared.model';
import { Drivers } from '../../models/driver.model';
import { DriverService } from '../../services/driver.service';

@Component({
  selector: 'app-edit-driver',
  templateUrl: './edit-driver.component.html',
  styleUrls: ['./edit-driver.component.scss'],
})
export class EditDriverComponent implements OnInit {
  @Input() driver!: Drivers;

  editDriverForm!: FormGroup;

  states: States[] = [];

  constructor(
    private fb: FormBuilder,
    public customFormatterService: CustomFormatterService,
    private driverService: DriverService,
    private dialog: MatDialog,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.editDriverForm = this.fb.group({
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

    this.editDriver(this.driver);
  }

  getStates() {
    this.states = getStates();
  }

  editDriver(driver: Drivers) {
    this.editDriverForm.get('stepOne')?.setValue({
      firstName: driver.firstName,
      lastName: driver.lastName,
      truckNumber: driver.truckNumber,
      licenseNo: driver.licenseNo,
      email: driver.email,
    }),
      this.editDriverForm.get('stepTwo')?.setValue({
        street: driver.address.street,
        city: driver.address.city,
        state: driver.address.state,
        zipCode: driver.address.zipCode,
        phoneNumber: driver.phoneNumber,
      });
  }

  onSubmit() {
    if (this.editDriverForm.invalid) {
      return;
    }

    const payload: Drivers = {
      firstName: this.editDriverForm?.get('stepOne')?.get('firstName')?.value,
      lastName: this.editDriverForm?.get('stepOne')?.get('lastName')?.value,
      truckNumber: this.editDriverForm?.get('stepOne')?.get('truckNumber')
        ?.value,
      licenseNo: this.editDriverForm?.get('stepOne')?.get('licenseNo')?.value,
      phoneNumber: this.editDriverForm?.get('stepTwo')?.get('phoneNumber')
        ?.value,
      email: this.editDriverForm?.get('stepOne')?.get('email')?.value,
      address: {
        street: this.editDriverForm?.get('stepTwo')?.get('street')?.value,
        state: this.editDriverForm?.get('stepTwo')?.get('state')?.value,
        city: this.editDriverForm?.get('stepTwo')?.get('city')?.value,
        zipCode: this.editDriverForm?.get('stepTwo')?.get('zipCode')?.value,
      },
    };
    this.driverService.editDriver(payload, this.driver?.id).subscribe({
      next: (response) => {
        console.log('driver updated successfuly!', response);
        this.editDriverForm.reset();
        this.dialog.closeAll();
      },
    });
  }

  onModalClose() {
    this.dialog.closeAll();
  }
}
