import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, filter, take, throwError } from 'rxjs';
import { User } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import { UserStore } from '../user-store';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  userId: number = 1;
  username = '';
  password = '';

  constructor(
    public authService: AuthService,
    private route: Router,
    private userStore: UserStore
  ) {}

  ngOnInit(): void {}

  signin() {
    const credentials: User = {
      id: this.userId,
      username: this.username,
      password: this.password,
    };
    this.authService.signin(credentials, this.userId);
    this.authService.isAuthenticated
      .pipe(
        filter((loggedIn) => loggedIn),
        take(1),
        catchError((error) => {
          return throwError(() => new Error(error));
        })
      )
      .subscribe(() => {
        this.route.navigate(['/dashboard']);
      });
  }
}
