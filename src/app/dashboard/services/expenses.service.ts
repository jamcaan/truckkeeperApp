import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { environment } from 'src/environments/environment';
import { Expenses } from '../models/expenses.model';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  public expensesList$ = new BehaviorSubject<Expenses[]>([]);

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  addNewExpense(expense: Expenses): Observable<HttpResponseObject<Expenses>> {
    const headers = this.getHeaders();
    return this.http
      .post<Expenses>(`${environment.baseUrl}/expenses`, expense, {
        headers: headers,
      })
      .pipe(
        map((data: Expenses) => {
          const responseObject: HttpResponseObject<Expenses> = {
            success: true,
            message: 'New Expenses added successfuly',
            data: data,
            status: 200,
          };
          if (responseObject.data)
            this.expensesList$.next([
              ...this.expensesList$.getValue(),
              responseObject.data,
            ]);
          return responseObject;
        }),
        catchError((error) => {
          const responseObject: HttpResponseObject<Expenses> = {
            success: false,
            message: `Unable to add new expense record. Error occurred ${error}`,
            data: undefined,
            status: error.status,
          };
          return of(responseObject);
        })
      );
  }

  editExpense(
    expense: Expenses,
    expenseId?: string | undefined
  ): Observable<HttpResponseObject<Expenses>> {
    const headers = this.getHeaders();
    return this.http
      .patch<Expenses>(
        `${environment.baseUrl}/expenses/${expenseId}`,
        expense,
        {
          headers: headers,
        }
      )
      .pipe(
        map((data: Expenses) => {
          const responseObject: HttpResponseObject<Expenses> = {
            success: true,
            message: 'Expense edited successfuly',
            data: data,
            status: 200,
          };
          if (responseObject.data) {
            const updatedList = this.expensesList$.getValue().map((d) => {
              if (d.id === responseObject.data?.id) {
                return responseObject.data;
              }
              return d;
            });
            this.expensesList$.next(updatedList as Expenses[]);
          }
          return responseObject;
        }),
        catchError((error) => {
          const responseObject: HttpResponseObject<Expenses> = {
            success: false,
            message: `Unable to edit expenses. Error occurred ${error}`,
            data: undefined,
            status: error.status,
          };
          return of(responseObject);
        })
      );
  }

  getExpensesByLoad(
    loadId?: string
  ): Observable<HttpResponseObject<Expenses>[]> {
    this.http
      .get<Expenses[]>(`${environment.baseUrl}/expenses?loadId=${loadId}`)
      .subscribe({
        next: (data: Expenses[]) => {
          this.expensesList$.next(data);
        },
        complete: () => {},
      });
    return this.expensesList$.asObservable().pipe(
      map((data: Expenses[]) => {
        const responseObject: HttpResponseObject<Expenses>[] = data.map(
          (d) => ({
            success: true,
            message: 'Expenses retrieved successfully',
            data: d,
            status: 200,
          })
        );
        return responseObject;
      }),
      catchError((error) => {
        console.log('Error occurred while getting expenses list:', error);
        const responseObject: HttpResponseObject<Expenses>[] = [
          {
            success: false,
            message: `Unable to retrieve expenses. Error occurred ${error}`,
            data: undefined,
            status: error.status,
          },
        ];
        return of(responseObject);
      })
    );
  }

  getExpensesByDriver(
    driverId?: string
  ): Observable<HttpResponseObject<Expenses>[]> {
    return this.http
      .get<Expenses[]>(`${environment.baseUrl}/expenses?driverId=${driverId}`)
      .pipe(
        map((data: Expenses[]) => {
          const responseObject: HttpResponseObject<Expenses>[] = data.map(
            (d) => ({
              success: true,
              message: 'Expenses by Driver retrieved successfully',
              data: d,
              status: 200,
            })
          );
          this.expensesList$.next(data); // update the BehaviorSubject with the HTTP response
          return responseObject;
        }),
        catchError((error) => {
          console.log('Error occurred while getting expenses list:', error);
          const responseObject: HttpResponseObject<Expenses>[] = [
            {
              success: false,
              message: `Unable to retrieve driver expenses. Error occurred ${error}`,
              data: undefined,
              status: error.status,
            },
          ];
          return of(responseObject);
        })
      );
  }

  getExpensesList(): Observable<HttpResponseObject<Expenses[]>> {
    return this.expensesList$.asObservable().pipe(
      map((expense: Expenses[]) => {
        return {
          success: true,
          message: 'Expenses retrieved successfully',
          data: expense,
          status: 200,
        };
      })
    );
  }
}
