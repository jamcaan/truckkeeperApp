import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  throwError,
} from 'rxjs';
import {
  GeneralResponse,
  HttpResponseObject,
} from 'src/app/auth/models/auth.model';
import { Drivers } from '../models/driver.model';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  public driversList$ = new BehaviorSubject<Drivers[]>([]);

  public driversList2$ = new BehaviorSubject<GeneralResponse<Drivers>[]>([]);

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return headers;
  }

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

  addDriver(driver: Drivers): Observable<HttpResponseObject<Drivers>> {
    const headers = this.getHeaders();
    return this.http
      .post<Drivers>(`${environment.baseUrl}/drivers`, driver, {
        headers: headers,
      })
      .pipe(
        map((data: Drivers) => {
          const responseObject: HttpResponseObject<Drivers> = {
            success: true,
            message: 'New Driver added successfuly',
            data: data,
            status: 200,
          };
          if (responseObject.data)
            this.driversList$.next([
              ...this.driversList$.getValue(),
              responseObject.data,
            ]);
          return responseObject;
        }),
        catchError((error) => {
          const responseObject: HttpResponseObject<Drivers> = {
            success: false,
            message: `Unable to add new driver. Error occurred ${error}`,
            data: undefined,
            status: error.status,
          };
          return of(responseObject);
        })
      );
  }

  editDriver(
    driver: Drivers,
    driverId?: string
  ): Observable<HttpResponseObject<Drivers>> {
    const headers = this.getHeaders();
    return this.http
      .patch<Drivers>(`${environment.baseUrl}/drivers/${driverId}`, driver, {
        headers: headers,
      })
      .pipe(
        map((data: Drivers) => {
          const responseObject: HttpResponseObject<Drivers> = {
            success: true,
            message: 'Driver edited successfuly',
            data: data,
            status: 200,
          };

          //updating the driversList$ with the new values
          if (responseObject.data) {
            const updatedList = this.driversList$.getValue().map((d) => {
              if (d.id === responseObject.data?.id) {
                return responseObject.data;
              }
              return d;
            });
            this.driversList$.next(updatedList as Drivers[]);
          }
          return responseObject;
        }),
        catchError((error) => {
          const responseObject: HttpResponseObject<Drivers> = {
            success: false,
            message: `Unable to edit driver. Error occurred ${error}`,
            data: undefined,
            status: error.status,
          };
          return of(responseObject);
        })
      );
  }

  deactivateDriver(
    driver: Drivers,
    driverId?: string
  ): Observable<HttpResponseObject<Drivers>> {
    const headers = this.getHeaders();
    return this.http
      .patch<Drivers>(`${environment.baseUrl}/drivers/${driverId}`, driver, {
        headers: headers,
      })
      .pipe(
        map((data: Drivers) => {
          const responseObject: HttpResponseObject<Drivers> = {
            success: true,
            message: 'Driver deactivated successfuly',
            data: data,
            status: 200,
          };
          if (responseObject.data) {
            const updatedList = this.driversList$.getValue().map((d) => {
              if (d.id === responseObject.data?.id) {
                return responseObject.data;
              }
              return d;
            });
            this.driversList$.next(updatedList as Drivers[]);
          }
          return responseObject;
        }),
        catchError((error) => {
          const responseObject: HttpResponseObject<Drivers> = {
            success: false,
            message: `Unable to deactivate driver. Error occurred ${error}`,
            data: undefined,
            status: error.status,
          };
          return of(responseObject);
        })
      );
  }

  getActiveDriversList(): Observable<HttpResponseObject<Drivers>[]> {
    return this.http.get<Drivers[]>(`${environment.baseUrl}/drivers`).pipe(
      map((data: Drivers[]) => {
        const responseObject: HttpResponseObject<Drivers>[] = data.map((d) => ({
          success: true,
          message: 'Driver retrieved successfully',
          data: d,
          status: 200,
        }));
        this.driversList$.next(data);
        return responseObject;
      }),
      catchError((error) => {
        console.log('Error occurred while getting drivers list:', error);
        const responseObject: HttpResponseObject<Drivers>[] = [
          {
            success: false,
            message: `Unable to retrieve drivers. Error occurred ${error}`,
            data: undefined,
            status: error.status,
          },
        ];
        return of(responseObject);
      })
    );
  }

  // Modify the frontend method to return an Observable of GeneralResponse<Driver[]>
  getActiveDriversList2(
    userId: string
  ): Observable<GeneralResponse<Drivers[]>> {
    const headers = this.getHeaders2(); // Retrieve headers with access token
    return this.http
      .get<GeneralResponse<Drivers[]>>(
        `${environment.baseUrl}/drivers/${userId}`,
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
            this.driversList$.next(response?.data);
          }

          return response;
        })
      );
  }
  // Define a method to return the drivers list as a GeneralResponse<Drivers[]>
  getDriversList(): Observable<GeneralResponse<Drivers[]>> {
    return this.driversList$.pipe(
      map((drivers: Drivers[]) => {
        return {
          success: true,
          message: 'Drivers retrieved successfully',
          data: drivers,
          statusCode: 200,
        };
      }),
      catchError((error) => {
        // Handle errors when retrieving the drivers list
        const errorMessage = error?.message || 'Internal Server Error';
        const statusCode = error?.status || HttpStatusCode.InternalServerError;
        return throwError({
          success: false,
          message: `Error: ${errorMessage}`,
          statusCode: statusCode,
          data: [],
        });
      })
    );
  }
}
