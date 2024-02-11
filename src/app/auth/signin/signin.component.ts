import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpLoginResponse } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import { Unsub } from 'src/app/unsub.class';
import { takeUntil } from 'rxjs';
import { Credentials } from '../models/auth.model';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent extends Unsub implements OnInit {
  hide = true;
  loginForm?: FormGroup;

  constructor(
    public authService: AuthService,
    private route: Router,
    private fb: FormBuilder
  ) {
    super();
  }
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.maxLength(25),
          Validators.minLength(4),
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
    });
  }

  signin() {
    if (!this.loginForm?.valid) {
      return;
    }

    const credentials: Credentials = {
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value,
    };

    this.authService
      .signin(credentials)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: HttpLoginResponse) => {
          console.log('response: ', response);
          if (response.success) {
            this.route.navigate(['/dashboard']);
          } else {
            console.log('Sign-in failed:', response.message);
            // Handle other cases where sign-in might fail
          }
        },
        error: (error: any) => {
          console.error('Error during sign-in:', error);
          // Handle other types of errors, if needed
        },
        complete: () => {
          // Optional complete callback
        },
      });
  }

  validateControl(controlName: string) {
    const control = this.loginForm?.get(controlName);
    if (control && !control.valid && (control?.dirty || control?.touched)) {
      const errors = control.errors;
      let errorMessage = '';
      for (const errorNames in errors) {
        switch (errorNames) {
          case 'required':
            errorMessage = 'Field is required';
            break;
          case 'maxlength':
            errorMessage = `Field must be at max of ${errors['maxlength'].requiredLength} characters long`;
            break;
          case 'minlength':
            errorMessage = `Field must be at least ${errors['minlength'].requiredLength} characters long`;
            break;
          default:
            return '';
        }
      }
      return errorMessage;
    }
    return '';
  }
}
