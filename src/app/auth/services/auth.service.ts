import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Credentials,
  HttpLoginResponse,
  HttpResponseObject,
  User,
} from '../models/auth.model';
import { CurrentUser, UserStore } from '../user-store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly loggedIn$ = new BehaviorSubject<boolean>(false);
  private readonly usersList$ = new BehaviorSubject<User[]>([]);

  constructor(private http: HttpClient, private userStore: UserStore) {}

  get isAuthenticated() {
    return this.loggedIn$.asObservable();
  }

  get usersData() {
    return this.usersList$.asObservable();
  }

  private getHeaders() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  getAllUsers(): Observable<HttpResponseObject<User>[]> {
    return this.http.get<User[]>(`${environment.baseUrl}/users`).pipe(
      map((data: User[]) => {
        const responseObject: HttpResponseObject<User>[] = data.map((d) => ({
          success: true,
          message: 'Users retrieved successfully',
          data: d,
          status: 200,
        }));
        this.usersList$.next(data); // update the BehaviorSubject with the HTTP response
        return responseObject;
      }),
      catchError((error) => {
        console.log('Error occurred while getting Users list:', error);
        const responseObject: HttpResponseObject<User>[] = [
          {
            success: false,
            message: `Unable to retrieve Users. Error occurred ${error}`,
            data: undefined,
            status: error.status,
          },
        ];
        return of(responseObject);
      })
    );
  }

  signin(credentials: Credentials): Observable<HttpLoginResponse> {
    const headers = this.getHeaders();
    return this.http
      .post<HttpLoginResponse>(
        `${environment.baseUrl}/auth/signin`,
        credentials,
        { headers: headers }
      )
      .pipe(
        map((response) => {
          const sanitizeUser: Partial<CurrentUser> = {
            id: response.userId,
          };
          this.userStore.update([sanitizeUser] as CurrentUser[]);
          return response;
        }),
        catchError((error) => {
          if (error.status === 401) {
            // Unauthorized error (invalid username or password)
            return throwError(() => ({
              success: error.success,
              message: error.message,
            }));
          } else if (error.status === 400) {
            // Bad request error (invalid input data)
            return throwError(() => ({
              success: error.success,
              message: error.message,
            }));
          } else {
            // Other errors
            return throwError(() => ({
              success: error.success,
              message: error.message,
            }));
          }
        })
      );
    // .pipe(
    //   map((data: User) => {
    //     // Store user data in sessionStorage
    //     sessionStorage.setItem('user', JSON.stringify(data));
    //   }),

    // );
  }

  signup(user: User): Observable<HttpResponseObject<User>> {
    const headers = this.getHeaders();
    return this.http
      .post<User>(`${environment.baseUrl}/users`, user, { headers: headers })
      .pipe(
        map((data: User) => {
          const responseObject: HttpResponseObject<User> = {
            success: true,
            message: 'New user added successfully!',
            data: data,
            status: 200,
          };
          this.usersList$.next([...this.usersList$.getValue(), data]);
          return responseObject;
        }),
        catchError((error) => {
          const responseObject: HttpResponseObject<User> = {
            success: false,
            message: `Unable to create a new user. Error occured: ${error}`,
            data: undefined,
            status: error.status,
          };
          return of(responseObject);
        })
      );
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
