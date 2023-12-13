import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpResponseObject, User } from '../models/auth.model';
import { UserStore } from '../user-store';

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
            message: `Unable to retrieve driver Users. Error occurred ${error}`,
            data: undefined,
            status: error.status,
          },
        ];
        return of(responseObject);
      })
    );
  }

  signin(
    credentials: Partial<User>,
    id: string | undefined
  ): Observable<HttpResponseObject<User>> {
    const headers = this.getHeaders();

    return this.http
      .patch<User>(`${environment.baseUrl}/users/${id}`, credentials, {
        headers,
      })
      .pipe(
        map((data: User) => {
          this.loggedIn$.next(true);

          //Store the user in the sessionStorage and
          // Remove the sensive data from the list
          const sanitizeUser: Partial<User> = {
            id: data.id,
          };
          this.userStore.update([sanitizeUser] as User[]);

          const responseObject: HttpResponseObject<User> = {
            success: true,
            message: 'User signed in successfully!',
            data: data,
            status: 200,
          };
          return responseObject;
        }),
        catchError((error) => {
          const responseObject: HttpResponseObject<User> = {
            success: false,
            message: `Unable to sign in. Error occurred: ${error.message}`,
            data: undefined,
            status: error.status,
          };
          return of(responseObject);
        })
      );
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
