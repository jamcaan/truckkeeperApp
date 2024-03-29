import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';
import { GeneralResponse, HttpResponseObject } from 'src/app/auth/models/auth.model';
import { environment } from 'src/environments/environment';
import { Loads, PayStubSummary } from '../models/loads.model';

@Injectable({
  providedIn: 'root',
})
export class LoadsService {
  public loadsList$ = new BehaviorSubject<Loads[]>([]);
  private payStub$ = new BehaviorSubject<PayStubSummary[]>([]);

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return headers;
  } // Will remove this later

   // Helper method to get HTTP headers with access token included
   private getHeaders2(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      });
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/json',
      });
    }
  }

  addLoad(loads: Loads): Observable<HttpResponseObject<Loads>> {
    const headers = this.getHeaders();
    return this.http
      .post<Loads>(`${environment.baseUrl}/loads`, loads, {
        headers: headers,
      })
      .pipe(
        map((data: Loads) => {
          const responseObject: HttpResponseObject<Loads> = {
            success: true,
            message: 'New Load added successfuly',
            data: data,
            status: 200,
          };
          if (responseObject.data)
            this.loadsList$.next([
              ...this.loadsList$.getValue(),
              responseObject.data,
            ]);
          return responseObject;
        }),
        catchError((error) => {
          const responseObject: HttpResponseObject<Loads> = {
            success: false,
            message: `Unable to add new load. Error occurred ${error}`,
            data: undefined,
            status: error.status,
          };
          return of(responseObject);
        })
      );
  }

  editLoad(
    load: Loads,
    loadId?: string
  ): Observable<HttpResponseObject<Loads>> {
    const headers = this.getHeaders();
    return this.http
      .patch<Loads>(`${environment.baseUrl}/loads/${loadId}`, load, {
        headers: headers,
      })
      .pipe(
        map((data: Loads) => {
          const responseObject: HttpResponseObject<Loads> = {
            success: true,
            message: 'Load edited successfuly',
            data: data,
            status: 200,
          };

          //updating the driversList$ with the new values
          if (responseObject.data) {
            const updatedList = this.loadsList$.getValue().map((d) => {
              if (d.id === responseObject.data?.id) {
                return responseObject.data;
              }
              return d;
            });
            this.loadsList$.next(updatedList as Loads[]);
          }
          return responseObject;
        }),
        catchError((error) => {
          const responseObject: HttpResponseObject<Loads> = {
            success: false,
            message: `Unable to edit load. Error occurred ${error}`,
            data: undefined,
            status: error.status,
          };
          return of(responseObject);
        })
      );
  }

  //revise the url for this method could be baseUrl}/loads?driverId=${driverId}
  // Will remove later when I finish all temp API replacements.
  getLoadsByDriver(driverId: string): Observable<HttpResponseObject<Loads>[]> {
    this.http
      .get<Loads[]>(`${environment.baseUrl}/drivers/${driverId}/loads`)
      .subscribe({
        next: (data: Loads[]) => {
          this.loadsList$.next(data);
        },
        error: (err) => {
          console.log('Error occurred while getting loads list:', err);
        },
        complete: () => {},
      });
    return this.loadsList$.asObservable().pipe(
      map((data: Loads[]) => {
        const responseObject: HttpResponseObject<Loads>[] = data.map((d) => ({
          success: true,
          message: 'Loads retrieved successfully',
          data: d,
          status: 200,
        }));
        return responseObject;
      }),
      catchError((error) => {
        console.log('Error occurred while getting loads list:', error);
        const responseObject: HttpResponseObject<Loads>[] = [
          {
            success: false,
            message: `Unable to retrieve loads. Error occurred ${error}`,
            data: undefined,
            status: error.status,
          },
        ];
        return of(responseObject);
      })
    );
  }

  getLoadsByDriver2(
    driverId: string
  ): Observable<GeneralResponse<Loads[]>> {
    const headers = this.getHeaders2(); // Retrieve headers with access token
    return this.http
      .get<GeneralResponse<Loads[]>>(
        `${environment.baseUrl}/loads/fetch-loads/${driverId}`,
        { headers }
      )
      .pipe(
        catchError((error) => {
          // Handle HTTP errors and return a consistent response structure
          const errorMessage = error.error?.message || 'Internal Server Error';
          const statusCode = error.status || HttpStatusCode.InternalServerError;
          return throwError({
            success: false,
            message: `Error: ${errorMessage}`,
            statusCode: statusCode,
            data: [],
          });
        }),
        map((response) => {
          // Update driversList$ if the request is successful
          if (response.success) {
            this.loadsList$.next(response?.data);
          }

          return response;
        })
      );
  }

  getAllLoads(): Observable<HttpResponseObject<Loads>[]> {
    this.http.get<Loads[]>(`${environment.baseUrl}/loads`).subscribe({
      next: (data: Loads[]) => {
        this.loadsList$.next(data);
      },
      error: (err) => {
        console.log('Error occurred while getting loads list:', err);
      },
      complete: () => {},
    });
    return this.loadsList$.asObservable().pipe(
      map((data: Loads[]) => {
        const responseObject: HttpResponseObject<Loads>[] = data.map((d) => ({
          success: true,
          message: 'Loads retrieved successfully',
          data: d,
          status: 200,
        }));
        return responseObject;
      }),
      catchError((error) => {
        console.log('Error occurred while getting loads list:', error);
        const responseObject: HttpResponseObject<Loads>[] = [
          {
            success: false,
            message: `Unable to retrieve loads. Error occurred ${error}`,
            data: undefined,
            status: error.status,
          },
        ];
        return of(responseObject);
      })
    );
  }

  getLoadsList(): Observable<HttpResponseObject<Loads[]>> {
    return this.loadsList$.asObservable().pipe(
      map((loads: Loads[]) => {
        return {
          success: true,
          message: 'Loads retrieved successfully',
          data: loads,
          status: 200,
        };
      })
    );
  }

  addPayStub(
    loadSummary: PayStubSummary
  ): Observable<HttpResponseObject<PayStubSummary>> {
    const headers = this.getHeaders();
    return this.http
      .post<PayStubSummary>(
        `${environment.baseUrl}/payStubSummary`,
        loadSummary,
        {
          headers: headers,
        }
      )
      .pipe(
        map((data: PayStubSummary) => {
          const responseObject: HttpResponseObject<PayStubSummary> = {
            success: true,
            message: 'New Load Summary added successfully.',
            data: data,
            status: 200,
          };
          if (responseObject.data) {
            this.payStub$.next([
              ...this.payStub$.getValue(),
              responseObject.data,
            ]);
          }
          return responseObject;
        }),
        catchError((error) => {
          const responseErrorObject: HttpResponseObject<PayStubSummary> = {
            success: false,
            message: `Unable to save new Load Summary record. Error occured. ${error}`,
            data: undefined,
            status: error.status,
          };
          return of(responseErrorObject);
        })
      );
  }

  getPayStubYtdCalc(
    driverId?: string
  ): Observable<HttpResponseObject<PayStubSummary>[]> {
    return this.http
      .get<PayStubSummary[]>(
        `${environment.baseUrl}/payStubSummary?driverId=${driverId}`
      )
      .pipe(
        map((data: PayStubSummary[]) => {
          const responseObject: HttpResponseObject<PayStubSummary>[] = data.map(
            (d) => ({
              success: true,
              message: 'Load Summary retrieved successfully',
              data: d,
              status: 200,
            })
          );
          this.payStub$.next(data); // update the BehaviorSubject with the HTTP response
          return responseObject;
        }),
        catchError((error) => {
          console.log('Error occurred while getting Load Summary list:', error);
          const responseObject: HttpResponseObject<PayStubSummary>[] = [
            {
              success: false,
              message: `Unable to retrieve Load Summary data. Error occurred ${error}`,
              data: undefined,
              status: error.status,
            },
          ];
          return of(responseObject);
        })
      );
  }
}
