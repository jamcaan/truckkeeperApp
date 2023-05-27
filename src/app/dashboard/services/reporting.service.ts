import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PayStubSummary } from '../models/loads.model';
import { environment } from 'src/environments/environment';
import { HttpResponseObject } from 'src/app/auth/models/auth.model';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportingService {
  constructor(private http: HttpClient) {}

  private getHeaders() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  getPayStub(): Observable<HttpResponseObject<PayStubSummary>[]> {
    return this.http
      .get<PayStubSummary[]>(`${environment.baseUrl}/payStubSummary`)
      .pipe(
        map((data: PayStubSummary[]) => {
          const responseObject: HttpResponseObject<PayStubSummary>[] = data.map(
            (d) => ({
              success: true,
              message: 'Pay Stub retrieved successfully',
              data: d,
              status: 200,
            })
          );
          return responseObject;
        }),
        catchError((error) => {
          const responseObject: HttpResponseObject<PayStubSummary>[] = [
            {
              success: false,
              message: `Unable to retrieve Load Pay Stub data. Error occurred ${error}`,
              data: undefined,
              status: error.status,
            },
          ];
          return of(responseObject);
        })
      );
  }
}
