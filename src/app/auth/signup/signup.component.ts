import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { getStates } from 'src/app/shared/shared.data';
import { States } from 'src/app/shared/shared.model';
import { User } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import { v4 } from 'uuid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupForm?: FormGroup;
  currentStep: number = 0;
  hide = true;
  states: States[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: Router
  ) {}
  ngOnInit(): void {
    this.signupForm = this.fb.group({
      stepOne: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required]],
        companyName: ['', [Validators.required]],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            this.customPatternValidator(
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              'invalidEmail'
            ),
          ],
        ],
        phoneNumber: [
          '',
          [
            Validators.required,
            this.customPatternValidator(/^\(\d{3}\) \d{3}-\d{4}$/, 'phone'),
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
            this.customPatternValidator(/^[0-9]+$/, 'zipCode'),
            Validators.minLength(5),
            Validators.maxLength(5),
          ],
        ],
      }),
      stepThree: this.fb.group(
        {
          username: [
            '',
            [
              Validators.required,
              Validators.minLength(4),
              Validators.maxLength(25),
            ],
          ],
          password: [
            '',
            [
              Validators.required,
              Validators.minLength(8),
              Validators.maxLength(16),
            ],
          ],
          confirmPassword: [
            '',
            [
              Validators.required,
              Validators.minLength(8),
              Validators.maxLength(16),
            ],
          ],
        },
        { validator: this.matchPassword }
      ),
    });

    this.getStates();
  }

  matchPassword(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword
      ? null
      : group.get('confirmPassword')?.setErrors({ passwordsNotMatched: true });
  }


  signup() {
    if (!this.signupForm?.valid) {
      return;
    }
    const payload: User = {
      id: v4(),
      role: 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
      firstName: this.signupForm?.get('stepOne')?.get('firstName')?.value,
      lastName: this.signupForm?.get('stepOne')?.get('lastName')?.value,
      companyName: this.signupForm?.get('stepOne')?.get('companyName')?.value,
      phoneNumber: this.signupForm?.get('stepOne')?.get('phoneNumber')?.value,
      email: this.signupForm?.get('stepOne')?.get('email')?.value,
      address: {
        street: this.signupForm?.get('stepTwo')?.get('street')?.value,
        city: this.signupForm?.get('stepTwo')?.get('city')?.value,
        state: this.signupForm?.get('stepTwo')?.get('state')?.value,
        zipCode: this.signupForm?.get('stepTwo')?.get('zipCode')?.value,
      },
      username: this.signupForm?.get('stepThree')?.get('username')?.value,
      password: this.signupForm?.get('stepThree')?.get('password')?.value,
      active: true,
    };
    this.authService.signup(payload).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Saved successfuly!', response);
          this.route.navigate(['/signin']);
        } else {
          console.log(response.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {},
    });
  }

  //Validating controls and returnig custom messages
  validateControl(step: string, controlName: string) {
    const control = this.signupForm?.get(step)?.get(controlName);
    if (control && !control?.valid && (control?.dirty || control?.touched)) {
      const errors = control.errors;
      let errorMessage = '';
      for (const errorNames in errors) {
        switch (errorNames) {
          case 'required':
            errorMessage = 'Field is required';
            break;
          case 'maxlength':
            errorMessage = `Field must be at the max of ${errors['maxlength'].requiredLength} characters long`;
            break;
          case 'minlength':
            errorMessage = `Field must be at least ${errors['minlength'].requiredLength} characters long`;
            break;
          case 'email':
            errorMessage = `Field must be a valid email`;
            break;
          case 'phone':
            errorMessage = 'Phone numbers must be 10 digits long';
            break;
          case 'zipCode':
            errorMessage = 'ZipCode numbers must be digits only';
            break;
          case 'passwordsNotMatched':
            errorMessage = 'Passwords must match';
            break;
          case 'invalidEmail':
            errorMessage = 'Email still not valid';
            break;

          default:
            return '';
        }
      }
      return errorMessage;
    }
    return '';
  }

  //Can validate any pattern any field
  customPatternValidator(regex: RegExp, errorKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return { required: true };
      }
      if (!regex.test(value)) {
        const error = {} as ValidationErrors;
        error[errorKey] = true;
        return error;
      }
      return null;
    };
  }

  //It can mask any type of text not only phone. Will be renaming this method accordingly
  maskPhone(value: string): string {
    const numbers = value.toString().replace(/\D/g, '');
    const format = {
      0: '(',
      3: ') ',
      6: '-',
    } as { [key: number]: string };
    let maskedNumber = '';

    for (let i = 0; i < numbers.length; i++) {
      maskedNumber += (format[i] || '') + numbers[i];
    }

    return maskedNumber;
  }

  //displaying the maksed value on the input on (keydown) event
  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = this.maskPhone(input.value);
  }

  getStates() {
    this.states = getStates();
  }
}
