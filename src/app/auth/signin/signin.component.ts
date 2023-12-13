import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import { UserStore } from '../user-store';
import { Unsub } from 'src/app/unsub.class';
import { takeUntil } from 'rxjs';

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

    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    this.authService
      .getAllUsers()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (users) => {
          const matchingUser = users.find(
            (user) =>
              user.data?.username === username &&
              user.data?.password === password
          );
          if (matchingUser) {
            const credentials: Partial<User> = {
              id: matchingUser.data?.id,
              username: matchingUser.data?.username,
              password: matchingUser.data?.password,
            };

            this.authService
              .signin(credentials, matchingUser.data?.id)
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe({
                next: (response) => {
                  if (response.success) {
                    this.route.navigate(['/dashboard']);
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
