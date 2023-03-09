import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CustomFormatterService {
  constructor() {}

  //Validating controls and returnig custom messages
  validateControl(formGroupName: FormGroup, step: string, controlName: string) {
    const control = formGroupName?.get(step)?.get(controlName);
    if (control && !control?.valid && (control?.dirty || control?.touched)) {
      const errors = control.errors;
      let errorMessage = '';
      for (const errorNames in errors) {
        switch (errorNames) {
          case 'required':
            errorMessage = 'Field is required';
            break;
          case 'maxlength':
            errorMessage = `Field must be max of ${errors['maxlength'].requiredLength} characters long`;
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
            errorMessage = 'Field must be a valid email';
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
}
