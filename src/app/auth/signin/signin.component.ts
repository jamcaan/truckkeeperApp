import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import { UserStore } from '../user-store';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  userId: string = 'e3f7fd6e-d9ae-46fd-8282-272f112e08eb';
  hide = true;

  loginForm?: FormGroup;

  constructor(
    public authService: AuthService,
    private route: Router,
    private userStore: UserStore,
    private fb: FormBuilder
  ) {}

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
    const credentials: Partial<User> = {
      id: this.userId,
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value,
    };
    this.authService.signin(credentials, this.userId).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Succesfully singed in', response);
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
    // this.authService.isAuthenticated
    //   .pipe(
    //     filter((loggedIn) => loggedIn),
    //     take(1),
    //     catchError((error) => {
    //       return throwError(() => new Error(error));
    //     })
    //   )
    //   .subscribe(() => {
    //     this.route.navigate(['/dashboard']);
    //   });
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
