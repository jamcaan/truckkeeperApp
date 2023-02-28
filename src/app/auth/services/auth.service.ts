import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/auth.model';
import { UserStore } from '../user-store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly loggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private userStore: UserStore) {}

  get isAuthenticated() {
    return this.loggedIn$.asObservable();
  }

  private getHeaders() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  signin(credentials: User, id: number) {
    const headers = this.getHeaders();
    this.http
      .patch<User>(`${environment.baseUrl}/users/${id}`, credentials, {
        headers,
      })
      .pipe(
        tap((users) => {
          return this.userStore.update([users]);
        }),
        catchError((error) => {
          console.log('error: ', error);
          return throwError(() => new Error(JSON.stringify(error)));
        })
      )
      .subscribe({
        next: (val) => {
          this.loggedIn$.next(true);
        },
        complete: () => {},
      });
    return;
  }

  signout() {
    return this.http.post(`${environment.baseUrl}/signout`, {}).subscribe({
      next: () => {
        this.loggedIn$.next(false);
      },
      complete: () => {},
      error: () => {
        this.loggedIn$.next(false);
      },
    });
  }
}
