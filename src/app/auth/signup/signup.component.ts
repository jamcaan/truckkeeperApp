import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupForm?: FormGroup;
  currentStep: number = 0;
  hide = true;

  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.signupForm = this.fb.group({
      stepOne: this.fb.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        companyName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required, Validators.pattern]],
      }),
      stepTwo: this.fb.group({
        address: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        zipCode: ['', [Validators.required]],
      }),
      stepThree: this.fb.group(
        {
          username: ['', [Validators.required]],
          password: ['', [Validators.required]],
          confirmPassword: ['', [Validators.required]],
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

    console.log('Form values: ', this.signupForm?.value)
    //TODO: Submission API
  }
}
