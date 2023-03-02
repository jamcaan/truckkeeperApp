import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupForm?: FormGroup;
  currentStep: number = 0;
  hide = true;
  readonly phoneNumber: string = '';

  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.signupForm = this.fb.group({
      stepOne: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required]],
        companyName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: [
          '',
          [
            Validators.required,
            this.customPatternValidator(/^\(\d{3}\) \d{3}-\d{4}$/),
          ],
        ],
      }),
      stepTwo: this.fb.group({
        address: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        zipCode: [
          '',
          [
            Validators.required,
            this.customPatternValidator(/^[0-9]+$/),
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
  }

  matchPassword(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsNotMatched: true };
  }

  get stepForm(): FormArray {
    return this.signupForm?.get('stepForms') as FormArray;
  }

  nextStep() {
    const currentStepForm = this.signupForm?.get(
      `step${this.currentStep}`
    ) as FormGroup;
    if (currentStepForm.valid) {
      this.currentStep++;
    }
  }

  previousStep() {
    this.currentStep--;
  }

  submit() {
    if (!this.signupForm?.invalid) {
      return;
    }

    console.log('Form values: ', this.signupForm?.value);
    //TODO: Submission API
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
          default:
            return '';
        }
      }
      return errorMessage;
    }
    return '';
  }

  //Validating phone number in this format (xxx) xxx-xxxx
  customPatternValidator(phoneRegex: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return { required: true };
      }
      if (!phoneRegex.test(value)) {
        return { phone: true } || { zipCode: true };
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
}
