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

  // addNewExpense(expense: Expenses): Observable<Expenses> {
  //   const headers = this.getHeaders();
  //   return this.http.post<Expenses>(
  //     `${environment.baseUrl}/expenses`,
  //     expense,
  //     { headers: headers }
  //   );
  // }


  addNewExpense(expense: Expenses): Observable<HttpResponseObject<Expenses>> {
    const headers = this.getHeaders();
    return this.http.post<Expenses>(
      `${environment.baseUrl}/expenses`,
      expense,
      { headers: headers }
    ).pipe(
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

}